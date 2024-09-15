import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware";
import authRouter from "./routers/auth.router";
import userRouter from "./routers/user.router";
import patientRouter from "./routers/patient.router";
import emergencyRouter from "./routers/emergencyContact.router";
import doctorRouter from "./routers/doctor.router";
import hospitalRouter from "./routers/hospital.router";
import cors from "cors";
import env from "./configs/env";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin"],
    exposedHeaders: ["Authorization"],
  })
);

app.get("/api/main_service", (req: Request, res: Response) => {
  res.status(200).send("MAIN SERVICE RUNNING");
});

app.use("/api/main_service/v1/auth", authRouter);
app.use("/api/main_service/v1/user", userRouter);
app.use("/api/main_service/v1/patient", patientRouter);
app.use("/api/main_service/v1/emergency-contact", emergencyRouter);
app.use("/api/main_service/v1/doctor", doctorRouter);
app.use("/api/main_service/v1/hospital", hospitalRouter);

app.use(errorMiddleware);
export default app;
