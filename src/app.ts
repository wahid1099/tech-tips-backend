import express, { Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";

const app = express();

//parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://car-rental-backend-assingment.vercel.app",
      "https://tech-tips-backend.vercel.app",
    ],
    credentials: true,
  })
);
//application routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Car Rental Reservation System");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
