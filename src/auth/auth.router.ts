import {Response, Router} from "express";
import {RequestWithBody, RequestWithUserId} from "../common/types/requests";
import {LoginInputDto} from "./types/login.input.dto";
import {authService} from "./auth.service";
import {routersPaths} from "../common/path/paths";
import {passwordValidation} from "../users/middlewares/password.validation";
import {inputValidation} from "../common/validation/input.validation";
import {loginOrEmailValidation} from "../users/middlewares/login.or.emaol.validation";
import {accessTokenGuard} from "./guards/access.token.guard";
import {usersQwRepository} from "../users/user.query.repository";
import {IdType} from "../common/types/id";

export const authRouter = Router()

authRouter.post(routersPaths.auth.login,
    passwordValidation,
    loginOrEmailValidation,
    inputValidation,
    async (req: RequestWithBody<LoginInputDto>, res: Response) => {
            const {loginOrEmail, password} = req.body

            const accessToken = await authService.loginUser(
                loginOrEmail,
                password
            );
            if (!accessToken) return res.sendStatus(401);

            return res.status(200).send({accessToken});
    })

authRouter.get(routersPaths.auth.me,
    accessTokenGuard,
    async (req: RequestWithUserId<IdType>,
           res: Response) => {
            const userId = req?.user?.id as string;

            if (!userId) return res.sendStatus(401);
            const me = await usersQwRepository.findById(userId);

            return res.status(200).send(me);
    })