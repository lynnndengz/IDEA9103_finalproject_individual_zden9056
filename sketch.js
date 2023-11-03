let circles = [];
const maxRadius = 40;
const bigCircleRadius = 80;
let frameCount = 0;
let smallCirclesAnimated = false; // Flag to track if small circles animation has started

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  makeCircles();
}

function makeCircles() {
  circles = [];
  let cols = floor(width / (bigCircleRadius * 2 + 5));
  let rows = floor(height / (bigCircleRadius * 2 + 5));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = (bigCircleRadius + 2.5) + col * (bigCircleRadius * 2 + 5);
      let y = (bigCircleRadius + 2.5) + row * (bigCircleRadius * 2 + 5);
      let hue = random(360);
      circles.push(new BigCircle(x, y, bigCircleRadius, color(hue, 5, 90)));

      for (let j = 0; j < 6; j++) {
        let hueSmall = random(360);
        let shade = color(hueSmall, 80, 70, 0.7);
        let radius = maxRadius * (1.0) * (1 - j * 0.2) * 0.9;
        circles.push(new SmallCircle(x, y, radius, shade));
      }

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
  resizeCanvas(windowWidth, windowHeight);
  makeCircles();
}

function draw() {
  background(44, 61, 100);


  // Draw the circles
  for (let circle of circles) {
    if (circle instanceof BigCircle) {
      circle.update();
    }
    circle.show();
  }

  frameCount++;

  if (smallCirclesAnimated) {
    animateSmallCircles();
  }
}


function animateSmallCircles() {
  for (let circleObject of circles) {
    if (circleObject instanceof SmallCircle) {
      circleObject.rotate();
    }
  }
}





class BigCircle {
  constructor(x, y, radius, base) {
    this.pos = createVector(x, y);
    this.base = base;
    this.rotate = 0;
    this.radius = radius;
  }

  update() {
    this.rotate += 2; // Adjust the rotation speed for the BigCircle
  }

  show() {
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
}

class SmallCircle {
  constructor(x, y, radius, base) {
    this.pos = createVector(x, y);
    this.base = base;
    this.radius = radius;
    this.rotation = 0; // Corrected the variable name
  }

  rotate() { // Corrected the method name
    this.rotation += 50; // Adjust the rotation speed for the SmallCircle
  }

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




class CircleCenter {
  constructor(x, y, radius, base) {
    this.pos = createVector(x, y);
    this.base = base;
    this.radius = radius;
  }

  show() {
    fill(this.base);
    stroke(255);
    strokeWeight(0.5);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}