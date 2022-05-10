

async function getEntities() {
    const response = await fetch('/api/entitieswiki');
    const data = await response.json();
    return data
}

function fillEntities() {
    getEntities().then(data => {
        console.log(data.entities);
        const ulEntities = document.getElementById("entities");
        data.entities.forEach(entity => {
          const liEntity = document.createElement("li");
          const text = document.createTextNode(entity);
          liEntity.appendChild(text);
          ulEntities.appendChild(liEntity);
        })
    })
}

async function getEntitiesFromWikiData() {
    const response = await fetch('/api/entitieswiki/2500062');
    console.log("1. :" + JSON.stringify(response));
    const data = await response.json();
    return data
}

async function searchEntities() {
    try{

        await  getEntitiesFromWikiData().then(async data => {
            
            // console.log(data.label);
            // console.log(JSON.stringify(data));
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

        //     const ulEntities = document.getElementById("entities");
        //     //data.entities.forEach(entity => {
        //         const liEntity = document.createElement("li");
        //         console.log(1)
        //         const text = document.createTextNode(data);
        //         console.log(2)
        //         liEntity.appendChild(text);
        //         console.log(3)
        //         ulEntities.appendChild(liEntity);

        // // })
        })
    }catch(error){
        console.log("Ha ocurrido un error: " +  error);
    }
}




// async function getEntitiesFromWikiData(){
//     try {
//         console.log("1");
//         var config = {
//             method: 'get',
//             url: 'https://en.wikipedia.org/w/rest.php/v1/search/page?q=saturn&limit=10',
//             headers: {}
//         };
       
//         return  await axios(config)
//             .then(async function (response) {
//             return response;
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     } catch (error) {
//         console.log(error);
//     }
// }
// //searchEntities();
//  function searchEntities(){

//       getEntitiesFromWikiData().then(  data => {
//         console.log(data.data.pages);
//         const ulEntities = document.getElementById("entities");
//         data.data.pages.forEach(entity => {
//           const liEntity = document.createElement("li");
//           //const text = document.createTextNode(entity);
//           liEntity.appendChild(entity.description);
//           ulEntities.appendChild(entity.key);
//           console.log(entity.description);
//           console.log(entity.excerpt);
//           console.log(entity.key);
//         })
//     })


// }