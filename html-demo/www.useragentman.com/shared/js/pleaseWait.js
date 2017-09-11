var pleaseWait = new function () { 
	var me = this;

	var darkBackground; 
	var message;
	var hourglassImage;
	
	me.init = function () {
		darkBackground = document.getElementById('pleaseWait-darkBackground');
		message = document.getElementById('pleaseWait-message');
		
		if (!message) {
			return;
		}
			
		hourglassImage = new Image();
		hourglassImage.src = config.getValue('pleaseWait.urls.hourglass');

		me.showDarkBackground();
		hideAllSelects();
		me.show();
		
		EventHelpers.addEvent(window, 'resize', me.resizeBackground)
	}
	
	me.hide = function (options) {
		if (!options) {
			options = new Object();
		}
		if (message) {
			message.style.display ='none';
		}
		
		
		if (!(options.keepDarkBackground)) {
			me.hideDarkBackground();
			
			showAllSelects();
		}
	}
	
	me.show = function () {
		if (!message) {
			return;
		}
		DebugHelpers.log('pleaseWait.show() executed')
		me.showDarkBackground();
		message.style.display='block';
		
		CSSHelpers.moveTo( 
			message,
			BrowserHelpers.getScrollX() + (BrowserHelpers.getWindowWidth() - CSSHelpers.getWidth(message))/2,
			BrowserHelpers.getScrollY() + (BrowserHelpers.getWindowHeight() - CSSHelpers.getHeight(message))/2);
	}
	
	me.hideDarkBackground = function () {
		DebugHelpers.log('hideDarkBackground() started')
		darkBackground.style.display ='none';
		CSSHelpers.setWidth(darkBackground, 0);
		CSSHelpers.setHeight(darkBackground, 0);
		
	}
	
	me.showDarkBackground  = function () {
		if (!darkBackground) {
			return false;
		}
		
		DebugHelpers.log('showDarkBackground() started')
		me.resizeBackground();
		
		
		darkBackground.style.display = 'block';
		setBackgroundOpacity(50);
		return true;
	}
	
	function setBackgroundOpacity (level) {
		
		if (!darkBackground) {
			return;
		}
		
		CSSHelpers.setOpacity(darkBackground, level);
		//ie shows drop downs on top regardless of z-position, so hide/show appropriately
		
		//DebugHelpers.log(StringHelpers.sprintf("opacity: %d", level));
		if (level == 0) {
			darkBackground.style.visibility = 'hidden';
			darkBackground.style.display = 'none';
			
			
			// IE doesn't like visible selects here 
			if (BrowserDetect.browser == 'Explorer') {
				showAllSelects();
			}
		} else {
			/*
			CSSHelpers.setWidth(darkBackground, BrowserHelpers.getDocumentWidthGetDocumentWidth());
			CSSHelpers.setHeight(darkBackground, BrowserHelpers.getDocumentHeight());
			*/
			darkBackground.style.width = BrowserHelpers.getDocumentWidth() + "px";
			darkBackground.style.height = BrowserHelpers.getDocumentHeight() + "px";
			darkBackground.style.visibility = 'visible';
			darkBackground.style.display = 'block';
			
			// IE doesn't like visible selects here 
			if (BrowserDetect.browser == 'Explorer') {
				hideAllSelects();
			}
		}
	}
	
	me.resizeBackground = function () {
		
		if (!darkBackground) {
			return;
		}
		
		var width = BrowserHelpers.getDocumentWidth();
		if (BrowserHelpers.getWindowWidth() > width) {
			width = BrowserHelpers.getWindowWidth();
		}
		var height = BrowserHelpers.getDocumentHeight();
		if (BrowserHelpers.getWindowHeight() > height) {
		    height = BrowserHelpers.getWindowHeight();
		}
		
		darkBackground.style.width = width + 'px';
		darkBackground.style.height = height + 'px';
		
	}
	
	
	
	function hideAllSelects() {
		var selects = document.getElementsByTagName('select');
		
		for (var i=0; i<selects.length; i++) {
			selects[i].style.visibility='hidden';
		}
	}
	
	function showAllSelects() {
		var selects = document.getElementsByTagName('select');
		
		for (var i=0; i<selects.length; i++) {
			selects[i].style.visibility='inherit';
		}
	}
	
	
}

// EventHelpers.addPageLoadEvent('pleaseWait.init');