$(document).ready(function() {

// To do
//		Optimize images in animals, background images, camo patterns, flags
//		Integrate pattern generator (on a separate page)
//		Add credits section to HTML

// HTML to do
//		Ensure headers AND nav bars AND scripts are uniform for index and pattern builder
//		Adjust links to point to index and pattern builder


	grabJSON();
	chooseBackground();
	adjustTitleSize();
	changeLogo('#picture-logo-2','#picture-logo-1');
	centerColors();
	adjustHistoryPic();
	changeCountryTextWidth();

	$(window).scroll(function(e){
		bgOpacityScroll();
		titleScroll();
	});

	$(window).resize(function(e) {
		centerColors();
		adjustTitleSize();
		adjustHistoryPic();
		changeCountryTextWidth();
	});

	// selects random background
	// note that you have to manually change 'k' assignment if you add files
	// to the images/bgs directory. also, images have to be named numerically.
	function chooseBackground() {
		var k = ~~(Math.random()*5) + 1;
		$('#bg-image').css('background-image', 'url("../images/bgs/'+k+'.jpg")');
	}

	// changes size of main title depending on window width
	function adjustTitleSize() {
		var titleHead = $('#title-head h1');
		var catchPhrase = $('#title-head h2');
		if ($(window).width() > 624) {
			titleHead.css('font-size','6em');
			catchPhrase.css('font-size', '2.5em');
		}

		else {
			titleHead.css('font-size','3em');
			catchPhrase.css('font-size', '1.5em');
		}
	}

	// cycles through logo images to create chameleon effect
	function changeLogo(id1, id2) {
		var arr = [1,2,3,4,5,6];
		var rand = Number(arr.splice(~~(Math.random()*5),1));
		$(id1).animate({
			opacity: 0,
		}, 2700, function() {
			$(id2).css('z-index','0');
			$(id1).css({'opacity':'1', 'z-index':'-1'}).attr('src','images/logo/chamo-logo-' + rand + '.png');
			changeLogo(id2,id1);
		});
	}

	// background opacity change with scroll
	function bgOpacityScroll(){
		var scrolled = $(window).scrollTop();
		var bgHeight = $('#bg-image').height();
		var scrolledPercent = ((bgHeight - scrolled) / bgHeight);

		var k = Math.min(1 - scrolledPercent, 0.6);

		$('.navbar-fixed-top').css('background-color','rgba(101,101,90,'+k+')');

		if (scrolledPercent >= 0) {
			$('#bg-image').css('opacity', scrolledPercent);
		}
		else $('#bg-image').css('opacity',0);
	}

	// title position change with scroll
	function titleScroll() {
		var scrolled = $(window).scrollTop();
		$('#title-head').css('top', (scrolled/3) +'px');
	}

	// populates swatches and randomly assigns backgrounds to logo
	function grabJSON() {
		$.getJSON('js/data.json', function(data) {
			var camoData = data.camoData;
			$('.country').each(function(i) {

				$('.country-name',this).append(camoData[i].NAME);
				$('.pat-name',this).append(camoData[i].PATNAME);
				$('.camo-type',this).css('background-image', 'url('+camoData[i].CAMOLOC+')');
				$('.flag-container',this).append('<img src='+camoData[i].FLAGLOC+'>');
				$('.pat-info',this).append(camoData[i].INFO);

				$('.pat-hex-color-hover',this).each(function(j) {
					var $this = $(this);
					$this.parent().css('background-color',camoData[i].HEXCOLORS[j]);
					if (camoData[i].HEXCOLORS[j]) {
						$this.append('<p>'+camoData[i].HEXCOLORS[j]+'</p>');
					}
					else {
						$this.parent().css('background-image','url(../images/diagonal.png)');
						$this.remove();
					}
				});
			});
		});
	}

	// adjusts height of history picture container
	function adjustHistoryPic() {
		var histPic = $('.history-pic-container');
		if ($(window).width() < 1000) {
			histPic.height(275);
		}
		else {
			var k = $('#history-text').height();
			histPic.height(k);
		}
	}

	// changes width of information boxes
	function changeCountryTextWidth() {
		var targetWidth = $('.camo-type').outerWidth();
		$('.country-text').outerWidth(targetWidth);
	}

	// dynamically centers color boxes depending on container width
	function centerColors() {
		var colorWidth = $('.pat-hex-color').outerWidth(true) * 4;
		var containerWidth = $('.country-text').width();
		var padding = (containerWidth - colorWidth) / 2;
		$('.pat-hex-container').css({'width':containerWidth + 'px', 'padding-left': padding + 'px', 'padding-right':padding + 'px'});
	}

	// makes flag pop up when hovering over camo
	$('.patterns-animate').hover(function() {
		var $this = $(this);
		$('.flag-container', $this).css('display','block');
		$('.flag-container', $this).removeClass('flipOutX');
		$('.flag-container', $this).addClass('flipInX');

	}, function() {
		var $this = $(this);
		$('.flag-container', $this).removeClass('flipInX');
		$('.flag-container', $this).addClass('flipOutX');

	});

	// makes hex value pop when hovering over color
	$('.pat-hex-color').hover(function() {
		var $this = $(this);
		$('.pat-hex-color-hover', this).stop().animate({'height':'30px','width':'80px'},200, function() {
			$('.pat-hex-color-hover',$this).css('border','1px solid gray');
			$('.pat-hex-color-hover p',$this).css('opacity','1');
		});
	}, function() {
		var $this = $(this);
		$('.pat-hex-color-hover',this).stop().animate({'height':'0px','width':'0px'},200, function() {
			$('.pat-hex-color-hover',$this).css('border','0');
			$('.pat-hex-color-hover p',$this).css('opacity','0');
		});
	});

	// EXPERIMENTAL

	$('.patterns-animate').click(function() {
		var parent = $(this).parent();
		$('.country-text', parent).slideToggle('fast');
	});



});



