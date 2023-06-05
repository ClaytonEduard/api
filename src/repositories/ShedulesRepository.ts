import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "../database/prisma"
import { ICreate } from '../Interfaces/SchedulesInterfaces';

class SchedulesRepository {
    async create({ name, phone, date, user_id }: ICreate) {
        const result = await prisma.schedule.create({
            data: {
                name,
                phone,
                date,
                user_id,
            },
        });
        return result;

    }
    // listar uma data
    async find(date: Date, user_id: string) {
        const resut = await prisma.schedule.findFirst({
            where: { date, user_id },
        });
        return resut;
    }
    // listar por user
    async findById(id: string) {
        const result = await prisma.schedule.findUnique({
            where: { id },
        });
        return result;
    }

    // listar todos por data
    async findAll(date: Date) {
        const result = await prisma.schedule.findMany({
            where: {
                date: {
                    gte: startOfDay(date),
                    lt: endOfDay(date),
                },
            },
            orderBy: {
                date: 'asc'
            },
        });
        return result;
    }

    // update
    async update(id: string, date: Date) {
        const result = await prisma.schedule.update({
            where: {
                id
            },
            data: {
                date,
            },
        });
        return result;
    }


    // delete 
    async delete(id: string) {
        const result = await prisma.schedule.delete({
            where: {
                id
            },
        });
        return result;
    }

}
export { SchedulesRepository }