const inquirer = require('inquirer');
const db = require('./db/connect');


async function employeeTracker() {
    const answers = await inquirer.prompt([
    {
        type: 'list',
        name: 'prompt',
        message: 'Choose an option',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update employee role'
        ],
    },
    ]);

    switch (answers.prompt) {
        case 'View all departments':
            viewAllDepartments();
            break;
        case 'View all roles':
            viewAllRoles();
            break;
        case 'View all employees':
            viewAllEmployees();
            break;
        case 'Add a department':
            addADepartment();
            break;
        case 'Add a role':
            addARole();
            break;
        case 'Add an employee':
            addAnEmployee();
            break;
        case 'Update an employee role':
            updateRole();
            break;
        case 'Log Out':
            db.end();
            console.log('Logged-Out');
            break;
        default:
            console.log('Invalid, Choose another option');
            employeeTracker();
        }
}

function viewAllDepartments() {
    db.query('SELECT * FROM department', (err, result) => {
        if (err) throw err;
        console.log('Viewing Departments');
        console.table(result);
        employeeTracker();
    });
}

function viewAllRoles() {
    db.query('SELECT * FROM role', (err, result) => {
        if (err) throw err;
        console.log('Viewing Roles');
        console.table(result);
        employeeTracker();
    });
}

function viewAllEmployees() {
    db.query('SELECT * FROM employee', (err, result) => {
        if (err) throw err;
        console.log('Viewing Employees');
        console.table(result);
        employeeTracker();
    });
}


    