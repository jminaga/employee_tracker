  USE employeesDB;

INSERT INTO department (name)
VALUES
("Upstream"),
("Downstream"),
("AFS"),
("MST");

INSERT INTO role (title, salary, department_id)
VALUES
("Scientist 1", 80, 1),
("Scientist 2", 90, 2),
("Senior Scientist", 100, 3),
("Engineer", 80, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Jared", "Minaga", 1, 1),
("Kevin", "Pigby", 3, 1),
("Magan","Motonaka", 1, 1),
("Geov", "Chonu", 1, 1),
("Tom", "Goodenough", 3, 1);

