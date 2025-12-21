# MERN Quiz Management System (QMS)

A microservices-based Quiz Management System built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

- **client/**: React frontend built with Vite.
- **server/**: Microservices backend.
  - **auth-service**: Handles user authentication and authorization.
  - **quiz-service**: Manages quiz creation and retrieval.
  - **assessment-service**: Handles quiz submissions and grading.
  - **reporting-service**: Generates PDF reports of quiz results.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (Atlas or local instance)

## Installation

Run the following command at the root to install dependencies for the root, client, and all services:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server/auth-service && npm install && cd ../..
cd server/quiz-service && npm install && cd ../..
cd server/assessment-service && npm install && cd ../..
cd server/reporting-service && npm install && cd ../..
```

## Running the Project

You can start all services and the client concurrently using:

```bash
npm run dev
```

The client will be available at `http://localhost:5173`.

## Environment Variables

Each microservice in `server/` has its own `.env` file for configuration (MongoDB URI, Port, etc.).
