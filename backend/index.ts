import dotenv from "dotenv";
dotenv.config();

import "newrelic";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express } from "express";

import keys from "./keys";
import errorHandler from "./middlewares/errorHandler";

import swaggerDocs from "./utils/swagger";
import todoRouter from "./routes/todoRouter";
import userRouter from "./routes/userRoutes";
import projectRouter from "./routes/projectRoutes";
import healthCheckRouter from "./routes/healthCheck";
import organizationRouter from "./routes/organizationRouter";
import { db } from "./models";

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Express route handlers

app.use(healthCheckRouter);
app.use(todoRouter);
app.use(userRouter);
app.use(organizationRouter);
app.use(projectRouter);

app.use(errorHandler);

app.listen(keys.backendPort, () => {
  console.log("Listening." + db.getDatabaseName());
  swaggerDocs(app, +keys.backendPort);
});
