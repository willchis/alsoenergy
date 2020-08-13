/*****************************************************************************************
* Part 2
****************************************************************************************/
var employees = [
    { first: "Amanda", last: "Byron", group: "Sales" },
    { first: "Ye", last: "Xia", group: "Receiving", nameOrder: "reverse" },
    { first: "Miltiades", last: "Crescens", group: "Sales" }
    /*...don't foget to account for other entries of the same form, but with different group names.....*/
];

// Part 2 Answer Here

const sortEmployees = (employees) => {
    let sorted = {};

    if (employees && employees.length) {
        employees.forEach(emp => {
            let employeeObj = createEmployeeWithName(emp);

            if (emp.group) {
                const groupKey = emp.group.toLowerCase();
                if (!(groupKey in sorted)) {
                    sorted[groupKey] = [];
                }
                sorted[groupKey].push(employeeObj);
            }
        });
    }
    return sorted;
}

const createEmployeeWithName = (employee) => {
    let name = '';
    let firstName = employee.first ?? '';
    let lastName = employee.last ?? '';
    if (employee.nameOrder && employee.nameOrder === 'reverse') {
        name = `${lastName} ${firstName}`;
    } else {
        name = `${firstName} ${lastName}`;
    }

    return { name: name.trim() };
}

/*****************************************************************************************
* Bonus
****************************************************************************************/

// Bonus Anwser Here

