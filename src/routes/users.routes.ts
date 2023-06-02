import { Router, request, response } from "express";
import { UsersController } from "../controllers/UsersControllers";
import { upload } from "../config/multer";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

class UsersRoutes {
    private router: Router;
    private usersController: UsersController;
    private authMiddleware: AuthMiddleware;
    constructor() {
        this.router = Router();
        this.usersController = new UsersController();
        this.authMiddleware = new AuthMiddleware();
    }
    getRoutes(): Router {
        // rota de save
        this.router.post('/',
            this.usersController.store.bind(this.usersController),);
        // rota de upload
        this.router.put('/',
            upload.single('avatar_url'), // a simplesmente a rota de upload pode acessar o muter
            this.authMiddleware.auth.bind(this.authMiddleware),// dados para autenticacao com token
            this.usersController.update.bind(this.usersController),
        );

        // rota de autenticacao
        this.router.post('/auth', this.usersController.auth.bind(this.usersController),);


        return this.router;

    }
}

export { UsersRoutes };