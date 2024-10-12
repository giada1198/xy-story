let state = 'init';
let is_mobile;

let canvas_3d;

let card_inner_left_img, card_inner_center_img, card_inner_right_img, card_inner_bottom_img;
let card_outer_left_img, card_outer_center_img, card_outer_right_img, card_outer_bottom_img;
let card_left_rotateY, card_right_rotateY, card_bottom_rotateX;

let ticket_front_img, ticket_back_img;
let ticket_y, ticket_z, ticket_rotateX, ticket_opacity;

let receipt_top_img, receipt_bottom_img;
let receipt_y, receipt_z, receipt_opacity, receipt_top_rotateZ, receipt_bottom_rotateX;

let zoom_in_button, zoom_in_button_img;
let zoom_out_button, zoom_out_button_img;
let rotate_button, rotate_button_img;

let tab_ticket, tab_ticket_img, tab_ticket_selected_img;
let tab_open, tab_open_img, tab_open_selected_img;
let tab_closed, tab_closed_img, tab_closed_selected_img;
let tab_receipt, tab_receipt_img, tab_receipt_selected_img;
let tabs_background_img;

let cam;
let isDragging = false;
let is_touching = false;
let lastX, lastY;
let last_touchX, last_touchY;

let cam_angle;

let prevDist = -1;

let target_eyeZ = 800;
const min_eyeZ = 200;
const max_eyeZ = 1200;


let card_opacity = 0;

let tabs = [];

let ui_padding, ui_spacing;
const dpi_multiple = 3;

function preload() {
	// card inner
	card_inner_left_img = loadImage('assets/card/card-inner-left.png');
	card_inner_center_img = loadImage('assets/card/card-inner-center.png');
	card_inner_right_img = loadImage('assets/card/card-inner-right.png');
	card_inner_bottom_img = loadImage('assets/card/card-inner-bottom.png');
	// card outer
	card_outer_left_img = loadImage('assets/card/card-outer-left.png');
	card_outer_center_img = loadImage('assets/card/card-outer-center.png');
	card_outer_right_img = loadImage('assets/card/card-outer-right.png');
	card_outer_bottom_img = loadImage('assets/card/card-outer-bottom.png');
	// ticket
	ticket_front_img = loadImage('assets/card/ticket-front.png');
	ticket_back_img = loadImage('assets/card/ticket-back.png');
	// receipt
	receipt_top_img = loadImage('assets/card/receipt-top.png');
	receipt_bottom_img = loadImage('assets/card/receipt-bottom.png');
	// buttons
	zoom_in_button_img = loadImage('assets/card/button-zoom-in.png');
	zoom_out_button_img = loadImage('assets/card/button-zoom-out.png');
	rotate_button_img = loadImage('assets/card/button-rotate.png');
	// tabs
	tab_ticket_img = loadImage('assets/card/tab-ticket-default.png');
	tab_ticket_selected_img = loadImage('assets/card/tab-ticket-selected.png');
	tab_open_img = loadImage('assets/card/tab-open-default.png');
	tab_open_selected_img = loadImage('assets/card/tab-open-selected.png');
	tab_closed_img = loadImage('assets/card/tab-closed-default.png');
	tab_closed_selected_img = loadImage('assets/card/tab-closed-selected.png');
	tab_receipt_img = loadImage('assets/card/tab-receipt-default.png');
	tab_receipt_selected_img = loadImage('assets/card/tab-receipt-selected.png');
	tabs_background_img = loadImage('assets/card/tabs-background.png');
}

