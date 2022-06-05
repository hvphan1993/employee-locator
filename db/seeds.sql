USE employee_tracker;

INSERT INTO departments (name)
VALUES
("Sales"),
("Engineering"),
("Finance"),
("Legal"),
("Intern");

INSERT INTO roles (title, salary, departments_id)
VALUES
("Salesperson", 60000, 1),
("Sales Manager", 100000, 1),
("Engineering Manager", 150000, 2),
("Software Engineer", 100000, 2),
("Accounts Payroll", 50000, 3),
("CFO", 180000, 3),
("Legal Team Lead", 150000, 4),
("Lawyer", 120000, 4),
("Intern", 100, 5);

INSERT INTO employees (first_name, last_name, role_id)
VALUES 
("Joe", "Mahma", 4),
("Knightley", "Keira", 3),
("Mustai", "Workard", 1),
("Pami", "Moore", 9),
("Ewan", "McNobi", 2),
("Mike", "Wazowski", 4),
("Norman", "Oscorp", 6),
("Burton", "Guster", 8),
("Pablo", "Francisco", 5),
("Luka", "Magic", 1),
("Dobby", "Hous-Elf", 9);


