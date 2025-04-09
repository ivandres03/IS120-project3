fetch("https://flights.is120.ckearl.com")
  .then((response) => response.json())
  .then((dataObject) => {
    completeSteps(dataObject["data"]);
  });

function completeSteps(dataObject){
    console.log(dataObject)
    taskOne(dataObject);
}

function taskOne(dataObject){
    let airlinesArray = dataObject['airlines'];
    for (let airline of airlinesArray){
        // create elements
        let gridDiv = document.createElement('div');
        let gridDivHeader = document.createElement("div");
        let gridDivSubtitle = document.createElement("div");
        let gridDivImgContainer = document.createElement("div");
        let gridDivImage = document.createElement("img");
        let gridDivPtag = document.createElement("div");

        //add content
        gridDivHeader.innerHTML = `Name: ${airline.name}`;
        gridDivImage.src = airline.logo;
        gridDivSubtitle.innerHTML = `HQ: ${airline.headquarters}`
        gridDivPtag.innerHTML = `Routes: ${Object.keys(airline['routes']).length}`;

        //add styles
        gridDiv.classList.add('airline-grid-item');
        gridDivHeader.classList.add('grid-header')
        gridDivImgContainer.classList.add('image-container')
        gridDivSubtitle.classList.add('grid-text')
        gridDivPtag.classList.add("grid-text");
        
        // append to div
        gridDiv.appendChild(gridDivHeader);
        gridDivImgContainer.appendChild(gridDivImage);
        gridDiv.appendChild(gridDivImgContainer)
        gridDiv.appendChild(gridDivSubtitle)
        gridDiv.appendChild(gridDivPtag);

        // append div to grid
        let containerDiv = document.getElementById("flights-grid");
        containerDiv.appendChild(gridDiv);
    }
}
/*
div 
<h1>{name of airline}</h1>
h2 {headquarters}
logo
p> routes
/div
*/