import express from "express";
import { S3 } from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const PORT = process.env.PORT || 3001;

app.get("/*", async (req, res) => {
  try {
    // Extract the host and remove the development domain suffix
    const host = req.hostname;
    let id;

    // Handle different development domain scenarios
    if (host.includes("nip.io")) {
      // Format: abcde.127.0.0.1.nip.io
      id = host.split(".")[0];
    } else if (host.includes("localtest.me")) {
      // Format: abcde.localtest.me
      id = host.split(".")[0];
    } else {
      // Handle your original domain format or other cases
      id = host.split(".")[0];
    }

    const filePath = req.path || "/index.html"; // Default to index.html if no path
    console.log({
      host,
      id,
      filePath,
      fullPath: `dist/${id}${filePath}`,
    });

    const contents = await s3
      .getObject({
        Bucket: "cloudcode123",
        Key: `dist/${id}${filePath}`,
      })
      .promise();

    // Enhanced MIME type handling
    const mimeTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    };

    const ext = filePath.match(/\.[^.]*$/)?.[0] || "";
    // @ts-ignore
    const contentType = mimeTypes[ext] || "application/octet-stream";

    res.set("Content-Type", contentType);
    res.send(contents.Body);
  } catch (error:any) {
    console.error("Error serving file:", error);
    res.status(error.statusCode || 500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`You can access your deployments using the following formats:`);
  console.log(`- http://[project-id].127.0.0.1.nip.io:${PORT}`);
  console.log(`- http://[project-id].localtest.me:${PORT}`);
});
