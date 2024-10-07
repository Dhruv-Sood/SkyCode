import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import simpleGit from "simple-git";

import { getAllFiles } from "./utils";

import path from "path";

const app = express();

app.use(express.json());

app.post("/deploy", async (req: Request, res: Response) => {
  const repoUrl = req.body.repoUrl;
  const id = uuidv4().slice(0, 5);

  await simpleGit().clone(repoUrl, path.join(__dirname, `../output/${id}`));
  const files = getAllFiles(`./output/${id}`);
  res.json({
    id,
    files
  })

  

});

app.listen(3000);
