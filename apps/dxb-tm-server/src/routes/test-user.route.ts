import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { NodeEnvEnum } from "../enums/node-env.enum";
import { BadRequestError } from "../errors/app.error";

const router = Router();
const userController = new UserController();

router.get("/:id", async (request, response, next) => {
    try {
        if (process.env.NODE_ENV !== NodeEnvEnum.TEST) {
            throw new BadRequestError("Not allowed");
        }

        const { id: idString } = request.params;
        const id = parseInt(idString, 10);
        const getDeleted = request.body?.getDeleted ?? false;

        const res = await userController.getById({
            id,
            getDeleted,
        });
        const { status, body } = res;

        if (status === 200) {
            const data =
                body.data != null &&
                Array.isArray(body.data) &&
                body.data.length > 0
                    ? body.data[0]
                    : {};

            response.status(status).json(data);
        } else {
            response.status(status).json(res);
        }
    } catch (error) {
        next(error);
    }
});

router.post("/", async (request, response, next) => {
    try {
        if (process.env.NODE_ENV !== NodeEnvEnum.TEST) {
            throw new BadRequestError("Not allowed");
        }

        const user = request.body;

        const res = await userController.create(user);

        const { status, body } = res;

        if (status === 200 && body.data != null) {
            response.status(status).json(body.data);
        } else {
            response.status(status).json(res);
        }
    } catch (error) {
        next(error);
    }
});

export default router;
