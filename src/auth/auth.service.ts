import {bcryptService} from "../common/adapters/bcrypt.service";
import {usersRepository} from "../users/user.repository";
import {WithId} from "mongodb";
import {IUserDB} from "../users/types/user.db.interface";

export const authService = {

    async loginUser(loginOrEmail: string, password: string): Promise<WithId<IUserDB> | null> {
        return this.checkUserCredentials(loginOrEmail, password);
    },

    async checkUserCredentials(loginOrEmail: string, password: string): Promise<WithId<IUserDB> | null> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;

        const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);
        if (!isPassCorrect) return null;

        return user
    },


}