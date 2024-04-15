// Define constants and parameters
let numBoids = 100;
let visualRange = 35;
let protectedRange = 8;
let centeringFactor = 0.0005;
let avoidFactor = 0.1;
let matchingFactor = 0.1;
let maxSpeed = 6;
let minSpeed = 3;
let turnFactor = 0.2;
let biasIncrement = 0.00004;
let defaultBiasVal = 0.001;
let maxBias = 0.1;
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

// Define canvas and context
const canvas = document.getElementById('canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const ctx = canvas.getContext('2d');

// Define Boid class
class Boid {
    constructor(x, y, vx, vy, biasVal) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.biasVal = biasVal;
        this.prevPositions = [];
    }

    update(boids) {
        let xposAvg = 0, yposAvg = 0, xvelAvg = 0, yvelAvg = 0, neighboringBoids = 0, closeDx = 0, closeDy = 0;

        for (const otherBoid of boids) {
            const dx = this.x - otherBoid.x;
            const dy = this.y - otherBoid.y;
            const squaredDistance = dx * dx + dy * dy;

            if (squaredDistance < visualRange ** 2) {
                if (squaredDistance < protectedRange ** 2) {
                    closeDx += this.x - otherBoid.x;
                    closeDy += this.y - otherBoid.y;
                } else {
                    xposAvg += otherBoid.x;
                    yposAvg += otherBoid.y;
                    xvelAvg += otherBoid.vx;
                    yvelAvg += otherBoid.vy;
                    neighboringBoids++;
                }
            }

            
        }

        if (neighboringBoids > 0) {
            xposAvg /= neighboringBoids;
            yposAvg /= neighboringBoids;
            xvelAvg /= neighboringBoids;
            yvelAvg /= neighboringBoids;

            this.vx += (xposAvg - this.x) * centeringFactor + (xvelAvg - this.vx) * matchingFactor;
            this.vy += (yposAvg - this.y) * centeringFactor + (yvelAvg - this.vy) * matchingFactor;
        }

        this.vx += closeDx * avoidFactor;
        this.vy += closeDy * avoidFactor;

        if (this.x < 100 || this.x > canvas.width-100) {
            this.vx = this.x < 100 ? this.vx + turnFactor : this.vx - turnFactor;
        }
        if (this.y < 100 || this.y > canvas.height-100) {
            this.vy = this.y < 100 ? this.vy + turnFactor : this.vy - turnFactor;
        }

        if (this.biasVal !== undefined) {
            if (this.vx > 0) {
                this.biasVal = Math.min(this.biasVal + biasIncrement, maxBias);
            } else {
                this.biasVal = Math.max(this.biasVal - biasIncrement, -maxBias);
            }
            this.vx = (1 - this.biasVal) * this.vx + this.biasVal * Math.sign(this.biasVal === 1 ? 1 : -1);
        }

        const speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
        if (speed < minSpeed || speed > maxSpeed) {
            this.vx = (this.vx / speed) * Math.min(Math.max(speed, minSpeed), maxSpeed);
            this.vy = (this.vy / speed) * Math.min(Math.max(speed, minSpeed), maxSpeed);
        }
        this.prevPositions.push({ x: this.x, y: this.y });
        let minVal = Math.ceil(1/numBoids * 2500);
        if (this.prevPositions.length > minVal) { 
            this.prevPositions.shift();
        }
        this.x += this.vx;
        this.y += this.vy;
    }
}

// Create an array to hold boids
const boids = [];

// Initialize boids
for (let i = 0; i < numBoids; i++) {
    // const x = Math.random() * canvas.width;
    // const y = Math.random() * canvas.height;
    const x = 0;
    const y = 0;
    const vx = Math.random() * 2 - 1;
    const vy = Math.random() * 2 - 1;
    const biasVal = (i < numBoids / 2) ? defaultBiasVal : -defaultBiasVal;
    boids.push(new Boid(x, y, vx, vy, biasVal));
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const boid of boids) {
        boid.update(boids);

        // ctx.strokeStyle = 'red';
        // // Draw boid in circle
        // ctx.beginPath();
        // ctx.moveTo(boid.x, boid.y);
        // ctx.lineTo(boid.x + boid.vx * 2, boid.y + boid.vy * 2);
        // ctx.stroke();
        
        // // Wrap around
        // if (boid.x < 0) boid.x = canvas.width;
        // if (boid.x > canvas.width) boid.x = 0;
        // if (boid.y < 0) boid.y = canvas.height;
        // if (boid.y > canvas.height) boid.y = 0;
        
        // // in red color
        // ctx.strokeStyle = 'white';

        // // Draw protected range
        // ctx.beginPath();
        // ctx.arc(boid.x, boid.y, protectedRange, 0, 2 * Math.PI);
        // ctx.stroke();

        // Draw boid as triangle
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(boid.x + boid.vx * 2, boid.y + boid.vy * 2);
        ctx.lineTo(boid.x + boid.vy * 2, boid.y - boid.vx * 2);
        ctx.lineTo(boid.x - boid.vy * 2, boid.y + boid.vx * 2);
        ctx.fill();

        

        // Draw previous positions
        for (let i = 0; i < boid.prevPositions.length; i++) {
            const pos = boid.prevPositions[i];
            ctx.globalAlpha = i / boid.prevPositions.length;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 2, 0, 2 * Math.PI);
            ctx.fill();

        }

    }

    requestAnimationFrame(animate);
}




