require("dotenv").config();
import "newrelic";
const keys = require("./keys");
import express, { Express } from "express";
const cookieParser = require("cookie-parser");
import swaggerDocs from "./utils/swagger";

import todoRouter from "./routes/todoRouter";
import userRouter from "./routes/userRoutes";
import organizationRouter from "./routes/organizationRouter";
import projectRouter from "./routes/projectRoutes";
import healthCheckRouter from "./routes/healthCheck";

import errorHandler from "./middlewares/errorHandler";

const bodyParser = require("body-parser");
const cors = require("cors");

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
app.get("/debug-nr", (req, res) => {
  throw new Error("Check is new relic catch it up");
});
app.use(errorHandler);

app.listen(keys.backendPort, () => {
  console.log("Listening");
  swaggerDocs(app, keys.backendPort);
});
