let circles = [];
const maxRadius = 40;
const bigCircleRadius = 70;




//Set up
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  makeCircles();
}





//use this function to create circles
function makeCircles() {
  circles = [];
  // 根据大圆的直径和间距来计算列数和行数
  let cols = floor(width / (bigCircleRadius * 2 + 5));
  let rows = floor(height / (bigCircleRadius * 2 + 5));
  // 通过循环创建每个圆形
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // 计算每个圆形的位置
      let x = (bigCircleRadius + 2.5) + col * (bigCircleRadius * 2 + 5);
      let y = (bigCircleRadius + 2.5) + row * (bigCircleRadius * 2 + 5);
      let hue = random(360); // 为每个圆选择一个随机的色调
      // 创建一个大圆
      circles.push(new Circle(x, y, bigCircleRadius, color(hue, 5, 90), true));
      // 为每个大圆创建6个小圆
      for (let j = 0; j < 6; j++) {
        let brightness = 70;
        let reducedSaturation = 80; // 降低饱和度
        let hueSmall = random(360); // 为内部小圆选择一个随机的色调
        let shade = color(hueSmall, reducedSaturation, brightness, 0.7);
        let radius = maxRadius * (1.0) * (1 - j * 0.2) * 0.9;
        circles.push(new Circle(x, y, radius, shade, false));
      }
      // 在每个大圆的中心创建一个更小的圆
      let hueCenter = random(360); // 为中心小圆选择一个随机的色调
      circles.push(new Circle(x, y, maxRadius * 0.2, color(hueCenter, 100, 50, 0.7), false));
    }
  }
}




// 当窗口大小改变时调整画布大小并重新创建圆
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  makeCircles();
}




// 绘制函数
function draw() {
  background(44, 61, 100); // 设置背景色为灰蓝色
  for (let circle of circles) {
    circle.show(); // 显示所有的圆
  }
}




// 圆形类
// ... [不变的部分]


// 圆形类
class Circle {
  constructor(x, y, radius, base, isBigCircle) {
    this.pos = createVector(x, y); // 位置
    this.base = base;  // 颜色
    this.radius = radius; // 半径
    this.isBigCircle = isBigCircle; // 是否为大圆
  }
  // 显示圆
  show() {
    fill(this.base); // 设置填充颜色
    // 如果是大圆，则设置边框颜色并增加边框宽度
    if (this.isBigCircle) {
      let strokeCol = color(hue(this.base), 90, brightness(this.base) - 60);
      stroke(strokeCol);
      strokeWeight(1.5);
    } else {
      stroke(255);
      strokeWeight(0.5);
    }

    ellipse(this.pos.x, this.pos.y, this.radius * 2);
    // 如果是大圆，则在其与最大的小圆之间的环形区域绘制线条
    if (this.isBigCircle) {
      let numLines = 50;  // 设置线条数量
      let innerRadius = maxRadius * 0.9;  // 最大的小圆的半径
      stroke(34, 100, 100);  // 设置连线的颜色
      for (let i = 0; i < numLines; i++) {
        let angle = TWO_PI / numLines * i;
        let innerX = this.pos.x + cos(angle) * innerRadius;
        let innerY = this.pos.y + sin(angle) * innerRadius;
        let outerX = this.pos.x + cos(angle) * this.radius;
        let outerY = this.pos.y + sin(angle) * this.radius;
        line(innerX, innerY, outerX, outerY);  // 从最大的小圆到大圆绘制线条
      }
    }
    // 如果不是大圆，则绘制更多的细节
    if (!this.isBigCircle) {
      // 绘制内圆、小圆和外圆
      let innerRadius = this.radius * 0.5;
      ellipse(this.pos.x, this.pos.y, innerRadius * 2);




      for (let j = 0; j < 6; j++) {
        for (let i = 0; i < 24; i++) {
          let angle = TWO_PI / 24 * i + j * PI / 12;
          let xOffset = cos(angle) * this.radius * 0.7;
          let yOffset = sin(angle) * this.radius * 0.7;
          ellipse(this.pos.x + xOffset, this.pos.y + yOffset, this.radius * 0.15);
        }
      }




      for (let i = 0; i < 5; i++) {
        let angle = TWO_PI / 5 * i;
        let xOffset = cos(angle) * (this.radius * 2.5);
        let yOffset = sin(angle) * (this.radius * 2.5);
        ellipse(this.pos.x + xOffset, this.pos.y + yOffset, this.radius * 0.2);
      }
    }
  }
}


