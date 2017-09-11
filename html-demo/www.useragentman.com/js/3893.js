var dragObject = new function () {
	var me = this;
	
	var dragNode, targetNodes, coords, startCoords; 
	
	me.init = function () {
	
		if (EventHelpers.hasPageLoadHappened(arguments)) {
			return;
		}	
		
		dragNodes=[document.getElementById('toDrag'), document.getElementById('toDrag2')];
		for (var i=0; i<dragNodes.length; i++) {
			var dragNode = dragNodes[i];
			/* These are events for the draggable object */
			EventHelpers.addEvent(dragNode, 'dragstart', dragStartEvent);
			EventHelpers.addEvent(dragNode, 'drag', dragEvent); 
			EventHelpers.addEvent(dragNode, 'dragend', dragEndEvent);
			EventHelpers.addEvent(dragNode, 'click', function (e) { EventHelpers.preventDefault(e) });
		}
		/* These are events for the object to be dropped */
		
		
		targetNodes=[document.getElementById('container'), document.getElementById('container2')];
		
		for (var i=0; i<targetNodes.length; i++) {
			var targetNode = targetNodes[i];
			EventHelpers.addEvent(targetNode, 'dragover', dragOverEvent);
			EventHelpers.addEvent(targetNode, 'drop', dropEvent);
		}
		
		
		 
	}
	
	function dragStartEvent(e) {
		startCoords = DragDropHelpers.getEventCoords(e);
		
	}

	function dragEndEvent(e) {
		
	}
	
	
	function dragEvent(e) {
		//dragEventNoticeNode.innerHTML = "Currently dragging.";
	}
	
	
	
	
	function dragOverEvent(e) {
		coords = DragDropHelpers.getEventCoords(e);
		
		
		EventHelpers.preventDefault(e);
	}
	
	
	function dropEvent(e) {
		EventHelpers.preventDefault(e);
		var target = e.target;
		
		var dragNode;
		
		if (target.id == 'container') {
			dragNode = document.getElementById('toDrag');
		} else {
			dragNode = document.getElementById('toDrag2');
		}
		
		dragNode.style.left = coords.x - startCoords.x + 'px';
		dragNode.style.top = coords.y + - startCoords.y + 'px';
		
		
	}
	
	
}

// fixes visual cues in IE and Chrome 3.0 and lower.
DragDropHelpers.fixVisualCues=true;

EventHelpers.addPageLoadEvent('dragObject.init');