import express, { Application } from "express";
import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import appError from "../utils/appError";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "../routes/auth";

export const server: Application = express();
export const prisma = new PrismaClient();

async function main() {
  // Connect the client
  await prisma.$connect();
  console.log("Connected to Prisma and mongoDB");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// global
server.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
server.use(express.json());
server.use(morgan("dev"));
//Routes Registration
server.use("/auth", authRoutes);

server.all("*", (req: Request, _res: Response, next: NextFunction) => {
  next(
    new appError(`The requested page ${req.originalUrl} was not found`, 404)
  );
});

//global error handler
server.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    ok: false,
    status: err.status,
    message: err.message,
  });
});