function setup() {
	is_mobile = (windowWidth <= 1020) ? true : false;
	let w = Math.max(320, windowWidth);
	let h = Math.max(240, windowHeight);
	createCanvas(w, h);
	canvas_3d = createGraphics(w, h, WEBGL);
	canvas_3d.noStroke();
	cam = canvas_3d.createCamera();
	cam.setPosition(0, -300, 800);
	cam_angle = 0.5*PI;

	ui_padding = (is_mobile) ? 16 : 24;
	ui_spacing = 8;

	card_left_rotateY = PI;
	card_right_rotateY = -PI;
	card_bottom_rotateX = 0.99*PI;

	ticket_y = 0;
	ticket_z = 0.03;
	ticket_rotateX = 0;
	ticket_opacity = 255;

	receipt_y = 0;
	receipt_z = 0;
	receipt_opacity = 255;
	receipt_top_rotateZ = 0.5*PI;
	receipt_bottom_rotateX = -PI;

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

	// tab: open
	bw = tab_open_img.width/dpi_multiple;
	bh = tab_open_img.height/dpi_multiple;
	x = width/2-bw*2;
	y = height-ui_padding-bh-4;
	tab_open = new Tab(tab_open_img, tab_open_selected_img, x, y, bw, bh, go_to_carrier_open);
	tab_open.state = 'hidden';
	tabs.push(tab_open);

	// tab: closed
	bw = tab_closed_img.width/dpi_multiple;
	bh = tab_closed_img.height/dpi_multiple;
	x = width/2-bw;
	y = height-ui_padding-bh-4;
	tab_closed = new Tab(tab_closed_img, tab_closed_selected_img, x, y, bw, bh, go_to_carrier_closed);
	tab_closed.state = 'hidden';
	tabs.push(tab_closed);

	// tab: ticket
	bw = tab_ticket_img.width/dpi_multiple;
	bh = tab_ticket_img.height/dpi_multiple;
	x = width/2+4;
	y = height-ui_padding-bh-4;
	tab_ticket = new Tab(tab_ticket_img, tab_ticket_selected_img, x, y, bw, bh, go_to_ticket);
	tab_ticket.state = 'hidden';
	tabs.push(tab_ticket);

	// tab: receipt
	bw = tab_receipt_img.width/dpi_multiple;
	bh = tab_receipt_img.height/dpi_multiple;
	x = width/2+bw;
	y = height-ui_padding-bh-4;
	tab_receipt = new Tab(tab_receipt_img, tab_receipt_selected_img, x, y, bw, bh, go_to_receipt);
	tab_receipt.state = 'hidden';
	tabs.push(tab_receipt);
}

