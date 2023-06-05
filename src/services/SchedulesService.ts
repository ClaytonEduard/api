import { ICreate } from "../Interfaces/SchedulesInterfaces";
import { getHours, isBefore, startOfHour } from 'date-fns'
import { SchedulesRepository } from "../repositories/ShedulesRepository";
import { ptBR } from "date-fns/locale";
class SchedulesService {
    private schedulesRepository: SchedulesRepository;
    constructor() {
        this.schedulesRepository = new SchedulesRepository
    }
    // metodo save
    async create({ name, phone, date, user_id }: ICreate) {
        const dateFormatted = new Date(date);

        const hourStart = startOfHour(dateFormatted)

        const hour = getHours(hourStart);
        if (hour <= 7 || hour >= 18) {
            throw new Error('Create Schedule between 7 and 18');
        }
        // verificando se a data anterior já esta sendo utilizada
        if (isBefore(hourStart, new Date())) {
            throw new Error('Is is not allwed to schedule old date');
        }
        // verificar se ja existe cliente marcado neste horario?
        const checkIsAvaliable = await this.schedulesRepository.find(
            hourStart,
            user_id
        );

        if (checkIsAvaliable) {
            throw new Error('Schedule date is not available');
        }
        const create = await this.schedulesRepository.create({
            name,
            phone,
            date: hourStart,
            user_id,
        });
        return create;
    }

    // metodo listar
    async index(date: Date) {
        const result = await this.schedulesRepository.findAll(date);
        //console.log(result);
        return result;
    }

    // metodo atualizar
    async update(id: string, date: Date, user_id: string) {
        const dateFormatted = new Date(date);

        const hourStart = startOfHour(dateFormatted)
        // verificando se a data anterior já esta sendo utilizada
        if (isBefore(hourStart, new Date())) {
            throw new Error('Is is not allwed to schedule old date');
        }
        // verificar se ja existe cliente marcado neste horario?
        const checkIsAvaliable = await this.schedulesRepository.find(hourStart, user_id);
        if (checkIsAvaliable) {
            throw new Error('Schedule date is not available');
        }

        const result = await this.schedulesRepository.update(id, date);

        return result;
    }

    // metodo delete
    async delete(id: string) {
        const checkExists = await this.schedulesRepository.findById(id);
        if (!checkExists) {
            throw new Error('Schedule doenst exists');
        }
        const result = await this.schedulesRepository.delete(id);
        return result;
    }




}
export { SchedulesService }