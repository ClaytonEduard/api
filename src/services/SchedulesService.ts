import { ICreate } from "../Interfaces/SchedulesInterfaces";
import { isBefore, startOfHour } from 'date-fns'
import { SchedulesRepository } from "../repositories/ShedulesRepository";
import { ptBR } from "date-fns/locale";
class SchedulesService {
    private schedulesRepository: SchedulesRepository;
    constructor() {
        this.schedulesRepository = new SchedulesRepository
    }
    // metodo save
    async create({ name, phone, date }: ICreate) {
        const dateFormatted = new Date(date);
        let d = new Date();
        console.log(d)
        console.log("Date1 - " + date);
        const hourStart = startOfHour(dateFormatted)
        console.log("Date2 - " + hourStart);
        // verificando se a data anterior já esta sendo utilizada
        if (isBefore(hourStart, new Date())) {
            throw new Error('Is is not allwed to schedule old date');
        }
        // verificar se ja existe cliente marcado neste horario?
        const checkIsAvaliable = await this.schedulesRepository.find(hourStart);
        if (checkIsAvaliable) {
            throw new Error('Schedule date is not available');
        }
        const create = await this.schedulesRepository.create({
            name,
            phone,
            date: hourStart
        });
        return create;
    }

    // metodo listar
    async index(date: Date) {
        const result = await this.schedulesRepository.findAll(date);
        console.log(result);
        return result;
    }

    // metodo atualizar
    async update(id: string, date: Date) {
        const dateFormatted = new Date(date);

        const hourStart = startOfHour(dateFormatted)
        // verificando se a data anterior já esta sendo utilizada
        if (isBefore(hourStart, new Date())) {
            throw new Error('Is is not allwed to schedule old date');
        }
         // verificar se ja existe cliente marcado neste horario?
         const checkIsAvaliable = await this.schedulesRepository.find(hourStart);
         if (checkIsAvaliable) {
             throw new Error('Schedule date is not available');
         }



        // tempo 53:30 aula 2
    }



}
export { SchedulesService }