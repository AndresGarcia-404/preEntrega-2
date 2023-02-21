let butdel = document.getElementById("logout");
butdel.addEventListener("click", function(){
    window.location.href = "http://localhost:8080/api/users/logout";
});
