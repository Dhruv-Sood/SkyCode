
---

# Request Handler

The **Request Handler** service is responsible for handling incoming HTTP requests and serving static files (such as HTML, CSS, JavaScript, and assets) for specific deployments from an S3 bucket. The project ID is extracted from the subdomain, and the appropriate files are fetched and served.

## Features

- Serves static files from an S3 bucket based on the project ID extracted from the subdomain.
- Supports multiple hosting services, such as `onrender.com`, `nip.io`, `localtest.me`, or custom domains.
- Auto-detects and serves appropriate MIME types (HTML, CSS, JavaScript, images, etc.).

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dhruv-Sood/SkyCode.git
   cd SkyCode/request_handler
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** with your AWS credentials and custom port (if needed):
   ```bash
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   PORT=3001  # Optional, defaults to 3001
   ```

4. Ensure that your AWS S3 bucket is properly set up and contains the deployed projects.

## Running the Service

1. **Navigate to the Request Handler directory**:

   Before running the service, ensure you are in the correct folder:
   ```bash
   cd ./request_handler
   ```

2. **Install dependencies**:

   If you haven't installed them already:
   ```bash
   npm install
   ```

3. **Build the TypeScript project** (if necessary):

   Compile the TypeScript files into JavaScript (if applicable):
   ```bash
   npx tsc -b
   ```

4. **Start the Request Handler**:

   After building the project, start the service with:
   ```bash
   node dist/index.js
   ```

   The service will be running at `http://localhost:[PORT]`, where `[PORT]` is either the custom value you defined in the `.env` file or the default `3001`.

## How It Works

1. **Subdomain Handling**:
    - The service extracts the project ID from the subdomain of the incoming request.
    - For example, if the request URL is `https://4aa6d.skycode-2.onrender.com`, it will extract `4aa6d` as the project ID.

2. **Serving Static Files**:
    - The request's path (e.g., `/index.html`, `/assets/style.css`) is used to locate and fetch the corresponding file from the S3 bucket.
    - The file is retrieved from S3, and its content is sent back to the client.

3. **MIME Type Detection**:
    - The service determines the MIME type based on the file extension (e.g., `.html`, `.css`, `.js`, etc.) and sets the appropriate `Content-Type` header before sending the file.

4. **Supported Host Formats**:
    The service supports the following host formats:
    - `https://[project-id].onrender.com`
    - `http://[project-id].127.0.0.1.nip.io:[PORT]`
    - `http://[project-id].localtest.me:[PORT]`

## Utility Functions

### `getObjectFromS3(prefix: string)`

Fetches the requested file from the S3 bucket based on the deployment ID and file path.

## Prerequisites

- Node.js
- AWS S3

## Environment Variables

Make sure to define the following environment variables in your `.env` file:

- `AWS_ACCESS_KEY_ID`: Your AWS access key.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key.
- `PORT`: The port number on which the server should listen (optional, defaults to 3001).

## Example Usage

Once the service is running, you can access the deployed projects using the following formats:

- `http://[project-id].127.0.0.1.nip.io:[PORT]`
- `http://[project-id].localtest.me:[PORT]`
- `https://[project-id].your-app-name.onrender.com`

---

