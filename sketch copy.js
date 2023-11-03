// Initialize an array to store circle objects and declare a variable for dim.
let circles = [];
let dim;

function setup() {
  // Create a canvas that fits the window's dimensions.
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  // Determine the value of dim based on the window dimensions.
  if (width > height) {
    dim = height / 12;
  } else {
    dim = height / 10;
  }

  // Call the makeCircles function to create circles.
  makeCircles();
}

function makeCircles() {
  circles = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      let x = 3 * dim * (0.5 + col);
      let y = 3 * dim * (0.5 + row);

      // Generate a random hue value between 0 and 360 for HSB color mode.
      let hue = random(360);

      // Create circles with varying brightness and the random hue.
      for (let j = 0; j < 6; j++) {
        let brightness = map(j, 0, 5, 100, 60); // Adjust as necessary
        let shade = color(hue, 100, brightness, 0.7); // Using 70% alpha, adjust if necessary

        let radius = dim * (1.0) * (1 - j * 0.2) * 0.9;
        circles.push(new Circle(x, y, radius, shade));
      }

      // Add an additional circle with a slightly smaller radius.
      circles.push(new Circle(x, y, dim * 0.2, color(hue, 100, 50, 0.7)));
    }
  }
}

function draw() {
  // Set the background color to black.
  background(221, 50, 48);

  // Display all the circles stored in the circles array.
  for (let circle of circles) {
    circle.show();
  }
}

// Define a class for Circle objects.
class Circle {
  constructor(x, y, radius, base) {
    // Store the position, base color, and radius of the circle.
    this.pos = createVector(x, y);
    this.base = base;
    this.radius = radius;
  }

  // Display the circle on the canvas.
  show() {
    fill(this.base);
    stroke(255);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);

    // Drawing an additional circle at the center.
    let innerRadius = this.radius * 0.5; // Making the inner circle's radius half of the main circle's.
    ellipse(this.pos.x, this.pos.y, innerRadius * 2);

    // Draw small circles around the main circle's center with a twist in each layer.
    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 24; i++) {
        let angle = TWO_PI / 24 * i + j * PI / 12; // Add a twist based on the layer (j)
        let xOffset = cos(angle) * this.radius * 0.7; // Adjust the radius multiplier as needed
        let yOffset = sin(angle) * this.radius * 0.7; // Adjust the radius multiplier as needed
        ellipse(this.pos.x + xOffset, this.pos.y + yOffset, this.radius * 0.15); // Adjust the radius of the small circles as needed
      }
    }

    // Draw circles on the outside of the biggest circle without overlap.
    for (let i = 0; i < 12; i++) {
      let angle = TWO_PI / 12 * i;
      let xOffset = cos(angle) * (this.radius * 1.5);
      let yOffset = sin(angle) * (this.radius * 1.5);

      let isOverlapping = false;
      for (let existingCircle of circles) {
        let d = dist(this.pos.x + xOffset, this.pos.y + yOffset, existingCircle.pos.x, existingCircle.pos.y);
        if (d < (this.radius * 0.2 + existingCircle.radius * 0.2)) {
          isOverlapping = true;
          break; // If it overlaps with any existing circle, exit the loop.
        }
      }

      if (!isOverlapping) {
        ellipse(this.pos.x + xOffset, this.pos.y + yOffset, this.radius * 0.2);
      }
    }
  }


}

