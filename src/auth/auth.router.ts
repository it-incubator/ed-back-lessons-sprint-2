import {Response, Router} from "express";
import {RequestWithBody} from "../common/types/requests";
import {LoginInputDto} from "./types/login.input.dto";
import {authService} from "./auth.service";
import {routersPaths} from "../common/path/paths";
import {passwordValidation} from "../users/middlewares/password.validation";
import {inputValidation} from "../common/validation/input.validation";
import {loginOrEmailValidation} from "../users/middlewares/login.or.emaol.validation";

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
