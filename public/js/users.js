function getCookie(cname){
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return unescape(c.substring(name.length, c.length));
        }
    }
}

function eliminarCookies() {
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }


let name = getCookie("user_name") || "";
let role = getCookie("userRole");
let credenciales = document.getElementById("credenciales");

if (name != ""){
    let btn = '<button class="btn btn-danger" id="logout">Log out</button>';
    credenciales.innerHTML = `<h4>Bienvenido ${name} - ${role} </h4> ${btn}`;
}

let butdel = document.getElementById("logout");
butdel.addEventListener("click", function(){
    eliminarCookies();
    window.location.href = "http://localhost:8080/api/users/signin";
});
