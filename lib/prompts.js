
const inquirer = require("inquirer");

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
                "View utilized budget by department",
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

module.exports = prompts;