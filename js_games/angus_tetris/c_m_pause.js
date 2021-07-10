var CurButton;


var Utility = {

    butSend: function(obj) {
	Utility.but_on(obj);
      //up button
    if(obj == "up_button")  
      if (gameState == "running")
        rotate(currentShape, board, -1);
      //down button
    if(obj == "down_button")  
      if (gameState == "running")
        rotate(currentShape, board, 1);
     //left
    if(obj == "left_button")  
      if (gameState == "running")
        move(currentShape, board, -1, 0);
     //right
    if(obj == "right_button")  
      if (gameState == "running")
       move(currentShape, board, 1, 0);
    //drop
    if(obj == "drop_button")  
      if (gameState == "running")
        drop(currentShape, board);
    //pause
    if(obj == "pause_button")  
      if (gameState == "running")
        pause();
      else
        resume();
   },

    but_on: function(obj) {
        var but = document.getElementById(obj);
        but.style.backgroundColor = 'gray';
        CurButton = but; 

        but.style.color = 'black';
        setTimeout('Utility.but_off()',100);
    },


    but_off: function(obj) {
        CurButton.style.backgroundColor = 'green';
        CurButton.style.color = 'black';
    }
};

function getCookie(name,path)
{
        var start = document.cookie.indexOf( name + "=" );
        var len = start + name.length + 1;

        if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {
                return null;
        }

        if ( start == -1 ) return null;
                var end = document.cookie.indexOf( ";", len );
        if ( end == -1 ) end = document.cookie.length;
                return unescape( document.cookie.substring( len, end ) );

}

function createCookie(name,value,days)
{
        if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
}

function eraseCookie(name)
{
        createCookie(name,"",-1);
}

