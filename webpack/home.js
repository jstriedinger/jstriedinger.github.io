import "../_sass/home.scss";
import "jquery";
import TweenMax from "gsap/TweenMax"; // imports TweenLite
import TimelineMax from "gsap/TimelineMax"; // imports TimelineLite
import scrollTo from "gsap/ScrollToPlugin";

var gold = "#f7be40";
var gold2 = "#e38c25";

var _isiOS = false;
var _isAndroid = false;
var _isMobile = false;
//To verify if the website is scrolling or not
var _scrolling = false;
//Array to represent all the sections in the page
var _sections = [];
//Represent the current index of the "active" section
var _curSectionIndex = 0;
//Initial navbar relative pos
var initialPos = $("nav").css("left");
//HammerJS object
var hjs = null;
//To know if the initial orientation of the device is portrait of landscape. Default true
var initialPortrait = true;

var specs = {width: 0, height: 0};

var OnMouseWheel=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x

/**
 * Show a specific section of the page
 * @param  int i   index of the section
 * @param  boolean dir direction to now if it going next or previous section
 */
function showSection(i, dir)
{
    _scrolling = true;
    console.log("From section: "+_sections[_curSectionIndex]+" - "+_curSectionIndex);
    if(_isMobile)
    {
        TweenMax.to(window, 0.8, {scrollTo:"#"+_sections[i], onComplete: function(){
            _scrolling = false;
            _curSectionIndex = i;
            console.log("Current section index: "+_curSectionIndex);
        }});
    }
    else{
        var tll2 = new TimelineMax({onComplete: function(){
            $("#"+_sections[_curSectionIndex]).removeClass("active");
            $("#"+_sections[i]).addClass("active");
            _curSectionIndex = i;
            _scrolling = false;
            console.log("Current section index: "+_curSectionIndex);
        }});
        if(dir)
        {
            //Next
            tll2.staggerTo("#"+_sections[_curSectionIndex]+"> *", 0.8, {y:-200,opacity:0, clearProps:'y'}, 0.4)
            tll2.to(window, 0.2, {scrollTo:"#"+_sections[i]});
            tll2.staggerFrom("#"+_sections[i]+"> *", 0.8, {y: 200}, 0.4, "same");
            tll2.staggerTo("#"+_sections[i]+"> *", 0.8, {opacity: 1}, 0.4, "same");
        }
        else
        {
            tll2.staggerTo("#"+_sections[_curSectionIndex]+"> *", 0.8, {y:200,opacity:0, clearProps:'y'}, 0.4)
            tll2.to(window, 0.2, {scrollTo:"#"+_sections[i]});
            tll2.staggerFrom("#"+_sections[i]+"> *", 0.8, {y: -200}, 0.4, "same");
            tll2.staggerTo("#"+_sections[i]+"> *", 0.8, {opacity: 1}, 0.4, "same");

        }
        tll2.play();
    }
}
//Wrapper to add .next and .prev to our sections array. Transforming it in some kind of iterator
var iterify = function(){
    _sections.next = (function () { 
        if (_curSectionIndex < this.length-1 && !_scrolling){
            showSection(_curSectionIndex + 1, true);
        }
        return false;
    });
    _sections.prev = (function () {
        if (_curSectionIndex >0 && !_scrolling){
            showSection(_curSectionIndex - 1,false);
        }
        return false;
    });

    _sections.goTo = (function (section) {
        var i = _sections.indexOf(section);
        if (i > -1 && _curSectionIndex != i && !_scrolling){
            if(i<_curSectionIndex)
                showSection(i,false);
            else
                showSection(i,true);
        }
    });
    return _sections;
};
iterify();



function checkMobileUserAgent(onlyMobile) {
    if(!onlyMobile)
    {
        //1. Check iOS
        var iDevices = [
            'iPhone Simulator',
            'iPod Simulator',
            'iPhone',
            'iPod'
        ];
        while (iDevices.length) {
            if (navigator.platform === iDevices.pop())
                _isiOS = true;
        }
        //2. Check Android
        if( navigator.userAgent.toLowerCase().indexOf('android') >= 0 )
            _isAndroid = true;
    }
    //3. Check if mobile by width
    var width = 0;
    if(initialPortrait)
        screen.orientation.angle == 0 ? width = specs.width : width = specs.height;
    else
        screen.orientation.angle == 0 ? width = specs.height : width = specs.width;

    width <= 992 ? _isMobile = true : _isMobile = false;
}
function onMouseWheelScroll(e){
    if(!_scrolling && !_isMobile)
    {
        var evt= window.event || e; //equalize event object
        var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta; //check for detail first so Opera uses that instead of wheelDelta
        if (delta>0)
            _sections.prev();
        else
            _sections.next();
    }
}

