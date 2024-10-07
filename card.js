let state = 'init';
let language = 'tc';
let is_mobile;

let canvas_3d;

let letter_front_desktop_img, letter_back_desktop_img, letter_back_desktop_en_img;
let letter_front_mobile_img, letter_back_mobile_img;
let dagger_img;



let card_inner_left_img, card_inner_center_img, card_inner_right_img, card_inner_bottom_img;


let cam;
let isDragging = false;
let isTouching = false;
let lastX, lastY;
let lastTouchX, lastTouchY;

let prevDist = -1;


const dpi_multiple = 3;

const survey_link = 'https://forms.gle/AvYd9YZ7U9vqC8Vx5';

let front_countdown = 20;

let letter_opacity = 0;
let letter_y_offset = 150;
let letter_rotate_x = 0;
let letter_rotate_y = 0;
let dagger_z = 0;

let letter_tilt_x = 0;
let letter_tilt_x_forward = true;
let letter_tilt_y = 0;
let letter_tilt_y_forward = true;

function preload() {
	// card
	card_inner_left_img = loadImage('assets/card/card-inner-left.png');
	card_inner_center_img = loadImage('assets/card/card-inner-center.png');
	card_inner_right_img = loadImage('assets/card/card-inner-right.png');
	card_inner_bottom_img = loadImage('assets/card/card-inner-bottom.png');
}

function setup() {
	let w = windowWidth;
	let h = windowHeight;
	createCanvas(w, h);
	canvas_3d = createGraphics(w, h, WEBGL);
	canvas_3d.noStroke();

	cam = canvas_3d.createCamera();



}

function draw() {

	canvas_3d.orbitControl();
	
	background(0);
	
	canvas_3d.clear();
	

	

	let w = card_inner_left_img.width/dpi_multiple;
	let h = card_inner_left_img.height/dpi_multiple;

	let w_center = card_inner_center_img.width/dpi_multiple;
	let h_center = card_inner_center_img.height/dpi_multiple;

	canvas_3d.push();
	canvas_3d.texture(card_inner_left_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(-w, -h/2, 0, 0, 0);                         						// Top left corner
	canvas_3d.vertex(0, -h/2, 0, card_inner_left_img.width, 0);               			// Top right corner
	canvas_3d.vertex(0, h/2, 0, card_inner_left_img.width, card_inner_left_img.height);	// Bottom right corner
	canvas_3d.vertex(-w, h/2, 0, 0, card_inner_left_img.height);          				// Bottom left corner
	canvas_3d.translate(-w_center/2, 0, 0);
	// canvas_3d.rotateY(1.5);
	canvas_3d.rotateY(1);
	canvas_3d.endShape(CLOSE);
	canvas_3d.pop();

	canvas_3d.push();
	canvas_3d.texture(card_inner_right_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(w_center/2, -h/2, 0, 0, 0);                         									// Top left corner
	canvas_3d.vertex(w+w_center/2, -h/2, 0, card_inner_right_img.width, 0);               				// Top right corner
	canvas_3d.vertex(w+w_center/2, h/2, 0, card_inner_right_img.width, card_inner_right_img.height);	// Bottom right corner
	canvas_3d.vertex(w_center/2, h/2, 0, 0, card_inner_right_img.height);          				    // Bottom left corner
	canvas_3d.endShape(CLOSE);

	canvas_3d.texture(card_inner_center_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(-w_center/2, -h_center/2, 0, 0, 0);                         									// Top left corner
	canvas_3d.vertex(w_center/2, -h_center/2, 0, card_inner_center_img.width, 0);               				// Top right corner
	canvas_3d.vertex(w_center/2, h_center/2, 0, card_inner_center_img.width, card_inner_center_img.height);	// Bottom right corner
	canvas_3d.vertex(-w_center/2, h_center/2, 0, 0, card_inner_center_img.height);          				    // Bottom left corner
	canvas_3d.endShape(CLOSE);

	let w_bottom = card_inner_bottom_img.width/dpi_multiple;
	let h_bottom = card_inner_bottom_img.height/dpi_multiple;

	canvas_3d.texture(card_inner_bottom_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(-w_bottom/2, h_center/2, 0, 0, 0);                         									// Top left corner
	canvas_3d.vertex(w_bottom/2, h_center/2, 0, card_inner_bottom_img.width, 0);               				// Top right corner
	canvas_3d.vertex(w_bottom/2, h_center/2+h_bottom, 0, card_inner_bottom_img.width, card_inner_bottom_img.height);	// Bottom right corner
	canvas_3d.vertex(-w_bottom/2, h_center/2+h_bottom, 0, 0, card_inner_bottom_img.height);          				    // Bottom left corner
	canvas_3d.endShape(CLOSE);



	

	canvas_3d.pop();
	
	

	if (isDragging) {
		let dx = mouseX - lastX;
		let dy = mouseY - lastY;
		// cam.pan(-dx * 0.005);  // Horizontal movement
		// cam.tilt(dy * 0.005);  // Vertical movement
		cam.move(-dx, -dy, 0);
	}

	if (isTouching && touches.length > 0) {
		let dx = touches[0].x - lastTouchX;
		let dy = touches[0].y - lastTouchY;
	
		// Adjust camera based on touch drag
		cam.move(-dx, -dy, 0);
	}

	if (touches.length > 0) {
		lastTouchX = touches[0].x;
		lastTouchY = touches[0].y;
	}

	// Pinch to zoom
	if (touches.length == 2) {
	let currDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
	
	if (prevDist > 0) {
		let zoomAmount = (prevDist - currDist) * 0.01; // Adjust sensitivity
		cam.move(0, 0, zoomAmount);  // Move the camera forward or backward
	}
	
	prevDist = currDist; // Update the previous distance
	} else {
	prevDist = -1; // Reset the distance when not pinching
	}

	image(canvas_3d, 0, 0);

	lastX = mouseX;
	lastY = mouseY;

	

}

function mousePressed() {
	console.log('mouse pressed');
	isDragging = true;
}
  
function mouseReleased() {
	isDragging = false;
}

function touchStarted() {
	isTouching = true;
	if (touches.length > 0) {
	  lastTouchX = touches[0].x;
	  lastTouchY = touches[0].y;
	}

}

function touchEnded() {
	isTouching = false;
}

function mouseWheel(event) {
	// Optional: Zoom with the mouse wheel
	cam.move(0, 0, event.delta);
}