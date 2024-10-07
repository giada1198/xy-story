let state = 'init';
let is_mobile;

let canvas_3d;


let card_inner_left_img, card_inner_center_img, card_inner_right_img, card_inner_bottom_img;


let zoom_in_button, zoom_in_button_img;
let zoom_out_button, zoom_out_button_img;
let rotate_button, rotate_button_img;

let tabs_img;


let cam;
let isDragging = false;
let isTouching = false;
let lastX, lastY;
let lastTouchX, lastTouchY;

let prevDist = -1;

let target_eye_z = 800;
const min_eye_z = 200;
const max_eye_z = 1200;





let ui_padding, ui_spacing;
const dpi_multiple = 3;

function preload() {
	// card
	card_inner_left_img = loadImage('assets/card/card-inner-left.png');
	card_inner_center_img = loadImage('assets/card/card-inner-center.png');
	card_inner_right_img = loadImage('assets/card/card-inner-right.png');
	card_inner_bottom_img = loadImage('assets/card/card-inner-bottom.png');

	// button
	zoom_in_button_img = loadImage('assets/card/button-zoom-in.png');
	zoom_out_button_img = loadImage('assets/card/button-zoom-out.png');
	rotate_button_img = loadImage('assets/card/button-rotate.png');

	tabs_img = loadImage('assets/card/tabs.png');
}

function setup() {
	let w = windowWidth;
	let h = windowHeight;
	createCanvas(w, h);
	canvas_3d = createGraphics(w, h, WEBGL);
	canvas_3d.noStroke();

	ui_padding = 24;
	ui_spacing = 8;

	cam = canvas_3d.createCamera();
	cam.setPosition(0, 0, 800);

	console.log(cam.eyeZ);

	// zoom in button
	let bw = zoom_in_button_img.width/dpi_multiple;
	let bh = zoom_in_button_img.height/dpi_multiple;
	let x = w-ui_padding-bw;
	let y = ui_padding;
	zoom_in_button = new Button(zoom_in_button_img, x, y, bw, bh, 255);

	// zoom out button
	y = ui_padding+bh+ui_spacing;
	bw = zoom_out_button_img.width/dpi_multiple;
	bh = zoom_out_button_img.height/dpi_multiple;
	x = w-ui_padding-bw;
	zoom_out_button = new Button(zoom_out_button_img, x, y, bw, bh, 255);

	// rotate button
	bw = rotate_button_img.width/dpi_multiple;
	bh = rotate_button_img.height/dpi_multiple;
	x = ui_padding;
	y = ui_padding;
	rotate_button = new Button(rotate_button_img, x, y, bw, bh, 255);

}

