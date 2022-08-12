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

  // Creating a propmt question with inquirer
  const promptStart = () => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "choices",
          message: "What would you like to do?",
          choices: [
            "Show all departments",
            "Show all roles",
            "Show all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Update an employee manager",
            "Show employees by department",
            "Delete a department",
            "Delete a role",
            "Delete an employee",
            "Show department budgets",
            "Exit",
          ],
        },
      ])
      .then(({ choices }) => {
        choices === "Show all departments"
          ? showDepartments()
          : choices === "Show all roles"
          ? showRoles()
          : choices === "Show all employees"
          ? showEmployees()
          : choices === "Add a department"
          ? createDepartment()
          : choices === "Add a role"
          ? createRole()
          : choices === "Add an employee"
          ? addEmployee()
          : choices === "Update an employee role"
          ? updateEmployee()
          : choices === "Update an employee manager"
          ? updateManager()
          : choices === "Update an employee manager"
          ? updateManager()
          : choices === "Show employees by department"
          ? showEmployeeDepartment()
          : choices === "Delete a department"
          ? deleteDepartment()
          : choices === "Delete a role"
          ? deleteRole()
          : choices === "Delete an employee"
          ? deleteEmployee()
          : choices === "Show department budgets"
          ? showBudget()
          : choices === "Exit"
          ? connection.end()
          : connection.end();
      });
  };