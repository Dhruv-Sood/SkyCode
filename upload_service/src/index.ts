import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import simpleGit from "simple-git";
import { getAllFiles } from "./utils";
import { uploadFile } from "./utils";
import path from "path";
import fs from "fs";

// redis setup
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(express.json());

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, "../output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

app.post("/deploy", async (req: Request, res: Response) => {
  try {
    const repoUrl = req.body.repoUrl;
    const id = uuidv4().slice(0, 5);
    const outputPath = path.join(outputDir, id);

    // Creating specific output directory for this deployment
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // Cloning repository
    await simpleGit().clone(repoUrl, outputPath);

    // Getting all files
    const files = getAllFiles(outputPath);

    // Uploading files to S3
    files.map(async (file)=>{
      const relativePath = path.relative(outputDir,file); // Eg. /cf32/index.html
      const s3Key = path.join("output", relativePath); // Eg. output/cf32/index.html

      await uploadFile(s3Key, file);
    });

    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded"); 

    res.json({
      id,
      files: files.map((file) => path.relative(outputPath, file)),
    });
  } catch (error) {
    console.error("Deployment error:", error);
    res.status(500).json({ error: "Deployment failed" });
  }
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response,
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
