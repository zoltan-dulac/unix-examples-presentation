/*
 * Requires: helpers.js, config.js, cssquery-p.js, pleaseWait.js
 * 
 */ 


var sharedReq;

function AjaxDialogue() {
	

	var me = this;

	var layerLinks = null;
	var buttons;

	var extension = new RegExp('-link');
	
	var layerOpened = null;
	var layerOpenedIsVisible = false;
	
	var actionToExecuteAfter = null;
	var functionToExecuteAfter = null;
	var onOpen = null;
	var onFadeIn = null
	var onAlertClose = null;
	var pressedButtonName = "";
	me.timer = new Timer(me);
	var req;
	
	// did this change for colouronwheels.com
	var link = null;
	me.getLink = function () {
		return link;
	}
	
	me.isVisible  = function () {
		if (layerOpened && layerOpened.style.visibility == 'visible') {
			return true;
		} else {
			return false;
		}
	}	
	

	me.openLayerEvent = function (e) {
		
		
		link = EventHelpers.getEventTarget(e);
		jslog.debug('link is ' + link	)
		for (;;) {
			
			if (CSSHelpers.isMemberOfClass(link, 'ajaxDialogue-openLayer')) {
				break;
			} else {
				link = link.parentNode;
			}
		} 
		EventHelpers.preventDefault(e);

		var layerID = link.id.replace(extension, '');
		
		me.openLayer(layerID);
	}
	
	me.openLayer = function (layerID, events) {
		jslog.debug('opening layer ' + layerID)
		var body = document.getElementsByTagName('body')[0];
		var style = config.getValue('ajaxDialogue.styles.open')

		/*
		 * Before we open the layer, let's see if there are any events to do
		 */
		if (onOpen) {
			eval(StringHelpers.sprintf("%s('%s')", onOpen, layerID));
		}
		
		
		
		jslog.debug(DebugHelpers.getProperties(link));
		//jslog.debug(StringHelpers.sprintf("layerID: %s, link: %s", layerID, link.id));

		layerOpened = document.getElementById(layerID);


		if (layerOpened == null) {
			
			return;
		}

		layerOpened.style.display='block';
		layerOpened.style.zIndex=1000;
		centerLayer();
		
		if (layerID != "ajaxDialogue-alert") {
			setLayerMessage("");
		}
		
		pleaseWait.showDarkBackground();
		
		
		
		hideAllSelects();
		
		var styleFunc;
		
		if (!style || style == 'fade') {
			CSSHelpers.setOpacity(layerOpened, 0);
			layerOpened.style.visibility =  'visible';
			styleMethod = me.fadeInLayer;
		} else {
			styleMethod = me.showLayerImmediately
		}
		
		if (events) {
			styleMethod(0, events.fadeIn);
		} else {
			styleMethod(0);
		}
		
		centerLayer();
		
	}
	
	me.showLayerImmediately = function (n, onFadeInEvent) {
		pleaseWait.showDarkBackground(0);
		layerOpened.style.visibility = 'visible';
		layerOpened.style.display = 'block';
		showAllSelects();
		if (onFadeIn) {
			eval(StringHelpers.sprintf("%s('%s')", onFadeIn, layerOpened));
		}
		
		if (onFadeInEvent) {
			onFadeInEvent(layerOpened);
		}
	}
	
	me.fadeInLayer = function (n, onFadeInEvent){
		jslog.debug(StringHelpers.sprintf("fadeInLayer(%d, '%s') called", n, onFadeInEvent))
		if (!layerOpenedIsVisible) {
			layerOpened.style.visibility = 'visible';
			layerOpened.style.display='block'
			layerOpenedIsVisible = true;
			pleaseWait.showDarkBackground();
		}
		
		
		CSSHelpers.setOpacity(layerOpened, n);
		if (n < 100) {
			me.timer.setTimeout('fadeInLayer', 10, n+50, onFadeInEvent);
		} else {
			showAllSelects();
			if (onFadeIn) {
				eval(StringHelpers.sprintf("%s('%s')", onFadeIn, layerOpened));
			}
			
			if (onFadeInEvent) {
				onFadeInEvent(layerOpened);
			}
		}
	}
	
	me.closeLayer = function (e) {
		
		jslog.debug("Closing ...");
		pleaseWait.hide();
		layerOpened.style.visibility = 'hidden';
		layerOpened.style.display='none';
		layerOpenedIsVisible = false;
		pleaseWait.hide();
		
		
	}
	
	function getSubmitButton() {
		var inputs = layerOpened.getElementsByTagName('input');
		
		for (var i=0; i<inputs.length; i++) {
			var input = inputs[i];
			if (input.type == 'image' && input.name != 'cancel') {
				return input;
			}
		}
		
		return null;
	}
	
	function disableSubmit() {
		var submitButton = getSubmitButton();
		
		if (submitButton) {
			CSSHelpers.setOpacity(submitButton, 0.5);
			submitButton.disabled = true;
		}
	}
	
	function enableSubmit() {
		var submitButton = getSubmitButton();
		
		if (submitButton) {
			CSSHelpers.setOpacity(submitButton, 1);
			submitButton.disabled = false;
		}
	}
	
	
	
	
	
	
	function hideAllSelects() {
		var selects = layerOpened.getElementsByTagName('select');
		
		for (var i=0; i<selects.length; i++) {
			selects[i].style.visibility='hidden';
		}
	}
	
	function showAllSelects() {
		jslog.debug('showAllSelects() called');
		var selects = layerOpened.getElementsByTagName('select');
		
		for (var i=0; i<selects.length; i++) {
			selects[i].style.visibility='visible';
		}
	}
	
	function updateFormSections() {
	
		
		var sectionsToUpdate = 
			CSSHelpers.getElementsByClassName(layerOpened, 'ajaxDialogue-updatePageSection');
		
			
		for (var i=0; i<sectionsToUpdate.length; i++) {
			
			var idToUpdate = sectionsToUpdate[i].name + "Section";
			
			var tag = document.getElementById(idToUpdate);
			
			
			
			
			if (sectionsToUpdate[i].tagName.toLowerCase() == 'select') {
			
				var options = sectionsToUpdate[i].getElementsByTagName('option');
				for (var j=0; j<options.length; j++ ) {
					
					if (options[j].value == sectionsToUpdate[i].value) {
						tag.innerHTML = options[j].innerHTML;
					}
				}
			
				/* 
				
				var selector = StringHelpers.sprintf('select[name="%s"] option[value="%s"]', sectionsToUpdate[i].name, sectionsToUpdate[i].value);
					
				var theOption = cssQuery(selector);
				tag.innerHTML = theOption.innerHTML;
				*/
				
			} else {
				tag.innerHTML = sectionsToUpdate[i].value;
			}
		}
	}
	
	function centerLayer () {
		if (layerOpened) {
			
			pleaseWait.resizeBackground();
			
			CSSHelpers.setLeft(layerOpened, /* BrowserHelpers.getScrollX() + */ 
				(BrowserHelpers.getWindowWidth() - CSSHelpers.getWidth(layerOpened))/2);
			
			var yOffset = 0;
			if (CSSHelpers.getComputedStyle(layerOpened, 'position') != 'fixed') {
				yOffset = BrowserHelpers.getScrollY();
			} 
				CSSHelpers.setTop(layerOpened, yOffset + 
					(BrowserHelpers.getWindowHeight() - CSSHelpers.getHeight(layerOpened))/2);
			
			
		}
		
		
	}
	
	function fixIEForms () {
		var inputs = document.getElementsByTagName('input');
		
		for (var i=0; i<inputs.length; i++) {
			// IE has a stupid bug in it .. this fixes it.
			CSSHelpers.setTop(inputs[i], 100);
			CSSHelpers.setTop(inputs[i], 0);
		}
	}
	
	function setLayerMessage(message) {
		
		var layerID = layerOpened.id;
		
		var selector = 
        	StringHelpers.sprintf("div#%s div.ajaxDialogue-messages", layerID);
		
        var messageContainer = cssQuery(selector)[0];
        
       
        // first ... close Layer
        me.closeLayer();
        
        messageContainer.style.display='block';
        
        messageContainer.innerHTML = message;
        
      	// fix the IE forms misaligning.
        fixIEForms();
        
		
        me.fadeInLayer(0);
		pleaseWait.showDarkBackground();
    }
	
	

	
	var processForm = function (e) {
		
		if (!req) {
                return;
        }
		
        var layerID = layerOpened.id;
        
        var selector = 
        	StringHelpers.sprintf("div#%s div.messages", layerID);
        	
        

        
        // only if req shows "complete"
		
        if (req.readyState == 4) {
                // only if "OK"
				jslog.debug(req.getAllResponseHeaders());
				
                if (req.status == 200 || req.status ==0) {
                
                	var xml = req.responseXML;
                	
                	var errors = xml.getElementsByTagName('errors')[0];
                	var messageText = xml.getElementsByTagName('messageText');
                	if (messageText.length == 0 ) {
                		messageText = config.getScriptedValueByPriority(
							'ajaxDialogue.templates.changeSubmitted',
							'changeSubmitted',
							null);
                	} else {
                		messageText = DOMHelpers.getTextContent(messageText[0]);
                	}
                	var success = xml.getElementsByTagName('success')[0];
                	
                	if (errors) {
                		var errorList = errors.getElementsByTagName('error');
                		
                		var errorListHTML = new StringBuffer();
                		
                		for(var i=0; i<errorList.length; i++) {
							var values = new Object();
							
							values.errorMessageListItem = DOMHelpers.getTextContent(errorList[i]);
							jslog.debug('s: ' + DebugHelpers.getProperties(config.values))

                			errorListHTML.append(config.getScriptedValueByPriority(
								'ajaxDialogue.templates.errorMessageList',
								'errorMessageTemplateList', 
								values));

                		}
                		
                		/* var errorMessages = 
                			StringHelpers.sprintf(config.getValue('errorMessageTemplate'),
                			errorListHTML.toString()); */
                				
                		var values = new Object();
						values.errorMessageList = errorListHTML.toString();
						
                		setLayerMessage(
                			config.getScriptedValueByPriority(
								'ajaxDialogue.templates.errorMessage',
								'errorMessageTemplate', 
								values));
								
                		centerLayer();
                		
                		/* jslog.debug(StringHelpers.sprintf('Set %s to %s',
                			messageContainer, errorListHTML.toString())); */
                		
                		
                	} else if (success) {
						
						
                		updateFormSections();
                		
                		if (layerOpened.style.visibility != 'hidden') {
                			pleaseWait.hide();
                			alert(messageText);
                		}
                		
						jslog.debug("completing first call attempting second: " + actionToExecuteAfter);
						//alert("completing first call attempting second: " + actionToExecuteAfter);
						if (actionToExecuteAfter) {
							jslog.debug("Executing update call: " + actionToExecuteAfter );
							
							secondRequest = updateEmail(actionToExecuteAfter);
							jslog.debug("after updateEmail. ");
							
						} else {
							jslog.debug("Did not execute update call: " );
							jslog.debug("Did not execute update call: " + actionToExecuteAfter );
						}
						//if (actionToExecuteAfter && functionToExecuteAfter) {
						//	jslog.debug("Executing update call: " + actionToExecuteAfter + " " + functionToExecuteAfter);
						//	sharedReq = XMLHelpers.getHttpRequestOpenXMLDoc(actionToExecuteAfter, functionToExecuteAfter);
						//}

                		pleaseWait.hide();
						me.closeLayer();

                	}
                	
                    
                	
                	req = null;
                } else {
                	
                	var errorMessageTemplate = config.getScriptedValueByPriority
						('ajaxDialogue.templates.errorMessage',
						 'errorMessageTemplate',
						 {
						 	errorMessageList: req.statusText
						 });
					
					if (!errorMessageTemplate) {
						errorMessageTemplate = req.statusText;
					}
                	setLayerMessage(errorMessageTemplate);
                		
                    /*setLayerMessage(messageContainer, 
                    	StringHelpers.sprintf(config.getValue('errorMessageTemplate'),
                    		req.statusText));  */
                    		
                   
                }
        }
		
	}

	me.submitForm = function (e) {
	
		EventHelpers.preventDefault(e);
	
		
		jslog.debug('me.submitForm() entered');
		
		var target = EventHelpers.getEventTarget(e);
		
		while (!CSSHelpers.isMemberOfClass(target, 'ajaxDialogue-button')) {
			target = target.parentNode;
			
			if (target.tagName == 'body') {
				// bad ... bail!
				jslog.debug('bad .. ')
				return;
			}
		}
		pressedButtonName = target.name;
		
		var form = DOMHelpers.getAncestorByTagName(target, 'form');
		jslog.debug('form: ' + form);
		/* 
		 * check to see if there is something we need to do before we submit the
		 * form.
		 */
		var functionToExecuteBefore = form.functionToExecuteBefore;
		if (functionToExecuteBefore) {
			functionToExecuteBefore = functionToExecuteBefore.value;
			eval(functionToExecuteBefore + '()');
		}
		
		
		/* 
		 * If we didn't press cancel, and the form doesn't have a hidden
		 * field called "doNotSubmit", then submit the form to the action 
		 */
		var doSubmitForm = (form.doNotSubmit&&form.doNotSubmit.value=='true')?false:true;
		if (!CSSHelpers.isMemberOfClass(target, 'ajaxDialogue-closeButton') 
			&& doSubmitForm) {
			
			var action = form.action;
	
			var queryString = formData2QueryString(form);
			
			jslog.debug(queryString);
			if (form.actionToExecuteAfter && form.functionToExecuteAfter) {
				jslog.debug('setting secondary action');
				actionToExecuteAfter = form.actionToExecuteAfter.value;
				functionToExecuteAfter = form.functionToExecuteAfter.value;
			} else {
				actionToExecuteAfter=null;
				functionToExecuteAfter=null;
			}
			
			req=XMLHelpers.getXMLHttpRequest(StringHelpers.sprintf("%s?%s", action, queryString), 
				processForm);
		
			pleaseWait.show();
			
		} else {
			me.closeLayer();
		}

	}

	

	me.resizeWindow = function(e) {
		centerLayer();
	}
	

	me.init = function(reindex) {
	
		if (EventHelpers.hasPageLoadHappened(arguments) && reindex != true) return;
		
		pleaseWait.showDarkBackground()
		

		// index all links of class "ajaxDialogue-openlayer" and set onclick events
		// to open layer that they are assigned to.

		//var links = document.getElementsByTagName("a");
		
		
		var links = CSSHelpers.getElementsByClassName(document, 'ajaxDialogue-openLayer');
		jslog.debug("Num links:" + links.length)
		for (var i = 0; i < links.length; i++ ) {
			
			if (reindex) {
				//EventHelpers.removeEvent(links[i], 'click', me.openLayerEvent)
				EventHelpers.removeEvent(links[i], 'focus', me.openLayerEvent)
			}
			//EventHelpers.addEvent(links[i], 'click', me.openLayerEvent);
			//jslog.debug('links[i]:' + DebugHelpers.getProperties(links[i]));
			EventHelpers.addEvent(links[i], 'click', me.openLayerEvent);
			
			
		}


		// for all the ajax dialogues, submit the form
		buttons = CSSHelpers.getElementsByClassName(document,'ajaxDialogue-button');
		jslog.debug('buttons: ' + buttons.length)
		for (var i=0; i<buttons.length; i++) {
			
			
			EventHelpers.addEvent(buttons[i], 'click', me.submitForm);
			//EventHelpers.addEvent(buttons[i], 'focus', me.submitForm);
		}
		
		// add key event to close layer if esc is hit.
		EventHelpers.addEvent(document, 'keydown', keyEvent);
		
		// make sure resize of browser triggers resize of dialogues.
		EventHelpers.addEvent(window, 'resize', me.resizeWindow);
		
		onOpen = config.getNormalizedValue('ajaxDialogue.events.open');
		onFadeIn = config.getNormalizedValue('ajaxDialogue.events.fadeIn');
		
		pleaseWait.hide();
	}
	
	
	// let's close the ajax dialogue if we press ESC
	function keyEvent(e) {
		var key = EventHelpers.getKey(e);
		
		if (key == 27) {
			me.closeLayer(e);
		}
	}
	
	 me.alert = function(message){
        layerOpened = document.getElementById('ajaxDialogue-alert');
        layerOpened.style.display = 'block';
        
        setContent(message);
		centerLayer();
        pleaseWait.showDarkBackground();
        CSSHelpers.setOpacity(layerOpened, 0);
        layerOpened.style.display = 'block';
        me.fadeInLayer(0);
    }
	
	function setContent(html){
        var layerID = layerOpened.id;
        var selector = StringHelpers.sprintf("div#%s div.ajaxDialogue-content", layerID);
        var contentContainer = cssQuery(selector)[0];
        
        
        // first ... close Layer
        me.closeLayer();
        
        contentContainer.style.display = 'block';
        
        contentContainer.innerHTML = html;
        
        // fix the IE forms misaligning.
        fixIEForms();
        
        me.fadeInLayer(0);
    }
}




var ajaxDialogue = new AjaxDialogue();

EventHelpers.addPageLoadEvent('pleaseWait.init');
EventHelpers.addPageLoadEvent("ajaxDialogue.init");

//EventHelpers.addEvent(window, 'load', ajaxDialogue.init);
