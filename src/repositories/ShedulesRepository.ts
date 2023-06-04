import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "../database/prisma"
import { ICreate } from '../Interfaces/SchedulesInterfaces';

class SchedulesRepository {
    async create({ name, phone, date }: ICreate) {
        const result = await prisma.schedule.create({
            data: {
                name,
                phone,
                date
            },
        });
        return result;

    }
    // listar uma data
    async find(date: Date) {
        const resut = await prisma.schedule.findFirst({
            where: { date },
        });
        return resut;
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
}
export { SchedulesRepository }