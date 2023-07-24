INSERT INTO department
(name)
VALUES
('Sales').
('CSM'),
('Operations'),
('Manager');

INSERT INTO role
(title, salary, department_id)
VALUES
('Ouside Sales', 60000, 1),
('Customer Service', 40000, 2),
('Operations Manager', 75000, 3),
('General Manager', 85000, 4);

INSERT INTO employee
(firstName, lastName, roleId, managerId)
VALUES
('Bill', 'Nye', 4, 5),
('Charles', 'Smith', 3, 4),
('Andrew', 'Gallant', 2, 3),
('Zeus', 'Xavier', 1, 3);
