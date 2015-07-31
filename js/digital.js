$(document).ready(function() {

// To do
//	
//		Build JSON database for patterns and colors
//		Add color "thickness" option

var color1 = $('#color-1'),
	color2 = $('#color-2'),
	color3 = $('#color-3'),
	color4 = $('#color-4');

// inserts pre-defined colors into the "pre-defined color set" menu
function buildPreDefinedPatterns() {
	$.getJSON('js/data.json', function(data) {
		for (i=0; i<data.camoData.length; i++) {
			$('#pre-defined-pat').append('<option value=' + i + '>' + data.camoData[i].PATNAME + '</option>');
		}
	});
}

buildPreDefinedPatterns();

function colorDisable(x) {
	x.attr('disabled',true);
	x.css({'background-color': 'lightgrey', 'color':'black'});
}

function colorEnable(x) {
	x.attr('disabled', false);
	x.css({'background-color': 'white', 'color':'black'});
}

// if a pre-defined color is select, this properly formats the color inputs
function buildPreDefinedColors() {
	var colorArr = [color1, color2, color3, color4];
	$('#pre-defined-pat').change(function() {
		var k = Number($('#pre-defined-pat').val());
		if (k >= 0) {
			setUpOptions();
			$('#custom-color-num').attr('disabled',true);
			$.getJSON('js/data.json', function(data) {
				
				var x = data.camoData[k].HEXCOLORS.length;
				var y = colorArr.length - x;
				$('#custom-color-num').val(x);
				
				for (i=0; i<x; i++) {
					colorArr[i].val(data.camoData[k].HEXCOLORS[i]);
					colorArr[i].css('background-color',data.camoData[k].HEXCOLORS[i]);
					colorArr[i].attr('disabled',false);
					colorArr[i].css('text-decoration','none');
				}

				for (j=0; j<y; j++) {
					colorDisable(colorArr[x-j]);
				}
			});
		}

		else {
			$('#custom-color-num').attr('disabled',false);
		}
	});
}

buildPreDefinedColors();

function setUpOptions() {

	$('#new-base, #save-base').change(function() {
		if ($('#new-base').is(':checked')) {
			colorEnable($('#canvas-size'));
			colorEnable($('#pixel-size'));
			colorEnable($('#roughness'));
		}

		else if ($('#save-base').is(':checked')) {
			colorDisable($('#canvas-size'));
			colorDisable($('#pixel-size'));
			colorDisable($('#roughness'));			
		}
	});

	$('#custom-color-num').change(function() {
		var k = Number($('#custom-color-num').val());
		if (k === 1) {
			colorEnable(color1);
			colorDisable(color2);
			colorDisable(color3);
			colorDisable(color4);
			// colorDisable(step);
			// colorDisable(totalSteps);
		}
		else if (k === 2) {
			colorEnable(color1);
			colorEnable(color2);
			colorDisable(color3);
			colorDisable(color4);
		}
		else if (k === 3) {
			colorEnable(color1);
			colorEnable(color2);
			colorEnable(color3);
			colorDisable(color4);
			// colorDisable(step);
			// colorDisable(totalSteps);

		}
		else if (k === 4) {
			colorEnable(color1);
			colorEnable(color2);
			colorEnable(color3);
			colorEnable(color4);
			// colorDisable(step);
			// colorDisable(totalSteps);
		}
		else if (k === 5) {
			colorDisable(color1);
			colorDisable(color2);
			colorDisable(color3);
			colorDisable(color4);	
			// colorDisable(step);
			// colorDisable(totalSteps);
		}
	});
}

setUpOptions();

// ALL THE HORSEPOWER IS BELOW HERE

var savedBase; 

function generatePattern() {
	var width,
		pixelSize,
		roughness,
		mapType,
		mapBase,
		wrapping,
		build = document.getElementById('build'),
		canvas = document.getElementById('canvas'),
		w = canvas.width,
		h = canvas.height,
		c = canvas.getContext('2d'),
		image = c.createImageData(w,w),
		imageData = image.data,

		color1,
		color2,
		color3,
		color4;

		width = parseInt($('#canvas-size').val(),10);	
		pixelSize = parseInt($('#pixel-size').val(),10);
		roughness = parseInt($('#roughness').val(),10);
		mapType = Number($('#custom-color-num option:selected').val());

		step = parseInt($('#step').val(),10);
		totalSteps = parseInt($('#total-steps').val(),10);

		color1 = hexToRgb($('#color-1').val());
		color2 = hexToRgb($('#color-2').val());
		color3 = hexToRgb($('#color-3').val());
		color4 = hexToRgb($('#color-4').val());

		if ($('#new-base:checked').length !== 0) {
			mapBase = buildPatternBase(width, pixelSize, roughness);
			savedBase = mapBase; 
			colorPattern(width, 'canvas', mapBase, mapType);
		}

		else {
			colorPattern(width, 'canvas', savedBase, mapType);
		}


	// CREDIT: code to build pattern base adapted from 
	// http://www.somethinghitme.com/projects/canvasterrain/.
	// big thanks to Jason Brown

	function buildPatternBase(width, pixelSize, roughness) {

		// have to create a 2D array in order to more easily manipulate shapes
		function create2dArray(w,h) { 
			var newArray = new Array(w);

			for (i=0; i<w; i++) {
				newArray[i] = new Array(h); 
			}

			for (i=0; i<w; i++) {
				for (j=0; j<h; j++) {
					newArray[i][j] = 0; // set all initial values to 0.
				}						// these will get assigned random values.
			}

			return newArray;
		}


		// start by seeding first corners
		function startDisplacement(map, width) {
			var topRight, topLeft, top, bottomRight, bottomLeft, bottom, 
				right, left, center;

			map[0][0] = Math.random();
			topLeft = map[0][0];

			map[0][width] = Math.random();
			bottomLeft = map[0][width];

			map[width][0] = Math.random();
			topRight = map[width][0];

			map[width][width] = Math.random();
			bottomRight = map[width][width];

			map[width / 2][width / 2] = topLeft + bottomLeft + topRight + bottomRight; 
			map[width / 2][width / 2] = normalize(map[width / 2][width / 2]);
			center = map[width / 2][width / 2];
			

			map[width / 2][width] = bottomLeft + bottomRight + center / 4;
			map[width / 2][0] = topLeft + topRight + center / 4;
			map[width][width / 2] = topRight + bottomRight + center / 4;
			map[0][width / 2] = topLeft + bottomLeft + center / 4;


			// if (wrapping === false) {
			// // non wrapping
			// 	map[width / 2][width] = bottomLeft + bottomRight + center / 3;
			// 	map[width / 2][0] = topLeft + topRight + center / 3;
			// 	map[width][width / 2] = topRight + bottomRight + center / 3;
			// 	map[0][width / 2] = topLeft + bottomLeft + center / 3;
			// }

			// else {
			// // wrapping	
			// 	map[width / 2][width] = bottomLeft + bottomRight + center + center / 4;
			// 	map[width / 2][0] = topLeft + topRight + center + center / 4;
			// 	map[width][width / 2] = topRight + bottomRight + center + center / 4;
			// 	map[0][width / 2] = topLeft + bottomLeft + center + center / 4;
			// }

			centerDisplacement(width);
		}

		function centerDisplacement(d) {
			var newD = d / 2,
				topRight, topLeft, top, bottomRight, bottomLeft, bottom, 
				right, left, center, i, j;

			if (newD > pixelSize) {
				for (i = newD; i <= width; i += newD) {
					for (j = newD; j <= width; j+= newD) {
						x = i - (newD / 2);
						y = j - (newD / 2);

						// corners 
						topLeft = map[i - newD][j - newD];
						topRight = map[i][j - newD];
						bottomLeft = map[i - newD][j];
						bottomRight = map[i][j];

						// center
						map[x][y] = (topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(d);
						map[x][y] = normalize(map[x][y]);
						center = map[x][y];
						
						// top
						if (j - (newD * 2) + (newD / 2) > 0) {
							map[x][j - newD] = (topLeft + topRight + center + map[x][j - d + (newD / 2)]) / 4 + displace(d);
						}
						else {
							map[x][j - newD] = (topLeft + topRight + center) / 3+ displace(d);
						}

						map[x][j - newD] = normalize(map[x][j - newD]);

						// Bottom
						if (j + (newD / 2) < width){
							map[x][j] = (bottomLeft + bottomRight + center + map[x][j + (newD / 2)]) / 4+ displace(d);
						}
						else{
							map[x][j] = (bottomLeft + bottomRight + center) / 3+ displace(d);
						}

						map[x][j] = normalize(map[x][j]);


						//Right
						if (i + (newD / 2) < width){
							map[i][y] = (topRight + bottomRight + center + map[i + (newD / 2)][y]) / 4+ displace(d);
						}
						else{
							map[i][y] = (topRight + bottomRight + center) / 3+ displace(d);
						}

						map[i][y] = normalize(map[i][y]);

						// Left
						if (i - (newD * 2) + (newD / 2) > 0){
							map[i - newD][y] = (topLeft + bottomLeft + center + map[i - d + (newD / 2)][y]) / 4 + displace(d);
						}
						else{
							map[i - newD][y] = (topLeft + bottomLeft + center) / 3+ displace(d);
						}

						map[i - newD][y] = normalize(map[i - newD][y]);

					}
				}

				centerDisplacement(newD);
			}
		}

		function normalize(x) { // required in the event a center value exceeds 1
			if (x > 1) {
				x = 1;
			}
			else if (x < 0) {
				x = 0;
			}
			return x;
		}

		// generates a random value to offset center for subsequent iterations
		function displace(num){
			var max = num / (width + width) * roughness;
			return (Math.random(1.0)- 0.5) * max;
		}

		var map = create2dArray(width + 1, width + 1);
		startDisplacement(map,width);
		return map;
	}

	// add color to the pattern base
	function colorPattern(size, canvasID, mapData, mapType){
		var canvas = document.getElementById(canvasID),
			c = canvas.getContext('2d'),
			image = c.createImageData(w,h),
			imageData = image.data,
			colorObj = 0,
			r = 0,
			g = 0,
			b = 0,
			alpha = 255;

		// iterate through all elements in pattern base (mapData)
		for (x=0; x<=size; x+=pixelSize) {
			for (y=0; y<=size; y+= pixelSize) {
				
				colorObj = {r: 0, g: 0, b: 0};
				var val = mapData[x][y];

				switch(mapType) {
					case 1: // greyscale
						var greys = Math.round(~~(mapData[x][y]*100)/25)*25;
						colorObj = {r: greys, g: greys, b: greys, a: alpha};
						break;

					case 2: // two color
						if (val >= 0 && val < 0.6) {
							colorObj = color1;
						}
						else if (val >= 0.6 && val <= 1) {
							colorObj = color2;
						}			
						break;

					case 3: // three color
						if (val >= 0 && val < 0.4) {
							colorObj = color1;
						}
						else if (val >= 0.4 && val < 0.66) {
							colorObj = color2;
						}
						else if (val >= 0.66 && val <= 1) {
							colorObj = color3;
						}
						break;

					case 4: // four color
						if (val >= 0 && val < 0.25) {
							colorObj = color1;
						}
						else if (val >= 0.25 && val < 0.5) {
							colorObj = color2;
						}
						else if (val >= 0.5 && val <= 0.75) {
							colorObj = color3;
						}
						else if (val >= 0.75 && val <= 1) {
							colorObj = color4;
						}
						
						break;
					
					case 5: // another rendition of smooth transitions between colors
							// using alpha channel
						if (val >= 0 && val < 0.33) {
							colorObj = {r: color1.r, g: color1.g, b: color1.b, a: alpha * 0.5};
						}
						else if (val >= 0.33 && val < 0.66) {
							colorObj = {r: color1.r, g: color1.g, b: color1.b, a: alpha * 0.75};
						}
						else if (val >= 0.66 && val <= 1) {
							colorObj = {r: color1.r, g: color1.g, b: color1.b, a: alpha * 1.0};
						}
						break;		
					
					// case 6: // smooth transitions between colors
					// 	if (val >= 0 && val < 0.4) {
					// 		colorObj = smooth(color1, color2, totalSteps, parseInt(val * 100, 10) - step);
					// 	}
					// 	else if (val >= 0.4 && val < 0.66) {
					// 		colorObj = smooth(color2, color3, totalSteps, parseInt(val * 100, 10) - step);
					// 	}
					// 	else if (val >= 0.66 && val <= 1) {
					// 		colorObj = smooth(color3, color1, totalSteps, parseInt(val * 100, 10) - step);
					// 	}
					// 	break;				
				}

				for (w=0; w<=pixelSize; w++) {
					for (h=0; h<=pixelSize; h++) {
						var pixelStart = (x + w + ((y + h) * canvas.width)) * 4;
						imageData[pixelStart + 0] = colorObj.r;
						imageData[pixelStart + 1] = colorObj.g;
						imageData[pixelStart + 2] = colorObj.b;
						imageData[pixelStart + 3] = colorObj.a;
					}
				}
			}
		}

		// interpolate colors in order to produce "smoothness"
		// function smooth(cStart, cEnd, totalSteps, step) {
		// 	var rStart = cStart.r,
		// 		rEnd = cEnd.r,
		// 		gStart = cStart.g,
		// 		gEnd = cEnd.g,
		// 		bStart = cStart.b,
		// 		bEnd = cEnd.b,
		// 		r = rEnd + (~~((rStart - rEnd) / totalSteps) * step),
		// 		g = gEnd + (~~((gStart - gEnd) / totalSteps) * step),
		// 		b = bEnd + (~~((bStart - bEnd) / totalSteps ) * step);

		// 	return {r: r, g: g, b: b, a: alpha};
		// }
		
		c.putImageData(image,0,0);
	}

	// CREDIT: function courtsey of stackoverflow
	// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	function hexToRgb(hex) {
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16),
	        a: 255
	    } : null;
	}
}

