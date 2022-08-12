SELECT department_id   AS id,
       department.name AS department,
       SUM(salary)     AS budget
FROM role
JOIN department ON role.department_id = department.id
GROUP BY department_id;