const mysql = require('mysql2');
const inquirer = require("inquirer");


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: 'HackDeez12!',
  database: 'companyDB'
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    createProduct();
  });

  function mainMenu() {
      inquirer.prompt([
          {
              name: "main",
              type: "list",
              messsage: "What do you want to do?",
              choices: ["List Employees", "Add Employee", "Delete Employee"]
          }
      ])
.then(response => {
    console.log(response)
    switch (response.main) {

    }
})
    
  }



function displayEmployees() {
    query
}

function addEmployee() {
    inquirer.prompt([

    ])

        .then(response => {
            connection.query(sql, function (err, res) {
                if (err) throw err;
                console.log(res);
                mainMenu
            })
            
        })
};

function deleteEmployee() {
    connection.query("SELECT * FROM products", (error, res) => {
        inquirer.prompt([
            {
                type: "list",
                name: 'deleteMe',
                message: "Which Employee would you like to delete?",
                choices: SpeechRecognitionResultList.map(employee => `${employee.id}:${employee.first_name}`)
            }
        ])
        .then(response => {
            let id = response.deleteMe.split(":")[0];
            connection.query("DELETE FROM products WHERE ?", [{id}], (err, res) => {
                if (err) throw err;
                console.log(res);
                mainMenu();
            })
        })
    })
};



function exit() {
    connection.end();
    console.log("goodbye");
}