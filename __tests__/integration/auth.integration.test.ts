import { db } from '../../src/db';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { nodemailerService } from '../../src/common/adapters/nodemailer.service';
import { authService } from '../../src/auth/auth.service';
import { ResultStatus } from '../../src/common/types/resultCode';
import { testSeeder } from './test.seeder';

describe('AUTH-INTEGRATION', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await db.run(mongoServer.getUri());
  });

  beforeEach(async () => {
    await db.drop();
  });

  afterAll(async () => {
    await db.drop();
    await db.stop();
  });

  afterAll(done => done());

  describe('User Registration', () => {
    //nodemailerService.sendEmail = emailServiceMock.sendEmail;

    nodemailerService.sendEmail = jest
      .fn()
      .mockImplementation(
        (email: string, code: string, template: (code: string) => string) =>
          Promise.resolve(true)
      );

    const registerUserUseCase = authService.registerUser;

    it('should register user with correct data', async () => {
      const { login, pass, email } = testSeeder.createUserDto();

      const result = await registerUserUseCase(login, pass, email);

      expect(result.status).toBe(ResultStatus.Success);
      expect(nodemailerService.sendEmail).toBeCalled();
      expect(nodemailerService.sendEmail).toBeCalledTimes(1);
    });

    it('should not register user twice', async () => {
      const { login, pass, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ login, pass, email });

      const result = await registerUserUseCase(login, pass, email);

      expect(result.status).toBe(ResultStatus.BadRequest);
      //collection.countDoc().toBe(1)
    });
  });

  describe('Confirm email', () => {
    const confirmEmailUseCase = authService.confirmEmail;

    it('should not confirm email if user does not exist', async () => {
      const result = await confirmEmailUseCase('bnfgndflkgmk');

      expect(result.status).toBe(ResultStatus.BadRequest);
    });

    it('should not confirm email which is confirmed', async () => {
      const code = 'test';

      const { login, pass, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({
        login,
        pass,
        email,
        code,
        isConfirmed: true,
      });

      const result = await confirmEmailUseCase(code);

      expect(result.status).toBe(ResultStatus.BadRequest);
    });

    it('should not confirm email with expired code', async () => {
      const code = 'test';

      const { login, pass, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({
        login,
        pass,
        email,
        code,
        expirationDate: new Date(),
      });

      const result = await confirmEmailUseCase(code);

      expect(result.status).toBe(ResultStatus.BadRequest);
      //check status in DB
    });

    it('confirm user', async () => {
      const code = '123e4567-e89b-12d3-a456-426614174000';

      const { login, pass, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ login, pass, email, code });

      const result = await confirmEmailUseCase(code);

      expect(result.status).toBe(ResultStatus.Success);
    });
  });
});
