const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const db = require("./db/connection");
const inquirer = require('inquirer');

// use inquirer to prompt user questions
const prompts = () => {
  inquirer.prompt([
      {
          type: "list",
          name: "userSelect",
          message: "Select the choice you would like to carry out.",
          choices: [
              "View all departments",
              "Add a department",
              "Remove a Department",
              "View all roles",
              "Add a role",
              "Remove a role",
              "View all employees",
              "Add an employee",
              "Remove an employee",
              "Edit an employee's role",
              "Edit an employee's manager",
              "View employees by department",
              "View employees by manager",
              "Leave"
          ]
      }
  ])
  .then(answers => {
      const followUp = answers.userSelect;
      if (followUp === "View all departments") {
          viewDepartments();
      };

      if (followUp === "Add a department") {
          addDepartment();
      };

      if (followUp === "Remove a Department") {
          removeDepartment();
      };

      if (followUp === "View all roles") {
          viewRoles();
      };

      if (followUp === "Add a role") {
          addRole();
      };

      if (followUp === "Remove a role") {
          removeRole();
      };

      if (followUp === "View all employees") {
          viewEmployees();
      };

      if (followUp === "Add an employee") {
          addEmployee();
      };

      if (followUp === "Remove an employee") {
          removeEmployee();
      };

      if (followUp === "Edit an employee's role") {
          editEmployeeRole();
      };

      if (followUp === "Edit an employee's manager") {
          editEmployeeManager();
      };

      if (followUp === "View employees by department") {
          viewEmployeesByDepartment();
      };

      if (followUp === "View employees by manager") {
          viewEmployeesByManager();
      };

      if (followUp === "View utilized budget by department") {
          viewBudgetByDepartment();
      };

      if (followUp === "Leave") {
          process.exit();
      };

  })
}

// Functions to generate table content

// View departments
const viewDepartments = () => {
  const sql = `SELECT * FROM departments`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log("500 error " + (err));
      return;
    }
    console.table(rows);
    return prompts();
  });
};

// Add a department
const addDepartment = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the new department?",
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter a new departments name.");
          return false;
        };
      }
    }
  ])
  .then(answer => {
    const sql = `INSERT INTO departments (name)
    VALUES
        (?)`;
    
  const params = answer.name;
  db.query(sql, params, (err) => {
    if (err) {
      throw err;
    }
    console.log("departments successfully added!");
    return viewDepartments();
  });
  });
};

// "Remove a Department",
const removeDepartment = () => {
  const sql = `SELECT * FROM departments`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const departments = rows.map(({name, id}) => ({name: name, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "departments",
        message: "Which departments would you like to remove?",
        choices: departments
      }
    ])
    .then(departmentsAnswer => {
      const departments = departmentsAnswer.departments
      const params = departments;
      const sql = `DELETE FROM departments
                    WHERE id = ?`
      db.query(sql, params, (err) => {
        if (err) {
          throw err;
        }
        console.log("departments deleted!");
        return viewDepartments();
      });
    });
  });
};


// "View all roles",
const viewRoles = () => {
  const sql = `SELECT roles.id, roles.title, roles.salary, departments.name AS department
              FROM roles
              LEFT JOIN departments ON roles.departments_id = departments.id`;
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
      console.table(rows);
      return prompts();
  });
};


// "Add a role",
const addRole = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title of this role?",
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter a title for the role.");
          return false;
        };
      }
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary for this role?",
      validate: salaryInput => {
        if (isNaN(salaryInput)) {
          console.log("Please enter a salary!");
          return false;
        } else {
          return true;
        };
      }
    }
  ])
  .then (answer => {
    const params = [answer.title, answer.salary];
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const departments = rows.map(({ name, id }) => ({ name: name, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "departments",
          message: "Select the departments that contains the role.",
          choices: departments
        }
      ])
      .then(departmentsAnswer => {
        const departments = departmentsAnswer.departments;
        params.push(departments);
        const sql = `INSERT INTO roles (title, salary, departments_id)
                      VALUES (?,?,?)`;
        
        db.query(sql, params, (err) => {
          if (err) {
            throw err;
          }
          console.log("Role has been added!");
          return viewRoles();
        });
      });
     });
  });
}

// "Remove a role",
const removeRole = () => {
  const sql = `SELECT id, title FROM roles`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const roles = rows.map(({title, id}) => ({name: title, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "role",
        message: "Which role would you like to remove?",
        choices: roles
      }
    ])
    .then(roleAnswer => {
      const roles = roleAnswer.role
      const params = roles;
      const sql = `DELETE FROM roles
                    WHERE id = ?`
      db.query(sql, params, (err) => {
        if (err) {
          throw err;
        }
        console.log("Role has been deleted!");
        return viewRoles();
      });
    });
  });
};

