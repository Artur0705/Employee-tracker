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

// Functions to address the propmted questions

showDepartments = async () => {
  console.log("Showing all departments...\n");
  const sql = await fs.readFile("./db/query/showDepartments.sql", "utf8");

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptStart();
  });
};

showRoles = async () => {
  console.log("Showing all roles...\n");

  const sql = await fs.readFile("./db/query/showRoles.sql", "utf8");

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptStart();
  });
};

showEmployees = async () => {
  console.log("Showing all employees...\n");
  const sql = await fs.readFile("./db/query/showEmployees.sql", "utf8");
  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptStart();
  });
};

createDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDept",
        message: "What department do you want to add?",
        validate: (addDept) => {
          if (addDept) {
            return true;
          } else {
            console.log("Please enter a department");
            return false;
          }
        },
      },
    ])
    .then(async (answer) => {
      const sql = await fs.readFile("./db/query/createDepartment.sql", "utf8");
      connection.query(sql, answer.addDept, (err, result) => {
        if (err) throw err;
        console.log("Added " + answer.addDept + " to departments!");

        showDepartments();
      });
    });
};

createRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What role do you want to add?",
        validate: (createRole) => {
          if (createRole) {
            return true;
          } else {
            console.log("Please enter a role");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of this role?",
        validate: (addSalary) => {
          if (addSalary) {
            return true;
          } else {
            console.log("Please enter a salary");
            return false;
          }
        },
      },
    ])
    .then(async (answer) => {
      const params = [answer.role, answer.salary];

      const sql = await fs.readFile("./db/query/createRole.sql", "utf8");

      connection.promise().query(sql, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "dept",
              message: "What department is this role in?",
              choices: dept,
            },
          ])
          .then(async ({ dept }) => {
            params.push(dept);

            const sql = await fs.readFile(
              "./db/query/createRoleDep.sql",
              "utf8"
            );

            connection.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log("Added" + answer.role + " to roles!");

              showRoles();
            });
          });
      });
    });
};

addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "fistName",
        message: "What is the employee's first name?",
        validate: (addFirst) => {
          if (addFirst) {
            return true;
          } else {
            console.log("Please enter a first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: (addLast) => {
          if (addLast) {
            return true;
          } else {
            console.log("Please enter a last name");
            return false;
          }
        },
      },
    ])
    .then(async (answer) => {
      const params = [answer.fistName, answer.lastName];
      const sql = await fs.readFile("./db/query/addEmployee.sql", "utf8");

      connection.promise().query(sql, (err, data) => {
        if (err) throw err;

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then(async ({ role }) => {
            params.push(role);

            const sql = await fs.readFile(
              "./db/query/selectEmployee.sql",
              "utf8"
            );

            connection.promise().query(sql, (err, data) => {
              if (err) throw err;

              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managers,
                  },
                ])
                .then(async ({ manager }) => {
                  params.push(manager);

                  const sql = await fs.readFile(
                    "./db/query/insertEmployee.sql",
                    "utf8"
                  );

                  connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Employee has been added!");

                    showEmployees();
                  });
                });
            });
          });
      });
    });
};

// Updating an employee
updateEmployee = async () => {
    const sql = await fs.readFile("./db/query/selectEmployee.sql", "utf8");
  
    connection.promise().query(sql, (err, data) => {
      if (err) throw err;
  
      const employees = data.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));
  
      inquirer
        .prompt([
          {
            type: "list",
            name: "name",
            message: "Which employee would you like to update?",
            choices: employees,
          },
        ])
        .then(async (name) => {
          const params = [];
          params.push(name);
  
          const sql = await fs.readFile("./db/query/selectRole.sql", "utf8");
  
          connection.promise().query(sql, (err, data) => {
            if (err) throw err;
  
            const roles = data.map(({ id, title }) => ({
              name: title,
              value: id,
            }));
  
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "role",
                  message: "What is the employee's new role?",
                  choices: roles,
                },
              ])
              .then(async ({ role }) => {
                params.push(role);
  
                let employee = params[0];
                params[0] = role;
                params[1] = employee;
  
                const sql = await fs.readFile(
                  "./db/query/selectRole.sql",
                  "utf8"
                );
  
                connection.query(sql, params, (err, result) => {
                  if (err) throw err;
                  console.log("Employee has been updated!");
  
                  showEmployees();
                });
              });
          });
        });
    });
  };

