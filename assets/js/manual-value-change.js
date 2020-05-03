$(document).ready(function() {
    $("#plus-button").click(function(){
        
	    var value = $('#manual-count-number').html();
	    value = isNaN(value) ? 0 : value;
        value++;
        //console.log(value);
	    $('#manual-count-number').html(value);
    }); 
    
    $("#minus-button").click(function(){
        
	    var value = $('#manual-count-number').html();
	    value = isNaN(value) ? 0 : value;
        if (value>0){
            value=value-1;
        }
        //console.log(value);
	    $('#manual-count-number').html(value);
    });
    
});