function setupHammerJS(){
    if (('ontouchstart' in window || navigator.msMaxTouchPoints > 0) && !_isMobile) {
        hjs = new Hammer(document.getElementsByTagName('main')[0]);
        hjs.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL,threshold: 20 });
        console.log("HammerJS fconfiged");
        hjs.on("swipe",function(e){
            console.log("Swipe in hjs");
            if(!_scrolling)
            {
                console.log("not scrolling");
                if(e.offsetDirection == 8)
                    _sections.next();
                else
                    _sections.prev();
            }
        });
    }
    else
    {
        console.log("UNconfig hammerjs");
        if (typeof hjs !== 'undefined' && hjs !== null)
        {
            hjs.off("swipe");
            hjs.destroy();
            $('main').css('touch-action', 'auto');
        }
    }

}
function init(){

    specs.width = $(window).width(); 
    specs.height = $(window).height(); 
    //1. Dynamically create sections and navbar
    $("main").find("section").each(function(){
        var id = $(this).attr('id');
        var nav = $(this).data("title");
        _sections.push(id);
        $("nav > ul").append("<li class='item'><a href='#' data-section='"+id+"'>"+nav+"</a></li>");
    });

    //2. Add click handlers for navbar links
    $("nav > ul > li > a").click(function(e)
    {
        var section = $(this).data("section");
        _sections.goTo(section);
        moveNavbar(false);
        if(history.pushState) {
            history.pushState(null, null, "#"+section);
        }
        else {
            location.hash = "#"+section;
        }
        e.preventDefault();
    });


    //3. Checks if device is mobile and/or android/iOS device
    screen.orientation.angle == 0 ? initialPortrait = true : initialPortrait = false;
    checkMobileUserAgent(false);

    //4. Navigation process
    //4.1 Disable mobile scrolling. We are gonna use OUR own implementation with Hammer
    document.ontouchstart = function(e) {
        if( !_isMobile && (_isAndroid || _isiOS) )
        {
            e.preventDefault(); 
        }
    }       
    document.ontouchmove = function(e) {
        if( !_isMobile && (_isAndroid || _isiOS) )
        {
            e.preventDefault(); 
        }
    }

    //4.2 Mouse wheel navigation
    if (document.attachEvent){ 
        document.attachEvent("on"+OnMouseWheel, onMouseWheelScroll);
    }
    else if (document.addEventListener){ //WC3 browsers
        document.addEventListener(OnMouseWheel, onMouseWheelScroll, false);
    }

    //4.3 Touch navigation
    setupHammerJS();

    //4.4 Arrow key navigation
    if(!_isMobile)
    {
        $(document).keyup( function(e){
            if(!_scrolling)
            {
                switch( e.which )
                {
                    case 38:
                        _sections.prev();
                        return false;
                        break;
                    case 40:
                        _sections.next();
                        return false;
                        break;
                        
                }
            }
        });
    }

    //5. Check if there is hash in url
    if (location.hash){
        var part = location.hash.substring(1);
        var hash = part.split("?")[0];
        var i = _sections.indexOf(hash); 
        if(i >= 0)
            _sections.goTo(hash)
        else{

            location.hash = "";
            _sections.goTo("home")
        }
    }
    else
    {
        TweenMax.to(window, 0.5, {scrollTo:"#home"});
        window.scrollTo(0,0);
    }
}

window.document.addEventListener("readystatechange", function(){
    if(document.readyState == "complete"){
    	pageStatus = "complete";
        init();
    	setTimeout(function(){
    		var tll = new TimelineMax({onComplete: function(){
                document.getElementById('pageloader').parentNode.removeChild(document.getElementById('pageloader'));
                $("h1.title span.progress").remove();
    		}});
    		tll.to("#loader",1.2,{top:"-60%",opacity:0, ease: Back.easeIn.config(1.4)});
            tll.to("#pageloader",0.6,{opacity:0});
    		tll.staggerTo("#home h1.title span.progress",1.8,{left:"100%"}, 0.9);
    		tll.play();
            
            
            
        }, 1000);
    }
}, false);

function moveNavbar(open)
{
    var tll = new TimelineMax();
    if(open)
    {
        tll.to(".hamburger.open",1,{left:"-5.5rem",opacity:0.2, ease: Back.easeIn.config(2)});
        tll.to("nav",1.4,{left:"-20px",opacity:1});
    }
    else
    {
        tll.to("nav",1.4,{left:initialPos,opacity:0.2, ease: Back.easeIn.config(1.4)});
        tll.to(".hamburger.open",1,{left:"0px",opacity:1});
    }
}

$(document).ready(function(){
    
    $(".hamburger.open").click(function(){
        moveNavbar(true)
    });
    $(".hamburger.close").click(function(){
        moveNavbar(false)
    })

    $(window).bind( 'orientationchange', function(e){
        checkMobileUserAgent(true);
        setupHammerJS();
        _sections.goTo("home");
        TweenMax.to(window, 0.5, {scrollTo:"#home"});
        window.scrollTo(0,0);
        if(_isMobile)
            TweenMax.set("section > *",{clearProps: "all"});
        _scrolling = false;
    });


});