// Updating a manager
updateManager = async () => {
    const sql = await fs.readFile("./db/query/selectEmployee.sql", "utf8");
  
    connection.promise().query(sql, (err, data) => {
      if (err) throw err;
  
      const employees = data.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));
  
      inquirer
        .prompt([
          {
            type: "list",
            name: "name",
            message: "Which employee would you like to update?",
            choices: employees,
          },
        ])
        .then(async ({ name }) => {
          const params = [];
          params.push(name);
          const sql = await fs.readFile("./db/query/selectEmployee.sql", "utf8");
  
          connection.promise().query(sql, (err, data) => {
            if (err) throw err;
  
            const managers = data.map(({ id, first_name, last_name }) => ({
              name: first_name + " " + last_name,
              value: id,
            }));
  
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "manager",
                  message: "Who is the employee's manager?",
                  choices: managers,
                },
              ])
              .then(async ({ manager }) => {
                params.push(manager);
  
                let employee = params[0];
                params[0] = manager;
                params[1] = employee;
  
                const sql = await fs.readFile(
                  "./db/query/updateEmployeeManager.sql",
                  "utf8"
                );
  
                connection.query(sql, params, (err, result) => {
                  if (err) throw err;
                  console.log("Employee has been updated!");
  
                  showEmployees();
                });
              });
          });
        });
    });
  };

  showEmployeeDepartment = async () => {
    console.log("Showing employee by departments...\n");
    const sql = await fs.readFile(
      "./db/query/showEmployeeDepartment.sql",
      "utf8"
    );
  
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptStart();
    });
  };
  
  deleteDepartment = async () => {
    const sql = await fs.readFile("./db/query/selectDepartment.sql", "utf8");
  
    connection.promise().query(sql, (err, data) => {
      if (err) throw err;
  
      const dept = data.map(({ name, id }) => ({ name: name, value: id }));
  
      inquirer
        .prompt([
          {
            type: "list",
            name: "dept",
            message: "What department do you want to delete?",
            choices: dept,
          },
        ])
        .then(async ({ dept }) => {
          const sql = await fs.readFile(
            "./db/query/deleteDepartmentId.sql",
            "utf8"
          );
  
          connection.query(sql, dept, (err, result) => {
            if (err) throw err;
            console.log("Successfully deleted!");
  
            showDepartments();
          });
        });
    });
  };

  deleteRole = async () => {
    const sql = await fs.readFile("./db/query/selectRole.sql", "utf8");
  
    connection.promise().query(sql, (err, data) => {
      if (err) throw err;
  
      const role = data.map(({ title, id }) => ({ name: title, value: id }));
  
      inquirer
        .prompt([
          {
            type: "list",
            name: "role",
            message: "What role do you want to delete?",
            choices: role,
          },
        ])
        .then(async ({ role }) => {
          const sql = await fs.readFile("./db/query/deleteRoleId.sql", "utf8");
  
          connection.query(sql, role, (err, result) => {
            if (err) throw err;
            console.log("Successfully deleted!");
  
            showRoles();
          });
        });
    });
  };
  
  deleteEmployee = async () => {
    const sql = await fs.readFile("./db/query/selectEmployee.sql", "utf8");
  
    connection.promise().query(sql, (err, data) => {
      if (err) throw err;
  
      const employees = data.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));
  
      inquirer
        .prompt([
          {
            type: "list",
            name: "name",
            message: "Which employee would you like to delete?",
            choices: employees,
          },
        ])
        .then(async ({ name }) => {
          const sql = await fs.readFile(
            "./db/query/deleteEmployeeId.sql",
            "utf8"
          );
  
          connection.query(sql, name, (err, result) => {
            if (err) throw err;
            console.log("Successfully Deleted!");
  
            showEmployees();
          });
        });
    });
  };

  showBudget = async () => {
    console.log("Showing budget by department...\n");
  
    const sql = await fs.readFile("./db/query/showBudget.sql", "utf8");
  
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
  
      promptStart();
    });
  };
  