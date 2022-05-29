//#region Helpers

async function getelement(show, id){
    const li = document.createElement("li");
    li.setAttribute("id", id);
    const text = document.createTextNode(show);
    li.appendChild(text);
    return  li
}
async function getTextBoxelement(show, id, hide){
    var txtBox = document.createElement("INPUT");
    txtBox.setAttribute("type", "text");
    txtBox.setAttribute("id", "txt"+id);
    txtBox.value = show;
    if(hide)
        txtBox.style.display = 'none';
    const li = document.createElement("li");
    li.setAttribute("id", id);
   
    li.appendChild(txtBox);
    return  li
}
async function getelementImg(url){
    var img = new Image();
    img.src = url;
    img.id = "image"
    return  img
}

//Función que dibuja lo encontrado en wiki
async function fillObject(objtoshow, entity){
    const ulEntities = document.getElementById(entity);
    document.getElementById(entity).innerHTML = "";

    objtoshow.forEach(async object => {
        
        ulEntities.append(await getelement(object.title,"title"));
        ulEntities.append(await getelementImg(object.thumbnail ? object.thumbnail.url : object.image));
        ulEntities.append(await getelement(object.description,"description"));
        ulEntities.append(await getelement(object.excerpt,"excerpt"));
        ulEntities.append(await getelement(object.key,"key"));
       
    });
}

//Función que dibuja los controles para editar
async function fillObjectEdit(objtoshow, entity){
    const ulEntities = document.getElementById(entity);
    document.getElementById(entity).innerHTML = "";
    console.log(objtoshow);
    objtoshow.forEach(async object => {
        
        ulEntities.append(await getTextBoxelement(object.title,"title"));
        ulEntities.append(await getTextBoxelement((object.thumbnail ? object.thumbnail.url : object.image),"url"));
        ulEntities.append(await getelementImg(object.thumbnail ? object.thumbnail.url : object.image));
        ulEntities.append(await getTextBoxelement(object.description,"description"));
        ulEntities.append(await getTextBoxelement(object.key,"key"));
        ulEntities.append(await getTextBoxelement(object.excerpt,"excerpt"));
        ulEntities.append(await getTextBoxelement(object._id,"id",true));
       
    });
}
//#endregion

//#region Actions

async function searchEntities() {
    try{
        var valuetoSearch =  document.getElementById("txtEntity").value;
        document.getElementById('buscar').style.display = '';   
        if(valuetoSearch){
            
            document.getElementById("lblError").style.display = "none";
            document.getElementById("btnsave").style.display = "block";
            var obj  = await fetch('/api/entitieswiki/'+valuetoSearch);
            var objtoshow = await obj.json();
            await fillObject(objtoshow,"entities");
        }else{
            
            document.getElementById("lblError").style.display = "display";
            document.getElementById("btnsave").style.display = "none";
        }
     
    }catch(error){
        console.log("Ha ocurrido un error: " +  error);
    }
}

async function deleteEntity(identity){
    try{

    var opcion = confirm("¿Está seguro que desea eliminar este registro?");
    if (opcion == true) {
        var obj  = await fetch('/api/entities/'+identity, { method: 'DELETE' });
        const response = await obj.json();
        alert(response.response);
        await searchOwnEntities('0');
	} 
      
     

    }catch(error){
        console.log(error);
        alert("Ha ocurrido un error: " +  error);
    }
}

async function editEntity(identity){
    
    var obj  = await fetch('/api/entities/'+identity);
    var objtoshow = await obj.json();
    await fillObjectEdit(objtoshow,"entitiesedit");
   // $('#ownentities').hide();
    document.getElementById('ownentities').style.display = 'none';   
    document.getElementById('actualizar').style.display = '';
    document.getElementById('actualizar').classList.add("active");
   
}

async function saveEntity(isEditing){

    
    var data = {
            title: isEditing ? document.getElementById("txttitle").value : document.getElementById("title").innerHTML,
            image: isEditing ? document.getElementById("txturl").value :  document.getElementById("image").src,
            description: isEditing ? document.getElementById("txtdescription").value  : document.getElementById("description").innerHTML,
            key:  isEditing ? document.getElementById("txtkey").value  : document.getElementById("key").innerHTML,
            excerpt : isEditing ? document.getElementById("txtexcerpt").value  : document.getElementById("excerpt").innerHTML
    }
    if(isEditing)
        data.id = document.getElementById("txtid").value;

    const response = await fetch("/api/entities/", {
        method: (isEditing ? "PUT" : "POST"),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data),
    });

    const body = await response.json();
    alert(body.response);
    $('.close').trigger('click');
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
                            <td><i class="fas fa-edit" href="#buscar" onclick="editEntity('${object._id}')" style="	cursor: pointer !important;" title="Editar"></i> &nbsp; &nbsp; &nbsp; 
                                <i class="fas fa-trash" onclick="deleteEntity('${object._id}')"style="	cursor: pointer !important;" title="Eliminar"></i>
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