generatePattern();

$('#build').click(function() {
	generatePattern();
});

});





	// ---------Function to color individual pixels (random noise)--------
	// function colorPixels() {
	//     var painting = document.getElementById('painting'),
	//     	w = painting.width,
	//     	h = painting.height,
	//     	c = painting.getContext('2d');

	//     var imageData = c.createImageData(w,h);

	//     function setColor(imageData, x,y,r,g,b,a) {
	//         var i = (x + y * imageData.width) * 4;
	//         imageData.data[i + 0] = r;
	//         imageData.data[i + 1] = g;
	//         imageData.data[i + 2] = b;
	//         imageData.data[i + 3] = a;
	//     }

	//     for (y=0; y<h; y++) {
	//         for (x=0; x<w; x++) {
	//             var r = Math.random()*256 | 0;
	//             var g = Math.random()*256 | 0;
	//             var b = Math.random()*256 | 0;
	//             var a = 255;
	//             setColor(imageData,x,y,r,g,b,a);
	//         }
	//     }

	//     c.putImageData(imageData,0,0);

	//     console.log(c);
	//     console.log(imageData.data);
	// }


	//-----------Function to color boxes of pixels (random noise)------------
	// function colorPixelsBox(boxH,boxW) {
	// 	var painting = document.getElementById('painting'),
	// 	w = painting.width;
	// 	h = painting.height;
	// 	c = painting.getContext('2d');

	// 	var imageData = c.createImageData(w,h);

	// 	function setColor(imageData, boxH, boxW, x,y,r,g,b,a) {
	// 		var i = (x + y * imageData.width) * 4;
	// 		var k = (boxH)*imageData.width*4;
	// 		for (n=0; n<k; n+=imageData.width*4) {
	// 			for (m=0; m<boxW*4; m+=4) {
	// 				imageData.data[i + n + m + 0] = r;
	// 				imageData.data[i + n + m + 1] = g;
	// 				imageData.data[i + n + m + 2] = b;
	// 				imageData.data[i + n + m + 3] = a;

	// 			}
	// 		}
	// 	}

	// 	for (y=0; y<h; y+=boxH) {
	// 		for (x=0; x<w; x+=boxW) {
	// 			var i = Math.floor(Math.random()*3);
	// 			var r = rgbColors[i][0] | 0;
	//             var g = rgbColors[i][1] | 0;
	//             var b = rgbColors[i][2] | 0;
	//             var a = 255;
	//             setColor(imageData,boxH, boxW, x,y,r,g,b,a);
	// 		}
	// 	}
	// 	c.putImageData(imageData, 0,0);

	// }


// function to convert an inputted RGB value to an object
// function processColor(color) {
// if (color.match(/\d+/g) && color.match(/\d+/g).length === 3) {
// 	var r, g, b, colorObj;
// 	color = color.match(/\d+/g);
// 	r = parseInt(color[0],10);
// 	g = parseInt(color[1],10);
// 	b = parseInt(color[2],10);
// 	colorObj = {r: r, g: g, b: b};
// 	console.log(colorObj);
// 	return colorObj;
// }

// else if (color.match(/\w+/g) && !color.match(/,/g) && (color.match(/\w+/g).toString().length === 3 || color.match(/\w+/g).toString().length === 6)) {
// 	console.log(hexToRgb(color));
// 	return hexToRgb(color);
// }

// else {
// 	console.log('fail');
// 	return;
// }
//}
