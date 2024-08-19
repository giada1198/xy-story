let img;
let angle = 0;
let state = 'init';
let cardCanvas;

let cardOpacity = 1;

let language = 'unknown';

let daggerZ = 0;


// let cardRotateX = Math.PI/24;
// let cardRotateY = Math.PI/24;
let cardRotateX = 0;
let cardRotateY = 0;



let cardY = 200;

let cardWiggleX = 0;
let cardWiggleXPositive = true;
let cardWiggleY = 0;
let cardWiggleYPositive = true;

let frontCountdown = 20;

let button;
let buttonEnglish;


let nextStepButtonImg;
let nextStepButton;

function preload() {
	img = loadImage('assets/ygs-test.png'); // Replace with the path to your image
	img2 = loadImage('assets/ygs-test-3.png'); // Replace with the path to your image
	daggerImg = loadImage('assets/dagger.png');
	nextStepButtonImg = loadImage('assets/next-step-button.png');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	cardCanvas = createGraphics(windowWidth, windowHeight, WEBGL);
	// cardCanvas.position(0, 0);
	cardCanvas.noStroke();

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

	
	nextStepButton = new Button(nextStepButtonImg, windowWidth/2-150, windowHeight/2+138, 300, 54);
}

function draw() {
	background(0);

	cardCanvas.clear();
	cardCanvas.push();
	cardCanvas.translate(0, cardY, 0);
	// console.log(cardY);

	if (state === 'back') {

		if (cardWiggleXPositive) {
			cardWiggleX += (PI/72)/60;
		} else {
			cardWiggleX -= (PI/72)/60;
		}

		if (cardWiggleYPositive) {
			cardWiggleY += (PI/60)/80;
		} else {
			cardWiggleY -= (PI/60)/80;
		}

		if (cardWiggleX >= PI/60) {
			cardWiggleXPositive = false;
		} else if (cardWiggleX <= -PI/60) {
			cardWiggleXPositive = true;
		}

		if (cardWiggleY >= PI/60) {
			cardWiggleYPositive = false;
		} else if (cardWiggleY <= -PI/60) {
			cardWiggleYPositive = true;
		}

		cardCanvas.rotateX(cardWiggleX);
		cardCanvas.rotateY(cardWiggleY);

		if (state === 'back') {
			let x = map(mouseY, 0, height, -PI/36, PI/36);
			let y = map(mouseX, 0, width, -PI/36, PI/36);
			cardCanvas.rotateX(x);
			cardCanvas.rotateY(y);
		}		
	}

	cardCanvas.rotateX(cardRotateX);
	cardCanvas.rotateY(cardRotateY);

	// console.log(img.width, img.height);

	// Set the plane's width and height based on the image's aspect ratio


	let planeWidth = img.width;
	let planeHeight = img.height; // Arbitrary height for the plane


	


	// Draw the plane with the scaled texture to fit the entire image
	cardCanvas.texture(img);
	cardCanvas.beginShape();
	cardCanvas.vertex(-planeWidth/2, -planeHeight/2, 0, 0, 0);                          // Top left corner
	cardCanvas.vertex(planeWidth/2, -planeHeight/2, 0, img.width, 0);               // Top right corner
	cardCanvas.vertex(planeWidth/2, planeHeight/2, 0, img.width, img.height);    // Bottom right corner
	cardCanvas.vertex(-planeWidth/2, planeHeight/2, 0, 0, img.height);               // Bottom left corner
	cardCanvas.endShape(CLOSE);

	cardCanvas.texture(img2);
	cardCanvas.beginShape();
	cardCanvas.vertex(planeWidth/2, -planeHeight/2, -0.01, img2.width, img2.height);               // Top left corner
	cardCanvas.vertex(-planeWidth/2, -planeHeight/2, -0.01, 0, img2.height);                          // Top right corner
	cardCanvas.vertex(-planeWidth/2, planeHeight/2, -0.01, 0, 0);               // Bottom right corner
	cardCanvas.vertex(planeWidth/2, planeHeight/2, -0.01, img2.width, 0);    // Bottom left corner
	cardCanvas.endShape(CLOSE);
	
	let daggerOffset = 0;
	if (daggerZ > 0) {
		daggerOffset = Math.pow(1.3, daggerZ);
	}

	cardCanvas.translate(260+daggerOffset, -270-daggerOffset, 60+2*daggerOffset);
	cardCanvas.rotateY(-PI/12);
	cardCanvas.rotateZ(PI/4);

	cardCanvas.tint(255, Math.max(0, 255-Math.pow(1.2, daggerZ)));
	cardCanvas.texture(daggerImg);
	cardCanvas.beginShape();
	cardCanvas.vertex(-daggerImg.width/2, -daggerImg.height/2, 10, 0, 0);               // Top left corner
	cardCanvas.vertex(daggerImg.width/2, -daggerImg.height/2, 10, daggerImg.width, 0);                          // Top right corner
	cardCanvas.vertex(daggerImg.width/2, daggerImg.height/2, 10, daggerImg.width, daggerImg.height);               // Bottom right corner
	cardCanvas.vertex(-daggerImg.width/2, daggerImg.height/2, 10, 0, daggerImg.height);    // Bottom left corner
	cardCanvas.endShape(CLOSE);

	cardCanvas.pop();

	// cardCanvas.pop();

	if (state === 'card-fade-in') {
		cardOpacity += 1.5
		if (cardY <= 0) {
			cardY = 0;
		} else {
			cardY -= 2.5;
		}
		push();
		tint(255, 255, 255, cardOpacity);
		image(cardCanvas, 0, 0);
		pop();
		if (cardOpacity >= 255 && cardY === 0) {
			state = 'front';
		}
	} else if (state === 'front') {
		// cursor('pointer');
		frontCountdown -= 1;
		if (frontCountdown <= 0) {
			state = 'dagger-out';
		}
		image(cardCanvas, 0, 0);
	} else if (state === 'dagger-out') {
		image(cardCanvas, 0, 0);
		daggerZ += 1;
		if (daggerZ >= 40) {
			state = 'turn-over';
		}
		cursor(ARROW);
	} else if (state === 'turn-over') {
		cardRotateX = Math.max(-PI, cardRotateX-=0.12);
		cardRotateY = Math.min(2*PI, cardRotateY+=0.20);
		image(cardCanvas, 0, 0);
		if (cardRotateX === -PI && cardRotateY === 2*PI) {
			state = 'back'
		}
	} else if (state === 'back') {
		image(cardCanvas, 0, 0);
		if (nextStepButton.opacity <= 255) {
			nextStepButton.opacity = Math.min(255, nextStepButton.opacity += 10);
		}
		nextStepButton.display();
	}
	
	if (language === 'unknown') {
		// push();
		// fill(0, 0, 0, 220);
		// rect(0, 0, windowWidth, windowHeight);
		// pop();
		button.position(width/2-button.width-10, height / 2 - button.height / 2);
		buttonEnglish.position(width/2+10, height / 2 - buttonEnglish.height / 2);
	}

	// console.log(cardOpacity);
}

// function mousePressed() {
// 	if (nextStepButton.clicked()) {
// 		console.log('hello');
// 	}
// }

function touchEnded() {
	if (nextStepButton.isClicked()) {
		window.open("https://mail.google.com");
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	cardCanvas.resizeCanvas(windowWidth, windowHeight);
	nextStepButton.position(windowWidth/2-150, windowHeight/2+138);


}

function setLanguage(l) {
	language = l;
	state = 'card-fade-in';
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
	display() {
		stroke(0);
		// tint the image on mouse hover
		push();
		if (this.over()) {
			tint(200, 200, 200, this.opacity);
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