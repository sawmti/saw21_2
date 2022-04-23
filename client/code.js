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