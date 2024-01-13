# RecipeRealm

## Project Summary

**Project Name:** RecipeRealm

**Description:**
RecipeRealm is a web application that allows users to explore and share food recipes. Users can log in to access personalized features, search for recipes by name or ingredients, and view detailed information, including descriptions, ingredients, and steps. The platform also supports user registration, login, and the ability to add and manage their own recipes.

## Implementation

**Technologies Used:**
- **Frontend:** React
- **Backend:** Node and Express
- **Authentication:** Auth0
- **Database:** Firebase

## Project Links

- **GitHub Repository:** [subh05sus/RecipeRealm](https://github.com/subh05sus/RecipeRealm)
- **Hosted Website:** [RecipeRealm](https://recipe-realm-2023.onrender.com)

## Setup Guide

### Backend (Server)

1. Navigate to the `Server` directory.
   ```bash
   cd Server
   ```

2. Install dependencies.
   ```bash
   npm install
   ```

3. Create a `secret.json` file in the `Server` directory with your Firebase credentials.
   ```json
   {
     "apiKey": "YOUR_API_KEY",
     "authDomain": "YOUR_AUTH_DOMAIN",
     "projectId": "YOUR_PROJECT_ID",
     "storageBucket": "YOUR_STORAGE_BUCKET",
     "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
     "appId": "YOUR_APP_ID"
   }
   ```

4. Start the server.
   ```bash
   npm start
   ```

### Frontend (Client)

1. Navigate to the `Client` directory.
   ```bash
   cd Client
   ```

2. Open the `package.json` file and add a `proxy` field.
   ```json
   {
     "name": "client",
     "version": "0.1.0",
     "private": true,
     "dependencies": {
       //...
     },
     "scripts": {
       "start": "react-scripts start",
       "build": "react-scripts build",
       "test": "react-scripts test",
       "eject": "react-scripts eject"
     },
     "proxy": "http://localhost:5000"  // Add this line
   }
   ```

3. Install dependencies.
   ```bash
   npm install
   ```

4. Replace all fetch links in the React app from the hosted backend server to the local backend server (`http://localhost:5000`).

5. Start the React app.
   ```bash
   npm start
   ```

The server will be running on port 5000, and the React app will be hosted on port 3000.

Feel free to customize it according to your specific project details.
