var progressTest = new function () {
	var me = this;
	
	var counter = 1;
	
	me.init = function () {
		$('progress').each( function (index, element) {
			var $el = $(element);
			if ($el.next().hasClass('arrow') || $el.next().hasClass('after')) {
				$el = $el.next();
			}
			
			if (!element.id) {
				element.id = 'id' + counter;
				counter++;
			}
			
			
			$el.after('<input type="submit" class="progressTest" data-for="'+ element.id + '" value="Test Progress Bar" />')
		});
		
		$('.progressTest').click(function (e) {
			e.preventDefault();
			var id = $(e.target).attr('data-for');
			
			var el = $('#' + id ).get(0);
			
			setTimeout(function () {
				startHelper(el);
			}, 200);
		});

	}
	
	function startHelper(el) {
		
		startTimeout(0, el, 100);
	
		
	}
	
	function startTimeout(n, el, ms) {
		 
		var val = parseInt(el.value);
		el.value = n;
		
		if (parseInt(el.value) < 100) {
			setTimeout(function() {
				startTimeout(n+10, el, ms)
			}, ms);
		}	
	}
}


$(document).ready(progressTest.init)
