import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { exec, spawn } from "child_process";

dotenv.config();
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


// Utility function to Download files from S3
export const downloadFromS3 = async (prefix: String) => {
    //@ts-ignore
    const allFiles = await s3.listObjectsV2({
        Bucket: "cloudcode123",
        Prefix: prefix
    
    }).promise()

    const allPromises =
      allFiles.Contents?.map(async ({ Key }) => {
        return new Promise(async (resolve) => {
          if (!Key) {
            resolve("");
            return;
          }
          const finalOutputPath = path.join(__dirname, Key);
          const outputFile = fs.createWriteStream(finalOutputPath);
          const dirName = path.dirname(finalOutputPath);
          if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
          }
          s3.getObject({
            Bucket: "cloudcode123",
            Key,
          })
            .createReadStream()
            .pipe(outputFile)
            .on("finish", () => {
              resolve("");
            });
        });
      }) || [];

      console.log("awaiting");

    await Promise.all(allPromises?.filter(x => x !== undefined));
}


// Utility function to build the project
export function buildProject(id: string) {
  return new Promise((resolve) => {
    const child = exec(
      `cd ${path.join(
        __dirname,
        `output/${id}`
      )} && npm install && npm run build`
    );

    child.stdout?.on("data", function (data) {
      console.log("stdout: " + data);
    });
    child.stderr?.on("data", function (data) {
      console.log("stderr: " + data);
    });

    child.on("exit", function (code) {
      resolve("");
    });
  });
}
export async function copyFinalDist(id: string) {
  const folderPath = path.join(__dirname, `output/${id}/dist`);

  try {
    const allFiles = getAllFiles(folderPath);

    // Use for...of loop to handle async/await properly
    for (const file of allFiles) {
      const relativeFilePath =
        `dist/${id}/` + file.slice(folderPath.length + 1);
      await uploadFile(relativeFilePath, file); // Await here
    }
  } catch (error) {
    console.error("Error copying files:", error);
  }
}

const getAllFiles = (folderPath: string): string[] => {
  let response: string[] = [];

  try {
    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach((file) => {
      const fullFilePath = path.join(folderPath, file);
      if (fs.statSync(fullFilePath).isDirectory()) {
        response = response.concat(getAllFiles(fullFilePath)); // Recursively get all files
      } else {
        response.push(fullFilePath); // Add file path to response
      }
    });
  } catch (error) {
    console.error("Error reading folder contents:", error);
  }

  return response;
};

const uploadFile = async (fileName: string, localFilePath: string) => {
  try {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3
      .upload({
        Body: fileContent,
        Bucket: "cloudcode123", // Use your actual bucket name
        Key: fileName,
      })
      .promise();
    console.log(`File uploaded successfully: ${fileName}`, response);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};