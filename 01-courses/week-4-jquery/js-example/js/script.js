$(document).ready(function(){
	// $('element').method(argument, callback);
	// alert('Hello world !');
	console.log('Hello world');
	$('.gallery ul li').on('click', function(){
		$('body').css({
			'background':'red',
			'font-size': '20px'
		});
		$(this).hide();
	});
	$('.gallery ul li').on('mouseenter', function(){
		$(this).find('div').slideDown('1000');
	});
	$('.gallery ul li').on('mouseleave', function(){
		$(this).find('div').slideUp('400');
	});

	$('header h1').on('click', function(){
		$('header').append('<nav><ul><li>Menu for Dasha</li></ul></nav>');
	});
	// $('.gallery ul li').click(function(){});
});