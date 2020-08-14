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

var canvas = document.getElementById('canvas');

class Rabbit {
    static widthToHeightRatio = 1.3;
    children = [];

    constructor(x, y, size, color, parent) {
        this.x = x;
        this.y = y;
        this.height = size;
        this.width = size * Rabbit.widthToHeightRatio;
        this.color = color;
        this.parent = parent;
    }
    draw(canvasCtx) {
        canvasCtx.fillStyle = this.color;
        canvasCtx.fillRect(this.x, this.y, this.width, this.height);
        canvasCtx.strokeRect(this.x, this.y, this.width, this.height);
    }
    isWithinBounds(x, y) {
        if (x >= this.x && x <= this.x + this.width) {
            if (y >= this.y && y <= this.y + this.height) {
                return true;
            }
        }
        return false;
    }
    highlight(canvasCtx) {
        this.draw(canvasCtx);
        const strokeStyle = canvasCtx.strokeStyle;
        canvasCtx.strokeStyle = '#fff'; 
        canvasCtx.strokeRect(this.x, this.y, this.width, this.height);
        canvasCtx.strokeStyle = strokeStyle;
    }
    fill(canvasCtx, color) {
        canvasCtx.fillStyle = color;
        canvasCtx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

if (canvas) {
    let rabbits = [];
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    let firstGenerationCount = 3;
    const firstGenerationSize = 30;
    const generateButton = document.getElementById('generate');
    let youngestGeneration = [];

    ctx.lineWidth = 10;
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    generateButton.onclick = () => {
        generateRabbits();
    }

    canvas.onclick = (e) => {
        updateColors(e, rabbits);
    }

    const updateColors = (e, rabbitArray) => {
        rabbitArray.forEach(rabbit => {
            if (rabbit.isWithinBounds(e.clientX, e.clientY)) {
                rabbit.highlight(ctx);
                rabbit.parent && rabbit.parent.fill(ctx, 'blue');
            } else {
                if (rabbit.parent && rabbit.parent.isWithinBounds(e.clientX, e.clientY)) {
                    rabbit.fill(ctx, 'yellow');
                } else {
                    rabbit.draw(ctx); // redraw to clear highlights
                }
            }
            updateColors(e, rabbit.children); // recursively update all rabbits
        });
    }

    const isCollisionWithExisting = (x, y, existingRabbits, newRabbitHeight) => {
        let hasCollision = false;
        const newRabbitWidth = newRabbitHeight * Rabbit.widthToHeightRatio;
        for (let rabbit of existingRabbits) {
            if (x + newRabbitWidth + 1 < rabbit.x ||
                x > rabbit.x + rabbit.width + 1||
                y > rabbit.y + rabbit.height + 1 ||
                y + newRabbitHeight + 1 < rabbit.y) {
                hasCollision = hasCollision || isCollisionWithExisting(x, y, rabbit.children, newRabbitHeight); // resursively check child rabbits
            } else {
                return true;
            }
        }
        return hasCollision;
    }

    for (let i = 0; i < firstGenerationCount; i++) {
        const randomX = randomIntFromInterval(0, width - firstGenerationSize);
        const randomY = randomIntFromInterval(0, height - firstGenerationSize);
        if (isCollisionWithExisting(randomX, randomY, youngestGeneration, firstGenerationSize)) {
            firstGenerationCount++;
        } else {
            const rabbit = new Rabbit(randomX, randomY, firstGenerationSize, '#000', null);
            rabbit.draw(ctx);
            rabbits.push(rabbit);
            youngestGeneration.push(rabbit);
        }
    }

    const generateRabbits = () => {
        let tempLatestGeneration = [];
        youngestGeneration.forEach(parent => {
            const randomChildCount = randomIntFromInterval(0, 5);
            const childSize = parent.height * 2 / 3;

            for (var i = 0; i < randomChildCount; i++) {
                let newCoords = generateOffspringCoordinates(parent.x, parent.y);
                while (isCollisionWithExisting(newCoords.x, newCoords.y, rabbits, childSize)) {
                    newCoords = generateOffspringCoordinates(parent.x, parent.y);
                }
                const rabbit = new Rabbit(newCoords.x, newCoords.y, childSize, '#000', parent);
                parent.children.push(rabbit);
                tempLatestGeneration.push(rabbit);
                rabbit.draw(ctx);
            }
        });
        youngestGeneration = tempLatestGeneration;
    };

    const generateOffspringCoordinates = (parentX, parentY) => {
        // Slightly naive way to bias the positions based on the parents. 
        // A different weighting function could be better.
        let changeX = randomIntFromInterval(-parentX, width - parentX) / 2;
        let changeY = randomIntFromInterval(-parentY, height - parentY) / 2;

        return {
            x: parentX + changeX,
            y: parentY + changeY
        };
    }
}
