import path from "path";
import dotenv from "dotenv";
import { S3 } from "aws-sdk";
import fs from "fs";

dotenv.config();

export const getAllFiles = (folderPath: string) => {
  let response: string[] = [];

  // Checking if directory exists
  if (!fs.existsSync(folderPath)) {
    console.error(`Directory does not exist: ${folderPath}`);
    return response;
  }

  // Utility function to recursively get all files in a directory
  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
};

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Utility function to upload a file to S3
export const uploadFile = async (fileName: string, localFilePath: string) => {
  try {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3
      .upload({
        Body: fileContent,
        Bucket: "cloudcode123",
        Key: fileName,
      })
      .promise();
    console.log(`Successfully uploaded: ${fileName}`);
    return response;
  } catch (error) {
    console.error(`Error uploading file ${fileName}:`, error);
    throw error;
  }
};