const numBoidsElement = document.getElementById('numBoids');
const visualRangeElement = document.getElementById('visualRange');
const protectedRangeElement = document.getElementById('protectedRange');
const centeringFactorElement = document.getElementById('centeringFactor');
const avoidFactorElement = document.getElementById('avoidFactor');
const matchingFactorElement = document.getElementById('matchingFactor');
const maxSpeedElement = document.getElementById('maxSpeed');
const minSpeedElement = document.getElementById('minSpeed');
const turnFactorElement = document.getElementById('turnFactor');
const biasIncrementElement = document.getElementById('biasIncrement');
const defaultBiasValElement = document.getElementById('defaultBiasVal');
const maxBiasElement = document.getElementById('maxBias');


const changeButton = document.getElementById('change');
const resetButton = document.getElementById('reset');

// Change button event listener
changeButton.addEventListener('click', () => {
    // Update variables with new values from input fields
    numBoids = parseInt(numBoidsElement.value);
    visualRange = parseFloat(visualRangeElement.value);
    protectedRange = parseFloat(protectedRangeElement.value);
    centeringFactor = parseFloat(centeringFactorElement.value);
    avoidFactor = parseFloat(avoidFactorElement.value);
    matchingFactor = parseFloat(matchingFactorElement.value);
    maxSpeed = parseFloat(maxSpeedElement.value);
    minSpeed = parseFloat(minSpeedElement.value);
    turnFactor = parseFloat(turnFactorElement.value);
    biasIncrement = parseFloat(biasIncrementElement.value);
    defaultBiasVal = parseFloat(defaultBiasValElement.value);
    maxBias = parseFloat(maxBiasElement.value);

    // Remove all existing boids
    boids.length = 0;

    // Reinitialize boids with new parameters
    for (let i = 0; i < numBoids; i++) {
        const x = 0;
        const y = 0;
        const vx = Math.random() * 2 - 1;
        const vy = Math.random() * 2 - 1;
        const biasVal = (i < numBoids / 2) ? defaultBiasVal : -defaultBiasVal;
        boids.push(new Boid(x, y, vx, vy, biasVal));
    }
});

// Reset button event listener
resetButton.addEventListener('click', () => {
    // Reset input field values to defaults
    numBoidsElement.value = numBoids;
    visualRangeElement.value = visualRange;
    protectedRangeElement.value = protectedRange;
    centeringFactorElement.value = centeringFactor;
    avoidFactorElement.value = avoidFactor;
    matchingFactorElement.value = matchingFactor;
    maxSpeedElement.value = maxSpeed;
    minSpeedElement.value = minSpeed;
    turnFactorElement.value = turnFactor;
    biasIncrementElement.value = biasIncrement;
    defaultBiasValElement.value = defaultBiasVal;
    maxBiasElement.value = maxBias;

    // Clear existing boids
    boids.length = 0;

    // Reinitialize boids with default parameters
    for (let i = 0; i < numBoids; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;        
        const vx = Math.random() * 2 - 1;
        const vy = Math.random() * 2 - 1;
        const biasVal = (i < numBoids / 2) ? defaultBiasVal : -defaultBiasVal;
        boids.push(new Boid(x, y, vx, vy, biasVal));
    }
});


// on window resize, update canvas size
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
});

// on value change, show number in span
const spans = document.querySelectorAll('span');
const inputs = document.querySelectorAll('input');
inputs.forEach((inp, index) => {
    inp.addEventListener('change', () => {
        spans[index].innerText = inp.value;
    });
});




// Start animation
animate();