// Create an array to store circles
let circles = [];
// maximum radius for circles
const maxRadius = 40;
// radius for the large central circles
const bigCircleRadius = 80;
//use framecount to control time
let frameCount = 0;
// track if small circles animation has started
let smallCirclesAnimated = false;
//  track whether to scale up or down
let scaleUp = true;
// Interval for toggling the scale direction
let scaleInterval;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  // Create the initial set of circles
  makeCircles();

  // Toggle the scale direction every 3 seconds
  scaleInterval = setInterval(function () {
    scaleUp = !scaleUp;
  }, 3000);
}

function makeCircles() {
  // Clear the circles array
  circles = [];
  // Calculate the number of columns and rows for the central circles
  let cols = floor(width / (bigCircleRadius * 2 + 5));
  let rows = floor(height / (bigCircleRadius * 2 + 5));
  // Create a grid of circles with variations
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Position for each circle
      let x = (bigCircleRadius + 2.5) + col * (bigCircleRadius * 2 + 5);
      let y = (bigCircleRadius + 2.5) + row * (bigCircleRadius * 2 + 5);
      // Generate a random hue for the central circle
      let hue = random(360);
      circles.push(new BigCircle(x, y, bigCircleRadius, color(hue, 5, 90)));
      // Create three small circles around the central one
      for (let j = 0; j < 3; j++) {
        let hueSmall = random(360);
        let shade = color(hueSmall, 80, 70, 0.7);
        let radius = maxRadius * (1.0) * (1 - j * 0.2) * 0.9;
        circles.push(new SmallCircle(x, y, radius, shade));
      }
      // Generate a hue for the central point of the cluster
      let hueCenter = random(360);
      circles.push(new CircleCenter(x, y, maxRadius * 0.2, color(hueCenter, 100, 50, 0.7)));
    }
  }

  // Set a timer to animate the small circles after a delay 
  setTimeout(function () {
    smallCirclesAnimated = true;
  }, 3000);
}

function windowResized() {
  // Resize the canvas to fit the window
  resizeCanvas(windowWidth, windowHeight);
  makeCircles();
}

function draw() {
  background(44, 61, 100);


  // Draw the circles
  for (let circle of circles) {
    if (circle instanceof BigCircle) {
      // Update the rotation of the central circles
      circle.update();
      // Update the scale of the central circles
      circle.updateScale(scaleUp);
    }
    circle.show();
  }
  // Increment the frame counter
  frameCount++;
  // If small circle animation is enabled, rotate start
  if (smallCirclesAnimated) {
    animateSmallCircles();
  }
}


function animateSmallCircles() {
  // Rotate the small circles
  for (let circleObject of circles) {
    if (circleObject instanceof SmallCircle) {
      circleObject.rotate();
    }
  }
}





// Define the class for large central circles
class BigCircle {
  constructor(x, y, radius, base) {
    this.pos = createVector(x, y);
    this.base = base;
    this.rotate = 0;
    this.radius = radius;
  }
  // Update the rotation of the central circles
  update() {
    // Adjust the rotation speed for the BigCircle
    this.rotate += 1;
  }
  // Display the central circle
  show() {
    // Push and pop matrix for translation and rotation
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotate);
    fill(this.base);
    stroke(color(hue(this.base), random(0, 360), brightness(this.base) - 60));
    strokeWeight(1.5);
    ellipse(0, 0, this.radius * 2);
    let numLines = 50;
    let innerRadius = maxRadius * 0.9;
    stroke(34, random(300, 360), 300);

    for (let i = 0; i < numLines; i++) {
      let angle = TWO_PI / numLines * i;
      let innerX = cos(angle) * innerRadius;
      let outerX = cos(angle) * this.radius;
      let innerY = sin(angle) * innerRadius;
      let outerY = sin(angle) * this.radius;
      line(innerX, innerY, outerX, outerY);
    }
    pop();
  }
  // Update the scale of the central circle
  updateScale(scaleUp) {
    if (scaleUp) {
      this.radius += 0.5; // Scale up
      if (this.radius >= bigCircleRadius * 1.2) {
        console.log("SWAP TO NEGATIVE");
        console.log(bigCircleRadius);
        scaleUp = false;
      }
    } else {
      this.radius -= 1; // Scale down
      if (this.radius <= bigCircleRadius / 1.2) {
        console.log(this.radius)
        console.log("SWAP TO POSITIVE");
        console.log(bigCircleRadius);
        scaleUp = true;

      }
    }
    console.log(scaleUp);
  }
}

// Define the class for small circles
class SmallCircle {
  constructor(x, y, radius, base) {
    this.pos = createVector(x, y);
    this.base = base;
    this.radius = radius;
    this.rotation = 0; // Corrected the variable name
  }
  // Rotate the small circles
  rotate() { // Corrected the method name
    this.rotation += 1; // Adjust the rotation speed for the SmallCircle
  }
  // Display the small circle
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation); // Use the corrected variable name
    fill(this.base);
    stroke(random(0, 355), 355, random(300, 355));
    strokeWeight(0.5);
    ellipse(0, 0, this.radius * 2);
    let innerRadius = this.radius * 0.5;
    ellipse(0, 0, innerRadius * 3);

    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 24; i++) {
        let angle = TWO_PI / 24 * i + j * PI / 12;
        let xOffset = cos(angle) * this.radius * 0.7;
        let yOffset = sin(angle) * this.radius * 0.7;
        ellipse(xOffset, yOffset, this.radius * 0.15);
      }
    }

    for (let i = 0; i < 7; i++) {
      let angle = TWO_PI / 7 * i;
      let xOffset = cos(angle) * (this.radius * 2.3);
      let yOffset = sin(angle) * (this.radius * 2.3);
      ellipse(xOffset, yOffset, this.radius * 0.2);
    }

    pop();
  }
}



// Define the class for the central point of the circle cluster
class CircleCenter {
  constructor(x, y, radius, base) {
    this.pos = createVector(x, y);
    this.base = base;
    this.radius = radius;
  }
  // Display the central point of the cluster
  show() {
    fill(this.base);
    stroke(255);
    strokeWeight(0.5);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}