 
var currentSongNum = 0;

// Add a general loading
$(window).on("load", function() {
    $(".loader").fadeOut("slow");

    // INIT AOS
	AOS.init({
	    duration: 1200,
	})

	    //fullpage
    new fullScroll({
		mainElement: 'fullpage',
		displayDots: true,
		dotsPosition: 'right',
		animateTime: 2.5,
		animateFunction:'ease'
	});


});

// Menu
(function() {
    var container = document.querySelector('.sg-wrapper'),
        triggerBttn = document.getElementById('trigger-overlay'),
        overlay = document.querySelector('.overlay'),
        closeBttn = overlay.querySelector('.overlay-close');
    	transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
        support = {
            transitions: Modernizr.csstransitions
        };


    function toggleOverlay() {
        if (classie.has(overlay, 'open')) {
            classie.remove(overlay, 'open');
            classie.remove(container, 'overlay-open');
            classie.add(overlay, 'close');
            var onEndTransitionFn = function(ev) {
                if (support.transitions) {
                    if (ev.propertyName !== 'visibility') return;
                    this.removeEventListener(transEndEventName, onEndTransitionFn);
                }
                classie.remove(overlay, 'close');
            };
            if (support.transitions) {
                overlay.addEventListener(transEndEventName, onEndTransitionFn);
            } else {
                onEndTransitionFn();
            }
        } else if (!classie.has(overlay, 'close')) {
            classie.add(overlay, 'open');
            classie.add(container, 'overlay-open');
        }
    }

    triggerBttn.addEventListener('click', toggleOverlay);
    closeBttn.addEventListener('click', toggleOverlay);

    var menuOption = $(overlay).find('.option');
    $(menuOption).on('click', function(e){
      e.preventDefault();
      $(overlay).removeClass('open');
      var section = parseInt($(this).attr('href').replace('#song-',''));
      if($(this).attr('href') != 'cover'){
        section = section;
        currentSongNum = section - 1;
      } else {
        //section = 1;
       // currentSongNum = section-1;
      }

      
      location.replace("#" + section);
      //fullpage_api.moveTo(section,0);
     // fullScroll.changeCurrentPosition(section);
    });


    //SCROLL
	var lastScrollTop = 0;
	var allSongs = document.getElementsByClassName("js-song");
	var currentLyric;
	var lastLyric = false;
	var listenToWheel = true;

	var lyricsInSong = allSongs[currentSongNum].getElementsByClassName("js-lyric");
	var thisLyricNum;
	var prevLyricNum;
	var thisLyric;
	var prevLyric;
	var TStart;
	var TEnd;

	$('.js-song').on('touchstart', touchHandlerStart);
	$('.js-song').on('touchend', touchHandlerEnd);

	//window.addEventListener('scroll', _.throttle(handleMove, 1000, { leading: true, trailing: true}));

	 $('.js-song').on('scroll wheel', _.throttle(function(e){
    	handleMove(e);
  	}, 900));

	//$('.js-song').on('scroll wheel', _.throttle(handleMove(e), 1000, { leading: true, trailing: true}));

	//$('.js-song').on('scroll wheel', function (e) {

		/*
  	  if(parseInt(location.hash.replace('#', '').split('/')[0]) == 14 ){
	  	listenToWheel =true;
	  	allowScroll();
	  }


	  var ts = window.pageYOffset || document.documentElement.scrollTop;
	  console.log('scroll event:' + ts);
	  var direction =  findScrollDirectionOtherBrowsers(e.originalEvent);

	  if (listenToWheel) {
	    listenToWheel = false;

	    checkEndSong(direction);

	    setTimeout(function(){
	      listenToWheel = true;
	    }, 400);
	  }

	  lastScrollTop = ts <= 0 ? 0 : ts; // For Mobile or negative scrolling
		*/

	//});

	function handleMove(e, direct){
	  if(parseInt(location.hash.replace('#', '').split('/')[0]) == 14 ){
	  	listenToWheel =true;
	  	allowScroll();
	  }

	  console.log('scroll event:' + ts);

	  if(direct === undefined){
	  		  var ts = window.pageYOffset || document.documentElement.scrollTop;
	 		 var direction =  findScrollDirectionOtherBrowsers(e.originalEvent);
	  }else{
	  	direction = direct;
	  }

	  if (listenToWheel) {
	    listenToWheel = false;
	    checkEndSong(direction);
	    setTimeout(function(){
	      listenToWheel = true;
	    }, 100);
	  }

	  //lastScrollTop = ts <= 0 ? 0 : ts; // For Mobile or negative scrolling
	}

	function touchHandlerStart(event) {
				 TStart = parseInt(event.changedTouches[0].clientY);
				    TEnd = 0;
	};

	function touchHandlerEnd (event) {
			console.log('endTouchEvent');
			var direct;
			TEnd = parseInt(event.changedTouches[0].clientY);

						console.log(TStart - TEnd)
						console.log(TEnd - TStart)


			if (TEnd - TStart > 100 || TStart - TEnd > 100) {
				if (TEnd > TStart) {
						direct = -1;console.log('atras')
				} else {
						direct = 1;console.log('adelante')
				}
				handleMove(event, direct)//_self.changeCurrentPosition(_self.defaults.currentPosition);
			}			
	};


	function checkEndSong(direction) {
		console.log('checkendSong');
		dataLyric = (currentSongNum >= 0 && allSongs[currentSongNum].getAttribute('data-lyricnum') ) ? allSongs[currentSongNum].getAttribute('data-lyricnum') : 0;
		thisLyricNum = parseInt(dataLyric);

		console.log('Song Dir: '+ direction);
				console.log('Song Dir: '+ direction);

		if ( (direction == 1 && thisLyricNum == lyricsInSong.length - 1) || (direction == -1 && thisLyricNum == 0) ) {
		  console.log("termino la cancion");
		  var nextSong = parseInt(currentSongNum + parseInt(direction))
		  allowScroll();
		  songChanged(nextSong);
		} else {
		    console.log("la cancion sigue");
		    blockScroll();
    		scrollInSong(direction);
	    }
	}


	function scrollInSong(direction) {

   		console.log("la cancion es: " + currentSongNum);

	 	if(allSongs[currentSongNum]){
		    lyricsInSong = allSongs[currentSongNum].getElementsByClassName("js-lyric");
		    thisLyricNum += direction;
		    prevLyricNum = thisLyricNum + (direction * -1);

		     console.log("este lyric es " + thisLyricNum);
		     console.log("esta cancion tiene " + lyricsInSong.length + " lineas");
		    
		    thisLyric = lyricsInSong[thisLyricNum];
		    prevLyric = lyricsInSong[prevLyricNum];

		    // console.log(thisLyric);
		    showHideLyrics(thisLyric, prevLyric);

		    allSongs[currentSongNum].setAttribute('data-lyricnum',thisLyricNum);
	  	}
	}

	function showHideLyrics(thisLyric, prevLyric) {
	  if (thisLyricNum >= 0) {
	    if(thisLyric){
	      if(prevLyric){
	        prevLyric.classList.add('d-none');
	      }
	      thisLyric.classList.remove('d-none');
	    }
	  }
	}

	function activateEndSong(direction) {
	  // allowScroll();
	  if(direction == 1) {
	    fullpage_api.moveSectionDown();
	  } else {
	    fullpage_api.moveSectionUp();
	  }
	  currentSongNum += direction;
	}

function songChanged(nextSong) {
	console.log(' -- SONGCHANGED -- ');
	console.log('Current: '+currentSongNum);
	console.log('NEXT: '+nextSong);


	if(nextSong<0) 
		currentSongNum= 0;
	else 
		currentSongNum = nextSong;

	 thisLyric = lyricsInSong[0];
    prevLyric = lyricsInSong[thisLyricNum];
    showHideLyrics(thisLyric, prevLyric);
    allSongs[currentSongNum].setAttribute('data-lyricnum',0);
    lyricsInSong = allSongs[currentSongNum].getElementsByClassName("js-lyric");
    console.log(lyricsInSong);
    for(var i = 1; i < lyricsInSong.length; i++)
	{
	    lyricsInSong[i].classList.add('d-none');
	}
		lyricsInSong[0].classList.remove('d-none');

  /*if(currentSongNum >= 0 && allSongs[currentSongNum]){
    thisLyric = lyricsInSong[0];
    prevLyric = lyricsInSong[thisLyricNum];
    showHideLyrics(thisLyric, prevLyric);
    allSongs[currentSongNum].setAttribute('data-lyricnum',0);
    lyricsInSong = allSongs[currentSongNum].getElementsByClassName("js-lyric");
  }
  */

}


	function findScrollDirectionOtherBrowsers(event){
	  var delta;

	  if (event.wheelDelta){
	      delta = event.wheelDelta;
	  } else {
	      delta = -1 * event.deltaY;
	  }

		console.log(delta);
	  if (delta < 0){
	    return 1;
	  }else if (delta > 0){
	    return -1;
	  }
	}


	


})();

function allowScroll() {
	console.log('AllowScroll - songchanged')
	var el = document.getElementById('blocked-scroll');
	el.setAttribute('data-blocked', 0);
	console.log(el.getAttribute('data-blocked'));

}

function blockScroll() {
console.log('blockeo');
	var el = document.getElementById('blocked-scroll');
	el.setAttribute('data-blocked', 1);
	console.log(el.getAttribute('data-blocked'));

}