import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();
const maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days

router.post("/login", async (request, response, next) => {
  try {
    const res = await authController.handleLogin(request);
    let status = res.status;

    if (status === 200) {
      response
        .status(status)
        // @todo Raman - see if we need send back the refresh and the access token
        .json(res.body.data)
        .cookie("token", res.body.data?.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge,
        });
    } else {
      response.status(status).json(res);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
