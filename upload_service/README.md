
# Upload Service

The Upload Service is a component of the Vercel-like utility designed to handle the deployment of repositories to an S3 bucket. This service clones a repository, retrieves all files, uploads them to S3, and then notifies the build queue.

## Features

- Clone Git repositories using `simple-git`.
- Recursively retrieve all files from the repository.
- Upload files to an S3 bucket.
- Notify the deployment status to Redis.
- Check the status of a deployment via Redis.

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd upload_service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your AWS credentials:
   ```
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   ```

4. Ensure you have Redis running locally or accessible in your environment.

## API Endpoints

### 1. Deploy Repository

**POST** `/deploy`

Deploy a new repository by cloning it, retrieving all files, and uploading them to S3.

**Request Body**:
```json
{
  "repoUrl": "https://github.com/user/repo.git"
}
```

**Response**:
```json
{
  "id": "unique-id",
  "files": ["index.html", "style.css", "script.js"]
}
```

- **repoUrl**: The Git URL of the repository you want to deploy.
- **id**: A unique 5-character identifier for the deployment.
- **files**: List of files that were uploaded.

### 2. Get Deployment Status

**GET** `/status`

Check the status of a deployment using the unique deployment ID.

**Query Parameters**:
- `id`: The unique identifier for the deployment.

**Response**:
```json
{
  "status": "uploaded"
}
```

## How It Works

1. **Deploy Repository**:
    - The service generates a unique ID for each deployment.
    - It clones the Git repository to a temporary output folder.
    - All files in the repository are recursively retrieved using the `getAllFiles` function.
    - The files are then uploaded to an S3 bucket using the `uploadFile` function.
    - The deployment ID is pushed to a Redis build queue, and the deployment status is updated.

2. **Check Status**:
    - You can check the status of a deployment by sending a GET request to `/status` with the deployment ID. The status is retrieved from Redis.

## Utility Functions

### 1. `getAllFiles(folderPath: string)`

Recursively retrieves all files from the provided folder path.

### 2. `uploadFile(fileName: string, localFilePath: string)`

Uploads the specified file to an S3 bucket.

## Prerequisites

- Node.js
- Redis
- AWS S3

---

## Running the Service

1. **Navigate to the Upload Service Directory**:

   First, move into the `upload_service` directory:

   ```bash
   cd ./upload_service
   ```

2. **Install Dependencies**:

   Install the required npm packages:

   ```bash
   npm install
   ```

3. **Build the TypeScript Project**:

   Use the following command to compile the TypeScript files:

   ```bash
   npx tsc -b
   ```

4. **Start the Express Server**:

   After the build is complete, run the server using:

   ```bash
   node dist/index.js
   ```

   The service will now be running at `http://localhost:3000`.

---

## Environment Variables

Make sure to define the following environment variables in your `.env` file:

- `AWS_ACCESS_KEY_ID`: Your AWS access key.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key.

## Example Usage

```bash
curl -X POST http://localhost:3000/deploy -H "Content-Type: application/json" -d '{"repoUrl": "https://github.com/user/repo.git"}'
```

---
