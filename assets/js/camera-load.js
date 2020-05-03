$(document).ready(function() {
    var video = $('#video');
    
	navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
	if (navigator.getUserMedia) {
        //constraints
        navigator.getUserMedia({video:true, audio:false},handleVideo,videoError)
        
    }
    
    function handleVideo(stream){
        console.log("Good morning today is a wonderful day")
        video.srcObject = stream; 
        video.play();
    }

    function videoError(e){
        alert("Video Error")
    }
                       

});