# BriskTask - Fullstack Todo App

Responsive Todo app made with React, Node and MySQL.

Frontend is deployed on Netlify: https://brisktask.netlify.app

## Built with

-   HTML
-   CSS
-   JavaScript
-   React
-   Node
-   MySQL

## Installation and Setup

-   You can clone this repository if you would like to check out app functionalities

### DATABASE SETUP

-   On your local MySQL server create new database
-   Navigate to `/backend/config/tables` where you will find SQL commands to recreate the tables needed
-   Add those tables in the new databse you just created

### .env SETUP

-   In the root folder create .env file with the following parameters:

    -   `DATABASE_PORT` = Port number that your MySQL server is running on
    -   `DATABASE_HOST` = Your MySQL host, default is `127.0.0.1`
    -   `DATABASE_USER` = Your MySQL user name, default is `root`
    -   `DATABASE_PASSWORD` = Password for your local MySQL access
    -   `DATABASE_NAME` = Name of the database you created during database setup above
    -   `SERVER_HOSTNAME` = You can put the default `http://localhost` for the server hostname
    -   `SERVER_PORT` = Port number you want to run your local server on
    -   `JWT_SECRET` = JSON Web Token secret key, can be any string you want
    -   `JWT_TOKEN_EXPIRES` = Set token expiration time, for example `24h` means that token expires in 1 day

### FRONTEND AND BACKEND SETUP

-   Frontend was created using Vite: https://vitejs.dev
-   Inside the root folder run: `npm install`
-   Navigate to `/frontend` folder and run: `npm install`
-   To start backend server navigate to the root folder and run: `npm start`
-   To start frontend react server navigate to the `/frontend` folder and run: `npm run dev`
-   Open http://localhost:5173 to view the app in the browser

## Description and Usage

-   Simple todo app. You can perform authentication actions via login or registration form
-   When you are logged in you can perform CRUD operations on your tasks
-   While viewing tasks clicking on a pencil icon navigates to the update task page
-   Clicking a trash can icon deletes a task from the database

## License

MIT License. See `LICENSE.txt` for more information.
