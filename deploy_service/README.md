
---

# Deploy Service

The Deploy Service is responsible for managing the build process of projects after they have been uploaded to the S3 bucket. It listens to a Redis queue, downloads the project files from S3, builds the project, and finally uploads the build artifacts back to S3.

## Features

- Listens to a Redis build queue for project deployment.
- Downloads the project files from S3.
- Installs dependencies and builds the project.
- Uploads the build artifacts to an S3 bucket.
- Updates the deployment status in Redis.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dhruv-Sood/SkyCode.git
   cd SkyCode/deploy_service
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** with your AWS credentials:
   ```bash
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   ```

4. Ensure you have Redis running and accessible in your environment.

## Running the Service

1. **Navigate to the Deploy Service directory**:

   Before running the service, ensure you are in the correct folder:
   ```bash
   cd ./deploy_service
   ```

2. **Install dependencies**:

   If you haven't installed them already:
   ```bash
   npm install
   ```

3. **Build the TypeScript project**:

   Compile the TypeScript files into JavaScript:
   ```bash
   npx tsc -b
   ```

4. **Start the Deploy Service**:

   After building the project, start the service with:
   ```bash
   node dist/index.js
   ```

   The service will continuously listen for new jobs in the Redis build queue.

## How It Works

1. **Queue Listener**:
    - The service continuously listens to the `build-queue` in Redis. 
    - When a new deployment ID is pushed to the queue, it retrieves the ID and starts the process.

2. **Download Project from S3**:
    - The project files for the specific deployment ID are downloaded from S3 to a local directory.

3. **Build the Project**:
    - The service installs dependencies (`npm install`) and runs the build process (`npm run build`) inside the downloaded project directory.

4. **Upload Built Files to S3**:
    - After the build, the final distribution folder (`dist`) is uploaded back to S3.

5. **Update Status**:
    - Once the process completes, the status in Redis is updated to "deployed."

## Utility Functions

### 1. `downloadFromS3(prefix: string)`

Downloads all files from the specified S3 bucket folder.

### 2. `buildProject(id: string)`

Builds the project by installing dependencies and running the build script in the cloned repository.

### 3. `copyFinalDist(id: string)`

Recursively uploads the build artifacts from the `dist` folder to S3.

### 4. `getAllFiles(folderPath: string)`

Recursively retrieves all files from the specified folder path.

### 5. `uploadFile(fileName: string, localFilePath: string)`

Uploads a file to the S3 bucket.

## Prerequisites

- Node.js
- Redis
- AWS S3

## Environment Variables

Make sure to define the following environment variables in your `.env` file:

- `AWS_ACCESS_KEY_ID`: Your AWS access key.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key.

## Example Usage

Once the service is running, any project that gets pushed to the Redis queue will be automatically handled by the Deploy Service.

---