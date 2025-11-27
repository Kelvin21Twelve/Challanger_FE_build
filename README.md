# Challenger Frontend Setup Guide

This guide provides step-by-step instructions to set up, build, and deploy a this project, including local development and production deployment on an XAMPP server.

## 1. Installation Steps

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended) version 20.10.0
- [npm](https://www.npmjs.com/) version 10.2.3

### Install Dependencies

Navigate to the project directory and install dependencies:

```sh
npm install
```

Note: If it do not work then try

```sh
npn install --legacy-peer-deps
```

## 2. Running the Project Locally

To start the development server, run:

```sh
npm run dev
```

The application will be available at `http://localhost:5173/` (or another port if configured).

## 3. Creating a Build

To generate a production-ready build, run:

```sh
npm run build
```

This will create a `build/` directory containing the optimized build.

## 4. Changing the Base URL

There is a constants file where the `api_url` needs to be updated before deploying. Locate the constants file (e.g., `js/constants.js`) and modify the `api_url`:

```js
var constant = {  api_url = "https://your-production-url.com"; ...}
```

Ensure the correct URL is set based on the environment.

## 5. Uploading the Build to XAMPP Server (HTTPS Docs)

Follow these steps to deploy the build in XAMPP:

1. Generate the production build
2. Copy the contents of the `build/` directory.
3. Navigate to your XAMPP installation directory (usually `C:/xampp/htdocs/`).
4. Moves all files to a new folder inside `htdocs/` by creating a new folder.
5. Paste the `build/` contents into `C:/xampp/htdocs`.
6. Start XAMPP and ensure Apache is running.
7. Open the browser and navigate to: `https://localhost` or `https://your-domain.com`

   Ensure that the `api_url`, `ExcelURL`, `UploadsURL` in your constants file is correctly set for production.
   or if ssl is not configured then try using `http://`

## 6. Test the Build Locally

After generating the build, you can test it locally by running the following command:

```sh
npm run preview
```

This will start the development server and open the application in the browser.

This completes the setup and deployment guide for the Vite project. If you encounter issues, check the console for errors and ensure dependencies are correctly installed.
