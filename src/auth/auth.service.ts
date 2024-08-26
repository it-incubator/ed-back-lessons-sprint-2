import {bcryptService} from "../common/adapters/bcrypt.service";
import {usersRepository} from "../users/user.repository";
import {WithId} from "mongodb";
import {jwtService} from "../common/adapters/jwt.service";
import {Result} from "../common/types/result.type";
import {ResultStatus} from "../common/types/resultCode";
import {User} from "../users/domain/user.entity";
import {emailExamples} from "../common/adapters/emailExamples";
import {nodemailerService} from "../common/adapters/nodemailer.service";

export const authService = {

    async loginUser(loginOrEmail: string, password: string): Promise<Result<{ accessToken: string } | null>> {
        const result = await this.checkUserCredentials(loginOrEmail, password);
        if (result.status !== ResultStatus.Success) return {
            status: ResultStatus.Unauthorized,
            errorMessage: 'Wrong credentials',
            data: null
        };

        const accessToken = await jwtService.createToken(result.data!._id.toString())

        return {
            status: ResultStatus.Success,
            data: {accessToken}
        }
    },

    async checkUserCredentials(loginOrEmail: string, password: string): Promise<Result<WithId<User> | null>> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return {
            status: ResultStatus.NotFound,
            data: null,
            errorMessage: 'User not found'
        };

        const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);
        if (!isPassCorrect) return {
            status: ResultStatus.BadRequest,
            data: null,
            errorMessage: 'Wrong password'
        };

        return {
            status: ResultStatus.Success,
            data: user
        }
    },

    async registerUser(login: string, pass: string, email: string): Promise<Result<User | null>> {
        const user = await usersRepository.doesExistByLoginOrEmail(login, email);
        if (user) return {
            status: ResultStatus.BadRequest,
            errorMessage: 'User already exist',
            data: null,
        };

        const passwordHash = await bcryptService.generateHash(pass)

        const newUser = new User(login, email, passwordHash);

        await usersRepository.create(newUser);

        nodemailerService.sendEmail(newUser.email, newUser.emailConfirmation.confirmationCode, emailExamples.registrationEmail).catch((er) => console.error('error in send email:', er));
        return {
            status: ResultStatus.Success,
            data: newUser
        };
    },

    async confirmEmail(code: string): Promise<Result<any>> {
        //some logic

        return {
            status: ResultStatus.Success,
            data: null
        }
    },
}
