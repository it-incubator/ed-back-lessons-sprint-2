import {NextFunction, Request, Response} from "express";
import {IdType} from "../../common/types/id";
import {authService} from "../auth.service";
import {ResultStatus} from "../../common/types/resultCode";

export const accessTokenGuard = async (req: Request,
                                       res: Response,
                                       next: NextFunction) => {
    if (!req.headers.authorization) return res.sendStatus(401);

    const result = await authService.checkAccessToken(req.headers.authorization);

    if (result.status === ResultStatus.Success) {
        req.user = result.data as IdType;
        return next();
    }
    return res.sendStatus(401);

}