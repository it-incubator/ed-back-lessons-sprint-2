import {NextFunction, Request, Response} from "express";
import {IdType} from "../../common/types/id";
import {jwtService} from "../../common/adapters/jwt.service";
import {usersRepository} from "../../users/user.repository";

export const accessTokenGuard = async (req: Request,
                                       res: Response,
                                       next: NextFunction) => {
    if (!req.headers.authorization) return res.sendStatus(401);

    const [authType, token] = req.headers.authorization.split(" ")[1];

    if (authType !== 'Bearer') return res.sendStatus(401);

    const payload = await jwtService.verifyToken(token);
    if (payload) {
        const {userId} = payload;

        const user = await usersRepository.doesExistById(userId);

        if (!user) return res.sendStatus(401);

        req.user = {id: userId} as IdType;
        return next();
    }
    return res.sendStatus(401);

}