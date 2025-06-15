import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();
const maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days

router.post("/login", async (request, response, next) => {
    try {
        const res = await authController.handleLogin(request);
        let status = res.status;
        const { accessToken } = res.body.data;

        if (status === 200) {
            response.cookie("token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge,
            });
            response.status(status).json(res.body);
        } else {
            response.status(status).json(res);
        }
    } catch (error) {
        next(error);
    }
});

router.post("/logout", async (_request, response, next) => {
    try {
        response.clearCookie("token");
        response.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
});

export default router;
