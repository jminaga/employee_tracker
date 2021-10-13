const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const util = require("util");

const connection = require("./connection");

// Start Inquirer Prompts
const initiate = async () => {
  try {
    let answer = await inquirer.prompt({
      name: "action",
      type: "list",
      message: "PLease make a selection",
      choices: [
        "View Employees",
        "View Departments",
        "View Roles",
        "Add Employees",
        "Add Departments",
        "Add Roles",
        "Update Employee Role",
        "Exit",
      ],
    });
    switch (answer.action) {
      case "View Employees":
        viewEmployees();
        break;

      case "View Departments":
        viewDepartments();
        break;

      case "View Roles":
        viewRoles();
        break;

      case "Add Employees":
        addEmployees();
        break;

      case "Add Departments":
        addDepartment();
        break;

      case "Add Roles":
        addRoles();
        break;

      case "Update Employee Role":
        updateEmployees();
        break;

      case "Exit":
        connection.end();
        break;
    }
  } catch (err) {
    console.log(err);
    initiate();
  }
};

// View Employees from DB
const viewEmployees = async () => {
  try {
    let query = "SELECT * FROM employees";
    connection.query(query, function (err, res) {
      if (err) throw err;
      let employeeArray = [];
      res.forEach((employee) => employeeArray.push(employee));
      console.table(employeeArray);
      initiate();
    });
  } catch (err) {
    console.log(err);
    initiate();
  }
};

//View departments from DB
const viewDepartments = async () => {
  try {
    let query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
      if (err) throw err;
      let departments = [];
      res.forEach((department) => departments.push(department));
      console.table(departments);
      initiate();
    });
  } catch (err) {
    console.log(err);
    initiate();
  }
};

// View roles from DB
const viewRoles = async () => {
  try {
    let query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
      if (err) throw err;
      let roles = [];
      res.forEach((role) => roles.push(role));
      console.table(roles);
      initiate();
    });
  } catch (err) {
    console.log(err);
    initiate();
  }
};

// Add a new employee to DB
const addEmployees = async () => {
  try {
    let roles = await connection.query("SELECT * FROM role");
    let managers = await connection.query("SELECT * FROM employees");
    let answer = await inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is their First Name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is their Last Name",
      },
      {
        name: "roleId",
        type: "list",
        choices: roles.map((role) => {
          return {
            name: role.title,
            value: role.id,
          };
        }),
        message: "What is their role ID?",
      },
      {
        name: "managerId",
        type: "list",
        choices: managers.map((manager) => {
          return {
            name: manager.first_name + " " + manager.last_name,
            value: manager.id,
          };
        }),
        message: "What is their Manager's ID?",
      },
    ]);

    let result = await connection.query("INSERT INTO employees SET ?", {
      first_name: answer.firstName,
      last_name: answer.lastName,
      role_id: answer.roleId,
      manager_id: answer.managerId,
    });

    console.log(
      `${answer.firstName} ${answer.lastName} has been added successfully!\n`
    );
    initiate();
  } catch (err) {
    console.log(err);
    initiate();
  }
};

// Add a new department to DB
const addDepartment = async () => {
  try {
    let answer = await inquirer.prompt([
      {
        name: "department",
        type: "input",
        message: "What is the new department?",
      },
    ]);

    let result = await connection.query("INSERT INTO department SET ?", {
      name: answer.department,
    });

    console.log(`${answer.department} has been added successfully!\n`);
    initiate();
  } catch (err) {
    console.log(err);
    initiate();
  }
};

// Add new role to DB
const addRoles = async () => {
  try {
    let departments = await connection.query("SELECT * FROM department");
    let answer = await inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "What is the new role?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the new salary?",
      },
      {
        name: "departmentList",
        type: "list",
        choices: departments.map((departmentList) => {
          return {
            name: departmentList.department_name,
            value: departmentList.id,
          };
        }),
        message: "What is the new department?",
      },
    ]);

    let newDepartment;
    for (i = 0; i < departments.length; i++) {
      if (departments[i].department_id === answer.choice) {
        newDepartment = departments[i];
      }
    }
    let result = await connection.query("INSERT INTO role SET ?", {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.departmentList,
    });

    console.log(`${answer.title} has been added successfully!\n`);
    initiate();
  } catch (err) {
    console.log(err);
    initiate();
  }
};

// Make an update to an employee
const updateEmployees = async () => {
  try {
    let employees = await connection.query("SELECT * FROM employees");
    let employeeUpdate = await inquirer.prompt([
      {
        name: "employee",
        type: "list",
        choices: employees.map((employeeName) => {
          return {
            name: employeeName.first_name + " " + employeeName.last_name,
            value: employeeName.id,
          };
        }),
        message: "Who do you want to update?",
      },
    ]);

    let roles = await connection.query("SELECT * FROM role");
    let rolePick = await inquirer.prompt([
      {
        name: "role",
        type: "list",
        choices: roles.map((roleOption) => {
          return {
            name: roleOption.title,
            value: roleOption.id,
          };
        }),
        message: "Pick a new role!",
      },
    ]);

    let result = await connection.query("UPDATE employees SET ? WHERE ?", [
      { role_id: rolePick.role },
      { id: employeeUpdate.employee },
    ]);

    console.log(`The role has been successfully updated!\n`);
    initiate();
  } catch (err) {
    console.log(err);
    initiate();
  }
};

initiate();
