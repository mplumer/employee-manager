const mysql = require('mysql2');
const inquirer = require("inquirer");
const Table = require('easy-table');
const cTable = require('console.table');


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // Your MySQL username
    user: 'root',
    // Your MySQL password
    password: 'module12',
    database: 'companyDB'
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    mainMenu();
});

function mainMenu() {
  return  inquirer.prompt([
        {
            type: "list",
            name: "main",           
            messsage: "What do you want to do?",
            choices: [
                "Display all departments",
                "Display all roles",
                "Display all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update employee role",
                "Delete an employee",
                "Exit \n"
            ]
        }
    ])
        .then(response => {
            console.log(response)
            switch (response.main) {
                case ('Display all departments'):
                    displayDepts();
                    break;
                case ('Display all roles'):
                    displayRoles();
                    break;
                case ('Display all employees'):
                    displayEmployees();
                    break;
                case ('Add a department'):
                    addDept();
                    break;
                case ('Add a role'):
                    addRole();
                    break;
                case ('Add an employee'):
                    addEmployee();
                    break;
                case ('Update an employee role'):
                    updateEmployeeRole();
                    break;
                case ('Delete an employee'):
                    deleteEmployee();
                    break;
                case ('Exit \n'):
                    connection.end();
            }
        })
};


function displayDepts() {
    var sql = 'SELECT department.id, department.name AS `Department` FROM department';
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

function displayRoles() {
    var sql = 'SELECT role.id, role.title AS `Job Title`, department.name AS `Department`, role.salary AS `Salary` FROM role INNER JOIN department ON department.id = role.department_id';
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

function displayEmployees() {
    var sql = 'SELECT employee.id, employee.first_name AS `First Name`, employee.last_name AS `Last Name`, role.title AS `Job Title`, department.name AS Department, role.salary AS Salary, IFNULL(CONCAT(manager.first_name," ", manager.last_name), "N/A ") AS `Manager` FROM employee LEFT JOIN employee manager ON manager.id = employee.manager_id INNER JOIN role ON employee.role_id=role.id INNER JOIN department ON department.id = role.department_id';
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};


function addDept() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department.',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Invalid Response! Please enter the department name.");
                    return false;
                }
            }
        }
    ])
        .then(response => {
            connection.query('INSERT INTO department SET ?',
                {
                    name: response.name
                },
                (err, res) => {
                    if (err) throw err;
                    console.log("Department added!")
                    mainMenu();
                });

        })
};

function addRole() {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;

        var deptArray = [];
        res.forEach(item => {
            var {
                id,
                name
            } = item;
            var item = {
                value: id,
                name
            };
            deptArray.push(item)
            var {
                value,
                name
            } = item;
            var item = {
                id: value,
                name
            };

        })
        inquirer.prompt([{
            type: 'input',
            name: 'role',
            message: 'Enter the role name.',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Invalid Response! Please enter a role name.");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary paid for this role.',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Invalid Response! Please enter the salary paid for this role.");
                    return false;
                }
            }
        }, {
            type: 'list',
            name: 'department',
            message: 'What department does this role belong to?',
            choices: deptArray
        }
        ])
            .then(response => {
                connection.query('INSERT INTO role SET ?', {
                    title: response.role,
                    salary: response.salary,
                    department_id: response.department
                },

                    (err, res) => {
                        if (err) throw err;
                        console.log("Role added: " + res.affectedRows)
                        mainMenu();
                    })
            })
    })
};


function addEmployee() {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;

        var roleArray = [];
        res.forEach(item => {
            var {
                id,
                title,
            } = item;
            var item = {
                value: id,
                name: title,
            };
            roleArray.push(item)
            var {
                value,
                name,
            } = item;
            var item = {
                id: value,
                title: name,
            };
        })
        connection.query('SELECT * FROM manager', (err, res) => {
            if (err) throw err;

            var managerArray = [];
            res.forEach(item => {
                var {
                    id,
                    first_name,
                } = item;
                var item = {
                    value: id,
                    name: first_name,
                };

                managerArray.push(item)
                var {
                    value,
                    name,
                } = item;
                var item = {
                    id: value,
                    first_name: name,
                };
            })
            inquirer.prompt([{
                type: 'input',
                name: 'firstName',
                message: "Enter the employee's first name.",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Invalid Response! Please enter the employee's first name.");
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: "Enter the employee's last name.",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Invalid Response! Please enter the employee's last name.");
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'role',
                message: "Enter the employee's role.",
                choices: roleArray
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is the employee's manager?",
                choices: managerArray
            }
            ])
                .then(response => {

                    connection.query('INSERT INTO employee SET ?', {
                        first_name: response.firstName,
                        last_name: response.lastName,
                        role_id: response.role,
                        manager_id: response.manager
                    },

                        (err, res) => {
                            if (err) throw err;
                            console.log("Employee added: " + res.affectedRows)

                            mainMenu();
                        })

                })
        });
    })
}


function updateEmployeeRole() {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;

        var roleArray = [];
        res.forEach(item => {
            var {
                id,
                title,
            } = item;
            var item = {
                value: id,
                name: title,
            };
            roleArray.push(item)
            var {
                value,
                name,
            } = item;
            var item = {
                id: value,
                title: name,
            };
        })
        connection.query('SELECT * FROM employee', (err, res) => {
            if (err) throw err;
            var table = new Table;
            res.forEach(employee => {
                table.cell('Employee ID', employee.id)
                table.cell('Name', employee.first_name + " " + employee.last_name)
                table.newRow()
            })
            console.log(table.toString())

            inquirer.prompt([{
                type: 'input',
                name: 'employeeId',
                message: 'Enter ID number of employee to update:'
            },
            {
                type: 'list',
                name: 'role',
                message: 'Choose new employee role.',
                choices: roleArray
            }
            ])
                .then(answers => {

                    connection.query('UPDATE employee SET role_id = ? WHERE id = ?',
                        [answers.role, answers.employeeId],

                        (err, res) => {
                            if (err) throw err;
                            console.log("Employee updated: " + res.affectedRows)
                            mainMenu();
                        }
                    )
                })
        })
    });
}


function deleteEmployee() {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        var t = new Table;
        res.forEach(employee => {
            t.cell('Employee ID', employee.id)
            t.cell('Name', employee.first_name + " " + employee.last_name)
            t.newRow()
        })
        console.log(table.toString())

        inquirer.prompt([{
            type: 'input',
            name: 'employeeId',
            message: 'Enter ID number of employee to delete:'
        },
        ])
            .then(response => {
                let id = response.deleteMe.split(":")[0];
                connection.query("DELETE FROM products WHERE ?", [{ id }], (err, res) => {
                    if (err) throw err;
                    console.log(res);
                    mainMenu();
                })
            })
    })
};


