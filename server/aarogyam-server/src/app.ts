import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.ts";
import authRouter from "./routers/auth.router.ts";
import userRouter from "./routers/user.router.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("MAIN SERVICE RUNNING");
});

app.use("/api/main_service/v1/auth", authRouter);
app.use("/api/main_service/v1/user", userRouter);

app.use(errorMiddleware);
export default app;
