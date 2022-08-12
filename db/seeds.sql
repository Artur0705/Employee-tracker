INSERT INTO department (name)
VALUES 
('IT'),
('Finance & Accounting'),
('Sales & Marketing'),
('Human Resource'),
('Purchase'),
('Operations');


INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 30000, 1),
('Software Engineer', 90000, 1),
('Accountant', 400000, 2),
('Finanical Analyst', 10000, 2),
('Marketing Coordindator', 15000, 3),
('Sales Lead', 70000, 3),
('Project Manager', 360000, 4),
('Operations Manager', 72000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Anthony', 'Simpson', 2, null),
('Belinda', 'Jay', 1, 1),
('Alfred', 'Thompson', 4, null),
('Jessica', 'Muller', 3, 3),
('Frank', 'Oliver', 6, null),
('Andy', 'Smith', 5, 5),
('John', 'Birbilis', 7, null),
('Dennis', 'Carroll', 8, 7);
