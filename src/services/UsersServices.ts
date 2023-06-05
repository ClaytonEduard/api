import { compare, hash } from "bcrypt";
import { ICreate, IUpdate } from "../Interfaces/UsersInterfaces";
import { UsersRepository } from "../repositories/UsersRepository"
import { s3 } from "../config/aws";
import { v4 as uuid } from 'uuid';
import { sign, verify } from "jsonwebtoken";

class UsersServices {
    private usersRepository: UsersRepository

    constructor() {
        this.usersRepository = new UsersRepository()
    }

    async create({ name, email, password }: ICreate) {

        const findUser = await this.usersRepository.findUserByEmail(email);
        if (findUser) {
            throw new Error('Users exists')
        }

        //criptografando a senha
        const hashPassword = await hash(password, 10);

        const create = this.usersRepository.create({
            name,
            email,
            password: hashPassword
        });
        return create;
    }

    // metodo update
    async update({ name, oldPassword, newPassword, avatar_url, user_id }: IUpdate) {
        let password;
        // verificar se ele informou os dado para atualizar
        if (oldPassword && newPassword) {
            const findUserById = await this.usersRepository.findUserById(user_id);
            if (!findUserById) {
                throw new Error('User not found');
            }
            const passwordMatch = compare(oldPassword, findUserById.password);
            if (!passwordMatch) {
                throw new Error('Password invalid.');
            }
            //criptografando a nova senha
            password = await hash(newPassword, 10);
            //gravando
            await this.usersRepository.updatePassword(password, user_id);
        }

        if (avatar_url) {
            // pegando os dados da imagem
            const uploadImage = avatar_url?.buffer;
            //upload da imagem para AWS
            // vou esperar uma resposta AWAIT
            const uploadS3 = await s3.upload({
                Bucket: 'salaoagendamento',
                Key: `${uuid()}-${avatar_url?.originalname}`,
                //ACL: 'public-read',
                Body: uploadImage,
            }).promise();

            await this.usersRepository.update(name, uploadS3.Location, user_id);
        }
        return {
            message: 'User update sucessfully',
        }
    }


    async auth(email: string, password: string) {
        // verificar se o email existe
        const findUser = await this.usersRepository.findUserByEmail(email);
        if (!findUser) {
            throw new Error('User or password invalid.');
        }
        // compara a senha cadastrada utilizando o Bcript
        const passwordMatch = compare(password, findUser.password);
        if (!passwordMatch) {
            throw new Error('User or password invalid.');
        }

        //criar uma chave secreta
        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
        if (!secretKey) {
            throw new Error('There is no token key')
        }
        const token = sign({ email }, secretKey, {
            subject: findUser?.id,
            expiresIn: 60 * 15, // tempo de expiracao do token de 15 min
        });
        // refresh token 
        const refreshToken = sign({ email }, secretKey, {
            subject: findUser?.id,
            expiresIn: '7d', // tempo de expiracao do token de 7 dias
        });

        return {
            token,
            refresh_token: refreshToken,
            user: {
                name: findUser.name,
                email: findUser.email,
            }
        }
    }

    // metodo de refresh token para quem esta logado

    async refresh(refresh_token: string) {
        if (!refresh_token) {
            throw new Error('Refresh token missing')
        }
        let secretKeyRefresh: string | undefined =
            process.env.ACCESS_KEY_TOKEN_REFRESH;
        if (!secretKeyRefresh) {
            throw new Error('There is no refresh token key');
        }
        //criar uma chave secreta
        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
        if (!secretKey) {
            throw new Error('There is no refresh token key')
        }

        const verifyRefreshToken = verify(refresh_token, secretKeyRefresh)
        const { sub } = verifyRefreshToken;

        // retorna o novo token
        const newToken = sign({ sub }, secretKey, {
            expiresIn: 60 * 15,
        })
        const refreshToken = sign({ sub }, secretKeyRefresh, {
            expiresIn: '7d',
        });
        return { token: newToken, refresh_token: refreshToken };
    }


}
export { UsersServices }