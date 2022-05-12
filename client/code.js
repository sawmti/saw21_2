async function searchEntities() {
    try{
        var valuetoSearch =  document.getElementById("txtEntity").value;

        var obj  = await fetch('/api/entitieswiki/'+valuetoSearch);
        console.log("Objetos obtendi2: ");
        var objtoshow = await obj.json();
        console.log(objtoshow);
        const ulEntities = document.getElementById("entities");
        document.getElementById("entities").innerHTML = "";
        objtoshow.forEach(object => {
            const liEntity = document.createElement("li");
            const text = document.createTextNode(object.description);
            liEntity.appendChild(text);
            ulEntities.append(liEntity);
        });
     
    }catch(error){
        console.log("Ha ocurrido un error: " +  error);
    }
}

async function saveEntity(){
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
            const liEntity = document.createElement("li");
            const text = document.createTextNode(object.description);
            liEntity.appendChild(text);
            ulEntities.append(liEntity);
        });
     
    }catch(error){
        console.log("Ha ocurrido un error: " +  error);
    }
}
