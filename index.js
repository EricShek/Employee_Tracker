const inquirer = require("inquirer");
const db = require("./config/connection");

require("console.table");

db.connect(() => {
  menu();
});
/*
view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

*/
const menuQuestion = [
  {
    type: "list",
    name: "menu",
    message: "choose the following option:",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee role",
    ],
  },
];

function menu() {
  inquirer.prompt(menuQuestion).then((res) => {
    switch (res.menu) {
      case "view all departments":
        viewDepartments();
        break;

      case "view all roles":
        viewRoles();
        break;

      case "view all employees":
        viewEmployees();
        break;

      case "add a role":
        addRole();
        break;

      case "add an employee":
        addEmployees();
        break;

      case "add a department":
        addDepartment();
        break;

      case "update an employee role":
        updateEmployee();
        break;
    }
  });
}

function viewDepartments() {
  db.query(`SELECT * FROM department`, function (err, res) {
    if (err) throw err;
    console.table(res);
    menu();
  });
}

function viewRoles() {
  db.query(`SELECT * FROM role`, function (err, res) {
    if (err) throw err;
    console.table(res);
    menu();

    // (err, response) =>{
    //     console.table(data)
    //     menu()
  });
}

function addRole() {
  const roleAddQuestions = [
    {
      type: "input",
      name: "title",
      message: " What is the name of the new role?",
    },
    {
      type: "input",
      name: "department",
      message: "what department ID does this role being assign to?",
    },
    {
      type: "input",
      name: "salary",
      message: "Salary amount for this role?",
    },
  ];
  inquirer.prompt(roleAddQuestions).then((res) => {
    const insertRole = "INSERT INTO role SET ?";
    db.query(insertRole, {
      title: res.title,
      salary: res.salary,
      department_id: res.department,
    });
    menu();
  });
}

function addDepartment() {
  const insertDeartment = [
    {
      type: "input",
      name: "name",
      message: "What is the department you want to add?",
    },
  ];
  inquirer.prompt(insertDeartment).then((res) => {
    const newDepartment = "INSERT INTO department SET ?";
    db.query(newDepartment, {
      name: res.name,
    });
    menu();
  });

}

function updateEmployee() {
  // get employees from employee table 
  const employeeSql = `SELECT * FROM employee`;

  db.query(employeeSql, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;
        const params = []; 
        params.push(employee);

        const roleSql = `SELECT * FROM role`;

        db.query(roleSql, (err, data) => {
          if (err) throw err; 

          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
          // params = [mike chan] + what ever role he is going into
            inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's new role?",
                choices: roles
              }
            ])
                .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role); 
                //  params = [account manager, mike chan]
                let employee = params[0]
                params[0] = role
                params[1] = employee 
              

                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                db.query(sql, params, (err, result) => {
                  if (err) throw err;
                console.log("Employee has been updated!");
              
                menu();
          });
        });
      });
    });
  });
};


function addEmployees() {
  db.query("select title as name, id as value from role", (err, roleData) => {
    db.query(
      `select CONCAT(first_name, " " , last_name) as name,  id as value from employee where  manager_id is null `,
      (err, managerData) => {
        const employeeAddQuestions = [
          {
            type: "input",
            name: "first_name",
            message: "What is your first name?",
          },
          {
            type: "input",
            name: "last_name",
            message: "What is your last name?",
          },
          {
            type: "list",
            name: "role_id",
            message: "Choose the following role title",
            choices: roleData,
          },
          {
            type: "list",
            name: "manager_id",
            message: "Choose the following manager",
            choices: managerData,
          },
        ];
        inquirer.prompt(employeeAddQuestions).then((response) => {
          const parameters = [
            response.first_name,
            response.last_name,
            response.role_id,
            response.manager_id,
          ];
          db.query(
            "INSERT INTO employee (first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)",
            parameters,
            (err, data) => {
              viewEmployees();
            }
          );
        });
      }
    );
  });
}
function viewEmployees() {
  db.query(
    `
SELECT 
employee.id,
employee.first_name,
employee.last_name,
role.title,
department.name as department,
role.salary,
CONCAT(mgr.first_name, " " , mgr.last_name) as manager
FROM employee
LEFT JOIN role ON role.id= employee.role_id
LEFT JOIN department ON role.department_id=department.id
LEFT JOIN employee as mgr ON employee.manager_id =  mgr.id

`,
    (err, data) => {
      //   console.log(data)
      console.table(data);

      menu();
    }
  );
}


// function updateEmployeeRole(){
//     inquirer.prompt([
//         {
//             type: "input",
//             name: "id",
//             message: "Type in employee id to update"
//         },
//         {
//             type: "imput",
//             name: "role",
//             message: "Employee's new role?"
//         },
//         {
//             type: "input",
//             name: "department",
//             message: "Employee's new department?"
//         },
//         {
//             type: "input",
//             name: "salary",
//             message: "Employee's new salary?"
//         },
//         {
//             type: "input",
//             name: "manager",
//             message: "Employee's new manager?"
//         }.then((res)=>{

//                 })
//     ])

// }

