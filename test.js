let cam;
let prevDist = -1;

function setup() {
  createCanvas(600, 400, WEBGL);

  // Initialize the camera
  cam = createCamera();
}

function draw() {
  background(200);

  // Example 3D object
  rotateY(frameCount * 0.01);
  box(100);

  // Pinch-to-zoom detection (for touch)
  if (touches.length == 2) {
    let currDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    
    if (prevDist > 0) {
      let zoomAmount = (prevDist - currDist) * 0.05; // Sensitivity for zoom
      cam.move(0, 0, zoomAmount);  // Adjust camera zoom along Z-axis
    }
    
    prevDist = currDist;  // Update previous distance for next frame
  } else {
    prevDist = -1;  // Reset when not pinching
  }
}

function mouseWheel(event) {
  // Optional: Add zooming via mouse wheel for desktop users
  cam.move(0, 0, event.delta * 0.1);
}