function draw() {
	background(0);
	canvas_3d.clear();
	if (!['ticket-front', 'ticket-front-to-back-reset', 'ticket-front-to-back', 'ticket-back', 'ticket-back-to-front-reset', 'ticket-back-to-front','receipt'].includes(state)) {
		// card center dimensions
		let w_center = (is_mobile) ? width*(510/1020) : card_inner_center_img.width/dpi_multiple;
		let h_center = (is_mobile) ? w_center*(card_inner_center_img.height/card_inner_center_img.width) : card_inner_center_img.height/dpi_multiple;

		// card left dimensions
		let w = (is_mobile) ? width*(255/1020) : card_inner_left_img.width/dpi_multiple;
		let h = (is_mobile) ? w*(card_inner_left_img.height/card_inner_left_img.width) : card_inner_left_img.height/dpi_multiple;

		// card left inner
		canvas_3d.push();
		canvas_3d.texture(card_inner_left_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(-w, -h/2, -0.04, 0, 0);                         						// Top left corner
		canvas_3d.vertex(0, -h/2, -0.04, card_inner_left_img.width, 0);               			// Top right corner
		canvas_3d.vertex(0, h/2, -0.04, card_inner_left_img.width, card_inner_left_img.height);	// Bottom right corner
		canvas_3d.vertex(-w, h/2, -0.04, 0, card_inner_left_img.height);          				// Bottom left corner
		canvas_3d.translate(-w_center/2, 0, 0);
		canvas_3d.rotateY(card_left_rotateY);
		canvas_3d.endShape(CLOSE);
		canvas_3d.pop();

		// card left outer
		canvas_3d.push();
		canvas_3d.texture(card_outer_left_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(0, -h/2, -0.05, 0, 0);
		canvas_3d.vertex(-w, -h/2, -0.05, card_inner_left_img.width, 0);
		canvas_3d.vertex(-w, h/2, -0.05, card_inner_left_img.width, card_inner_left_img.height);
		canvas_3d.vertex(0, h/2, -0.05, 0, card_inner_left_img.height);
		canvas_3d.translate(-w_center/2, 0, 0);
		canvas_3d.rotateY(card_left_rotateY);
		canvas_3d.endShape(CLOSE);
		canvas_3d.pop();

		// card left dimensions
		w = (is_mobile) ? width*(255/1020) : card_inner_right_img.width/dpi_multiple;
		h = (is_mobile) ? w*(card_inner_right_img.height/card_inner_right_img.width) : card_inner_right_img.height/dpi_multiple;

		// card right inner
		canvas_3d.push();
		canvas_3d.texture(card_inner_right_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(0, -h/2, -0.04, 0, 0);                         							// Top left corner
		canvas_3d.vertex(w, -h/2, -0.04, card_inner_right_img.width, 0);               				// Top right corner
		canvas_3d.vertex(w, h/2, -0.04, card_inner_right_img.width, card_inner_right_img.height);	// Bottom right corner
		canvas_3d.vertex(0, h/2, -0.04, 0, card_inner_right_img.height);          				    // Bottom left corner
		canvas_3d.translate(w_center/2, 0, 0);
		canvas_3d.rotateY(card_right_rotateY);
		canvas_3d.endShape(CLOSE);
		canvas_3d.pop();

		// card right outer
		canvas_3d.push();
		canvas_3d.texture(card_outer_right_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(w, -h/2, -0.05, 0, 0);                         							// Top left corner
		canvas_3d.vertex(0, -h/2, -0.05, card_inner_right_img.width, 0);               				// Top right corner
		canvas_3d.vertex(0, h/2, -0.05, card_inner_right_img.width, card_inner_right_img.height);	// Bottom right corner
		canvas_3d.vertex(w, h/2, -0.05, 0, card_inner_right_img.height);          				    // Bottom left corner
		canvas_3d.translate(w_center/2, 0.04, 0);
		canvas_3d.rotateY(card_right_rotateY);
		canvas_3d.endShape(CLOSE);
		canvas_3d.pop();

		// card center inner
		canvas_3d.push();
		canvas_3d.texture(card_inner_center_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(-w_center/2, -h_center/2, -0.05, 0, 0);                         									// Top left corner
		canvas_3d.vertex(w_center/2, -h_center/2, -0.05, card_inner_center_img.width, 0);               				// Top right corner
		canvas_3d.vertex(w_center/2, h_center/2, -0.05, card_inner_center_img.width, card_inner_center_img.height);	// Bottom right corner
		canvas_3d.vertex(-w_center/2, h_center/2, -0.05, 0, card_inner_center_img.height);          				    // Bottom left corner
		canvas_3d.endShape(CLOSE);
		canvas_3d.pop();

		// card center outer
		canvas_3d.push();
		canvas_3d.texture(card_outer_center_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(w_center/2, -h_center/2, -0.06, 0, 0);                         									// Top left corner
		canvas_3d.vertex(-w_center/2, -h_center/2, -0.06, card_inner_center_img.width, 0);               				// Top right corner
		canvas_3d.vertex(-w_center/2, h_center/2, -0.06, card_inner_center_img.width, card_inner_center_img.height);	// Bottom right corner
		canvas_3d.vertex(w_center/2, h_center/2, -0.06, 0, card_inner_center_img.height);          				    // Bottom left corner
		canvas_3d.endShape(CLOSE);
		canvas_3d.pop();

		// card bottom dimensions
		let w_bottom = (is_mobile) ? width*(510/1020) : card_inner_bottom_img.width/dpi_multiple;
		let h_bottom = (is_mobile) ? w_center*(card_inner_bottom_img.height/card_inner_bottom_img.width) : card_inner_bottom_img.height/dpi_multiple;

		// card bottom inner
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

		// card bottom outer
		canvas_3d.push();
		canvas_3d.texture(card_outer_bottom_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(-w_bottom/2, h_bottom, -0.5, 0, 0);                         									// Top left corner
		canvas_3d.vertex(w_bottom/2, h_bottom, -0.5, card_inner_bottom_img.width, 0);               				// Top right corner
		canvas_3d.vertex(w_bottom/2, 0, -0.5, card_inner_bottom_img.width, card_inner_bottom_img.height);	// Bottom right corner
		canvas_3d.vertex(-w_bottom/2, 0, 0, -0.5, card_inner_bottom_img.height);          				    // Bottom left corner
		canvas_3d.translate(0, h_center/2, 0);
		canvas_3d.rotateX(card_bottom_rotateX);
		canvas_3d.endShape(CLOSE);
		canvas_3d.pop();
	}
	
	if (['unfold-sides', 'ticket-out', 'ticket-front', 'ticket-front-to-back-reset', 'ticket-front-to-back', 'ticket-back', 'ticket-back-to-front-reset', 'ticket-back-to-front'].includes(state)) {
		// ticket dimensions
		let w_ticket = (is_mobile) ? width*(450/1020) : ticket_front_img.width/dpi_multiple;
		let h_ticket = (is_mobile) ? w_ticket*(ticket_front_img.height/ticket_front_img.width) : ticket_front_img.height/dpi_multiple;

		// ticket front
		canvas_3d.push();
		canvas_3d.tint(255, 255, 255, ticket_opacity);
		canvas_3d.texture(ticket_front_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(-w_ticket/2, -h_ticket/2+ticket_y, ticket_z, 0, 0);                         									// Top left corner
		canvas_3d.vertex(w_ticket/2, -h_ticket/2+ticket_y, ticket_z, ticket_front_img.width, 0);               				// Top right corner
		canvas_3d.vertex(w_ticket/2, h_ticket/2+ticket_y, ticket_z, ticket_front_img.width, ticket_front_img.height);	// Bottom right corner
		canvas_3d.vertex(-w_ticket/2, h_ticket/2+ticket_y, ticket_z, 0, ticket_front_img.height);          				    // Bottom left corner
		// canvas_3d.rotateX(ticket_rotateX);
		canvas_3d.endShape(CLOSE);
		canvas_3d.pop();

		// ticket back
		if (['ticket-front-to-back', 'ticket-back', 'ticket-back-to-front-reset', 'ticket-back-to-front'].includes(state)) {
			canvas_3d.push();
			canvas_3d.texture(ticket_back_img);
			canvas_3d.beginShape();
			canvas_3d.vertex(w_ticket/2, -h_ticket/2, -0.01, 0, 0);                         									// Top left corner
			canvas_3d.vertex(-w_ticket/2, -h_ticket/2, -0.01, ticket_back_img.width, 0);               				// Top right corner
			canvas_3d.vertex(-w_ticket/2, h_ticket/2, -0.01, ticket_back_img.width, ticket_back_img.height);	// Bottom right corner
			canvas_3d.vertex(w_ticket/2, h_ticket/2, -0.01, 0, ticket_back_img.height);          				    // Bottom left corner
			canvas_3d.endShape(CLOSE);
			canvas_3d.pop();
		}
	}

	if (['ticket-out', 'receipt-rise', 'receipt-unfold-out', 'receipt'].includes(state)) {
		// receipt dimensions
		let h_receipt_top = (is_mobile) ? width*(450/1020) : receipt_top_img.height/dpi_multiple;
		let h_receipt_bottom = (is_mobile) ? width*(234/1020) : receipt_bottom_img.height/dpi_multiple;
		let w_receipt = (is_mobile) ? h_receipt_top*(receipt_top_img.width/receipt_top_img.height) : receipt_top_img.width/dpi_multiple;

		// receipt top
		canvas_3d.push();
		canvas_3d.tint(255, 255, 255, receipt_opacity);
		canvas_3d.texture(receipt_top_img);
		canvas_3d.beginShape();
		canvas_3d.vertex(-w_receipt/2, -h_receipt_top/2+receipt_y, receipt_z+0.02, 0, 0);                         									// Top left corner
		canvas_3d.vertex(w_receipt/2, -h_receipt_top/2+receipt_y, receipt_z+0.02, receipt_top_img.width, 0);               				// Top right corner
		canvas_3d.vertex(w_receipt/2, h_receipt_top/2+receipt_y, receipt_z+0.02, receipt_top_img.width, receipt_top_img.height);	// Bottom right corner
		canvas_3d.vertex(-w_receipt/2, h_receipt_top/2+receipt_y, receipt_z+0.02, 0, receipt_top_img.height);          				    // Bottom left corner
		canvas_3d.rotateZ(receipt_top_rotateZ);
		canvas_3d.endShape(CLOSE);
		canvas_3d.pop();

		// receipt bottom
		if (['receipt-unfold-out', 'receipt'].includes(state)) {
			canvas_3d.push();
			canvas_3d.tint(255, 255, 255, receipt_opacity);
			canvas_3d.texture(receipt_bottom_img);
			canvas_3d.beginShape();
			canvas_3d.vertex(-w_receipt/2, 0, 0.01, 0, 0);                         									// Top left corner
			canvas_3d.vertex(w_receipt/2, 0, 0.01, receipt_bottom_img.width, 0);               				// Top right corner
			canvas_3d.vertex(w_receipt/2, h_receipt_bottom, 0.01, receipt_bottom_img.width, receipt_bottom_img.height);	// Bottom right corner
			canvas_3d.vertex(-w_receipt/2, h_receipt_bottom, 0.01, 0, receipt_bottom_img.height);          				    // Bottom left corner
			canvas_3d.translate(0, h_receipt_top/2+receipt_y, receipt_z);
			canvas_3d.rotateX(receipt_bottom_rotateX);
			canvas_3d.endShape(CLOSE);
			canvas_3d.pop();
		}
	}

	if (isDragging) {
		let dx = mouseX - lastX;
		let dy = mouseY - lastY;
		let d = Math.abs(cam.eyeZ);
		cam.move(-dx*(d/800), -dy*(d/800), 0);
		console.log('drag', dx, dy);
	}
	lastX = mouseX;
	lastY = mouseY;

	if (is_touching && touches.length > 0) {
		let dx = touches[0].x - last_touchX;
		let dy = touches[0].y - last_touchY;
		// adjust camera based on touch drag
		let d = Math.abs(cam.eyeZ);
		cam.move(-dx*(d/800), -dy*(d/800), 0);
		console.log('touch', dx, dy);
	}

	if (touches.length > 0) {
		last_touchX = touches[0].x;
		last_touchY = touches[0].y;
	}

	push();
	tint(255, 255, 255, card_opacity);
	image(canvas_3d, 0, 0);
	pop();

	if (!['init', 'unfold-bottom', 'unfold-sides', 'ticket-out', 'receipt-rise', 'receipt-unfold-out'].includes(state)) {
		// draw buttons
		zoom_in_button.display();
		zoom_out_button.display();
		if (state !== 'receipt') {
			rotate_button.display();
		}

		// draw background for tabs
		let bw = tabs_background_img.width/dpi_multiple;
		let bh = tabs_background_img.height/dpi_multiple;
		push();
		image(tabs_background_img, width/2-bw/2, height-ui_padding-bh, bw, bh);
		pop();

		// draw tabs
		tabs.forEach(tab => {
			tab.display();
		});
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
			state = 'ticket-out';
		}
	} else if (state === 'ticket-out') {
		if (ticket_opacity <= 0 || ticket_y <= -1000) {
			ticket_y = -1000;
			ticket_opacity -= 0;
			state = 'receipt-rise';
		} else {
			ticket_y -= 10;
			if (ticket_y <= -500) {
				ticket_opacity -= 5;
			}
			// // fancy fly out path
			// ticket_z += 5;
			// if (ticket_rotateX > -0.25*PI) {
			// 	ticket_rotateX -= 0.0025*PI;
			// } 
		}
	} else if (state === 'receipt-rise') {
		if (receipt_z >= 200 && receipt_top_rotateZ <= 0) {
			receipt_z = 200;
			receipt_top_rotateZ = 0;
			state = 'receipt-unfold-out';
		} else {
			receipt_z += 5
			receipt_top_rotateZ -= 0.5*PI/40;
		}
	} else if (state === 'receipt-unfold-out') {
		if (receipt_opacity <= 0 || receipt_y <= -1000) {
			receipt_y = -1000;
			ticket_opacity -= 0;
			state = 'carrier-open-front';
			tabs.forEach(tab => {
				tab.state = 'default';
			});
			tab_open.state = 'selected';
		} else {
			if (receipt_bottom_rotateX >= 0) {
				receipt_bottom_rotateX = 0
			} else {
				receipt_bottom_rotateX += 0.02*PI;
			}
			if (receipt_bottom_rotateX >= -0.1*PI) {
				receipt_y -= 10;
				if (receipt_y <= -500) {
					receipt_opacity -= 5;
				}
			}
		}
	} else if (state === 'carrier-open-front') {
		move_camera_eyeZ();
	} else if (state === 'carrier-open-front-to-back-reset') {
		if (card_opacity === 0 || (cam.eyeX === 0 && cam.eyeY === 0 && cam.eyeZ === 800)) {
			// console.log(card_opacity, cam.eyeX, cam.eyeY, cam.eyeZ);
			state = 'carrier-open-front-to-back';
			cam.setPosition(0, 0, 800);
			target_eyeZ = -800;
		} else {
			card_opacity = Math.max(0, card_opacity-25);
		}
	} else if (state === 'carrier-open-front-to-back') {
		let a = (cam_angle+0.01*PI)%(2*PI);
		if (card_opacity === 255 && a > 1.5*PI) {
			cam_angle = 1.5*PI;
			cam.setPosition(0, 0, -800);
			state = 'carrier-open-back';
		} else {
			cam_angle = a;
			let ax = 800*cos(cam_angle);
			let az = 800*sin(cam_angle);
			cam.setPosition(ax, 0, az);
			card_opacity = Math.min(255, card_opacity+3);
		}
		cam.lookAt(0, 0, 0);
	} else if (state === 'carrier-open-back') {
		move_camera_eyeZ();
	} else if (state === 'carrier-open-back-to-front-reset') {
		if (card_opacity === 0 || (cam.eyeX === 0 && cam.eyeY === 0 && cam.eyeZ === -800)) {
			state = 'carrier-open-back-to-front';
			cam.setPosition(0, 0, -800);
			target_eyeZ = 800;
		} else {
			card_opacity = Math.max(0, card_opacity-25);
		}
	} else if (state === 'carrier-open-back-to-front') {
		let a = (cam_angle+0.01*PI)%(2*PI);
		if (card_opacity === 255 && a >= 0.5*PI && a <= 0.6*PI) {
			cam_angle = 0.5*PI;
			cam.setPosition(0, 0, 800);
			state = 'carrier-open-front';
		} else {
			cam_angle = a;
			let ax = 800*cos(cam_angle);
			let az = 800*sin(cam_angle);
			cam.setPosition(ax, 0, az);
			card_opacity = Math.min(255, card_opacity+3);
		}
		cam.lookAt(0, 0, 0);
	} else if (state === 'carrier-closed-front') {
		move_camera_eyeZ();
	} else if (state === 'carrier-closed-front-to-back-reset') {
		if (card_opacity === 0 || (cam.eyeX === 0 && cam.eyeY === 0 && cam.eyeZ === 800)) {
			state = 'carrier-closed-front-to-back';
			cam.setPosition(0, 0, 800);
			target_eyeZ = -800;
		} else {
			card_opacity = Math.max(0, card_opacity-25);
		}
	} else if (state === 'carrier-closed-front-to-back') {
		let a = (cam_angle+0.01*PI)%(2*PI);
		if (card_opacity === 255 && a > 1.5*PI) {
			cam_angle = 1.5*PI;
			cam.setPosition(0, 0, -800);
			state = 'carrier-closed-back';
		} else {
			cam_angle = a;
			let ax = 800*cos(cam_angle);
			let az = 800*sin(cam_angle);
			cam.setPosition(ax, 0, az);
			card_opacity = Math.min(255, card_opacity+3);
		}
		cam.lookAt(0, 0, 0);
	} else if (state === 'carrier-closed-back') {
		move_camera_eyeZ();
	} else if (state === 'carrier-closed-back-to-front-reset') {
		if (card_opacity === 0 || (cam.eyeX === 0 && cam.eyeY === 0 && cam.eyeZ === -800)) {
			state = 'carrier-closed-back-to-front';
			cam.setPosition(0, 0, -800);
			target_eyeZ = 800;
		} else {
			card_opacity = Math.max(0, card_opacity-25);
		}
	} else if (state === 'carrier-closed-back-to-front') {
		let a = (cam_angle+0.01*PI)%(2*PI);
		if (card_opacity === 255 && a >= 0.5*PI && a <= 0.6*PI) {
			cam_angle = 0.5*PI;
			cam.setPosition(0, 0, 800);
			state = 'carrier-closed-front';
		} else {
			cam_angle = a;
			let ax = 800*cos(cam_angle);
			let az = 800*sin(cam_angle);
			cam.setPosition(ax, 0, az);
			card_opacity = Math.min(255, card_opacity+3);
		}
		cam.lookAt(0, 0, 0);
	} else if (state === 'ticket-front') {
		move_camera_eyeZ();
	} else if (state === 'ticket-front-to-back-reset') {
		if (ticket_opacity === 0 || (cam.eyeX === 0 && cam.eyeY === 0 && cam.eyeZ === 800)) {
			state = 'ticket-front-to-back';
			cam.setPosition(0, 0, 800);
			target_eyeZ = -800;
		} else {
			ticket_opacity = Math.max(0, ticket_opacity-25);
		}
	} else if (state === 'ticket-front-to-back') {
		let a = (cam_angle+0.01*PI)%(2*PI);
		if (ticket_opacity === 255 && a > 1.5*PI) {
			cam_angle = 1.5*PI;
			cam.setPosition(0, 0, -800);
			state = 'ticket-back';
		} else {
			cam_angle = a;
			let ax = 800*cos(cam_angle);
			let az = 800*sin(cam_angle);
			cam.setPosition(ax, 0, az);
			ticket_opacity = Math.min(255, ticket_opacity+3);
		}
		cam.lookAt(0, 0, 0);
	} else if (state === 'ticket-back') {
		move_camera_eyeZ();
	} else if (state === 'ticket-back-to-front-reset') {
		if (ticket_opacity === 0 || (cam.eyeX === 0 && cam.eyeY === 0 && cam.eyeZ === -800)) {
			state = 'ticket-back-to-front';
			cam.setPosition(0, 0, -800);
			target_eyeZ = 800;
		} else {
			ticket_opacity = Math.max(0, ticket_opacity-25);
		}
	} else if (state === 'ticket-back-to-front') {
		let a = (cam_angle+0.01*PI)%(2*PI);
		if (ticket_opacity === 255 && a >= 0.5*PI && a <= 0.6*PI) {
			cam_angle = 0.5*PI;
			cam.setPosition(0, 0, 800);
			state = 'ticket-front';
		} else {
			cam_angle = a;
			let ax = 800*cos(cam_angle);
			let az = 800*sin(cam_angle);
			cam.setPosition(ax, 0, az);
			ticket_opacity = Math.min(255, ticket_opacity+3);
		}
		cam.lookAt(0, 0, 0);
	} else if (state === 'receipt') {
		move_camera_eyeZ();
	}
	if (zoom_in_button.is_hovered() || zoom_out_button.is_hovered() || rotate_button.is_hovered()) {
		cursor('pointer');
	} else if (isDragging){
		cursor('grabbing');
	} else {
		// cursor('grab');
	}

	// Pinch-to-zoom detection (for touch)
	// if (touches.length == 2) {
	// 	let currDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
		
	// 	if (prevDist > 0) {
	// 		let zoomAmount = (prevDist - currDist) * 0.05; // Sensitivity for zoom
	// 		cam.move(0, 0, zoomAmount);  // Adjust camera zoom along Z-axis
	// 	}
		
	// 	prevDist = currDist;  // Update previous distance for next frame
	// } else {
	// 	prevDist = -1;  // Reset when not pinching
	// }
}

function mousePressed() {
	let should_continue = true;
	tabs.forEach(tab => {
		if (tab.is_hovered()) {
			tab.clicked();
			should_continue = false;
		}
	});
	// zoom in button
	if (!should_continue) {
		return;
	} else if (zoom_in_button.is_hovered()) {
		zoom_in();
	// zoom out button
	} else if (zoom_out_button.is_hovered()) {
		zoom_out();
	// rotate button
	} else if (rotate_button.is_hovered()) {
		if (state === 'carrier-open-front') {
			state = 'carrier-open-front-to-back-reset';
			target_eyeZ = 800;
		} else if (state === 'carrier-open-back') {
			state = 'carrier-open-back-to-front-reset';
			target_eyeZ = -800;
		} else if (state === 'carrier-closed-front') {
			state = 'carrier-closed-front-to-back-reset';
			target_eyeZ = 800;
		} else if (state === 'carrier-closed-back') {
			state = 'carrier-closed-back-to-front-reset';
			target_eyeZ = -800;
		} else if (state === 'ticket-front') {
			state = 'ticket-front-to-back-reset';
			target_eyeZ = 800;
		} else if (state === 'ticket-back') {
			state = 'ticket-back-to-front-reset';
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
	if (state === 'carrier-open-front') {
		let z = cam.eyeZ + event.delta;
		if (z > max_eyeZ) {
			target_eyeZ = max_eyeZ;
		} else if (z < min_eyeZ) {
			target_eyeZ = min_eyeZ;
		} else {
			target_eyeZ = z;
		}
		cam.setPosition(cam.eyeX, cam.eyeY, target_eyeZ);
	} else if (state === 'carrier-open-back') {
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
	is_touching = true;
	if (touches.length > 0) {
		last_touchX = touches[0].x;
		last_touchY = touches[0].y;
	}
}

function touchEnded() {
	let should_continue = true;
	is_touching = false;
	tabs.forEach(tab => {
		if (tab.is_hovered()) {
			tab.clicked();
			should_continue = false;
		}
	});
	// zoom in button
	if (!should_continue) {
		return;
	// zoom in button
	} else if (zoom_in_button.is_hovered()) {
		zoom_in();
	// zoom out button
	} else if (zoom_out_button.is_hovered()) {
		zoom_out();
	// rotate button
	} else if (rotate_button.is_hovered()) {
		if (state === 'carrier-open-front') {
			state = 'carrier-open-front-to-back-reset';
			target_eyeZ = 800;
		} else if (state === 'carrier-open-back') {
			state = 'carrier-open-back-to-front-reset';
			target_eyeZ = -800;
		} else if (state === 'carrier-closed-front') {
			state = 'carrier-closed-front-to-back-reset';
			target_eyeZ = 800;
		} else if (state === 'carrier-closed-back') {
			state = 'carrier-closed-back-to-front-reset';
			target_eyeZ = -800;
		} else if (state === 'ticket-front') {
			state = 'ticket-front-to-back-reset';
			target_eyeZ = 800;
		} else if (state === 'ticket-back') {
			state = 'ticket-back-to-front-reset';
			target_eyeZ = -800;
		}
	}
}

function move_camera_eyeZ() {
	let s = 5;
	if (target_eyeZ > cam.eyeZ) {
		if (target_eyeZ - cam.eyeZ < s) {
			cam.setPosition(cam.eyeX, cam.eyeY, target_eyeZ);
		} else {
			cam.setPosition(cam.eyeX, cam.eyeY, cam.eyeZ + s);
		}
	} else if (target_eyeZ < cam.eyeZ) {
		if (cam.eyeZ - target_eyeZ < s) {
			cam.setPosition(cam.eyeX, cam.eyeY, target_eyeZ);
		} else {
			cam.setPosition(cam.eyeX, cam.eyeY, cam.eyeZ - s);
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

function windowResized() {
	is_mobile = (windowWidth <= 1020) ? true : false;
	let w = Math.max(320, windowWidth);
	let h = Math.max(240, windowHeight);
	resizeCanvas(w, h);
	canvas_3d.resizeCanvas(w, h);
	ui_padding = (is_mobile) ? 16 : 24;

	// reposition control buttons
	let bw = zoom_in_button_img.width/dpi_multiple;
	let bh = zoom_in_button_img.height/dpi_multiple;
	zoom_in_button.position(w-ui_padding-bw, ui_padding);
	zoom_out_button.position(w-ui_padding-bw, ui_padding+bh+ui_spacing);
	rotate_button.position(ui_padding, ui_padding);

	// reposition tabs
	bw = tab_ticket_img.width/dpi_multiple;
	bh = tab_ticket_img.height/dpi_multiple;
	let x = w/2+4;
	let y = h-ui_padding-bh-4;
	tab_ticket.position(x, y);
	x = w/2-bw*2;
	y = h-ui_padding-bh-4;
	tab_open.position(x, y);
	x = w/2-bw;
	y = h-ui_padding-bh-4;
	tab_closed.position(x, y);
	x = w/2+bw;
	y = h-ui_padding-bh-4;
	tab_receipt.position(x, y);
}

function zoom_in() {
	d = (is_mobile) ? 100 : 70;
	if (['carrier-open-front', 'carrier-closed-front', 'ticket-front', 'receipt'].includes(state)) {
		console.log('zoom in');
		console.log(cam.eyeZ, target_eyeZ);
		let z = cam.eyeZ - d;
		if (z > max_eyeZ) {
			target_eyeZ = max_eyeZ;
		} else if (z < min_eyeZ) {
			target_eyeZ = min_eyeZ;
		} else {
			target_eyeZ = z;
		}
	} else if (['carrier-open-back', 'carrier-closed-back', 'ticket-back'].includes(state)) {
		let z = cam.eyeZ + d;
		if (z < -max_eyeZ) {
			target_eyeZ = -max_eyeZ;
		} else if (z > -min_eyeZ) {
			target_eyeZ = -min_eyeZ;
		} else {
			target_eyeZ = z;
		}
	}
}

function zoom_out() {
	d = (is_mobile) ? 100 : 70;
	if (['carrier-open-front', 'carrier-closed-front', 'ticket-front', 'receipt'].includes(state)) {
		let z = cam.eyeZ + d;
		if (z > max_eyeZ) {
			target_eyeZ = max_eyeZ;
		} else if (z < min_eyeZ) {
			target_eyeZ = min_eyeZ;
		} else {
			target_eyeZ = z;
		}
	} else if (['carrier-open-back', 'carrier-closed-back', 'ticket-back'].includes(state)) {
		let z = cam.eyeZ - d;
		if (z < -max_eyeZ) {
			target_eyeZ = -max_eyeZ;
		} else if (z > -min_eyeZ) {
			target_eyeZ = -min_eyeZ;
		} else {
			target_eyeZ = z;
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
			tint(204, 204, 204, this.opacity);
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

class Tab {
	constructor(img_default, img_selected, inX, inY, inWidth, inHeight, go_to) {
		this.x = inX;
		this.y = inY;
		this.width = inWidth;
		this.height = inHeight;
		this.img_default = img_default;
		this.img_selected = img_selected;
		this.go_to = go_to;
		this.state = 'default';
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
		if (this.state != 'hidden') {
			stroke(0);
			push();
			if (this.is_hovered()) {
				tint(204, 204, 204);
			} else {
				tint(255);
			}
			let img = (this.state === 'selected') ? this.img_selected : this.img_default;
			image(img, this.x, this.y, this.width, this.height);
			pop();
		}
	}

	is_hovered() {
		if ((mouseX > this.x) && (mouseX < this.x+this.width) && (mouseY > this.y) && (mouseY < this.y+this.height)) {
			if (!['hidden'].includes(this.state)) {
				cursor('pointer');
			}
			return true;
		} else {
			return false;
		}
	}

	clicked() {
		this.go_to();
	}
}

function go_to_carrier_open() {
	state = 'carrier-open-front';
	tabs.forEach(tab => {
		tab.state = 'default';
	});
	tab_open.state = 'selected';
	card_left_rotateY = 0.05*PI;
	card_right_rotateY = -0.05*PI;
	card_bottom_rotateX = 0.2*PI;
	cam.setPosition(0, 0, 800);
	cam.lookAt(0, 0, 0);
	cam_angle = 0.5*PI;
	target_eyeZ = 800;
}

function go_to_carrier_closed() {
	state = 'carrier-closed-front';
	tabs.forEach(tab => {
		tab.state = 'default';
	});
	tab_closed.state = 'selected';
	card_left_rotateY = PI;
	card_right_rotateY = -PI;
	card_bottom_rotateX = 0.99*PI;
	cam.setPosition(0, 0, 800);
	cam.lookAt(0, 0, 0);
	cam_angle = 0.5*PI;
	target_eyeZ = 800;
}

function go_to_ticket() {
	state = 'ticket-front';
	tabs.forEach(tab => {
		tab.state = 'default';
	});
	tab_ticket.state = 'selected';
	ticket_y = 0;
	ticket_z = 0;
	ticket_rotateX = 0;
	ticket_opacity = 255;
	cam.setPosition(0, 0, 800);
	cam.lookAt(0, 0, 0);
	cam_angle = 0.5*PI;
	target_eyeZ = 800;
}

function go_to_receipt() {
	state = 'receipt';
	tabs.forEach(tab => {
		tab.state = 'default';
	});
	tab_receipt.state = 'selected';
	receipt_y = 0;
	receipt_z = 0;
	receipt_opacity = 255;
	receipt_top_rotateZ = 0;
	receipt_bottom_rotateX = 0.1*PI;
	cam.setPosition(0, 0, 800);
	cam.lookAt(0, 0, 0);
	cam_angle = 0.5*PI;
	target_eyeZ = 800;
}