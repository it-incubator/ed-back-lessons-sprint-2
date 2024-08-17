export type UserDto = {
    login: string
    email: string
    pass: string
}


export const testingDtosCreator = {
    createUserDto({login, email, pass}: {
        login?: string, email?: string, pass?: string
    }): UserDto {
        return {
            login: login ?? 'test',
            email: email ?? 'test@gmail.com',
            pass: pass ?? '123456789',

        }
    },
    createUserDtos(count: number): UserDto[] {
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
}