import {Request, Response, Router} from "express";
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
import {emailValidation} from "../users/middlewares/email.validation";
import {ResultStatus} from "../common/types/resultCode";
import {CreateUserInputDto} from "../users/types/create.user.input.dto";
import {loginValidation} from "../users/middlewares/login.validation";

export const authRouter = Router()

authRouter.post(routersPaths.auth.login,
    passwordValidation,
    loginOrEmailValidation,
    inputValidation,
    async (req: RequestWithBody<LoginInputDto>, res: Response) => {
        const {loginOrEmail, password} = req.body

        const result = await authService.loginUser(
            loginOrEmail,
            password
        );

        if (result.status !== ResultStatus.Success) return res.sendStatus(401);

        return res.status(200).send({accessToken: result.data!.accessToken});
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

authRouter.post(routersPaths.auth.registration,
    passwordValidation,
    loginValidation,
    emailValidation,
    inputValidation,
    async (req: RequestWithBody<CreateUserInputDto>, res: Response) => {
        const {login, email, password} = req.body

        const result = await authService.registerUser(
            login,
            password,
            email
        );
        if (result.status === ResultStatus.Success) return res.sendStatus(204);
    })

authRouter.post(routersPaths.auth.registrationConfirmation,
    inputValidation,
    async (req: Request, res: Response) => {
        const {code} = req.body;
        //some logic

        return res.sendStatus(204);
    })

authRouter.post(routersPaths.auth.registrationEmailResending,
    inputValidation,
    async (req: Request, res: Response) => {
        const {email} = req.body;
        //some logic

        return res.sendStatus(204);

    })