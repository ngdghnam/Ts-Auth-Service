# Auths (Authentication - Authorization) Service with TypeScript

## Overview

The **Auths Service** is a robust authentication and authorization system built using **TypeScript**, following an **Object-Oriented Programming (OOP)** approach. The project is structured using the **3-layer model**, ensuring separation of concerns and maintainability.

## Requirements

- [Node.js](https://nodejs.org/) (latest LTS recommended)
- [TypeScript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)

## Folder Structure

```
project-root/
├── src/
│   ├── config/        # Configuration files (e.g., database, environment variables)
│   ├── controllers/   # Handles HTTP requests and responses
│   ├── entities/      # Defines core business models and classes
│   ├── interfaces/    # Defines TypeScript interfaces for strong typing
│   ├── repositories/  # Handles data persistence and retrieval
│   ├── routes/        # Defines API routes and endpoints
│   ├── utils/         # Utility functions and helpers
├── index.ts           # Main entry point
├── server.ts          # Server initialization
```

## How to Run

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the application:
   ```sh
   npm run start
   ```

## License

This project is open-source and available under the MIT License.
