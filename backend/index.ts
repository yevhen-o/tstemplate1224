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

app.get("/add-record", async (req: Request, res: Response) => {
  try {
    const todo = await Todo.addRecord();
    console.log(todo);
    res.json({ added: true });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

app.get("/get-records", Todo.getRecords);

app.listen(keys.backendPort, () => {
  console.log("Listening");
});
