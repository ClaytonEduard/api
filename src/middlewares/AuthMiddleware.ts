import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
interface IPayload {
    sub: string;
}
class AuthMiddleware {
    auth(request: Request, response: Response, next: NextFunction) {

        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return response.status(401).json({
                code: 'token.missing',
                message: 'Token missing',
            });
        }
        // metodo para pegar o token onde descarto a primeira posiccao da string
        const [, token] = authHeader.split(' ');
        //verifica se o token é valido ou verdadeiro
        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
        if (!secretKey) {
            throw new Error('There is no token key')
        }
        try {
            const { sub } = verify(token, secretKey) as IPayload;
            request.user_id = sub;
            return next();
        } catch (error) {
            return response.status(401).json({
                code: 'token.expired',
                message: 'Token expired.',
            });
        }
    }
}

export { AuthMiddleware }