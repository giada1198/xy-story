let state = 'init';
let language = 'tc';
let is_mobile;

let canvas_3d;

let letter_front_desktop_img, letter_back_desktop_img, letter_back_desktop_en_img;
let letter_front_mobile_img, letter_back_mobile_img;
let dagger_img;

let language_button_tc, language_button_tc_img;
const language_button_tc_img_w = 150;
const language_button_tc_img_h = 60;

let language_button_en, language_button_en_img;
const language_button_en_img_w = 150;
const language_button_en_img_h = 60;

let next_button_desktop, next_button_desktop_img, next_button_desktop_en_img;
const next_button_desktop_img_w = 300;
const next_button_desktop_img_h = 54;
const next_button_desktop_y_offset = 138;

let next_button_mobile, next_button_mobile_img, next_button_mobile_en_img;
const next_button_mobile_img_w = 240;
const next_button_mobile_img_h = 43;
const next_button_mobile_y_offset = 134;

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
	// letter
	letter_front_desktop_img = loadImage('assets/letter-front-desktop.png');
	letter_back_desktop_img = loadImage('assets/letter-back-desktop.png');
	letter_back_desktop_en_img = loadImage('assets/letter-back-desktop-en.png');
	letter_front_mobile_img = loadImage('assets/letter-front-mobile.png');
	letter_back_mobile_img = loadImage('assets/letter-back-mobile.png');
	letter_back_mobile_en_img = loadImage('assets/letter-back-mobile-en.png');
	
	// dagger
	dagger_img = loadImage('assets/dagger.png');
	
	// button
	language_button_tc_img = loadImage('assets/language-button-tc.png');
	language_button_en_img = loadImage('assets/language-button-en.png');
	next_button_desktop_img = loadImage('assets/next-button-desktop.png');
	next_button_desktop_en_img = loadImage('assets/next-button-desktop-en.png');
	next_button_mobile_img = loadImage('assets/next-button-mobile.png');
	next_button_mobile_en_img = loadImage('assets/next-button-mobile-en.png');
}

function setup() {
	is_mobile = (windowWidth <= 700) ? true : false;
	let min_h;
	if (is_mobile) {
		min_h = Math.max(Math.min(500, windowWidth), 320)/letter_front_mobile_img.width*letter_front_mobile_img.height;
	} else {
		min_h = 700/letter_front_desktop_img.width*letter_front_desktop_img.height;
	}
	let w = Math.max(320, windowWidth);
	let h = Math.max(min_h, windowHeight);
	createCanvas(w, h);
	canvas_3d = createGraphics(w, h, WEBGL);
	canvas_3d.noStroke();
	
	// create chinese language button
	let x = w/2-language_button_tc_img_w;
	let y = h/2-language_button_tc_img_h/2;
	language_button_tc = new Button(language_button_tc_img, language_button_tc_img, x, y, language_button_tc_img_w, language_button_tc_img_h);
	
	// create english language button
	x = w/2;
	y = h/2-language_button_en_img_h/2;
	language_button_en = new Button(language_button_en_img, language_button_en_img, x, y, language_button_en_img_w, language_button_en_img_h);
	
	// create next button on desktop
	x = w/2-next_button_desktop_img_w/2;
	y = h/2+next_button_desktop_y_offset;
	next_button_desktop = new Button(next_button_desktop_img, next_button_desktop_en_img, x, y, next_button_desktop_img_w, next_button_desktop_img_h);
	
	// create next button on mobile
	let scale = Math.min(500, w)/320;
	let button_w = next_button_mobile_img_w*scale;
	let button_h = next_button_mobile_img_h*scale;
	x = w/2-button_w/2;
	y = h/2+next_button_mobile_y_offset*scale;
	next_button_mobile = new Button(next_button_mobile_img, next_button_mobile_en_img, x, y, button_w, button_h);
}

