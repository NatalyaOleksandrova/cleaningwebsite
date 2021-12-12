
$(document).ready(function(){
	$(".burger-menu ").on("click",function(){
		$(".bar").toggleClass('change');
		$('.list').toggleClass('opening');  
	   });	
	$('.slider').slick({
		infinite: true,
		autoplay: true,
		autoplaySpeed:2000,
		slidesToShow: 1,
		arrows: false,
	});
	$('.t-slider').slick({
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: true,
		responsive: [
			{
			  breakpoint: 900,
			  settings: {
				slidesToShow: 2,
				slidesToScroll: 2,
				
				infinite: true
			  }
			},
			{
			  breakpoint: 550,
			  settings: {
				
				slidesToShow: 1,
				slidesToScroll: 1
			  }
			}
		  ]
	});
	$('.slider-content').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
	});
	$("#phone").mask("+38(000) 000-0000");

	
});


$(document).ready(function () {
	$('#toggle-link').click(function(e) {
		var $message = $('#message');
	 
		if ($message.css('display') != 'block') {
			$message.show();
	 
			var firstClick = true;
			$(document).bind('click.myEvent', function(e) {
				if (!firstClick && $(e.target).closest('#message').length == 0) {
					$message.hide();
					$(document).unbind('click.myEvent');
				}
				firstClick = false;
			});
		}
	 
		e.preventDefault();
	});

    
});
 

	

document.addEventListener("DOMContentLoaded", function(event) { 


	var acc = document.getElementsByClassName("accordion");
	var panel = document.getElementsByClassName('panel');
	
	for (var i = 0; i < acc.length; i++) {
		acc[i].onclick = function() {
			var setClasses = !this.classList.contains('active');
			setClass(acc, 'active', 'remove');
			setClass(panel, 'show', 'remove');
	
			if (setClasses) {
				this.classList.toggle("active");
				this.nextElementSibling.classList.toggle("show");
			}
		}
	}
	
	function setClass(els, className, fnName) {
		for (var i = 0; i < els.length; i++) {
			els[i].classList[fnName](className);
		}
	}
	
	});