/**
 *	Copyright (c) 2005, 2006 Rafael Robayna
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 *	CanvasWidget is a base class that handles all mouse event listening for a canvas element, 
 *	implements a widget event listener than you can use to trigger events remotely on widget 
 *	state changes and encapsulates a few useful helper functions.
 *
 *  To create widget using CanvasWidget all you need to do is the following:
 *
 *	var YourWidget = CanvasWidget.extend({
 *		widget_value_1: null,
 *		constructor: function(canvasName, position) {
 *			this.inherit(canvasName, position);
 *		},
 *		checkWidgetMouseEvent: function(e) {
 *			var mousePos = this.getCanvasMousePos(e);
 *			//interpret the mouse position 
 *			this.drawWidget();
 *		},
 *		drawWidget: function() { 
 *			//your canvas drawing code
 *		}
 *	});
 *
 *	//initialize an instance of your widget
 *	var yourWidget = new YourWidget("canvas_name", {x: canvasPosX, y: canvasPosY});
 *
 *	//initialize an instance of your widget
 *  yourWidget.addWidgetListener(function () {
 *		//assign your widget value to something else
 *		something = this.widget_value_1;
 *	});
 *
 *
 **/
var CanvasWidget = Base.extend({
	canvas: null,
	context: null,
	position: null,
	widgetListeners: null,

	/**
	 * constuctor
	 * 
	 * @param {String} canvasName - the id of the corresponding canvas html element
	 * @param {Array} position - the absolute position of the canvas html elemnt, {x:#,y:#}
	 */
	constructor: function(canvasElementID, position) {
		this.canvas = document.getElementById(canvasElementID);
		
		if (window.G_vmlCanvasManager) {
			G_vmlCanvasManager.initElement(this.canvas); 
		}
		
		this.context = this.canvas.getContext('2d');
		this.drawWidget();
		this.initMouseListeners();
		this.position = position;
		this.widgetListeners = new Array();
	},

	/**
	 * Initializes all the mouse listeners for the widget.
	 */
	initMouseListeners: function() {
		this.mouseMoveTrigger = new Function();
		if (document.all) {
			this.canvas.attachEvent("onmousedown", this.mouseDownActionPerformed.bindAsEventListener(this));
			this.canvas.attachEvent("onmousemove", this.mouseMoveActionPerformed.bindAsEventListener(this));
			this.canvas.attachEvent("onmouseup", this.mouseUpActionPerformed.bindAsEventListener(this));
			this.canvas.attachEvent("onmouseout", this.mouseUpActionPerformed.bindAsEventListener(this));
		} else {
			this.canvas.addEventListener("mousedown", this.mouseDownActionPerformed.bindAsEventListener(this), false);
			this.canvas.addEventListener("mousemove", this.mouseMoveActionPerformed.bindAsEventListener(this), false);
			this.canvas.addEventListener("mouseup", this.mouseUpActionPerformed.bindAsEventListener(this), false);
			this.canvas.addEventListener("mouseout", this.mouseUpActionPerformed.bindAsEventListener(this), false);
		}
	},

	/**
	 * Triggered by any mousedown event on the widget. This function calls 
	 * checkWidgetMouseEvent() and links the mousemove listener to checkWidgetEvent().
	 *
	 * Override this function if you want direct access to mousedown events.
	 *
	 * @param {Event} e
	*/
	mouseDownActionPerformed: function(e) {
		this.mouseMoveTrigger = function(e) {
			this.checkWidgetEvent(e);
		}
		this.checkWidgetEvent(e);
	},
	
	/**
	 * Triggered by any mousemove event on the widget. 
	 *
	 * Override this function if you want direct access to mousemove events.
	 *
	 * @param {Event} e
	*/
	mouseMoveActionPerformed: function(e) {
		this.mouseMoveTrigger(e);
	},
	
	/**
	 * Triggered by any mouseup or mouseout event on the widget. 
	 *
	 * Override this function if you want direct access to mouseup events.
	 *
	 * @param {Event} e
	*/
	mouseUpActionPerformed: function(e) {
		this.mouseMoveTrigger = new Function();
	},

	/**
	 * Called by the mousedown and mousemove event listeners by default.
	 *
	 * This function must be implemented by any class extending CPWidget.
	 *
	 * @param {Event} e
	*/
	checkWidgetMouseEvent: function(e) {},
	
	/**
	 * Draws the widget.
	 *
	 * This function must be implemented by any class extending CPWidget.
	 *
	*/
	drawWidget: function() {},

	/**
	 * Used to add event listeners directly to the widget.  Listeners registered 
	 * with this function are triggered every time the widget's state changes.
	 *
	 * @param {Function} eventListener
	*/
	addWidgetListener: function(eventListener) {
		this.widgetListeners[this.widgetListeners.length] = eventListener;
	},
	
	/**
	 * Executs all functions registered as widgetListeners.  Should be called every time 
	 * the widget's state changes.
	*/
	callWidgetListeners: function() {
		if(this.widgetListeners.length != 0) {
			for(var i=0; i < this.widgetListeners.length; i++) 
				this.widgetListeners[i]();
		}
	},
	
	/**
	 * Get the the amount of pixels the window has been scrolled from the top.  If there is no
	 * vertical scrollbar, this function return 0.
	 *
	 * @return {int} - the amount of pixels the window has been scrolled to the right, in pixels.
	 */
	getScrollX: function (myWindow)
	{
		var myDocument;
		
		if (myWindow) {
			myDocument = myWindow.document;
		} else {
			myWindow = window;
			myDocument = document;
		}
		
		// All except that I know of except IE
		if (myWindow.pageXOffset != null) {
			return myWindow.pageXOffset;
		// IE 6.x strict
		} else if (myDocument.documentElement != null 
				&& myDocument.documentElement.scrollLeft !="0px" 
					&& myDocument.documentElement.scrollLeft !=0)  {
			return myDocument.documentElement.scrollLeft;
		// all other IE
		} else if (myDocument.body != null && 
			myDocument.body.scrollLeft != null) {
			return myDocument.body.scrollLeft;
		// if for some reason none of the above work, this should.
		} else if (myWindow.scrollX != null) {
			return myWindow.scrollX;
		} else {
			return null;
		}
	},
	
	/**
	 * Get the the amount of pixels the window has been scrolled to the right.  If there is no
	 * horizontal scrollbar, this function return 0.
	 * 
	 * @return {int} - the amount of pixels the window has been scrolled to the right, in pixels.
	 */
	getScrollY: function(myWindow)
	{
		var myDocument;
		
		if (myWindow) {
			myDocument = myWindow.document;
		} else {
			myWindow = window;
			myDocument = document;
		}
		
		// All except that I know of except IE
		if (myWindow.pageYOffset != null) {
			return myWindow.pageYOffset;
		// IE 6.x strict
		} else if (myDocument.documentElement != null
				&& myDocument.documentElement.scrollTop !="0px" 
					&& myDocument.documentElement.scrollTop !=0) {
			return myDocument.documentElement.scrollTop;
		// all other IE
		} else if (myDocument.body && myDocument.body.scrollTop != null) { 
			return myDocument.body.scrollTop;
		// if for some reason none of the above work, this should.
		} else if (myWindow.scrollY != null) { 
			return myWindow.scrollY;
		} else {
			return null;
		}
	},
	
	getAbsoluteCoords: function(obj) {
		
		var curleft = obj.offsetLeft;
		var curtop = obj.offsetTop;
		
		/*
		 * IE and Gecko
		 */
		if (obj.getBoundingClientRect) {
			var temp = obj.getBoundingClientRect();
			
			curleft = temp.left; //+ this.getScrollX();
			curtop = temp.top; //+ this.getScrollY();
		} else {
		
			/* Everything else must do the quirkmode.org way */
		
			if (obj.offsetParent) {
			
				while (obj = obj.offsetParent) {
					curleft += obj.offsetLeft - obj.scrollLeft;
					curtop += obj.offsetTop - obj.scrollTop;
				}
			}
		}
		return {
			x: curleft,
			y: curtop
		};
	},
	
	/**
	 * Helper function to get the mouse position relative to the canvas position.
	 *
	 * @param {Event} e
	*/
	getCanvasMousePos: function(e) {
		var temp = this.getAbsoluteCoords(this.canvasInterface);
		
		//return {x: e.clientX - this.position.x, y: e.clientY - this.position.y};
		r = {x: e.clientX - temp.x, y: e.clientY - temp.y};
		//console.log(r, ', ', this.getScrollY())
		return r;
	}

});

var CanvasHelper = {
	canvasExists: function(canvasName) {
		var canvas = document.getElementById(canvasName);
		
		if (window.G_vmlCanvasManager) {
			G_vmlCanvasManager.initElement(canvas);
		}
		
		return canvas.getContext('2d');
	}
}