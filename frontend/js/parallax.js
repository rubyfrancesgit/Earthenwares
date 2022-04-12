$(window).scroll(function() {
    parallax();
})

function parallax() {

    var wScroll = $(window).scrollTop();
    // console.log(wScroll)

    
    $('.parallax--speed1').css('top', (wScroll*0.15)+'px');

    $('.parallax--speed2').css('bottom', (wScroll*0.30)+'px');

    $('.parallax--speed3').css('bottom', (wScroll*0.20)+'px');

    

}

// parallax();