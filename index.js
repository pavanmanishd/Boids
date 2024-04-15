const CANVAS_WIDTH = window.innerWidth; 
const CANVAS_HEIGHT = window.innerHeight;
const NUM_BOIDS = 100;
const BOID_RADIUS = 10;
const SEPARATION_DISTANCE = 100;
const ALIGNMENT_DISTANCE = 100;
const COHESION_DISTANCE = 100;
const MAX_SPEED = 4;
const FORCE_MULTIPLIER = 0.1;

// Boid class
class Boid {
  constructor() {
    this.position = {
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT
    };
    this.velocity = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1
    };
  }

  update(boids) {
    this.separate(boids);
    this.align(boids);
    this.cohere(boids);
    this.updatePosition();
  }

  separate(boids) {
    let separationForce = { x: 0, y: 0 };
    let numNeighbors = 0;

    for (let i = 0; i < boids.length; i++) {
      let distance = this.distance(boids[i]);
      if (distance > 0 && distance < SEPARATION_DISTANCE) {
        let diff = {
          x: this.position.x - boids[i].position.x,
          y: this.position.y - boids[i].position.y
        };
        let norm = this.normalize(diff);
        separationForce.x += norm.x;
        separationForce.y += norm.y;
        numNeighbors++;
      }
    }

    if (numNeighbors > 0) {
      separationForce.x /= numNeighbors;
      separationForce.y /= numNeighbors;
      separationForce = this.normalize(separationForce);
      separationForce.x *= FORCE_MULTIPLIER;
      separationForce.y *= FORCE_MULTIPLIER;
      this.velocity.x += separationForce.x;
      this.velocity.y += separationForce.y;
    }
  }

  align(boids) {
    let alignmentForce = { x: 0, y: 0 };
    let numNeighbors = 0;

    for (let i = 0; i < boids.length; i++) {
      let distance = this.distance(boids[i]);
      if (distance > 0 && distance < ALIGNMENT_DISTANCE) {
        alignmentForce.x += boids[i].velocity.x;
        alignmentForce.y += boids[i].velocity.y;
        numNeighbors++;
      }
    }

    if (numNeighbors > 0) {
      alignmentForce.x /= numNeighbors;
      alignmentForce.y /= numNeighbors;
      alignmentForce = this.normalize(alignmentForce);
      alignmentForce.x *= FORCE_MULTIPLIER;
      alignmentForce.y *= FORCE_MULTIPLIER;
      this.velocity.x += alignmentForce.x;
      this.velocity.y += alignmentForce.y;
    }
  }

  cohere(boids) {
    let cohesionForce = { x: 0, y: 0 };
    let numNeighbors = 0;

    for (let i = 0; i < boids.length; i++) {
      let distance = this.distance(boids[i]);
      if (distance > 0 && distance < COHESION_DISTANCE) {
        cohesionForce.x += boids[i].position.x;
        cohesionForce.y += boids[i].position.y;
        numNeighbors++;
      }
    }

    if (numNeighbors > 0) {
      cohesionForce.x /= numNeighbors;
      cohesionForce.y /= numNeighbors;
      cohesionForce.x -= this.position.x;
      cohesionForce.y -= this.position.y;
      cohesionForce = this.normalize(cohesionForce);
      cohesionForce.x *= FORCE_MULTIPLIER;
      cohesionForce.y *= FORCE_MULTIPLIER;
      this.velocity.x += cohesionForce.x;
      this.velocity.y += cohesionForce.y;
    }
  }

  updatePosition() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Wrap around the screen
    this.position.x = (this.position.x + CANVAS_WIDTH) % CANVAS_WIDTH;
    this.position.y = (this.position.y + CANVAS_HEIGHT) % CANVAS_HEIGHT;

    // Limit the maximum speed
    let speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > MAX_SPEED) {
      this.velocity.x = (this.velocity.x / speed) * MAX_SPEED;
      this.velocity.y = (this.velocity.y / speed) * MAX_SPEED;
    }
  }

  distance(other) {
    let dx = this.position.x - other.position.x;
    let dy = this.position.y - other.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  normalize(vector) {
    let length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (length === 0) {
      return { x: 0, y: 0 };
    } else {
      return { x: vector.x / length, y: vector.y / length };
    }
  }
}

// Main animation loop
function animate() {
  requestAnimationFrame(animate);

  // Clear the canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Update and draw the boids
  for (let i = 0; i < boids.length; i++) {
    boids[i].update(boids);
    
    // Draw the boid as a circle
    // ctx.beginPath();
    // ctx.arc(boids[i].position.x, boids[i].position.y, BOID_RADIUS, 0, 2 * Math.PI);
    // ctx.fillStyle = "white";
    // ctx.fill();
    // ctx.beginPath
    // ctx.moveTo(boids[i].position.x, boids[i].position.y);
    // ctx.lineTo(boids[i].position.x + boids[i].velocity.x * 10, boids[i].position.y + boids[i].velocity.y * 10);
    // ctx.strokeStyle = "red";
    // ctx.stroke();


    // Draw the boid as a triangle
    ctx.save();
    ctx.translate(boids[i].position.x, boids[i].position.y);
    ctx.rotate(Math.atan2(boids[i].velocity.y, boids[i].velocity.x) + Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, -BOID_RADIUS * 2);
    ctx.lineTo(-BOID_RADIUS, BOID_RADIUS * 2);
    ctx.lineTo(BOID_RADIUS, BOID_RADIUS * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.restore();
  }
}

// Set up the canvas and create the boids
const canvas = document.getElementById("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext("2d");
const boids = [];
for (let i = 0; i < NUM_BOIDS; i++) {
  boids.push(new Boid());
}
console.log("Canvas width:", canvas.width, "Canvas height:", canvas.height);

// Start the animation loop
animate();