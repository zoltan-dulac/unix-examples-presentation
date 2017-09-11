/*
 * polyClip 1.0 by Zoltan Hawryluk
 * allows cropping of images using non-rectangular shapes.
 * released under the MIT license.
 * 
 * requires jQuery and the dataset plugin: 	http://www.orangesoda.net/jquery.dataset.html
 * 
 * Usage Example: 
 * <div class="cropParent">
 *   <img data-polyclip="357, 0; 378, 421; 0, 203" src="photo.jpg" />
 * </div>
 */

var polyClip = new function () {
	
	/* private variables */
	var me = this,
		ctx,
		images,
		pathFor = [], // lookup table to see paths.
		cache = [],
		canvasCache = [],
		loaded = 0,
		callbacks = [],
		canvasBuffer = document.createElement('canvas'),
		callbacksExecuted = false,
		imagesLoaded = 0,
		isIOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false );
	
	/* public variables */
	// we do not allow iOS to render the SVG because of serious bugs: https://groups.google.com/forum/?fromgroups=#!topic/raphaeljs/oR7cr8aFBSU
	me.supportsSVG = false; //!isIOS && !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect; //document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0");
	me.aniamtionNode = null;
	me.index = -1;
	me.isOldIE = (window.G_vmlCanvasManager);
	me.polygonCache = [];

	
	
	

	me.init = function () {
		me.$animationNode = $('<div id="polyClip-tmp" />');
		document.body.appendChild(me.$animationNode.get(0))
		images = $('img[data-polyclip]');
		images.each(cacheImage);
		//document.body.appendChild(canvasBuffer);
	}
	
	function cacheImage(index, element) {
		
		var im = new Image(); //cache[index];
		$(element).attr('data-polyclip-index', index);
		//console.log(element.id)
		$(im).bind('load', function (e) {
			
			cache.push (e.target);
			//console.log(cache.length);
			drawShape(index, element);
			if (images.length == cache.length) {
				
				me.runCallbacks();
			}
		});
	
		im.src = element.src;
		
	}
	
	
	
	function drawShapeEvent(e) {
		me.index++;
		
		drawShape(me.index, e.target);
	}
	
	
	function supports_canvas() {
	  return !!document.createElement('canvas').getContext;
	}
	
	function randInt(min,max) {
	    return (Math.floor(Math.random()*(max-min+1)))+min
	}
	
	me.clipImage = function (element, clipCoords) {
		var $jNode = $(element);
		$jNode.attr('data-polyclip', clipCoords);
		return drawShape(null, element);
	}
	
	drawShape = function (index, element) {
		var $element = $(element),
			dataPolyclip = $element.attr('data-polyclip'),
			src,
			points = jQuery.trim(dataPolyclip).split(','),
			ctx, bufferCtx, src = element.src, $svg, $poly, sb,
			id = element.id?element.id:'polyClip' + index,
			r = $element;
			dataset = $element.dataset();
		sb = [];
					
		for (var i=0; i<points.length; i+=2) {
			var x = parseInt(jQuery.trim(points[i]));
			var y = parseInt(jQuery.trim(points[i+1]));
			
			sb.push(x + ',' + y + ' ');
		}
					
					
					
		switch (element.nodeName.toUpperCase()) {
		
			case "IMG":
				if (me.supportsSVG) {
					
					var widthHeight = 'width="' +
							element.offsetWidth + '" height="' +
							element.offsetHeight + '"',
						
						
						//$svg = $(document.createElement('svg'));
							svgNode = new DOMParser().parseFromString(
							   '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="' + id + 
								   '" class="polyClip-clipped" xmlns:xlink="http://www.w3.org/1999/xlink" ' + widthHeight + 
								   '><defs><pattern id="polyClip-img-for-' + id + '" patternUnits="userSpaceOnUse" ' +
									widthHeight + '><image xlink:href="' + 
									src + '" x="0" y="0" ' +
									widthHeight + '/></pattern></defs><polygon id="polyClip-poly-for-' + id
									+ '" points="' + sb.join() + '" style="fill:url(\'#polyClip-img-for-' + id + '\');" /></svg>',
							   'application/xml'),
							importNode = element.ownerDocument.importNode(svgNode.documentElement, true);
							//dataset = $element.dataset();
						$element.attr('id', '').replaceWith(importNode);
						$svg = $(importNode);
						$svg.dataset(dataset);
						
							
						me.polygonCache[id] = $('#polyClip-poly-for-' + id, $svg).get(0);
						r = $svg;
						
				} else {
					var canvas = document.createElement('canvas');
					canvas.width = element.offsetWidth;
					canvas.height = element.offsetHeight;
					canvasBuffer.width = canvas.width;
					canvasBuffer.height = canvas.height;
					
					canvas.id = id;
					
					
					$(canvas).dataset(dataset)
							 .attr('data-src', src)
							 .addClass('polyClip-clipped');  
					
					
					
					$element.replaceWith(canvas);
					
					if (me.isOldIE) {
						G_vmlCanvasManager.initElement(canvas);
					}
					
					
					ctx = canvas.getContext("2d");
					canvasCache[id] = ctx;
					
					
					$(window).trigger('resize');
					r = $(canvas);
				}
				break;
			case "SVG" :
				//$(element.getElementsByTagName('polygon')[0]).attr('points', sb.join());
				me.polygonCache[id].setAttribute('points', sb.join());
				break;
			case "CANVAS":
				canvas = element;
				src=$element.attr('data-src');
				ctx = canvasCache[id];
				break;
		
		}
		
		if (!me.supportsSVG) {
			
			pathFor[canvas.id] = [];
			
			
					
	
			
			
			var minx=0, maxx=canvas.width, miny=0, maxy = canvas.height;
			
			ctx.save();
			ctx.clearRect (0, 0 , canvas.width, canvas.height);
			//canvas.width = canvas.width;
			
		    ctx.beginPath();
		   	
			
			for (var i=0; i<points.length; i+=2) {
				
				//var point = points[i].split(',');
				var x = parseInt(jQuery.trim(points[i]));
				var y = parseInt(jQuery.trim(points[i+1]));
				
				
				
				pathFor[canvas.id].push({
					x: x,
					y: y
				});
				if (i == 0) {
					
					ctx.moveTo(x,y);
				} else {
					ctx.lineTo(x,y);
				}
				
				
				
			}
			
			ctx.closePath()
			
		   	if (me.isOldIE) {
		   		/*  
		   		 * excanvas doesn't implement fill with images, so we must hack the 
		   		 * resultant VML.
		   		 */
		   		ctx.fillStyle = '';
		   		ctx.fill(); 
		   		var fill = $('fill', canvas).get(0);
		   		
				fill.color = '';
				fill.src = src;
				fill.type = 'tile';
				fill.alignShape = false;
				
		   	} else {
				var imageObj = getFromCache(src);
			   	
			    var pattern = ctx.createPattern(imageObj, "repeat");
			        
			    ctx.fillStyle = pattern;
			    ctx.fill();
					
					
					
					/*
					 * The if statement below fixes a problem in Chrome 15 (and
					 * possibly other versions) where the image doesn't fill correctly.
					 * This forces a reload of the image from the server in that 
					 * case.
					
					var now = new Date().getTime();
					if (!isImageThere(canvasBufferCtx, points)) {
						if (imageObj.src.indexOf('?') < 0) {
							imageObj.src += "?" + now; 
						}
					} */
					// Now .. place buffer in visible canvas
					//console.log(minx, miny, maxx, maxy);
					/* var data = canvasBufferCtx.getImageData(minx, miny, maxx, maxy);
					ctx.clearRect (0, 0 , canvas.width, canvas.height);
					ctx.putImageData(data, 0, 0); */
					
					
			    
			    
			}
			ctx.restore();
		}
		
	   	return r;
	   	
	}
	
	function isImageThere(ctx, points) {
		var r;
		var x0 = parseInt(jQuery.trim(points[0]));
		var y0 = parseInt(jQuery.trim(points[1]));
		
		for (var i=-1; i<=1; i++) {
			for (var j=0; j<=1; j++) {
				r = ctx.getImageData(x0 +i, y0 +j, 1, 1).data[3];
				if (r!=0) {
					return true;
				}
			}
		}
		
		return false;
		
		
	}
	
	me.findObject = function (e) {
		var target = e.currentTarget;
		
		/* If the target is an image, then we should return the parent */
		if ($(target).hasClass('cropParent')) {
			return $(target);
		}
		
		for (var i in pathFor) {
			if (pathFor.hasOwnProperty(i)) {
				var jEl = $('#' + i);
				var x = e.pageX;
				var y = e.pageY;
				if (me.isInPolygon(jEl, x, y, true)) {
					return jEl;
				}
			}
			
		}
	}
	
	/* 
	 * isInPolygon: Fast algorithm that returns whether a point is inside a polygon, 
	 * given a set of points. From http://www.visibone.com/inpoly/
	 */
	
	me.isInPolygon = function (jObj, xt, yt, withOffset) {
	{
			 
			var obj = jObj.get(0);
			var poly = pathFor[obj.id];
			var npoints = poly.length;
		    var xnew,ynew, xold,yold, x1,y1, x2,y2, i, inside=false, offsets={left:0, top:0};
		    
		
			if (withOffset) {
				offsets = jObj.offset();
			} 
		
		     if (npoints < 3) {
		          return(false);
		     }
		     
		     xold=poly[npoints-1].x + offsets.left;
		     yold=poly[npoints-1].y + offsets.top;
		     
		     
		     
		     for (i=0 ; i < npoints ; i++) {
		          xnew=poly[i].x + offsets.left;
		          ynew=poly[i].y + offsets.top;
		          if (xnew > xold) {
		               x1=xold;
		               x2=xnew;
		               y1=yold;
		               y2=ynew;
		          }
		          else {
		               x1=xnew;
		               x2=xold;
		               y1=ynew;
		               y2=yold;
		          }
		          if ((xnew < xt) == (xt <= xold)          /* edge "open" at one end */
		           && (yt-y1)*(x2-x1)
		            < (y2-y1)*(xt-x1)) {
		               inside=!inside;
		          }
		          xold=xnew;
		          yold=ynew;
		     }
		     return(inside);
		}
		
		
	}
	
	function getFromCache(src) {
		
		for (var i=0, im; i<cache.length; i++) {
			im = cache[i];
			if (im.src == src) {
				return im;
			}
		}
		return null;
	}
	
	
	me.addCallback = function (f) {
			callbacks.push(f);
	}
	
	me.runCallbacks = function () {
		for (var i=0; i<callbacks.length; i++) {
			callbacks[i]();
		}
	}
}

// Minimizes FOUC in newer browsers. If older browsers that don't understand
// attribute selectors, add a class of polyClip to the images you are clipping.
document.write('<style type="text/css">img[data-polyclip], img.polyClip { visibility: hidden; }</style>')

if (polyClip.isOldIE) {
	$(window).bind('load', polyClip.init);
} else {
	$(document).ready(polyClip.init);
}