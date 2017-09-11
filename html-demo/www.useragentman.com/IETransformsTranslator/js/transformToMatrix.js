var transformToMatrix = new function () {
	var me = this;
	var transformExpression;
	var submitButton;
	var matrixFilter, css3;
	var matrixFilterRow, vert, horiz, widthNode, heightNode, display, originalObject;
	var transformedObject, errorMsg, errorFieldset;
	var html, form;
	
	me.init = function () {
		if (EventHelpers.hasPageLoadHappened(arguments)) {
			return;
		}
		scrollTo(0,0);
		transformExpression = document.getElementById('transformExpression');
		submitButton = document.getElementById('submitButton');
		matrixFilter = document.getElementById('matrixFilter');
		matrixFilterRow = document.getElementById('matrixFilterRow');
		transformedObject = document.getElementById('transformedObject');
		originalObject = document.getElementById('originalObject');
		vert = document.getElementById('vert');
		horiz = document.getElementById('horiz');
		widthNode = document.getElementById('width');
		heightNode = document.getElementById('height'); 
		display = document.getElementById('display');
		form = document.getElementsByTagName('form')[0];
		errorMsg = document.getElementById('errorMsg');
		errorFieldset = document.getElementById('errorFieldset');
		css3= document.getElementById('css3');
		
		html = document.getElementById('theWrapper').innerHTML;
		form = document.getElementsByTagName('form')[0];
		
		EventHelpers.addEvent(form, 'submit', convert);
	
		//EventHelpers.addEvent(form, 'submit', convert)
		EventHelpers.addEvent(submitButton, 'click', convert)
		
		
		if (window.$wf2) {
			if ($wf2.callAfterValidation != undefined) {
				$wf2.callAfterValidation.push(afterValidationEvent);
			}
		}
		
		//ZeroClipboard.setMoviePath( '../../shared/js/zeroclipboard/ZeroClipboard.swf' )
	}
	
	
	
	function removeTransformContainer(obj) {
		var wrapper = document.getElementById('theWrapper');
		
		wrapper.innerHTML = html; 
		transformedObject = document.getElementById('transformedObject');
		
		
	}
	
	function isFormValid(form) {
		var r = true;
		
		var els =form.elements;
		for (var i=0; i<els.length; i++) {
			var el = els[i]
			if (window.$wf2 && window.$wf2.updateValidityState) {
				$wf2.updateValidityState(el);
			}
			if (!el.validity.valid) {
				//$wf2.controlCheckValidityOfElement(el);
				
				r= false;
			}
		}
		
		
		return r;
	}
	
	
	function convert(e) {
		
		var isValid = isFormValid(form);
		
		
		
		if (!isValid) {
		
			return;
		}
		
		EventHelpers.preventDefault(e);
		
		try {
			removeTransformContainer(transformedObject)
			var width = document.getElementById('width').value;
			var height = document.getElementById('height').value;
			
			transformedObject.style.width = width + 'px';
			transformedObject.style.height = height + 'px';
			originalObject.style.width = width + 'px';
			originalObject.style.height = height + 'px';
			
			cssSandpaper.setTransform(transformedObject,transformExpression.value );
			transformedObject.style.visibility = 'visible';
			originalObject.style.visibility = 'visible';
			
			
			var matrix = CSS3Helpers.getTransformationMatrix(transformExpression.value, true);
			
			/* If IE, get the offset values */
			var container = transformedObject.parentNode;
			
			var offsetX, offsetY;
			if (CSSHelpers.isMemberOfClass(container, 'IETransformContainer')) {
				offsetX = container.style.marginLeft;
				offsetY = container.style.marginTop;
			} else {
				// Now, adjust the margins of the parent object
				var offsets = CSS3Helpers.getIEMatrixOffsets(transformedObject, 
				  matrix, originalObject.offsetWidth, originalObject.offsetHeight);
				offsetX = offsets.x;
				offsetY = offsets.y;
			}
			
			
			
			//var offsets = CSS3Helpers.getIEMatrixOffsets(transformedObject, matrix, width, height);
			
			var css3Code = config.getScriptedValue('transformToMatrix.templates.css3',
				{
					width: width + "px",
					height: height + "px",
					transform: transformExpression.value.trim().replace(/\s+/g, ' ').replace(/\)(\s)/g, ')<br>                         ')
				});
				
			var filterCode = config.getScriptedValue('transformToMatrix.templates.ieFilters',
				{
					M11: matrix.e(1, 1),
					M12: matrix.e(1, 2),
					M21: matrix.e(2, 1),
					M22: matrix.e(2, 2),
					width: width + "px",
					height: height + "px",
					transform: transformExpression.value.trim().replace(/\s+/g, ' ').replace(/\)(\s)/g, ')<br>                         ')
				});
				
			
			if (offsetX) {
				filterCode += config.getScriptedValue('transformToMatrix.templates.ieMargins', {
					marginLeft: parseInt(offsetX) + 10 + "px",
					marginTop: parseInt(offsetY) + 10 + "px",
					width: container.style.width,
					height: container.style.height,
					ieMessage: transformedObject.filters ? "" : config.getValue('transformToMatrix.templates.cssWarning')
				});
			}
			css3.innerHTML = css3Code.replace(/ /g, '&nbsp;');
			matrixFilter.innerHTML = filterCode.replace(/ /g, '&nbsp;');
			
			
			
			CSSHelpers.addClass(errorFieldset, 'initiallyHidden')
			CSSHelpers.removeClass(matrixFilterRow, 'initiallyHidden');
			/* dp.SyntaxHighlighter.ClipboardSwf = '/shared/js/dp.SyntaxHighlighter/Scripts/clipboard.swf';
			dp.SyntaxHighlighter.HighlightAll('matrixFilter'); */
			
			transformExpression.setCustomValidity("");
			
			smoothScroll('tool');
			return;
			
				
				
		} catch(ex) {
			
			CSSHelpers.removeClass(errorFieldset, 'initiallyHidden')
			CSSHelpers.addClass(matrixFilterRow, 'initiallyHidden');
			transformedObject.style.visibility = 'hidden';
			originalObject.style.visibility = 'hidden';
			if (typeof(ex) == 'string') {
				errorMsg.innerHTML = ex;
				
				transformExpression.setCustomValidity(ex);
				
				$wf2.controlCheckValidityOfElement(transformExpression);
				$wf2.hiliteFirstError();
				
			} else {
				
				transformExpression.setCustomValidity("There seems to be an error in the format of the transform.  Please try again");
				
				$wf2.controlCheckValidityOfElement(transformExpression);
				$wf2.hiliteFirstError();
				transformExpression.focus();
				errorMsg.innerHTML = "An error has occured"
			}
			
		}
		
		
		
	}
	
	me.getProperties = function (obj, objName)
	{
		var result = ""
		
		if (!obj) {
			return result;
		}
		
		for (var i in obj)
		{
			try {
				result += objName + "." + i.toString() + " = " + obj[i] + ", ";
			} catch (ex) {
				// nothing
			}
		}
		return result
	}
	
	function afterValidationEvent(e, continueSubmit) {
		if (e) {
			EventHelpers.preventDefault(e);
		}
		transformExpression.setCustomValidity("");
	}
	
	/*Scrolling functions by Andrew Johnson (http://www.itnewb.com/v/Creating-the-Smooth-Scroll-Effect-with-JavaScript) */
	function currentYPosition() {
		if (self.pageYOffset)
			 return self.pageYOffset;
		if (document.documentElement && document.documentElement.scrollTop)
			return document.documentElement.scrollTop;
		if (document.body.scrollTop)
			 return document.body.scrollTop;
		return 0;
	}
	function elmYPosition(eID) {
		var elm  = document.getElementById(eID);
		var y    = elm.offsetTop;
		var node = elm;
		while (node.offsetParent && node.offsetParent != document.body) {
			node = node.offsetParent;
			y   += node.offsetTop;
		} return y;
	}
	function smoothScroll(eID) {
		var startY   = currentYPosition();
		var stopY    = elmYPosition(eID);
		var distance = stopY > startY ? stopY - startY : startY - stopY;
		if (distance < 100) {
			scrollTo(0, stopY); return;
		}
		var speed = 20; /* Math.round(distance / 100); */
		/* if (speed >= 20) speed = 20; */
		var step  = Math.round(distance / 25);
		var leapY = stopY > startY ? startY + step : startY - step;
		var timer = 0;
		if (stopY > startY) {
			for ( var i=startY; i<stopY; i+=step ) {
				setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
				leapY += step; if (leapY > stopY) leapY = stopY; timer++;
			} return;
		}
		for ( var i=startY; i>stopY; i-=step ) {
			setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
			leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
		}
}
	
}

function doNothing() {
return;
}

EventHelpers.addPageLoadEvent('transformToMatrix.init')