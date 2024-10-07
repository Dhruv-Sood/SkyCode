import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import simpleGit from "simple-git";



const app = express();

app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = uuidv4().slice(0, 5);

  await simpleGit().clone(repoUrl, `./${id}`)
  res.json({
    id 
  })

});

app.listen(3000);
