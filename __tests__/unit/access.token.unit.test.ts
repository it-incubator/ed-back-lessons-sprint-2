import { MongoMemoryServer } from 'mongodb-memory-server';
import { db } from '../../src/db';
import { authService } from '../../src/auth/auth.service';
import { jwtService } from '../../src/common/adapters/jwt.service';
import { usersRepository } from '../../src/users/user.repository';
import { ResultStatus } from '../../src/common/result/resultCode';

describe('UNIT', () => {
  const checkAccessTokenUseCase = authService.checkAccessToken;
  it('should not verify noBearer auth', async () => {
    const result = await checkAccessTokenUseCase('Basic gbfbfbbhf');

    expect(result.status).toBe(ResultStatus.Unauthorized);
  });

  it('should not verify in jwtService', async () => {
    jwtService.verifyToken = jest
      .fn()
      .mockImplementation(async (token: string) => null);

    const result = await checkAccessTokenUseCase('Bearer gbfbfbbhf');

    expect(result.status).toBe(ResultStatus.Unauthorized);
  });

  it('should verify access token', async () => {
    jwtService.verifyToken = jest
      .fn()
      .mockImplementation(async (token: string) => ({ userId: '1' }));

    const result = await checkAccessTokenUseCase('Bearer gbfbfbbhf');

    expect(result.status).toBe(ResultStatus.Success);
  });
});
