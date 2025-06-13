import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.get("/:id", async (request, response, next) => {
    try {
        const { id: idString } = request.params;
        const id = parseInt(idString, 10);
        const getDeleted = request.body?.getDeleted ?? false;

        const res = await userController.getById({
            id, getDeleted
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