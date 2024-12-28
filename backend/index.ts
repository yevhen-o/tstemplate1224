const keys = require("./keys");
import express, { Express, Request, Response, Application } from "express";

const bodyParser = require("body-parser");
const cors = require("cors");

const app: Application = express();
app.use(cors());
app.use(bodyParser.json());
const Todo = require("./models/todos");

// Express route handlers

app.get("/", (req: Request, res: Response) => {
  res.send("Hi there");
});

app.get("/status", (req: Request, res: Response) => {
  res.json({ status: "connected!" });
});

app.post("/todos", async (req: Request, res: Response) => {
  try {
    const todo = await Todo.addRecord(req.body);
    res.json(todo);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

app.get("/todos", Todo.getRecords);

app.get("/todos/:uid", Todo.getRecord);

app.listen(keys.backendPort, () => {
  console.log("Listening");
});
