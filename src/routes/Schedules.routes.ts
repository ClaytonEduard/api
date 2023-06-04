import { Router, request, response } from 'express';
import { SchedulesController } from '../controllers/SchedulesController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

class SchedulesRoutes {
    private router: Router;
    private schedulesController: SchedulesController;
    private authMiddleware: AuthMiddleware;
    constructor() {
        this.router = Router();
        this.schedulesController = new SchedulesController();
        this.authMiddleware = new AuthMiddleware();
    }
    getRoutes(): Router {
        // criacao do agendamento
        this.router.post(
            '/',
            this.authMiddleware.auth.bind(this.authMiddleware),// dados para autenticacao com token
            this.schedulesController.store.bind(this.schedulesController),
            );
        //listar todos
        this.router.get(
            '/',
            this.authMiddleware.auth.bind(this.authMiddleware),// dados para autenticacao com token
            this.schedulesController.index.bind(this.schedulesController),
            );
        //editar
        this.router.put(
            '/:id',
            this.authMiddleware.auth.bind(this.authMiddleware),// dados para autenticacao com token
            this.schedulesController.update.bind(this.schedulesController),
            );
        return this.router;
    }

}
export { SchedulesRoutes }