const keys = require("./keys");
import express, { Express } from "express";

import swaggerDocs from "./utils/swagger";

import todoRouter from "./routes/todoRouter";
import healthCheckRouter from "./routes/healthCheck";
import errorHandler from "./middlewares/errorHandler";

const bodyParser = require("body-parser");
const cors = require("cors");

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());

// Express route handlers

app.use(healthCheckRouter);
app.use(todoRouter);

app.use(errorHandler);

app.listen(keys.backendPort, () => {
  console.log("Listening");
  swaggerDocs(app, keys.backendPort);
});
