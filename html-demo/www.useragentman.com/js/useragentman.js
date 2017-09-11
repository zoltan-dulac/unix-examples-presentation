/**
 * @author Zoltan Hawryluk
 */
var USMPage = new function () {
	var me = this;
	
	var commentNodes;
	
	me.init = function () {
		if (EventHelpers.hasPageLoadHappened(arguments)) {
			return;
		}
		
		commentNodes = CSSHelpers.getElementsByClassName(document, 'comment');
		stripeComments();
		fixAndroidVideos();
	}
	
	function stripeComments() {
		for (var i=0; i<commentNodes.length; i++) {
			var comment = commentNodes[i];
			
			if (i%2 == 0) {
				CSSHelpers.addClass(comment, 'dark');
			} else {
				CSSHelpers.addClass(comment, 'light');
			}
		}
	}
	
	function fixAndroidVideos() {
		var videoList = document.getElementsByTagName('video')
		for (var i=0; i<videoList.length; i++) {
			var v = videoList[i];
			  v.onclick = function() {
			    /*if (this.paused) {
			    	alert('x')
			      this.play();
			    } else {
			    	alert('y')
			      this.pause();
			    } */
			};
			
			var oldIE = CSSHelpers.isMemberOfClass(document.body, 'oldIE');
			if (oldIE) {
				v.innerHTML = v.innerHTML.replace("<!--", "").replace("-->", "");
			}
		}
	}
	
	var CSSHelpers = new function () {
		var me = this;
		var blankRe = new RegExp('\\s');
		
		function getClassReString(className) {
			return '\\s'+className+'\\s|^' + className + '\\s|\\s' + className + '$|' + '^' + className +'$';
		}
			
		me.getElementsByClassName = function (obj, className)
		{
			if (obj.getElementsByClassName) {
				return DOMHelpers.nodeListToArray(obj.getElementsByClassName(className))
			}
			else {
				var a = [];
				var re = new RegExp(getClassReString(className));
				var els = DOMHelpers.getAllDescendants(obj);
				for (var i = 0, j = els.length; i < j; i++) {
					if (re.test(els[i].className)) {
						a.push(els[i]);
						
					}
				}
				return a;
			}
		}
		
		/**
		 * Make an HTML object be a member of a certain class.
		 * 
		 * @param {Object} obj - an HTML object
		 * @param {String} className - a CSS class name.
		 */
		me.addClass = function (obj, className) {
			if (blankRe.test(className)) {
				return;
			}
			
			// only add class if the object is not a member of it yet.
			if (!me.isMemberOfClass(obj, className)) {
				obj.className += " " + className;
			}
		}
		
		/**
		 * Make an HTML object *not* be a member of a certain class.
		 * 
		 * @param {Object} obj - an HTML object
		 * @param {Object} className - a CSS class name.
		 */
		me.removeClass = function (obj, className) {
		
			if (blankRe.test(className)) {
				return; 
			}
			
			
			var re = new RegExp(getClassReString(className) , "g");
			
			var oldClassName = obj.className;
		
		
			if (obj.className) {
				obj.className = oldClassName.replace(re, '');
			}
		
		
		}
		
		/**
		 * Determines if an HTML object is a member of a specific class.
		 * @param {Object} obj - an HTML object.
		 * @param {Object} className - the CSS class name.
		 */
		me.isMemberOfClass = function (obj, className) {
			
			if (blankRe.test(className))
				return false;
			
			var re = new RegExp(getClassReString(className) , "g");
		
			return (re.test(obj.className));
		
		
		}
	}
	
	var DOMHelpers = new function () {
		var me = this;
		/******
		* Converts a DOM live node list to a static/dead array.  Good when you don't
		* want the thing you are iterating in a for loop changing as the DOM changes.
		* 
		* @param {Object} nodeList - a node list (like one returned by document.getElementsByTagName)
		* @return {Array} - an array of nodes.
		* 
		*******/
		me.nodeListToArray = function (nodeList) 
		{ 
		    var ary = []; 
		    for(var i=0, len = nodeList.length; i < len; i++) 
		    { 
		        ary.push(nodeList[i]); 
		    } 
		    return ary; 
		} 
		
		me.getAllDescendants = function(obj) {
			return obj.all ? obj.all : obj.getElementsByTagName('*');
		}
	}
}

EventHelpers.addPageLoadEvent('USMPage.init');
