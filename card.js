let state = 'init';
let is_mobile;

let canvas_3d;


let card_inner_left_img, card_inner_center_img, card_inner_right_img, card_inner_bottom_img;

let card_left_rotateY, card_right_rotateY, card_bottom_rotateX;

let zoom_in_button, zoom_in_button_img;
let zoom_out_button, zoom_out_button_img;
let rotate_button, rotate_button_img;

let tabs_img;


let cam;
let isDragging = false;
let isTouching = false;
let lastX, lastY;
let last_touchX, last_touchY;

let cam_angle;

let prevDist = -1;

let target_eyeZ = 800;
const min_eyeZ = 200;
const max_eyeZ = 1200;


let card_opacity = 0;


let ui_padding, ui_spacing;
const dpi_multiple = 3;

function preload() {
	// card
	card_inner_left_img = loadImage('assets/card/card-inner-left.png');
	card_inner_center_img = loadImage('assets/card/card-inner-center.png');
	card_inner_right_img = loadImage('assets/card/card-inner-right.png');
	card_inner_bottom_img = loadImage('assets/card/card-inner-bottom.png');

	card_outer_left_img = loadImage('assets/card/card-outer-left.png');
	card_outer_center_img = loadImage('assets/card/card-outer-center.png');
	card_outer_right_img = loadImage('assets/card/card-outer-right.png');
	card_outer_bottom_img = loadImage('assets/card/card-outer-bottom.png');


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
	cam.setPosition(0, -300, 800);


	card_left_rotateY = PI;
	card_right_rotateY = -PI;
	card_bottom_rotateX = 0.99*PI;

	cam_angle = 0.5*PI;


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





	
	background(0);
	

	canvas_3d.clear();
	



	let w_center = card_inner_center_img.width/dpi_multiple;
	let h_center = card_inner_center_img.height/dpi_multiple;

	let w = card_inner_left_img.width/dpi_multiple;
	let h = card_inner_left_img.height/dpi_multiple;

	// left inner
	canvas_3d.push();
	canvas_3d.texture(card_inner_left_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(-w, -h/2, 0, 0, 0);                         						// Top left corner
	canvas_3d.vertex(0, -h/2, 0, card_inner_left_img.width, 0);               			// Top right corner
	canvas_3d.vertex(0, h/2, 0, card_inner_left_img.width, card_inner_left_img.height);	// Bottom right corner
	canvas_3d.vertex(-w, h/2, 0, 0, card_inner_left_img.height);          				// Bottom left corner
	canvas_3d.translate(-w_center/2, 0, 0);
	canvas_3d.rotateY(card_left_rotateY);
	canvas_3d.endShape(CLOSE);
	canvas_3d.pop();

	// left outer
	canvas_3d.push();
	canvas_3d.texture(card_outer_left_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(0, -h/2, -0.01, 0, 0);
	canvas_3d.vertex(-w, -h/2, -0.01, card_inner_left_img.width, 0);
	canvas_3d.vertex(-w, h/2, -0.01, card_inner_left_img.width, card_inner_left_img.height);
	canvas_3d.vertex(0, h/2, -0.01, 0, card_inner_left_img.height);
	canvas_3d.translate(-w_center/2, 0, 0);
	canvas_3d.rotateY(card_left_rotateY);
	canvas_3d.endShape(CLOSE);
	canvas_3d.pop();

	w = card_inner_right_img.width/dpi_multiple;
	h = card_inner_right_img.height/dpi_multiple;

	// right inner
	canvas_3d.push();
	canvas_3d.texture(card_inner_right_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(0, -h/2, 0, 0, 0);                         							// Top left corner
	canvas_3d.vertex(w, -h/2, 0, card_inner_right_img.width, 0);               				// Top right corner
	canvas_3d.vertex(w, h/2, 0, card_inner_right_img.width, card_inner_right_img.height);	// Bottom right corner
	canvas_3d.vertex(0, h/2, 0, 0, card_inner_right_img.height);          				    // Bottom left corner
	canvas_3d.translate(w_center/2, 0, 0);
	canvas_3d.rotateY(card_right_rotateY);
	canvas_3d.endShape(CLOSE);
	canvas_3d.pop();

	// right outer
	canvas_3d.push();
	canvas_3d.texture(card_outer_right_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(w, -h/2, -0.01, 0, 0);                         							// Top left corner
	canvas_3d.vertex(0, -h/2, -0.01, card_inner_right_img.width, 0);               				// Top right corner
	canvas_3d.vertex(0, h/2, -0.01, card_inner_right_img.width, card_inner_right_img.height);	// Bottom right corner
	canvas_3d.vertex(w, h/2, -0.01, 0, card_inner_right_img.height);          				    // Bottom left corner
	canvas_3d.translate(w_center/2, 0, 0);
	canvas_3d.rotateY(card_right_rotateY);
	canvas_3d.endShape(CLOSE);
	canvas_3d.pop();

	// center inner
	canvas_3d.push();
	canvas_3d.texture(card_inner_center_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(-w_center/2, -h_center/2, 0, 0, 0);                         									// Top left corner
	canvas_3d.vertex(w_center/2, -h_center/2, 0, card_inner_center_img.width, 0);               				// Top right corner
	canvas_3d.vertex(w_center/2, h_center/2, 0, card_inner_center_img.width, card_inner_center_img.height);	// Bottom right corner
	canvas_3d.vertex(-w_center/2, h_center/2, 0, 0, card_inner_center_img.height);          				    // Bottom left corner
	canvas_3d.endShape(CLOSE);
	canvas_3d.pop();

	// center outer
	canvas_3d.push();
	canvas_3d.texture(card_outer_center_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(w_center/2, -h_center/2, -0.01, 0, 0);                         									// Top left corner
	canvas_3d.vertex(-w_center/2, -h_center/2, -0.01, card_inner_center_img.width, 0);               				// Top right corner
	canvas_3d.vertex(-w_center/2, h_center/2, -0.01, card_inner_center_img.width, card_inner_center_img.height);	// Bottom right corner
	canvas_3d.vertex(w_center/2, h_center/2, -0.01, 0, card_inner_center_img.height);          				    // Bottom left corner
	canvas_3d.endShape(CLOSE);
	canvas_3d.pop();

	let w_bottom = card_inner_bottom_img.width/dpi_multiple;
	let h_bottom = card_inner_bottom_img.height/dpi_multiple;

	// bottom inner
	canvas_3d.push();
	canvas_3d.texture(card_inner_bottom_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(-w_bottom/2, 0, 0, 0, 0);                         									// Top left corner
	canvas_3d.vertex(w_bottom/2, 0, 0, card_inner_bottom_img.width, 0);               				// Top right corner
	canvas_3d.vertex(w_bottom/2, h_bottom, 0, card_inner_bottom_img.width, card_inner_bottom_img.height);	// Bottom right corner
	canvas_3d.vertex(-w_bottom/2, h_bottom, 0, 0, card_inner_bottom_img.height);          				    // Bottom left corner
	canvas_3d.translate(0, h_center/2, 0);
	canvas_3d.rotateX(card_bottom_rotateX);
	canvas_3d.endShape(CLOSE);
	canvas_3d.pop();

	// bottom outer
	canvas_3d.push();
	canvas_3d.texture(card_outer_bottom_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(-w_bottom/2, h_bottom, -0.05, 0, 0);                         									// Top left corner
	canvas_3d.vertex(w_bottom/2, h_bottom, -0.05, card_inner_bottom_img.width, 0);               				// Top right corner
	canvas_3d.vertex(w_bottom/2, 0, -0.05, card_inner_bottom_img.width, card_inner_bottom_img.height);	// Bottom right corner
	canvas_3d.vertex(-w_bottom/2, 0, 0, -0.05, card_inner_bottom_img.height);          				    // Bottom left corner
	canvas_3d.translate(0, h_center/2, 0);
	canvas_3d.rotateX(card_bottom_rotateX);
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
		let dx = touches[0].x - last_touchX;
		let dy = touches[0].y - last_touchY;
	
		// Adjust camera based on touch drag
		cam.move(-dx, -dy, 0);
	}

	if (touches.length > 0) {
		last_touchX = touches[0].x;
		last_touchY = touches[0].y;
	}



	push();
	tint(255, 255, 255, card_opacity);
	image(canvas_3d, 0, 0);
	pop();



	

	lastX = mouseX;
	lastY = mouseY;

	zoom_in_button.display();
	zoom_out_button.display();
	rotate_button.display();

	image(tabs_img, windowWidth/2-154, windowHeight-ui_padding-56, 308, 56);

	if (zoom_in_button.is_hovered() || zoom_out_button.is_hovered() || rotate_button.is_hovered()) {
		cursor('pointer');
	} else if (isDragging){
		cursor('grabbing');
	} else {
		cursor('grab');
	}

	if (state === 'init') {
		if (cam.eyeX === 0 && cam.eyeY === 0 && cam.eyeZ === 800 && card_opacity === 255) {
			state = 'unfold-bottom';
		} else {
			reset_camera_eyeXY(3);
			card_opacity = Math.min(255, card_opacity+2);
		}
	} else if (state === 'unfold-bottom') {
		let x = card_bottom_rotateX - 0.008*PI;
		if (x > 0.2*PI) {
			card_bottom_rotateX = x;
		} else {
			card_bottom_rotateX = 0.2*PI;
			state = 'unfold-sides';
		}
	} else if (state === 'unfold-sides') {
		let y = card_left_rotateY - 0.008*PI;
		if (y > 0.05*PI) {
			card_left_rotateY = y;
			card_right_rotateY = -y;
		} else {
			card_left_rotateY = 0.05*PI;
			card_right_rotateY = -0.05*PI;
			state = 'carrier-front';
		}
	} else if (state === 'carrier-front') {
		move_camera_eyeZ();
	} else if (state === 'carrier-front-to-back-reset') {
		if (card_opacity === 0 || (cam.eyeX === 0 && cam.eyeY === 0 && cam.eyeZ === 800)) {
			state = 'carrier-front-to-back';
			cam.setPosition(0, 0, 800);
			target_eyeZ = -800;
		} else {
			card_opacity = Math.max(0, card_opacity-15);
		}
	} else if (state === 'carrier-front-to-back') {
		let a = cam_angle + 0.01*PI;
		if (card_opacity === 255 && a > 1.5*PI) {
			cam_angle = 1.5*PI;
			cam.setPosition(0, 0, -800);
			state = 'carrier-back';
		} else {
			cam_angle = a;
			let ax = 800*cos(cam_angle);
			let az = 800*sin(cam_angle);
			cam.setPosition(ax, 0, az);
			card_opacity = Math.min(255, card_opacity+5);
		}
		cam.lookAt(0, 0, 0);
	} else if (state === 'carrier-back') {
		move_camera_eyeZ();
	} else if (state === 'carrier-back-to-front-reset') {
		if (card_opacity === 0 || (cam.eyeX === 0 && cam.eyeY === 0 && cam.eyeZ === -800)) {
			state = 'carrier-back-to-front';
			cam.setPosition(0, 0, -800);
			target_eyeZ = 800;
		} else {
			card_opacity = Math.max(0, card_opacity-15);
		}
	} else if (state === 'carrier-back-to-front') {
		let a = cam_angle - 0.01*PI;
		if (card_opacity === 255 && a < 0.5*PI) {
			cam_angle = 0.5*PI;
			cam.setPosition(0, 0, 800);
			state = 'carrier-front';
		} else {
			cam_angle = a;
			let ax = 800*cos(cam_angle);
			let az = 800*sin(cam_angle);
			cam.setPosition(ax, 0, az);
			card_opacity = Math.min(255, card_opacity+5);
		}
		cam.lookAt(0, 0, 0);
	}
}

function mousePressed() {
	// zoom in button
	if (zoom_in_button.is_hovered()) {
		if (state === 'carrier-front') {
			let z = cam.eyeZ - 50;
			if (z > max_eyeZ) {
				target_eyeZ = max_eyeZ;
			} else if (z < min_eyeZ) {
				target_eyeZ = min_eyeZ;
			} else {
				target_eyeZ = z;
			}
		} else if (state === 'carrier-back') {
			let z = cam.eyeZ + 50;
			if (z < -max_eyeZ) {
				target_eyeZ = -max_eyeZ;
			} else if (z > -min_eyeZ) {
				target_eyeZ = -min_eyeZ;
			} else {
				target_eyeZ = z;
			}
		}
	// zoom out button
	} else if (zoom_out_button.is_hovered()) {
		if (state === 'carrier-front') {
			let z = cam.eyeZ + 50;
			if (z > max_eyeZ) {
				target_eyeZ = max_eyeZ;
			} else if (z < min_eyeZ) {
				target_eyeZ = min_eyeZ;
			} else {
				target_eyeZ = z;
			}
		} else if (state === 'carrier-back') {
			let z = cam.eyeZ - 50;
			if (z < -max_eyeZ) {
				target_eyeZ = -max_eyeZ;
			} else if (z > -min_eyeZ) {
				target_eyeZ = -min_eyeZ;
			} else {
				target_eyeZ = z;
			}
		}
	// rotate button
	} else if (rotate_button.is_hovered()) {
		if (state === 'carrier-front') {
			state = 'carrier-front-to-back-reset';
			target_eyeZ = 800;
		} else if (state === 'carrier-back') {
			state = 'carrier-back-to-front-reset';
			target_eyeZ = -800;
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

function mouseWheel(event) {
	if (state === 'carrier-front') {
		let z = cam.eyeZ + event.delta;
		if (z > max_eyeZ) {
			target_eyeZ = max_eyeZ;
		} else if (z < min_eyeZ) {
			target_eyeZ = min_eyeZ;
		} else {
			target_eyeZ = z;
		}
		cam.setPosition(cam.eyeX, cam.eyeY, target_eyeZ);
	} else if (state === 'carrier-back') {
		let z = cam.eyeZ + event.delta;
		if (z < -max_eyeZ) {
			target_eyeZ = -max_eyeZ;
		} else if (z > -min_eyeZ) {
			target_eyeZ = -min_eyeZ;
		} else {
			target_eyeZ = z;
		}
		cam.setPosition(cam.eyeX, cam.eyeY, target_eyeZ);
	}
}

function touchStarted() {
	isTouching = true;
	if (touches.length > 0) {
		last_touchX = touches[0].x;
		last_touchY = touches[0].y;
	}
}

function touchEnded() {
	isTouching = false;
	// zoom in button
	if (zoom_in_button.is_hovered()) {
		if (state === 'carrier-front') {
			let z = cam.eyeZ - 50;
			if (z > max_eyeZ) {
				target_eyeZ = max_eyeZ;
			} else if (z < min_eyeZ) {
				target_eyeZ = min_eyeZ;
			} else {
				target_eyeZ = z;
			}
		} else if (state === 'carrier-back') {
			let z = cam.eyeZ + 50;
			if (z < -max_eyeZ) {
				target_eyeZ = -max_eyeZ;
			} else if (z > -min_eyeZ) {
				target_eyeZ = -min_eyeZ;
			} else {
				target_eyeZ = z;
			}
		}
	// zoom out button
	} else if (zoom_out_button.is_hovered()) {
		if (state === 'carrier-front') {
			let z = cam.eyeZ + 50;
			if (z > max_eyeZ) {
				target_eyeZ = max_eyeZ;
			} else if (z < min_eyeZ) {
				target_eyeZ = min_eyeZ;
			} else {
				target_eyeZ = z;
			}
		} else if (state === 'carrier-back') {
			let z = cam.eyeZ - 50;
			if (z < -max_eyeZ) {
				target_eyeZ = -max_eyeZ;
			} else if (z > -min_eyeZ) {
				target_eyeZ = -min_eyeZ;
			} else {
				target_eyeZ = z;
			}
		}
	// rotate button
	} else if (rotate_button.is_hovered()) {
		if (state === 'carrier-front') {
			state = 'carrier-front-to-back-reset';
			target_eyeZ = 800;
		} else if (state === 'carrier-back') {
			state = 'carrier-back-to-front-reset';
			target_eyeZ = -800;
		}
	}
}

function move_camera_eyeZ() {
	if (target_eyeZ > cam.eyeZ) {
		if (target_eyeZ - cam.eyeZ < 4) {
			cam.setPosition(cam.eyeX, cam.eyeY, target_eyeZ);
		} else {
			cam.setPosition(cam.eyeX, cam.eyeY, cam.eyeZ + 4);
		}
	} else if (target_eyeZ < cam.eyeZ) {
		if (cam.eyeZ - target_eyeZ < 4) {
			cam.setPosition(cam.eyeX, cam.eyeY, target_eyeZ);
		} else {
			cam.setPosition(cam.eyeX, cam.eyeY, cam.eyeZ - 4);
		}
	}
}

function reset_camera_eyeXY(speed) {
	// let speed = 20;
	if (cam.eyeX > 0) {
		if (cam.eyeX-speed < 0) {
			cam.setPosition(0, cam.eyeY, cam.eyeZ);
		} else {
			cam.setPosition(cam.eyeX-speed, cam.eyeY, cam.eyeZ);
		}
	} else if (cam.eyeX < 0) {
		if (cam.eyeX-speed > 0) {
			cam.setPosition(0, cam.eyeY, cam.eyeZ);
		} else {
			cam.setPosition(cam.eyeX+speed, cam.eyeY, cam.eyeZ);
		}
	}
	if (cam.eyeY > 0) {
		if (cam.eyeY-speed < 0) {
			cam.setPosition(cam.eyeX, 0, cam.eyeZ);
		} else {
			cam.setPosition(cam.eyeX, cam.eyeY-speed, cam.eyeZ);
		}
	} else if (cam.eyeY < 0) {
		if (cam.eyeY-speed > 0) {
			cam.setPosition(cam.eyeX, 0, cam.eyeZ);
		} else {
			cam.setPosition(cam.eyeX, cam.eyeY+speed, cam.eyeZ);
		}
	}
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