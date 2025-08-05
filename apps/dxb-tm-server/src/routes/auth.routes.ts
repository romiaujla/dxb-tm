import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();
const maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days

router.post("/login", async (request, response, next) => {
    try {
        const res = await authController.handleLogin(request);
        let status = res.status;
        const { accessToken, user } = res.body.data;

        if (status === 200) {
            response.cookie("token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge,
                sameSite: "lax",
                path: "/",
                domain:
                    process.env.NODE_ENV === "production"
                        ? undefined
                        : "localhost",
            });

            response.status(status).json({
                message: "Login successful",
                data: {
                    email: user.email,
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    roleList: user.userRoles.map((role) => role.role.name),
                }
            });
        } else {
            response.status(status).json(res);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post("/logout", async (_request, response, next) => {
    try {
        response.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            domain:
                process.env.NODE_ENV === "production" ? undefined : "localhost",
        });
        response.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
});

router.get("/validate", async (request, response, next) => {
    try {
        const res = await authController.handleValidate(request);

        response.status(res.status).json(res);
    } catch (error) {
        next(error);
    }
});

export default router;
