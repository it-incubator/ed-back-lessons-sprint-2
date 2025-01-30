import {Response, Router} from "express";
import {RequestWithBody} from "../common/types/requests";
import {LoginInputDto} from "./types/login.input.dto";
import {authService} from "./auth.service";
import {routersPaths} from "../common/path/paths";
import {passwordValidation} from "../users/api/middlewares/password.validation";
import {inputValidation} from "../common/validation/input.validation";
import {loginOrEmailValidation} from "../users/api/middlewares/login.or.emaol.validation";
import {HttpStatuses} from "../common/types/httpStatuses";

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
        if (!accessToken) return res.sendStatus(HttpStatuses.Unauthorized);

        return res.status(HttpStatuses.Success).send({accessToken});
    })
