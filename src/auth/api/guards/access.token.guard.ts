import { NextFunction, Request, Response } from 'express';
import { IdType } from '../../../common/types/id';
import { ResultStatus } from '../../../common/result/resultCode';
import { HttpStatuses } from '../../../common/types/httpStatuses';
import { authService } from '../../domain/auth.service';

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization)
    return res.sendStatus(HttpStatuses.Unauthorized);

  const result = await authService.checkAccessToken(req.headers.authorization);

  if (result.status === ResultStatus.Success) {
    req.user = result.data!;
    return next();
  }
  return res.sendStatus(HttpStatuses.Unauthorized);
};