function draw() {
	background(0);

	if (state != 'init' && state != 'language' && state != 'language-buttons-fade-out') {
		canvas_3d.clear();
		canvas_3d.push();
		canvas_3d.translate(0, letter_y_offset, 0);
		canvas_3d.rotateX(letter_rotate_x);
		canvas_3d.rotateY(letter_rotate_y);

		if (state === 'back') {
			letter_tilt_x = letter_tilt_x_forward ? letter_tilt_x+(PI/48)/80 : letter_tilt_x-(PI/48)/80;
			letter_tilt_y = letter_tilt_y_forward ? letter_tilt_y+(PI/48)/100 : letter_tilt_y-(PI/48)/100;
			if (letter_tilt_x >= PI/48) {
				letter_tilt_x_forward = false;
			} else if (letter_tilt_x <= -PI/48) {
				letter_tilt_x_forward = true;
			}
			if (letter_tilt_y >= PI/48) {
				letter_tilt_y_forward = false;
			} else if (letter_tilt_y <= -PI/48) {
				letter_tilt_y_forward = true;
			}
			canvas_3d.rotateX(letter_tilt_x);
			canvas_3d.rotateY(letter_tilt_y);
			
			// mouse tracking tilt effect on desktop
			if (!is_mobile) {
				canvas_3d.rotateX(map(mouseY, 0, height, -PI/48, PI/48));
				canvas_3d.rotateY(map(mouseX, 0, width,  -PI/48, PI/48));
			}
		}

		// draw the front side of the letter
		if (is_mobile) {
			let w = Math.max(Math.min(500, windowWidth), 320);
			let h = w*(letter_front_mobile_img.height/letter_front_mobile_img.width);
			canvas_3d.texture(letter_front_mobile_img);
			canvas_3d.beginShape();
			canvas_3d.vertex(-w/2, -h/2, 0, 0, 0);                          								// Top left corner
			canvas_3d.vertex(w/2, -h/2, 0, letter_front_mobile_img.width, 0);               				// Top right corner
			canvas_3d.vertex(w/2, h/2, 0, letter_front_mobile_img.width, letter_front_mobile_img.height);	// Bottom right corner
			canvas_3d.vertex(-w/2, h/2, 0, 0, letter_front_mobile_img.height);               				// Bottom left corner
			canvas_3d.endShape(CLOSE);
		} else {
			let w = 700;
			let h = w*(letter_front_desktop_img.height/letter_front_desktop_img.width);
			canvas_3d.texture(letter_front_desktop_img);
			canvas_3d.beginShape();
			canvas_3d.vertex(-w/2, -h/2, 0, 0, 0);                         									// Top left corner
			canvas_3d.vertex(w/2, -h/2, 0, letter_front_desktop_img.width, 0);               				// Top right corner
			canvas_3d.vertex(w/2, h/2, 0, letter_front_desktop_img.width, letter_front_desktop_img.height);	// Bottom right corner
			canvas_3d.vertex(-w/2, h/2, 0, 0, letter_front_desktop_img.height);          				    // Bottom left corner
			canvas_3d.endShape(CLOSE);
		}

		// draw the back side of the letter
		if (is_mobile) {
			let w = Math.max(Math.min(500, windowWidth), 320);
			let h = w*(letter_back_mobile_img.height/letter_back_mobile_img.width);
			if (language === 'en') {
				canvas_3d.texture(letter_back_mobile_en_img);
			} else {
				canvas_3d.texture(letter_back_mobile_img);
			}
			canvas_3d.beginShape();
			canvas_3d.vertex(w/2, -h/2, -0.01, letter_back_mobile_img.width, letter_back_mobile_img.height);                          							// Top left corner
			canvas_3d.vertex(-w/2, -h/2, -0.01, 0, letter_back_mobile_img.height);
			canvas_3d.vertex(-w/2, h/2, -0.01, 0, 0);
			canvas_3d.vertex(w/2, h/2, -0.01, letter_back_mobile_img.width, 0);
			canvas_3d.endShape(CLOSE);
		} else {
			let w = 700;
			let h = w*(letter_back_desktop_img.height/letter_back_desktop_img.width);
			if (language === 'en') {
				canvas_3d.texture(letter_back_desktop_en_img);
			} else {
				canvas_3d.texture(letter_back_desktop_img);
			}
			canvas_3d.beginShape();
			canvas_3d.vertex(w/2, -h/2, -0.01, letter_back_desktop_img.width, letter_back_desktop_img.height);
			canvas_3d.vertex(-w/2, -h/2, -0.01, 0, letter_back_desktop_img.height);
			canvas_3d.vertex(-w/2, h/2, -0.01, 0, 0);
			canvas_3d.vertex(w/2, h/2, -0.01, letter_back_desktop_img.width, 0);
			canvas_3d.endShape(CLOSE);
		}

		let daggerOffset = 0;
		if (dagger_z > 0) {
			daggerOffset = Math.pow(1.3, dagger_z);
		}
		canvas_3d.translate(260+daggerOffset, -270-daggerOffset, 60+2*daggerOffset);
		canvas_3d.rotateY(-PI/12);
		canvas_3d.rotateZ(PI/4);

		canvas_3d.tint(255, Math.max(0, 255-Math.pow(1.2, dagger_z)));
		canvas_3d.texture(dagger_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(-dagger_img.width/2, -dagger_img.height/2, 10, 0, 0);
		canvas_3d.vertex(dagger_img.width/2, -dagger_img.height/2, 10, dagger_img.width, 0);
		canvas_3d.vertex(dagger_img.width/2, dagger_img.height/2, 10, dagger_img.width, dagger_img.height);
		canvas_3d.vertex(-dagger_img.width/2, dagger_img.height/2, 10, 0, dagger_img.height);
		canvas_3d.endShape(CLOSE);

		canvas_3d.pop();
	}

	if (state === 'init') {
		language_button_tc.display();
		language_button_en.display();
		language_button_tc.opacity += 10;
		language_button_en.opacity = language_button_tc.opacity;
		if (language_button_tc.opacity >= 255) {
			state = 'language'
		}
	} else if (state === 'language') {
		language_button_tc.display();
		language_button_en.display();
		if (language_button_tc.is_hovered() || language_button_en.is_hovered()) {
			cursor('pointer');
		} else {
			cursor('default');
		}
	} else if (state === 'language-buttons-fade-out') {
		language_button_tc.display();
		language_button_en.display();
		language_button_tc.opacity -= 10;
		language_button_en.opacity = language_button_tc.opacity;
		if (language_button_tc.opacity <= 0) {
			state = 'letter-fade-in'
		}
	} else if (state === 'letter-fade-in') {
		letter_opacity += 2;
		if (letter_y_offset <= 0) {
			letter_y_offset = 0;
		} else {
			letter_y_offset -= 1.5;
		}
		push();
		tint(255, 255, 255, letter_opacity);
		image(canvas_3d, 0, 0);
		pop();
		if (letter_opacity >= 255 && letter_y_offset === 0) {
			state = 'front';
		}
	} else if (state === 'front') {
		front_countdown -= 1;
		if (front_countdown <= 0) {
			state = 'dagger-out';
		}
		image(canvas_3d, 0, 0);
	} else if (state === 'dagger-out') {
		image(canvas_3d, 0, 0);
		dagger_z += 1;
		if (dagger_z >= 40) {
			state = 'turn-over';
		}
		cursor(ARROW);
	} else if (state === 'turn-over') {
		letter_rotate_x = Math.max(-PI, letter_rotate_x-=0.12);
		letter_rotate_y = Math.min(2*PI, letter_rotate_y+=0.20);
		image(canvas_3d, 0, 0);
		if (letter_rotate_x === -PI && letter_rotate_y === 2*PI) {
			state = 'back'
		}
	} else if (state === 'back') {
		image(canvas_3d, 0, 0);
		if (next_button_desktop.opacity <= 255) {
			next_button_desktop.opacity = Math.min(255, next_button_desktop.opacity += 10);
			next_button_mobile.opacity = Math.min(255, next_button_mobile.opacity += 10);
		}
		if (is_mobile) {
			next_button_mobile.display();
		} else {
			next_button_desktop.display();
			if (next_button_desktop.is_hovered()) {
				cursor('pointer');
			} else {
				cursor('default');
			}
		}
	}
}

function touchEnded() {
	if (state === 'language' && language_button_tc.is_hovered()) {
		language = 'tc';
		state = 'language-buttons-fade-out';
		cursor('default');
	} else if (state === 'language' && language_button_en.is_hovered()) {
		language = 'en';
		state = 'language-buttons-fade-out';
		cursor('default');
	} else if (state === 'back' && (next_button_desktop.is_hovered() || next_button_mobile.is_hovered())) {
		window.open(survey_link);
	}
}

function windowResized() {
	is_mobile = (windowWidth <= 700) ? true : false;
	let min_h;
	if (is_mobile) {
		min_h = Math.max(Math.min(500, windowWidth), 320)/letter_front_mobile_img.width*letter_front_mobile_img.height;
	} else {
		min_h = 700/letter_front_desktop_img.width*letter_front_desktop_img.height;
	}
	let w = Math.max(320, windowWidth);
	let h = Math.max(min_h, windowHeight);

	// reposition language buttons
	language_button_tc.position(w/2-language_button_tc_img_w, h/2-language_button_tc_img_h/2);
	language_button_en.position(w/2, h/2-language_button_en_img_h/2);

	resizeCanvas(w, h);
	canvas_3d.resizeCanvas(w, h);
	// reposition next button
	if (is_mobile) {
		let scale = Math.min(500, w)/320;
		let button_w = next_button_mobile_img_w*scale;
		let button_h = next_button_mobile_img_h*scale;
		let x = w/2-button_w/2;
		let y = h/2+next_button_mobile_y_offset*scale;
		next_button_mobile.position(x, y);
		next_button_mobile.size(button_w, button_h);
	} else {
		let x = w/2-next_button_desktop_img_w/2;
		let y = h/2+next_button_desktop_y_offset;
		next_button_desktop.position(x, y);
	}
}

class Button {
	constructor(img, img_en, inX, inY, inWidth, inHeight) {
		this.x = inX;
		this.y = inY;
		this.width = inWidth;
		this.height = inHeight;
		this.img = img;
		this.img_en = img_en;
		this.opacity = 0;
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
		if (language === 'en') {
			image(this.img_en, this.x, this.y, this.width, this.height);
		} else {
			image(this.img, this.x, this.y, this.width, this.height);
		}
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