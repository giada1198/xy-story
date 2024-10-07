let state = 'init';
let language = 'tc';
let is_mobile;

let canvas_3d;

let letter_front_desktop_img, letter_back_desktop_img, letter_back_desktop_en_img;
let letter_front_mobile_img, letter_back_mobile_img;
let dagger_img;



let card_inner_left_img, card_inner_center_img, card_inner_right_img, card_inner_bottom_img;


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
	let w = 1440;
	let h = 1024;
	createCanvas(w, h);
	canvas_3d = createGraphics(w, h, WEBGL);
	canvas_3d.noStroke();

}

function draw() {
	background(0);
	canvas_3d.clear();
	canvas_3d.push();



	let w = card_inner_left_img.width/dpi_multiple;
	let h = card_inner_left_img.height/dpi_multiple;

	let w_center = card_inner_center_img.width/dpi_multiple;
	let h_center = card_inner_center_img.height/dpi_multiple;

	canvas_3d.texture(card_inner_left_img);
	canvas_3d.beginShape();
	canvas_3d.vertex(-w-w_center/2, -h/2, 0, 0, 0);                         									// Top left corner
	canvas_3d.vertex(-w_center/2, -h/2, 0, card_inner_left_img.width, 0);               				// Top right corner
	canvas_3d.vertex(-w_center/2, h/2, 0, card_inner_left_img.width, card_inner_left_img.height);	// Bottom right corner
	canvas_3d.vertex(-w-w_center/2, h/2, 0, 0, card_inner_left_img.height);          				    // Bottom left corner
	canvas_3d.endShape(CLOSE);

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

	image(canvas_3d, 0, 0);


}