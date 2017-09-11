var canvasPainter;
var saveDrawing;
var canvasAnimator;
var colorWidget;
var lineWidthWidget;
var transportWidget;

function doOnLoad() {
	if(CanvasHelper.canvasExists("canvas")) {
		var obj = document.getElementById("canvas");
		document.getElementById('canvasPainter').onselectstart = function () {
			return false;
		}
		
		
		var rect = obj.getBoundingClientRect();
		var pos = {
			x : rect.left,
			y : rect.top
		}
		
		
		canvasPainter = new CanvasPainter("canvas", "canvasInterface", pos );
		
		//init save objects
		//saveDrawing = new CPDrawing(canvasPainter);
		canvasAnimator = new CPAnimator(canvasPainter);

		//init widgets
		/* colorWidget = new ColorWidget('colorChooser', {
			x : 500,
			y : 10
		}); 
		colorWidget.addWidgetListener(function() {
			canvasPainter.setColor(colorWidget.colorString);
		});
		lineWidthWidget = new LineWidthWidget('lineWidthChooser', 2, {
			x : 500,
			y : 120
		}); */
		canvasPainter.setLineWidth(2);
		/* lineWidthWidget.addWidgetListener(function() {
			canvasPainter.setLineWidth(lineWidthWidget.lineWidth);
		}); */
		/* transportWidget = new TransportWidget('transportWidget', {
			x : 500,
			y : 190
		}, canvasAnimator); */
		canvasPainter.setColor('#ff3333');
		document.getElementById('color').value = '#ff3333';
		document.getElementById('canvasInterface').className = 'state1';
 	} else {
		var ffb = new Image();
		ffb.src = "http://www.mozilla.org/products/firefox/buttons/getfirefox_large2.png";
		document.getElementById("controls").style.display = "none";
		document.getElementById("noCanvas").style.display = "block";
		document.getElementById("ffbutton").src = ffb.src;
		document.getElementById("cpainterInfo").style.display = "none";
	}
	
	for (var i=1; i<=9; i++) {
		if (i<=5 || i == 9) {
			var obj = document.getElementById('btn_' + i);
			obj.onmouseover = function (e) {
				setControlLook(this, '#EEEEEE');
			}
			
			obj.onmouseout = function (e) {
				setControlLook(this, '#FFFFFF');
			}
			
			obj.onmousedown = function (e) {
				setControlLook(this, '#CCCCCC')
			}
			
			if (i == 9) {
				obj.onclick = function () {
					canvasAnimator.newAnimation();
				}
			} else {
				obj.onclick = function (e) {
					setCPDrawAction(this);
				}
			}
		}
		
		
	}
	
	document.getElementById('color').onchange = function (e) {
		canvasPainter.setColor('#' + this.value);
	}
}

function printError(error) {
	document.getElementById("errorArea").innerHTML += error + "<br>";
}

// used by the dhtml buttons
function setControlLook(obj, color) {
	if(obj.id != canvasPainter.curDrawAction)
		obj.style.background = color;
}

function setCPDrawAction(obj) {
	document.getElementById("btn_" + canvasPainter.curDrawAction).style.background = "#FFFFFF";
	obj.style.background = "#CCCCCC";
	canvasPainter.setDrawAction(parseInt(obj.id.replace('btn_', '')));
}

