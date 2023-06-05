import { NextFunction, Response, Request } from 'express';
import { SchedulesService } from '../services/SchedulesService';
import { parseISO } from 'date-fns';

class SchedulesController {
    private schedulesService: SchedulesService
    constructor() {
        this.schedulesService = new SchedulesService();
    }
    //create
    async store(request: Request, response: Response, next: NextFunction) {
        const { name, phone, date } = request.body;
        const { user_id } = request;
        try {
            const result = await this.schedulesService.create({ name, phone, date, user_id });

            return response.status(201).json(result);
        } catch (error) {
            next(error)
        }
    }
    // buscar todos
    async index(request: Request, response: Response, next: NextFunction) {
        // listar o agendamento do dia
        const { date } = request.query;
        // converter a data
        const parseDate = date ? parseISO(date.toString()) : new Date();
        console.log(parseDate + " agora")
        try {
            const result = await this.schedulesService.index(parseDate);
            return response.json(result);
        } catch (error) {
            next(error)
        }
    }
    // metodo update
    async update(request: Request, response: Response, next: NextFunction) {
        // buscar o id para atualizar
        const { id } = request.params;
        const { date } = request.body;
        const { user_id } = request;
        try {
            const result = await this.schedulesService.update(id, date, user_id);

            return response.json(result);
        } catch (error) {
            next(error)
        }
    }
    async delete(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;
        try {
            const result = await this.schedulesService.delete(id);
            return response.json(result);
        } catch (error) {
            next(error);
        }
    }

}
export { SchedulesController }