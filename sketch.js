
let angle = 0;
let state = 'init';
let canvas_3d;

let letterOpacity = 1;

let language = 'unknown';

let daggerZ = 0;


// let letterRotateX = Math.PI/24;
// let letterRotateY = Math.PI/24;
let letterRotateX = 0;
let letterRotateY = 0;



let letterY = 150;

let letterWiggleX = 0;
let letterWiggleXPositive = true;
let letterWiggleY = 0;
let letterWiggleYPositive = true;

let frontCountdown = 20;

let button;
let buttonEnglish;




let letter_front_desktop_img, letter_back_desktop_img;
let letter_front_mobile_img, letter_back_mobile_img;

let next_button_desktop, next_button_desktop_img;
const next_button_desktop_img_w = 300;
const next_button_desktop_img_h = 54;
const next_button_desktop_y_offset = 138;

let next_button_mobile, next_button_mobile_img;
const next_button_mobile_img_w = 240;
const next_button_mobile_img_h = 43;
const next_button_mobile_y_offset = 134;

let is_mobile;

const survey_link = 'https://forms.gle/AvYd9YZ7U9vqC8Vx5';


function preload() {
	// Letter
	letter_front_desktop_img = loadImage('assets/ygs-test.png');
	letter_back_desktop_img = loadImage('assets/ygs-test-3.png');
	letter_front_mobile_img = loadImage('assets/letter-front-mobile.png');
	letter_back_mobile_img = loadImage('assets/letter-back-mobile.png');
	// Dagger
	daggerImg = loadImage('assets/dagger.png');
	// Button
	next_button_desktop_img = loadImage('assets/next-button-desktop.png');
	next_button_mobile_img = loadImage('assets/next-button-mobile.png');
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
	console.log('w:', w, "h:", h);


	canvas_3d.noStroke();
	button = createButton('中文');
	button.position(windowWidth/2-button.width-10, windowHeight/2 - button.height / 2);
	button.mousePressed(() => {
		setLanguage('chinese')
	});

	buttonEnglish = createButton('English');
	buttonEnglish.position(windowWidth/2+10, windowHeight/2 - buttonEnglish.height / 2);
	buttonEnglish.mousePressed(() => {
		setLanguage('english')
	});

	button.style('cursor', 'pointer');
	buttonEnglish.style('cursor', 'pointer');

	let x = w/2-next_button_desktop_img_w/2;
	let y = h/2+next_button_desktop_y_offset;
	next_button_desktop = new Button(next_button_desktop_img, x, y, next_button_desktop_img_w, next_button_desktop_img_h);

	let scale = Math.min(500, w)/320;
	let button_w = next_button_mobile_img_w*scale;
	let button_h = next_button_mobile_img_h*scale;
	x = w/2-button_w/2;
	y = h/2+next_button_mobile_y_offset*scale;
	next_button_mobile = new Button(next_button_mobile_img, x, y, button_w, button_h);
}

