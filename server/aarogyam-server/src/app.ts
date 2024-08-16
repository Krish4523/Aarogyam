import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("MAIN SERVICE RUNNING");
});

app.use(errorMiddleware);
export default app;
