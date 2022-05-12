

// async function getEntities() {
//     const response = await fetch('/api/entitieswiki');
//     const data = await response.json();
//     return data
// }

// function fillEntities() {
//     getEntities().then(data => {
//         console.log(data.entities);
//         const ulEntities = document.getElementById("entities");
//         data.entities.forEach(entity => {
//           const liEntity = document.createElement("li");
//           const text = document.createTextNode(entity);
//           liEntity.appendChild(text);
//           ulEntities.appendChild(liEntity);
//         })
//     })
// }


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
