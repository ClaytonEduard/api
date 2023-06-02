import { ICreate } from "../Interfaces/UsersInterfaces";
import { prisma } from "../database/prisma";

class UsersRepository {
    //cria o usuario
    async create({ name, email, password }: ICreate) {
        const result = await prisma.users.create({
            data: {
                name,
                email,
                password
            }
        });
        return result;
    }
    //pesquisar usuario
    async findUserByEmail(email: string) {
        const result = await prisma.users.findUnique({
            where: {
                email: email
            }
        });
        return result;
    }
    //pesquisar usuario por id
    async findUserById(id: string) {
        const result = await prisma.users.findUnique({
            where: {
                id: id
            }
        });
        return result;
    }

    //update
    async update(name: string, avatar_url: string, user_id: string) {
        const result = await prisma.users.update({
            where: {
                id: user_id,
            },
            data: {
                name,
                avatar_url,
            },
        });
        return result;
    }

    // update somente senha
    async updatePassword(newPassword: string, user_id: string) {
        const result = await prisma.users.update({
            where: {
                id: user_id,
            },
            data: {
                password: newPassword,
            },
        });
        return result;
    }

}

export { UsersRepository }