function draw() {
	if (target_eye_z > cam.eyeZ) {
		if (target_eye_z - cam.eyeZ < 4) {
			cam.setPosition(cam.eyeX, cam.eyeY, target_eye_z);
		} else {
			cam.setPosition(cam.eyeX, cam.eyeY, cam.eyeZ + 4);
		}
		console.log(target_eye_z, cam.eyeZ);
	} else if (target_eye_z < cam.eyeZ) {
		if (cam.eyeZ - target_eye_z < 4) {
			cam.setPosition(cam.eyeX, cam.eyeY, target_eye_z);
		} else {
			cam.setPosition(cam.eyeX, cam.eyeY, cam.eyeZ - 4);
		}
		console.log(target_eye_z, cam.eyeZ);
	}
	
	background(0);
	

	canvas_3d.clear();
	

	



	let w_center = card_inner_center_img.width/dpi_multiple;
	let h_center = card_inner_center_img.height/dpi_multiple;

	let w = card_inner_left_img.width/dpi_multiple;
	let h = card_inner_left_img.height/dpi_multiple;

	canvas_3d.push();
	canvas_3d.texture(card_inner_left_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(-w, -h/2, 0, 0, 0);                         						// Top left corner
	canvas_3d.vertex(0, -h/2, 0, card_inner_left_img.width, 0);               			// Top right corner
	canvas_3d.vertex(0, h/2, 0, card_inner_left_img.width, card_inner_left_img.height);	// Bottom right corner
	canvas_3d.vertex(-w, h/2, 0, 0, card_inner_left_img.height);          				// Bottom left corner
	canvas_3d.translate(-w_center/2, 0, 0);
	// canvas_3d.rotateY(PI/12);
	canvas_3d.endShape(CLOSE);
	canvas_3d.pop();

	w = card_inner_right_img.width/dpi_multiple;
	h = card_inner_right_img.height/dpi_multiple;

	canvas_3d.push();
	canvas_3d.texture(card_inner_right_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(0, -h/2, 0, 0, 0);                         							// Top left corner
	canvas_3d.vertex(w, -h/2, 0, card_inner_right_img.width, 0);               				// Top right corner
	canvas_3d.vertex(w, h/2, 0, card_inner_right_img.width, card_inner_right_img.height);	// Bottom right corner
	canvas_3d.vertex(0, h/2, 0, 0, card_inner_right_img.height);          				    // Bottom left corner
	canvas_3d.translate(w_center/2, 0, 0);
	// canvas_3d.rotateY(-PI/12);
	canvas_3d.endShape(CLOSE);
	canvas_3d.pop();

	canvas_3d.push();
	canvas_3d.texture(card_inner_center_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(-w_center/2, -h_center/2, 0, 0, 0);                         									// Top left corner
	canvas_3d.vertex(w_center/2, -h_center/2, 0, card_inner_center_img.width, 0);               				// Top right corner
	canvas_3d.vertex(w_center/2, h_center/2, 0, card_inner_center_img.width, card_inner_center_img.height);	// Bottom right corner
	canvas_3d.vertex(-w_center/2, h_center/2, 0, 0, card_inner_center_img.height);          				    // Bottom left corner
	canvas_3d.endShape(CLOSE);
	canvas_3d.pop();

	let w_bottom = card_inner_bottom_img.width/dpi_multiple;
	let h_bottom = card_inner_bottom_img.height/dpi_multiple;


	canvas_3d.push();
	canvas_3d.texture(card_inner_bottom_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(-w_bottom/2, 0, 0, 0, 0);                         									// Top left corner
	canvas_3d.vertex(w_bottom/2, 0, 0, card_inner_bottom_img.width, 0);               				// Top right corner
	canvas_3d.vertex(w_bottom/2, h_bottom, 0, card_inner_bottom_img.width, card_inner_bottom_img.height);	// Bottom right corner
	canvas_3d.vertex(-w_bottom/2, h_bottom, 0, 0, card_inner_bottom_img.height);          				    // Bottom left corner
	canvas_3d.translate(0, h_center/2, 0);
	canvas_3d.rotateX(PI/6);
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

	zoom_in_button.display();
	zoom_out_button.display();
	rotate_button.display();

	image(tabs_img, windowWidth/2-154, windowHeight-ui_padding-56, 308, 56);

	if (zoom_in_button.is_hovered()) {
		cursor('pointer');
	} else if (zoom_out_button.is_hovered()) {
		cursor('pointer');
	 } else if (rotate_button.is_hovered()) {
		cursor('pointer');
	 } else if (isDragging){
		cursor('grabbing');
	 } else {
		cursor('grab');
	 }

}

function mousePressed() {
	if (zoom_in_button.is_hovered()) {
		let z = cam.eyeZ - 50;
		if (z > max_eye_z) {
			target_eye_z = max_eye_z;
		} else if (z < min_eye_z) {
			target_eye_z = min_eye_z;
		} else {
			target_eye_z = z;
		}
	} else if (zoom_out_button.is_hovered()) {
		let z = cam.eyeZ + 50;
		if (z > max_eye_z) {
			target_eye_z = max_eye_z;
		} else if (z < min_eye_z) {
			target_eye_z = min_eye_z;
		} else {
			target_eye_z = z;
		}
	} else {
		isDragging = true;
		cursor('grabbing');
	}
}
  
function mouseReleased() {
	isDragging = false;
	cursor('grab');
}

function touchStarted() {
	isTouching = true;
	if (touches.length > 0) {
	  lastTouchX = touches[0].x;
	  lastTouchY = touches[0].y;
	}

}

function mouseWheel(event) {
	let z = cam.eyeZ + event.delta;
	if (z > max_eye_z) {
		target_eye_z = max_eye_z;
	} else if (z < min_eye_z) {
		target_eye_z = min_eye_z;
	} else {
		target_eye_z = z;
	}
	cam.setPosition(cam.eyeX, cam.eyeY, target_eye_z);
}

function touchEnded() {
	if (zoom_in_button.is_hovered()) {
		let z = cam.eyeZ - 50;
		if (z > max_eye_z) {
			target_eye_z = max_eye_z;
		} else if (z < min_eye_z) {
			target_eye_z = min_eye_z;
		} else {
			target_eye_z = z;
		}
	} else if (zoom_out_button.is_hovered()) {
		let z = cam.eyeZ + 50;
		if (z > max_eye_z) {
			target_eye_z = max_eye_z;
		} else if (z < min_eye_z) {
			target_eye_z = min_eye_z;
		} else {
			target_eye_z = z;
		}
	}
	isTouching = false;
}

class Button {
	constructor(img, inX, inY, inWidth, inHeight, opacity) {
		this.x = inX;
		this.y = inY;
		this.width = inWidth;
		this.height = inHeight;
		this.img = img;
		this.opacity = opacity;
	}

	position(inX, inY) {
		this.x = inX;
		this.y = inY;
	}

	size(inWidth, inHeight) {
		this.width = inWidth;
		this.height = inHeight;	
	}

	display() {
		stroke(0);
		push();
		if (this.is_hovered()) {
			tint(170, 170, 170, this.opacity);
		} else {
			tint(255, this.opacity);
		}
		image(this.img, this.x, this.y, this.width, this.height);
		// console.log(this.x, this.y, this.width, this.height);
		pop();
	}

	is_hovered() {
		if ((mouseX > this.x) && (mouseX < this.x+this.width) && (mouseY > this.y) && (mouseY < this.y+this.height)) {
			return true;
		} else {
			return false;
		}
	}
}