// "View all employees",
const viewEmployees = () => {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS title, roles.salary AS salary              
              FROM employees
              LEFT JOIN roles ON roles.id = employees.role_id`;
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
      // console.log("/n");
      console.table(rows);
      return prompts();
  });
};

// "Add an employee",
const addEmployee = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter a name");
          return false;
        };
      }
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter a name");
          return false;
        };
      }
    }
  ])
  .then (answer => {
    const params = [answer.firstName, answer.lastName];
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const roles = rows.map(({title, id}) => ({name: title, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "role",
          message: "What is the role of this employee?",
          choices: roles
        }
      ])
      .then(roleAnswer => {
        const role = roleAnswer.role;
        params.push(role);
        const sql = `SELECT * FROM employees`;
        db.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
          managers.push({name: "No manager", value: null});
          inquirer.prompt([
            {
              type: "list",
              name: "manager",
              message: "Who is this employee's manager?",
              choices: managers
            }
          ])
          .then(managerAnswer => {
            const manager = managerAnswer.manager;
            params.push(manager);
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
              VALUES (?, ?, ?, ?)`;
            db.query(sql, params, (err) => {
              if (err) {
                throw err;
              }
              console.log("Employee added!");
              return viewEmployees();
            });
          });
        });
      });
    });
  });
};

// "Remove an employee",
const removeEmployee = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`

  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const employees = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee would you like to remove?",
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const employee = employeeAnswer.employee
      const params = employee;
      const sql = `DELETE FROM employees WHERE id =?`

      db.query(sql, params, (err) => {
        if (err) {
          throw err;
        }
        console.log("The employee has been removed.");
        return viewEmployees();
      });
    });
  })
};

// "Edit an employee's role",
const editEmployeeRole = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee's role would you like to update?",
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const employee = employeeAnswer.employee;
      const params = [employee];
      const sql = `SELECT title, id FROM roles`;
      db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }
        const roles = rows.map(({title, id}) => ({name: title, value: id}));
        inquirer.prompt([
          {
            type: "list",
            name: "role",
            message: "What is the employee's new role?",
            choices: roles
          }
        ])
        .then(rolesAnswer => {
          const role = rolesAnswer.role;
          params.unshift(role);
          const sql = `UPDATE employees
                        SET role_id = ?
                        WHERE id = ?`
          db.query(sql, params, (err) => {
            if (err) {
              throw err;
            }
            console.log("Employee has been updated!");
            return viewEmployees();
          });
        });
      });
    });
  });
};


// "Edit an employee's manager",
const editEmployeeManager = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const employee = employeeAnswer.employee;
      const params = [employee];
      const sql = `SELECT first_name, last_name, id FROM employees`;

      db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }
        const managers = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id}));
        managers.push({ name: "No manager", value: null });
        inquirer.prompt([
          {
            type: "list",
            name: "manager",
            message: "Who is this employee's new manager?",
            choices: managers
          }
        ])
        .then(managerAnswer => {
          const manager = managerAnswer.manager;
          params.unshift(manager);
          const sql = `UPDATE employees
                        SET manager_id = ?
                        WHERE id = ?`
                    
          db.query(sql, params, (err) => {
            if (err) {
              throw err;
            }
            console.log("The employee has been updated.");
            return viewEmployees();
          });
        });
      });
    });
  });
};

// "View employees by department",
const viewEmployeesByDepartment = () => {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const departments = rows.map(({name, id}) => ({name: name, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which department's employees would you like to view?",
        choices: departments
      }
    ])
    .then(employeeAnswer => {
      const department = employeeAnswer.employee;
      const params = [department];
      const sql = `SELECT employees.id, first_name, last_name, departments.name AS department
                    FROM employees
                    LEFT JOIN roles ON employees.role_id = roles.id
                    LEFT JOIN departments ON roles.departments_id = departments.id
                    WHERE departments.id = ?`;
      db.query(sql, params, (err, rows) => {
        if (err) {
          throw err;
        }
        console.table(rows);
        return prompts();
      });
    });
  });
};

// "View employees by manager",
const viewEmployeesByManager = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`;
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const employees = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which manager's employees would you like to view?",
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const manager = employeeAnswer.employee;
      const params =[manager];
      const sql = `SELECT id, first_name, last_name FROM employees 
                    WHERE manager_id = ?`

      db.query(sql, params, (err, rows) => {
        if (err) {
          throw err;
        }
        if (rows.length === 0) {
          console.log("This employee is not a manager.");
          return prompts();
        }
        console.table(rows);
        return prompts();
      });
    });
  });
};

// "Leave"








// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    prompts();
  });
});
