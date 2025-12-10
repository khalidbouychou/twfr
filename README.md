# Tawfir Project

This is the frontend application for the Tawfir project, built with React, Vite, and Tailwind CSS.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Docker and Docker Compose (optional, for containerized run)

## Getting Started

You can run the project either locally or using Docker.

### 1. Local Development

To run the project locally on your machine:

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Fill in the required API keys in the `.env` file.

4.  Start the development server:
    ```bash
    npm run dev
    ```

5.  Open your browser and visit `http://localhost:5173`.

### 2. Running with Docker

To run the project using Docker Compose:

1.  Ensure you are in the root directory of the project.

2.  Create a `.env` file in the `frontend` directory (or ensure your environment variables are set in your shell if relying on substitution).

3.  Build and start the containers:
    ```bash
    docker-compose up --build
    ```

4.  The application will be available at `http://localhost:5173`.

## Project Structure

- **frontend/**: Contains the React application source code.
  - **src/**: Source files (components, hooks, context, etc.).
  - **public/**: Static assets.
  - **Dockerfile**: Docker configuration for the frontend.
- **docker-compose.yml**: Docker Compose configuration for the project.

## Scripts

Inside the `frontend` directory, you can run:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Locally preview the production build.

## Environment Variables

The application relies on several API keys. Make sure to configure them in your `.env` file:

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_FINNHUB_TOKEN`
- `VITE_GNEWS_KEY`
- `VITE_NEWSAPI_KEY`
- `VITE_MEDIASTACK_KEY`
- `VITE_CTX_NEWS_KEY`
- `VITE_CTX_NEWS_HOST`
