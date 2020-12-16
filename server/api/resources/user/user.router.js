import express from "express";
import passport from "passport";

import userController from "./user.controller";

const userRouter = express.Router();
userRouter.get("/me", passport.authenticate("jwt", { session: false }), userController.authenticate);
userRouter.post("/login", userController.login);

export default userRouter;
