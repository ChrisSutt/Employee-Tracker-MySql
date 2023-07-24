const inquirer = require('inquirer');
const db = require('./db/connect');


(async () => {
    try {
    // Getting a connections using db.getConnection()
    const conn = await db.getConnection();
    console.log('\x1b[36mEmployee Tracking Database!\x1b[0m');
    console.log('=============================');
     // starts the main application
    employeeTracker();
    } catch (err) {
    console.error('Error connecting to the database:', err);
    }
})
();

// Function prompting the user with options using inquirer
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
        'Update employee role',
        'Quit'
        ],
    },
]);
        // Perform actions based on the users selection
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
        case 'Update employee role':
        updateRole();
        break;
        case 'Quit':
        db.end();
        console.log('Logged-Out');
        break;
        default:
        console.log('Invalid, Choose another option');
        employeeTracker();
    }
}

// This function allows you to view all departments
async function viewAllDepartments() {
    try {
        const [departments] = await db.query('SELECT * FROM department');
        console.log('Viewing Departments');
        console.table(departments);
        employeeTracker();
        } catch (err) {
        console.error(err);
        employeeTracker();
    }
}


// This function allows your to view all roles
async function viewAllRoles() {
    try {
        const [roles] = await db.query('SELECT * FROM role');
        console.log('Viewing Roles');
        console.table(roles);
        employeeTracker();
        } catch (err) {
        console.error(err);
        employeeTracker();
    }
}

// This function allows your to view all employees
async function viewAllEmployees() {
    try {
        const [employees] = await db.query('SELECT * FROM employee');
        console.log('Viewing Employees');
        console.table(employees);
        employeeTracker();
        } catch (err) {
        console.error(err);
        employeeTracker();
    }
}

// Function allows you to add a new Department to the database
async function addADepartment() {
    try {
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

    await db.query('INSERT INTO department (name) VALUES (?)', [answer.department]);
    console.log(`Added ${answer.department} to the database.`);
    employeeTracker();
    } catch (err) {
    console.error(err);
    employeeTracker();
    }
}

// Function to select a department from the available departments
async function selectDepartment(departments) {
    while (true) {
        const departmentAnswers = await inquirer.prompt([
        {
        type: 'list',
        name: 'department',
        message: 'Roles Department',
        choices: departments.map((department) => department.name),
        },
        ]);

        const departmentSelection = departments.find((department) => department.name === departmentAnswers.department);

    if (departmentSelection) {
    return departmentSelection; 
    } else {
    console.log('Invalid department selection. Please try again.');
    }
    }
}

// Function to add a new role
async function addARole() {
    try {
        const [departments] = await db.query('SELECT * FROM department');


        if (!Array.isArray(departments) || departments.length === 0) {
        console.log('No departments found. Please add a department first.');
        employeeTracker();
        return;
        }

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
]);

const departmentSelection = await selectDepartment(departments);

    await db.query(
    'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
    [answers.role, answers.salary, departmentSelection.id]
    );
    console.log(`Added ${answers.role} to the database.`);
    employeeTracker();
    } catch (err) {
    console.error(err);
    employeeTracker();
    }
}

// Function to add a new employee
async function addAnEmployee() {
try {
    const [employeeRoles] = await db.query('SELECT * FROM employee, role');

    if (!Array.isArray(employeeRoles) || employeeRoles.length === 0) {
    console.log('No employee roles found. Please add a role first.');
    employeeTracker();
    return;
    }

    const answers = await inquirer.prompt([
    {
        type: 'input',
        name: 'first_name',
        message: "Employee's first name",
        validate: (firstNameInput) => {
        return firstNameInput ? true : 'Add a first name';
     },
    },
        {
        type: 'input',
        name: 'last_name',
        message: "Employee's last name",
        validate: (lastNameInput) => {
        return lastNameInput ? true : 'Add a last name';
     },
    },
{
        type: 'list',
        name: 'role',
        message: "Employee's role",
        choices: [...new Set(employeeRoles.map((role) => role.title))],
     },
        {
        type: 'input',
        name: 'manager',
        message: "Employee's manager",
        validate: (managerInput) => {
        return managerInput ? true : 'Add a manager';
     },
    },
]);

    const selectedRole = employeeRoles.find((role) => role.title === answers.role);

    await db.query(
    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
    [answers.first_name, answers.last_name, selectedRole.id, answers.manager]
    );
    console.log(`Added ${answers.first_name} ${answers.last_name} to the database.`);
    employeeTracker();
    } catch (err) {
    console.error(err);
    employeeTracker();
    }
}


// function to update a users role
async function updateRole() {
try {
const [employees] = await db.query('SELECT * FROM employee');
const [roles] = await db.query('SELECT * FROM role');

    const employeeChoices = employees.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
    }));

    const roleChoices = roles.map((role) => ({
    name: role.title,
    value: role.id,
}));

const answers = await inquirer.prompt([
        {
        type: 'list',
        name: 'employeeId',
        message: "Which employee's role do you want to update?",
        choices: employeeChoices,
    },
        {
        type: 'list',
        name: 'roleId',
        message: 'Select new role',
        choices: roleChoices,
     },
]);

    await db.query(
    'UPDATE employee SET ? WHERE ?',
    [{ role_id: answers.roleId }, { id: answers.employeeId }]
    );

    console.log('Updated employee role.');
    employeeTracker();
    } catch (err) {
    console.error(err);
    employeeTracker();
    }
}




