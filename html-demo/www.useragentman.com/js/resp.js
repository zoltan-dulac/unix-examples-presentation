/* 
 * Touche.jsseamless touch event mapping for your click events
 * http://benhowdle.im/touche/
 */

!function(){"use strict";function a(b){if(!(this instanceof a))return new a(b);if(!b)throw new Error("No DOM elements passed into Touche");return this.nodes=b,this}var b="ontouchstart"in window||"msmaxtouchpoints"in window.navigator;if(a.prototype.on=function(a,c){var d,e,f=this.nodes,g=f.length;if(b&&"click"===a&&(d=!0),e=function(a,b,c){var e,f=function(){!e&&(e=!0)&&c.apply(this,arguments)};a.addEventListener(b,f,!1),d&&a.addEventListener("touchend",f,!1)},g)for(;g--;)e(f[g],a,c);else e(f,a,c);return this},window.Touche=a,window.jQuery&&b){var c=jQuery.fn.on;jQuery.fn.on=function(){var a=arguments[0];return arguments[0]="click"===a?"touchend":a,c.apply(this,arguments),this}}}();

/*
 * Some fixes for the old articles to make them responsive
 */

var resp = new function () {
	var me = this
		isLoading = true;
	
	me.init = function () {
		$('#content table').wrap('<div class="tableContainer"><div class="tableWrap"></div></div>');
		$('.spritesheet, .wideImage').wrap('<div class="wideImageContainer"><div class="wideImageWrap"></div></div>')
		  .addClass('wideImage');
		      
		$('img').attr('width', '').attr('height', '');
		
		//$('a[href^="http://www.useragentman.com/blog"], a[href^="/blog"]').each(changeLink);
		
		$('.tableWrap, blockquote.code pre, .imageScrollWrap, .wideImageWrap').on('scroll', scrollEvent).each(scrollEventHelper);
		
		$('iframe').attr('width', '');
		$(window).on('resize', resizeEvent);
		
		isLoading = false;
		
	}
	
	function changeLink(i, el) {
	  var $el = $(el),
	      oldHref = $el.attr('href'),
	      newHref = oldHref + '?mobile=yes';
	  
	  if (oldHref.indexOf('mobile=yes') < 0) {
	      $el.attr('href', newHref);
	  }
	  
	}
	
	function scrollEvent(e) {
	  var target = e.currentTarget;
	  scrollEventHelper(0, target);
	}
	
	function scrollEventHelper(i, target) {
	  var $target = $(target),
	  	  $nodeToChange = $(target.parentNode);
	  
	  if (!isLoading && target.offsetWidth + target.scrollLeft + 5 > target.scrollWidth) {
	    $nodeToChange.addClass('scrolled-to-end');
	  } else {
	    $nodeToChange.removeClass('scrolled-to-end');
	  }
	  
	  
	}
	
	function resizeEvent(e) {
	  $('.tableWrap, blockquote.code pre').each(scrollEventHelper);
	}
}

$(document).ready(resp.init);
