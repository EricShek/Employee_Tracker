USE employee_db;

INSERT INTO department(name)
VALUES ("Sales"),
       ("Finance"),
       ("Legal"),
       ("Engineering");

INSERT INTO role(title, salary, department_id)
VALUES ("Sales Lead", 100000,1),
       ("Salesperson", 100000,1),
       ("Lead Engineer", 150000,4),
       ("Software Engineer", 120000,4),
       ("Account Manager", 160000,2),
       ("Accountant", 125000,2),
       ("Leagl Team Lead", 250000,3),
       ("Lawyer", 190000,3);

INSERT INTO employee(first_name, last_name, role_id )
VALUES ("John", "Doe", 1),
       ("Mike","Chan", 2),
       ("Ashley","Rodriguez", 3),
       ("Kevin","Tupik", 4),
       ("Kunal","Singh", 5),
       ("Malia","Brown", 6),
       ("Sarah","Lourd", 7),
       ("Tom","Allen", 8);


UPDATE employee SET manager_id=1 WHERE id=2;
UPDATE employee SET manager_id=3 WHERE id=4;
UPDATE employee SET manager_id=5 WHERE id=6;
UPDATE employee SET manager_id=7 WHERE id=8;

         