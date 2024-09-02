import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db";
import {authService} from "../../src/auth/auth.service";
import {jwtService} from "../../src/common/adapters/jwt.service";
import {ResultStatus} from "../../src/common/types/resultCode";
import {usersRepository} from "../../src/users/user.repository";

describe('UNIT', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri());
    })

    beforeEach(async () => {
        await db.drop();
    })

    afterAll(async () => {
        await db.drop();
        await db.stop();
    })

    afterAll((done) => done())

    const checkAccessTokenUseCase = authService.checkAccessToken
    it('should not verify noBearer auth', async () => {
        const result = await checkAccessTokenUseCase('Basic gbfbfbbhf')

        expect(result.status).toBe(ResultStatus.Unauthorized)

    })

    it('should not verify in jwtService', async () => {
        jwtService.verifyToken = jest.fn().mockImplementation(async (token: string) => null)

        const result = await checkAccessTokenUseCase('Bearer gbfbfbbhf')

        expect(result.status).toBe(ResultStatus.Unauthorized)

    })

    it('should not verify in usersRepository', async () => {
        jwtService.verifyToken = jest.fn().mockImplementation(async (token: string) => ({userId: '1'}))

        usersRepository.doesExistById = jest.fn().mockImplementation(async (userId: string) => false)

        const result = await checkAccessTokenUseCase('Bearer gbfbfbbhf')

        expect(result.status).toBe(ResultStatus.Unauthorized)

    })

    it('should verify access token', async () => {
        jwtService.verifyToken = jest.fn().mockImplementation(async (token: string) => ({userId: '1'}))

        usersRepository.doesExistById = jest.fn().mockImplementation(async (userId: string) => true)

        const result = await checkAccessTokenUseCase('Bearer gbfbfbbhf')

        expect(result.status).toBe(ResultStatus.Success)
    })

})