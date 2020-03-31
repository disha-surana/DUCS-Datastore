function checkPass()
{   
    var password = document.getElementById("password").value; 
    var mnlen = 8;
    var mxlen = 20;

    if(password.length<mnlen || password.length> mxlen)
    { 
        document.getElementById("push").innerHTML='<div class="alert alert-danger" role="alert">'+ "Please input the password between " +mnlen+ " and " +mxlen+ " characters" +'</div>';
        return false;
    }
    else
    { 
        userCapitalize();
        return true;
    }
}

function userCapitalize(){
    
    var username = document.getElementById("username").value;

    document.getElementById("username").value = username[0].toUpperCase() + username.substring(1) 

}