// importando o express
import express, { Application, NextFunction, Request, Response } from 'express';
import { UsersRoutes } from './routes/users.routes';
import multer from 'multer';
import { upload } from './config/multer';
import { SchedulesRoutes } from './routes/schedules.routes';
import cors from 'cors';

//tipando a constant App
const app: Application = express();
app.use(cors());// conexao com o front end
// converter tudo para json
app.use(express.json());
// converte os espacos das url em & ou outro caracter
app.use(express.urlencoded({ extended: true }));

const usersRoutes = new UsersRoutes().getRoutes();
const schedulesRoutes = new SchedulesRoutes().getRoutes();

app.use('/users', usersRoutes);
app.use('/schedules', schedulesRoutes);

//antes de subir o servidor tem uma tratativa de erros
app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return response.status(400).json({
            message: err.message,
        })
    }
    return response.status(500).json({
        message: 'Internal Server Error',
    });
});

// subindo o servidor
app.listen(3000, () => console.log('Server is running'))