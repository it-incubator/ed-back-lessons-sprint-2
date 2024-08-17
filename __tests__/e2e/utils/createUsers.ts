import request from "supertest";
import {routersPaths} from "../../../src/common/path/paths";
import {ADMIN_LOGIN, ADMIN_PASS} from "../../../src/auth/guards/base.auth.guard";
import {testingDtosCreator, UserDto} from "./testingDtosCreator";

export const createUser = async (app: any, userDto?: UserDto) => {

    const dto = userDto ?? testingDtosCreator.createUserDto({});

    const resp = await request(app).post(routersPaths.users).auth(ADMIN_LOGIN, ADMIN_PASS).send({
        login: dto.login,
        email: dto.email,
        password: dto.pass,
    }).expect(201)
    return resp.body
}

export const createUsers = async (app: any, count: number) => {
    const users = [];

    for (let i = 0; i <= count; i++) {
        const resp = await request(app).post(routersPaths.users).auth(ADMIN_LOGIN, ADMIN_PASS).send({
            login: 'test' + i,
            email: `test${i}@gmail.com`,
            pass: '12345678'
        }).expect(200)

        users.push(resp.body)
    }
    return users;
}