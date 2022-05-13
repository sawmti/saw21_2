async function searchEntities() {
    try{
        var valuetoSearch =  document.getElementById("txtEntity").value;

        var obj  = await fetch('/api/entitieswiki/'+valuetoSearch);
        console.log("Objetos obtendi2: ");
        var objtoshow = await obj.json();
        console.log(objtoshow);
        const ulEntities = document.getElementById("entities");
        document.getElementById("entities").innerHTML = "";
       // document.getElementById("buscar").innerHTML = "";
        objtoshow.forEach(async object => {
            
            ulEntities.append(await getelement(object.title,"title"));
            ulEntities.append(await getelementImg(object.thumbnail.url));
            ulEntities.append(await getelement(object.description,"description"));
            ulEntities.insertAdjacentHTML("beforeend", object.excerpt,"excerpt");
            ulEntities.append(await getelement(object.key,"key"));
           
        });
     
    }catch(error){
        console.log("Ha ocurrido un error: " +  error);
    }
}

async function getelement(show, id){
    const li = document.createElement("li");
    li.setAttribute("id", id);
    const text = document.createTextNode(show);
    li.appendChild(text);
    return  li
}

async function getelementImg(url){
    var img = new Image();
    img.src = url;
    img.id = "image"
    return  img
}

async function saveEntity(){

    var data = {
            title: document.getElementById("title").innerHTML,
            image:document.getElementById("image").src,
            description: document.getElementById("description").innerHTML,
        //excerpt
            key:  document.getElementById("key").innerHTML

    }

    const response = await fetch("/api/entities/", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data),
    });

    const body = await response.json();
    console.log("Respuesta:", body)
}

async function searchOwnEntities(){
    try{
        var valuetoSearch =  document.getElementById("txtEntity").value;

        var obj  = await fetch('/api/entities/'+valuetoSearch);
        var objtoshow = await obj.json();

        const ulEntities = document.getElementById("entities");
        document.getElementById("entities").innerHTML = "";
        objtoshow.forEach(object => {
            const liDescription = document.createElement("li");
            const text = document.createTextNode(object.description);
            liDescription.appendChild(text);
            ulEntities.append(liDescription);
        });
     
    }catch(error){
        console.log("Ha ocurrido un error: " +  error);
    }
}
