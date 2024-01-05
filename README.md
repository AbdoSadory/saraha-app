# Saraha App

A Saraha App API for a sending messages application using NodeJS runtime environment and ExpressJS as the server framework.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the API](#running-the-api)
- [API Structure](#api-structure)
- [Endpoints](#endpoints)

## Prerequisites

Before you run the API, make sure you have the following prerequisites installed:

**MongoDB Server:** Ensure you have MongoDB Server installed. You can download and install MongoDB from [MongoDB official website](https://www.mongodb.com/try/download/community).

## Installation

To install dependencies:

```bash
npm install
```

## Running the API

To run in dev mode:

```bash
npm run dev
```

## API Structure

Following ExpressJS Structure:

- DB : for DB connection and Entities Schemas
- Src : for middlewares, modules (controllers,routes) , utils

```
  ├── DB
  |   ├── models
  |   ├── connection.js
  |   └── dbMethods.js
  ├── src
  |   ├── middlewares
  |   |      ├── authHandler.js
  |   |      ├── dataValidationHandler.js
  |   |      ├── globalErrorHandler.js
  |   |      └── uploadingFilesHandler.js
  │   ├── modules
  |   |      ├── users
  |   |      |      ├── controllers.js
  |   |      |      ├── dataValidationSchema.js
  |   |      |      └── routes.js
  |   |      ├── messages
  |   |      |      ├── controllers.js
  |   |      |      ├── dataValidationSchema.js
  |   |      └──    └── routes.js
  |   ├── utils
  |   |      ├── allowedExtensions.js
  |   |      ├── generateToken.js
  |   |      └── generateUniqueString.js
  |   └── uploads
  ├── index.js
  ├── .env
  ├── README.md
  └── .gitignore
```

## Endpoints

### User

| Method | URL                         | Description                                     |
| ------ | --------------------------- | ----------------------------------------------- |
| POST   | `/users/signUp`             | Create a new user account                       |
| POST   | `/users/signIn`             | Authenticate and get access token               |
| PUT    | `/users/updateProfile`      | Update User Profile and must be logged In       |
| DELETE | `/users/deleteProfile`      | Delete User Profile and must be logged In       |
| GET    | `/users/profile`            | Get User Profile and must be logged In          |
| POST   | `/users/uploadProfileImage` | Upload User Profile Image and must be logged In |

### Messages

| Method | URL                             | Description                                     |
| ------ | ------------------------------- | ----------------------------------------------- |
| GET    | `/messages/userMessages`        | get all messages depends on View                |
| POST   | `/messages/sendMessage/:userId` | Send new message                                |
| PUT    | `/messages/message/:msgId`      | Update message view state and must be logged In |
| DELETE | `/messages/message/:msgId`      | Delete a specific message and must be logged In |
