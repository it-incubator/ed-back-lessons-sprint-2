import {IUserService} from "../../src/users/types/user.service.interface";
import {randomUUID} from "crypto";
import add from "date-fns/add";
import {db} from "../../src/db";

type RegisterUserType = {
    login: string,
    pass: string,
    email: string,
    code?: string,
    expirationDate?: Date,
    isConfirmed?: boolean
}


export const testSeeder = {
    createUserDto() {
        return {
            login: 'testing',
            email: 'test@gmail.com',
            pass: '123456789'
        }
    },
    createUserDtos(count: number) {
        const users = [];

        for (let i = 0; i <= count; i++) {
            users.push({
                login: 'test' + i,
                email: `test${i}@gmail.com`,
                pass: '12345678'
            })
        }
        return users;
    },
    async registerUser(
        {
            login,
            pass,
            email,
            code,
            expirationDate,
            isConfirmed
        }: RegisterUserType
    ): Promise<IUserService> {
        const newUser = {
            login,
            email,
            passwordHash: pass,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: code ?? randomUUID(),
                expirationDate: expirationDate ?? add(new Date(), {
                    minutes: 30,
                }),
                isConfirmed: isConfirmed ?? false
            }
        };
        const res = await db.getCollections().usersCollection.insertOne({...newUser})
        return {
            id: res.insertedId.toString(),
            ...newUser
        }
    }
}