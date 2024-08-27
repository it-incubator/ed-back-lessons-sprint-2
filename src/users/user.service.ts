import {usersRepository} from "./user.repository";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {IUserDB} from "./types/user.db.interface";
import {CreateUserInputDto} from "./types/create.user.input.dto";

export const usersService = {
    async create(dto: CreateUserInputDto): Promise<string> {
        const {login, password, email} = dto
        const passwordHash = await bcryptService.generateHash(password)

        const newUser: IUserDB = {
            login,
            email,
            passwordHash,
            createdAt: new Date(),
            emailConfirmation: {
                //default value can be nullable
                confirmationCode: '',
                isConfirmed: true,
                //default value can be nullable
                expirationDate: new Date()
            }
        };
        return await usersRepository.create(newUser);
    },

    async delete(id: string): Promise<boolean> {
        const user = await usersRepository.findById(id);
        if (!user) return false;

        return await usersRepository.delete(id);


    },
}

