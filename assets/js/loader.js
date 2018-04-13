//loader before anything
var pageStatus = null;
var progress = null;
var animationInterval = 33;


function updateProgress(){
    if(pageStatus == "complete"){
        document.getElementById("progress").style.right = "-200px";
    }
    else{            
        if(progress == null){
            progress = 1;
        }
        
        progress = progress + 1;
        if(progress >= 0 && progress <= 30){
            animationInterval += 1;
            document.getElementById("progress").style.right = "-"+(progress*2)+"px";
        }
        else if(progress > 30 && progress <= 60){
            animationInterval += 2;
            document.getElementById("progress").style.right = "-"+(progress*2)+"px";
        }
        else if(progress > 60 && progress <= 80){
            animationInterval += 3;
            document.getElementById("progress").style.right = "-"+(progress*2)+"px";
        }
        else if(progress > 80 && progress <= 90){
            animationInterval += 4;
            document.getElementById("progress").style.right = "-"+(progress*2)+"px";
        }
        else if(progress > 90 && progress <= 95){
            animationInterval += 80;
            document.getElementById("progress").style.right = "-"+(progress*2)+"px";
        }
        else if(progress > 95 && progress <= 99){
            animationInterval += 150;
            document.getElementById("progress").style.right = "-"+(progress*2)+"px";
        }
        else if(progress >= 100){
            document.getElementById("progress").style.right = "-198px";
        }
        setTimeout(updateProgress, animationInterval);    
    }
}

var intervalObject_1 = setInterval(function(){
    var element = document.querySelector("body");
    
    if(element != undefined){
        clearInterval(intervalObject_1);
        element.innerHTML += "<div id='pageloader'><div id='loader'><div id='progress'></div></div></dvi>";
        updateProgress();        

    }
}, 30);