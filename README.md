
---

# SkyCode

**SkyCode** is a cutting-edge deployment utility designed to make deploying React applications as seamless and efficient as possible. Modeled after platforms like Vercel, SkyCode empowers developers with a robust, scalable infrastructure to deploy, manage, and scale their projects with minimal overhead.

---

## Key Features

- **Rapid Deployments**: Upload and deploy your React applications with minimal setup.
- **Scalable Infrastructure**: Host projects of any size with reliable performance.
- **Automated Processes**: Focus on building, not configuring, thanks to SkyCode's automation.
- **Flexibility**: SkyCode works for both personal and large-scale production applications.

---

## Technologies Used

- **TypeScript**: Ensures type safety across the entire codebase, reducing bugs and improving maintainability.
- **Node.js & Express**: Used for building the backend services, ensuring fast and scalable network applications.
- **AWS S3**: Handles file storage and retrieval, offering high availability and durability for deployment assets.
- **Redis**: Manages the build queue and status updates, providing a lightweight, fast in-memory data store.
- **Simple Git**: Automates the cloning of repositories, streamlining the deployment process.

---

## Project Structure

SkyCode is composed of four primary services:

1. **Upload Service**  
   Responsible for managing file uploads, particularly cloning the repository, processing the files, and uploading them to AWS S3.

2. **Deploy Service**  
   Handles the core deployment logic, downloading files from S3, running builds, and managing the final deployment process.

3. **Request Handler**  
   Manages incoming requests for accessing deployments, fetching the necessary files from S3 based on the project ID.

4. **Frontend**  
   (To be added) The user-facing interface where developers can upload, deploy, and manage their React projects.

Each service is modular, existing in its own directory with a dedicated README that explains its purpose and usage in more detail.

---

## Running SkyCode Locally

To run SkyCode locally, follow these steps for each service. Please ensure you have gone through the individual README files located in each service folder before proceeding.

### Step-by-Step Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dhruv-Sood/SkyCode.git
   cd skycode
   ```

2. **Install dependencies for each service**

   Navigate into each service directory and run the following commands:

   ```bash
   cd ./upload_service
   npm install
   npx tsc -b
   node dist/index.js
   ```

   Repeat this process for the **deploy_service** and **request_handler**.

3. **Ensure AWS and Redis are set up**

   - Set your AWS S3 credentials in a `.env` file.
   - Ensure that Redis is running locally or connected to a Redis cloud instance.

4. **Run all services**

   After starting each service, the system will function locally. You can interact with SkyCode using the given endpoints and monitor logs to verify successful deployment processes.

---

## Contributing Guidelines

We welcome contributions! Please follow the coding standards outlined in the individual `Contributing.md` files located in each service folder to ensure a consistent and smooth development experience.

--- 
