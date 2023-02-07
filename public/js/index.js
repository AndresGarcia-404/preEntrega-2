const socket = io();

document.getElementById("send").addEventListener("click", function(){
    let statusHelp = true
    if(document.getElementById("status").value !== 'true'){
        statusHelp = false
    }
    const prod = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: parseFloat(document.getElementById("price").value),
        status: statusHelp,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        thumbnail: [document.getElementById("thumbnail").value]
    }
    socket.emit("new-product",prod);
    document.getElementById("formC").reset();
});

document.getElementById("send_delete").addEventListener("click", function(){
    const idEliminar = document.getElementById("id_delete").value;
    socket.emit("delete-product",{idELim: idEliminar});
});

socket.on("addProduct",(data)=>{
    let addProd = document.getElementById("realTimeProds");
    let message = "";

    data.forEach(elem => {
        message+=`
            <div class="col">
                <div class="card">  
                    <img class="card-image-top" src="../images/defaultimg.png"?
                    <div class="card-body"> 
                        <h5 class="card-title">${elem.title}</h1>
                        <h6 class="card-subtitle"><strong>id:</strong> ${elem._id}</h6>
                        <h6 class="card-subtitle text-muted"><strong>code:</strong> ${elem.code}</h6>
                        <h6 class="card-subtitle text-muted"><strong>category:</strong> ${elem.category}</h6>
                        <h6 class="card-subtitle text-muted"><strong>thumb:</strong> ${elem.thumbnail}</h6>
                        <h6 class="card-subtitle text-muted"><strong>status:</strong> ${elem.status}}</h6>
                        <h6 class="card-subtitle text-muted"><strong>stock:</strong> ${elem.stock}</h6>
                        <h6 class="card-subtitle text-muted"><strong>price:</strong> ${elem.price}</h6>
                        <p class="card-text">description: ${elem.description}</p>
                    </div>
                </div>
            </div>`
    });
    addProd.innerHTML = message;
})

function firstLoad (){
    let addProd = document.getElementById("realTimeProds");
    fetch("/prodHelp")
    .then((response) => {
        return response.json();
    })
    .then((data)=>{
        let message ="";
        data.forEach((elem) => {
            message += `
            <div class="col">
                <div class="card">  
                    <img class="card-image-top" src="../images/defaultimg.png"?
                    <div class="card-body"> 
                        <h5 class="card-title">${elem.title}</h1>
                        <h6 class="card-subtitle"><strong>id:</strong> ${elem._id}</h6>
                        <h6 class="card-subtitle text-muted"><strong>code:</strong> ${elem.code}</h6>
                        <h6 class="card-subtitle text-muted"><strong>category:</strong> ${elem.category}</h6>
                        <h6 class="card-subtitle text-muted"><strong>thumb:</strong> ${elem.thumbnail}</h6>
                        <h6 class="card-subtitle text-muted"><strong>status:</strong> ${elem.status}}</h6>
                        <h6 class="card-subtitle text-muted"><strong>stock:</strong> ${elem.stock}</h6>
                        <h6 class="card-subtitle text-muted"><strong>price:</strong> ${elem.price}</h6>
                        <p class="card-text">description: ${elem.description}</p>
                    </div>
                </div>
            </div>`
        });
        addProd.innerHTML = message;
    })
}

firstLoad();