function draw() {
	background(0);
	canvas_3d.clear();
	canvas_3d.push();
	canvas_3d.translate(0, letterY, 0);

	if (state === 'back') {
		letterWiggleX = letterWiggleXPositive? letterWiggleX+(PI/72)/60 : letterWiggleX-(PI/72)/60;
		letterWiggleY = letterWiggleYPositive? letterWiggleY+(PI/72)/80 : letterWiggleY-(PI/72)/80;
		
		if (letterWiggleX >= PI/60) {
			letterWiggleXPositive = false;
		} else if (letterWiggleX <= -PI/60) {
			letterWiggleXPositive = true;
		}

		if (letterWiggleY >= PI/60) {
			letterWiggleYPositive = false;
		} else if (letterWiggleY <= -PI/60) {
			letterWiggleYPositive = true;
		}

		canvas_3d.rotateX(letterWiggleX);
		canvas_3d.rotateY(letterWiggleY);

		// Mouse tracking tilt effect on desktop
		if (!is_mobile) {
			canvas_3d.rotateX(map(mouseY, 0, height, -PI/36, PI/36));
			canvas_3d.rotateY(map(mouseX, 0, width,  -PI/36, PI/36));
		}
	}

	canvas_3d.rotateX(letterRotateX);
	canvas_3d.rotateY(letterRotateY);

	// Draw the front side of the letter
	if (is_mobile) {
		let w = Math.max(Math.min(500, windowWidth), 320);
		let h = w*(letter_front_mobile_img.height/letter_front_mobile_img.width);
		//
		canvas_3d.texture(letter_front_mobile_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(-w/2, -h/2, 0, 0, 0);                          							// Top left corner
		canvas_3d.vertex(w/2, -h/2, 0, letter_front_mobile_img.width, 0);               				// Top right corner
		canvas_3d.vertex(w/2, h/2, 0, letter_front_mobile_img.width, letter_front_mobile_img.height);	// Bottom right corner
		canvas_3d.vertex(-w/2, h/2, 0, 0, letter_front_mobile_img.height);               			// Bottom left corner
		canvas_3d.endShape(CLOSE);
	} else {
		let w = 700;
		let h = w*(letter_front_desktop_img.height/letter_front_desktop_img.width);
		//
		canvas_3d.texture(letter_front_desktop_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(-w/2, -h/2, 0, 0, 0);                         								// Top left corner
		canvas_3d.vertex(w/2, -h/2, 0, letter_front_desktop_img.width, 0);               				// Top right corner
		canvas_3d.vertex(w/2, h/2, 0, letter_front_desktop_img.width, letter_front_desktop_img.height);	// Bottom right corner
		canvas_3d.vertex(-w/2, h/2, 0, 0, letter_front_desktop_img.height);          				    // Bottom left corner
		canvas_3d.endShape(CLOSE);
	}

	// Draw the back side of the letter
	if (is_mobile) {
		let w = Math.max(Math.min(500, windowWidth), 320);
		let h = w*(letter_back_mobile_img.height/letter_back_mobile_img.width);
		//
		canvas_3d.texture(letter_back_mobile_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(w/2, -h/2, -0.01, letter_back_mobile_img.width, letter_back_mobile_img.height);                          							// Top left corner
		canvas_3d.vertex(-w/2, -h/2, -0.01, 0, letter_back_mobile_img.height);
		canvas_3d.vertex(-w/2, h/2, -0.01, 0, 0);
		canvas_3d.vertex(w/2, h/2, -0.01, letter_back_mobile_img.width, 0);
		canvas_3d.endShape(CLOSE);
	} else {
		let w = 700;
		let h = w*(letter_back_desktop_img.height/letter_back_desktop_img.width);
		//
		canvas_3d.texture(letter_back_desktop_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(w/2, -h/2, -0.01, letter_back_desktop_img.width, letter_back_desktop_img.height);
		canvas_3d.vertex(-w/2, -h/2, -0.01, 0, letter_back_desktop_img.height);
		canvas_3d.vertex(-w/2, h/2, -0.01, 0, 0);
		canvas_3d.vertex(w/2, h/2, -0.01, letter_back_desktop_img.width, 0);
		canvas_3d.endShape(CLOSE);
	}

	let daggerOffset = 0;
	if (daggerZ > 0) {
		daggerOffset = Math.pow(1.3, daggerZ);
	}

	canvas_3d.translate(260+daggerOffset, -270-daggerOffset, 60+2*daggerOffset);
	canvas_3d.rotateY(-PI/12);
	canvas_3d.rotateZ(PI/4);

	canvas_3d.tint(255, Math.max(0, 255-Math.pow(1.2, daggerZ)));
	canvas_3d.texture(daggerImg);
	canvas_3d.beginShape();
	canvas_3d.vertex(-daggerImg.width/2, -daggerImg.height/2, 10, 0, 0);
	canvas_3d.vertex(daggerImg.width/2, -daggerImg.height/2, 10, daggerImg.width, 0);
	canvas_3d.vertex(daggerImg.width/2, daggerImg.height/2, 10, daggerImg.width, daggerImg.height);
	canvas_3d.vertex(-daggerImg.width/2, daggerImg.height/2, 10, 0, daggerImg.height);
	canvas_3d.endShape(CLOSE);

	canvas_3d.pop();


	if (state === 'letter-fade-in') {
		letterOpacity += 2;
		if (letterY <= 0) {
			letterY = 0;
		} else {
			letterY -= 1.5;
		}
		push();
		tint(255, 255, 255, letterOpacity);
		image(canvas_3d, 0, 0);
		pop();
		if (letterOpacity >= 255 && letterY === 0) {
			state = 'front';
		}
	} else if (state === 'front') {
		// cursor('pointer');
		frontCountdown -= 1;
		if (frontCountdown <= 0) {
			state = 'dagger-out';
		}
		image(canvas_3d, 0, 0);
	} else if (state === 'dagger-out') {
		image(canvas_3d, 0, 0);
		daggerZ += 1;
		if (daggerZ >= 40) {
			state = 'turn-over';
		}
		cursor(ARROW);
	} else if (state === 'turn-over') {
		letterRotateX = Math.max(-PI, letterRotateX-=0.12);
		letterRotateY = Math.min(2*PI, letterRotateY+=0.20);
		image(canvas_3d, 0, 0);
		if (letterRotateX === -PI && letterRotateY === 2*PI) {
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
		}
	}

	if (language === 'unknown') {
		// push();
		// fill(0, 0, 0, 220);
		// rect(0, 0, windowWidth, windowHeight);
		// pop();
		button.position(width/2-button.width-10, height / 2 - button.height / 2);
		buttonEnglish.position(width/2+10, height / 2 - buttonEnglish.height / 2);
	}
}

// function mousePressed() {
// }

function touchEnded() {
	if (next_button_desktop.isClicked() || next_button_mobile.isClicked()) {
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

	resizeCanvas(w, h);
	canvas_3d.resizeCanvas(w, h);
	
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

	console.log('w:', w, "h:", h);
}

function setLanguage(l) {
	language = l;
	state = 'letter-fade-in';
	button.hide();
	buttonEnglish.hide();
}

class Button {
	constructor(inImg, inX, inY, inWidth, inHeight) {
		this.x = inX;
		this.y = inY;
		this.width = inWidth;
		this.height = inHeight;
		this.img = inImg;
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
		if (this.over()) {
			tint(170, 170, 170, this.opacity);
		} else {
			tint(255, this.opacity);
		}
		image(this.img, this.x, this.y, this.width, this.height);
		pop();
	}
	// over automatically matches the width & height of the image read from the file
	// see this.img.width and this.img.height below
	over() {
	  if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
			cursor('pointer')
			return true;
	  } else {
			cursor('default')
			return false;
	  }
	}
	isClicked() {
		if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
			return true;
		} else {
			return false;
		}
	}
  }