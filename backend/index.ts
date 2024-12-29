const keys = require("./keys");
import express, { Request, Response, Application, Router } from "express";
import todoRouter from "./routes/todoRouter";
import errorHandler from "./middlewares/errorHandler";

const bodyParser = require("body-parser");
const cors = require("cors");

const app: Application = express();
app.use(cors());
app.use(bodyParser.json());

// Express route handlers

app.get("/", (req: Request, res: Response) => {
  res.send("Hi there");
});

app.get("/status", (req: Request, res: Response) => {
  res.json({ status: "connected!" });
});

app.use(todoRouter);

app.use(errorHandler);

app.listen(keys.backendPort, () => {
  console.log("Listening");
});
