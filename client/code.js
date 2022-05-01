


async function getEntities() {
    const response = await fetch('/api/entities');
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
    const response = await fetch('/api/entities/2500062');
    console.log("1. :" + JSON.stringify(response));
    const data = await response.json();
    return data
}
//searchEntities();
async function searchEntities() {
  await  getEntitiesFromWikiData().then(async data => {
        console.log("aca!!!!");
        console.log(data.label);
        console.log(JSON.stringify(data.results));
        const ulEntities = document.getElementById("entities");
        //data.entities.forEach(entity => {
            const liEntity = document.createElement("li");
            console.log(1)
            const text = document.createTextNode(data);
            console.log(2)
            liEntity.appendChild(text);
            console.log(3)
            ulEntities.appendChild(liEntity);

       // })
    })
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