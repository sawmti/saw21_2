//#region Helpers

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

async function fillObject(objtoshow, entity){
    const ulEntities = document.getElementById(entity);
    document.getElementById(entity).innerHTML = "";

    objtoshow.forEach(async object => {
        
        ulEntities.append(await getelement(object.title,"title"));
        ulEntities.append(await getelementImg(object.thumbnail ? object.thumbnail.url : object.image));
        ulEntities.append(await getelement(object.description,"description"));
        ulEntities.insertAdjacentHTML("beforeend", object.excerpt,"excerpt");
        ulEntities.append(await getelement(object.key,"key"));
       
    });
}
//#endregion

//#region Actions

async function searchEntities() {
    try{
        var valuetoSearch =  document.getElementById("txtEntity").value;

        var obj  = await fetch('/api/entitieswiki/'+valuetoSearch);
        var objtoshow = await obj.json();
        await fillObject(objtoshow,"entities");

     
    }catch(error){
        console.log("Ha ocurrido un error: " +  error);
    }
}

async function deleteEntity(identity){
    try{
         
        var obj  = await fetch('/api/entities/'+identity, { method: 'DELETE' });
        const response = await obj.json();
        alert(response.response);

    }catch(error){
        console.log(error);
        alert("Ha ocurrido un error: " +  error);
    }
}

async function editEntity(identity){
    
    var obj  = await fetch('/api/entities/'+identity);
    var objtoshow = await obj.json();
    await fillObject(objtoshow,"entitiesedit");
   // $('#ownentities').hide();
    document.getElementById('ownentities').style.display = 'none';
    document.getElementById('actualizar').style.display = '';
    document.getElementById('actualizar').classList.add("active");
}

async function saveEntity(){

    var data = {
            title: document.getElementById("title").innerHTML,
            image: document.getElementById("image").src,
            description: document.getElementById("description").innerHTML,
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

//#endregion

async function searchOwnEntities(value){
    try{
        $('#contenttable').empty();
        var valuetoSearch = value ? value : document.getElementById("txtEntity").value;
        var url =`/api/entities/${valuetoSearch}`;
        var obj  = await fetch(url);
        var objtoshow = await obj.json();
        var content = "<table><tr><td>Número</td><td>Título</td><td>Descripción</td><td>Imagen</td><td>Acciones<td></tr>";
        var i=1;
        
        for (const object of objtoshow){
            content += `<tr>
                            <td> ${i} </td>
                            <td> ${object.title} </td>
                            <td> ${object.description} </td>
                            <td><img style=" max-width:50px;" src=${object.image}></td>
                            <td><i class="fas fa-edit" href="#buscar" onclick="editEntity('${object._id}')"></i> 
                                <i class="fas fa-trash" onclick="deleteEntity('${object._id}')"></i>
                            </td>
                        </tr>`; 
            i++;
        }

        content +="</table>"
        
        $('#contenttable').append(content);


    }catch(error){
        console.log("Ha ocurrido un error: " +  error);
    }
}