// for bg image parallax
		// var docHeight = $('body').height();
		// var scrolledPercent = ($(window).scrollTop() / docHeight) * 100;
		// var scaledPercent = scrolledPercent / 2;
		// var scrolled = $(window).scrollTop();
		// var currentTop = $('#bg-parallax').css('top');
		// $('#bg-parallax').css('top', (currentTop-scrolled)+'px');
		// $('#bg-parallax').css('background-position', '50%'+'%'+(50 - scaledPercent)+'%');

// previously a part of swatches animate hover. added white background to flag.
		// $('.flag-container-bg', this).stop().animate({'margin-top':'0px'},200, function() {
		// 	$('.flag-container', $this).css('display','block');
		// 	$('.flag-container', $this).removeClass('flipOutX');
		// 	$('.flag-container', $this).addClass('flipInX');
		// });

		// $('.flag-container-bg', this).stop().animate({'margin-top':'200px'},200, function() {
		// 	$('.flag-container', $this).removeClass('flipInX');
		// 	$('.flag-container', $this).addClass('flipOutX');
		// });

	// css bit for above
		// .flag-container-bg {
		// 	height: 200px;
		// 	width: 100%;
		// 	margin-top: 200px;
		// 	display: block;
		// 	background-color: white;
		// 	position: absolute;
		// }

// previously selected random background images for a set of divs
		// var k = data.camoData.length,
		// 	l = [];
		// for (i=0; i<k; i++) l.push(i);
		// var x = Number(l.splice(~~(Math.random()*k),1));
		// var y = Number(l.splice(~~(Math.random()*(k-1)),1));
		// var z = Number(l.splice(~~(Math.random()*(k-2)),1));
		// $('#logo-1').css('background-image','url('+data.camoData[x].CAMOLOCTHUMB+')');
		// $('#logo-2').css('background-image','url('+data.camoData[y].CAMOLOCTHUMB+')');
		// $('#logo-3').css('background-image','url('+data.camoData[z].CAMOLOCTHUMB+')');

	// html for above
     	//<div id="logo">
    	// 	<div class="logo-animated logo-props" id="logo-1"></div>
    	// 	<div class="logo-animated logo-props" id="logo-2"></div>
    	// 	<div class="logo-animated logo-props" id="logo-3"></div>
    	// </div>

    // css for above
		// #logo {
		// 	width: 150px;
		// 	height: 150px;
		// 	float: left;
		// 	position: relative;
		// 	top: -20px;
		// 	left: 50%;
		// 	margin-right: -50%;
		// 	-webkit-transform: translate(-50%, -50%);
		// 	-moz-transofrm: translate(-50%, -50%);
		// 	-ms-transform: translate(-50%, -50%);
		// 	z-index: -1;
		// }

		// .logo-props {
		// 	background-position: center;
		// 	background-size: 100%;
		// }

		// #logo-1 {
		// 	-webkit-transform: translate(100%,0%);
		// 	-moz-transofrm: translate(100%,0%);
		// 	-ms-transform: translate(100%,0%);
		// }

		// #logo-2 {
		// 	-webkit-transform: translate(-20%,50%);
		// 	-moz-transofrm: translate(-20%,50%);
		// 	-ms-transform: translate(-20%,50%);	
		// }

		// #logo-3 {

		// 	-webkit-transform: translate(90%,110%);
		// 	-moz-transofrm: translate(90%,110%);
		// 	-ms-transform: translate(90%,110%);	
		// }

		// .logo-animated {
		// 	position: absolute;
		// 	border-radius: 5px;
		// 	width: 52px;
		// 	height: 52px;
		// 	opacity: 1;
		// 	border: 1px solid black;
		//     -webkit-animation: logo-bounce-out 1.8s ease-out 0.5s 1; 
		// 	-webkit-animation-fill-mode: both; 
		// 	-webkit-animation-direction: alternate;
		//     animation: logo-bounce-out 1.8s ease-out 0.5s 1;
		//     animation-fill-mode: both; 
		//     animation-direction: alternate;
		// }

