// Requiring dependancies needed for the application
const mysql = require("mysql2");
const inquirer = require("inquirer");
const fs = require("fs").promises;
const cTable = require("console.table");

require("dotenv").config();

// Creating a connection to server using .env variables and displaying welcome message 
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    afterConnection();
  });

  afterConnection = () => {
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    console.log("^                            ^");
    console.log("^      EMPLOYEE MANAGER      ^");
    console.log("^                            ^");
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    promptStart();
  };

  