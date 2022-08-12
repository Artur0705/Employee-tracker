SELECT role.id, role.title, department.name AS department
FROM role
INNER JOIN department ON role.department_id = department.id;