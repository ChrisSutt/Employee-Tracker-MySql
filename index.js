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


async function addADepartment() {
    const answer = await inquirer.prompt([
    {
        type: 'input',
        name: 'department',
        message: 'Input the name of the department',
        validate: (departmentInput) => {
        return departmentInput ? true : 'Add Department';
        },
    },
]);
  
    db.query('INSERT INTO department (name) VALUES (?)', [answer.department], (err, result) => {
      if (err) throw err;
      console.log(`Added ${answer.department} to the database.`);
      employeeTracker();
    });
  }


async function addARole() {
    const departments = await db.query('SELECT * FROM department');
  
    const answers = await inquirer.prompt([
    {
        type: 'input',
        name: 'role',
        message: 'Role Name',
        validate: (roleInput) => {
        return roleInput ? true : 'Add Role';
        },
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Role Salary',
        validate: (salaryInput) => {
        return salaryInput ? true : 'Please Add A Salary!';
        },
    },
    {
        type: 'list',
        name: 'department',
        message: 'Roles Department',
        choices: departments.map((department) => department.name),
    },
]);
  
    const selectedDepartment = departments.find((department) => department.name === answers.department);
  
    db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
      [answers.role, answers.salary, selectedDepartment.id],
      (err, result) => {
      if (err) throw err;
      console.log(`Added ${answers.role} to the database.`);
      employeeTracker();
      }
    );
  }

async function addAnEmployee() {
    const rolesAndEmployees = await db.query('SELECT * FROM employee, role');
  
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Employee\'s first name',
        validate: (firstNameInput) => {
          return firstNameInput ? true : 'Add a first name';
        },
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Employee\'s last name',
        validate: (lastNameInput) => {
          return lastNameInput ? true : 'Add a last name';
        },
      },
      {
        type: 'list',
        name: 'role',
        message: 'Employee\'s role',
        choices: [...new Set(rolesAndEmployees.map((role) => role.title))],
      },
      {
        type: 'input',
        name: 'manager',
        message: 'Employee\'s manager',
        validate: (managerInput) => {
          return managerInput ? true : 'Add a manger';
        },
      },
    ]);
  
    const selectedRole = rolesAndEmployees.find((role) => role.title === answers.role);
  
    db.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
      [answers.firstName, answers.lastName, selectedRole.id, answers.manager],
      (err, result) => {
      if (err) throw err;
      console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`);
      employeeTracker();
      }
    );
  }


  