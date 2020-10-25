INSERT INTO department
(name)
VALUES
('Sales'),
('Marketing'),
('IT'),
('Finance');

INSERT INTO role
(title, salary, department_id)
VALUES
('Sales Lead', 80000, 1),
('Salesperson', 60000, 1),
('Marketing Advisor', 750000, 2),
('Social Media', 60000, 2),
('Head Engineer', 130000, 3),
('Support Engineer', 100000, 3),
('Financial Advisor', 145000, 4),
('Accountant', 80000, 4);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES
('Peyton', 'Manning', 1, null),
('Marvin', 'Harrison', 2, null),
('Reggie', 'Wayne', 3, null),
('Dwight', 'Freeney', 4, null);

INSERT INTO manager
(first_name, last_name, role_id, department_id)
VALUES
('Peyton', 'Manning', 1, 1),
('Marvin', 'Harrison', 2, 2),
('Reggie', 'Wayne', 3, 3),
('Dwight', 'Freeney', 4, 4);