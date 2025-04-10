fetch("https://flights.is120.ckearl.com")
  .then((response) => response.json())
  .then((dataObject) => {
    completeSteps(dataObject["data"]);
  });

function completeSteps(dataObject) {
  console.log(dataObject);
  taskOne(dataObject); // still shows all the airlines
  taskTwo(); // NEW: activates the selecting behavior
}

function taskOne(dataObject) {
  let airlinesArray = dataObject["airlines"];
  for (let airline of airlinesArray) {
    // create elements
    let gridDiv = document.createElement("div");
    let gridDivHeader = document.createElement("div");
    let gridDivSubtitle = document.createElement("div");
    let gridDivImgContainer = document.createElement("div");
    let gridDivImage = document.createElement("img");
    let gridDivPtag = document.createElement("div");

    // add content
    gridDivHeader.innerHTML = `Name: ${airline.name}`;
    gridDivImage.src = airline.logo;
    gridDivSubtitle.innerHTML = `HQ: ${airline.headquarters}`;
    gridDivPtag.innerHTML = `Destinations: ${airline.destinations}`;

    // add styles
    gridDiv.classList.add("airline-grid-item");
    gridDivHeader.classList.add("grid-header");
    gridDivImgContainer.classList.add("image-container");
    gridDivSubtitle.classList.add("grid-text");
    gridDivPtag.classList.add("grid-text");

    // append to div
    gridDiv.appendChild(gridDivHeader);
    gridDivImgContainer.appendChild(gridDivImage);
    gridDiv.appendChild(gridDivImgContainer);
    gridDiv.appendChild(gridDivSubtitle);
    gridDiv.appendChild(gridDivPtag);

    // append div to grid
    let containerDiv = document.getElementById("flights-grid");
    containerDiv.appendChild(gridDiv);

    // IMPORTANT: temporarily remove eventListener from here
    // (we'll move that into taskTwo instead)
  }
}


function taskTwo() {
  // Arrays to store selected divs and names
  let selectedDivs = [];
  let selectedAirlines = [];

  // Find all airline grid items
  let allGridItems = document.querySelectorAll(".airline-grid-item");

  // AI help here
  allGridItems.forEach((div) => {
    // Get the airline name from inside the div
    let name = div
      .querySelector(".grid-header")
      .textContent.replace("Name: ", "");

    div.addEventListener("click", () => toggleSelection(div, name));
  });

  // how selection works
  function toggleSelection(div, name) {
    if (div.classList.contains("selected")) {
      // Unselect if already selected AI help here
      div.classList.remove("selected");
      selectedDivs = selectedDivs.filter((item) => item !== div);
      selectedAirlines = selectedAirlines.filter((n) => n !== name);
      // stop AI help

    } else {
      // select up to three
      if (selectedDivs.length < 3) {

        div.classList.add("selected");
        selectedDivs.push(div);
        selectedAirlines.push(name);


      } else {
        // shake the div if more than three
        div.classList.add("shake");

        // Remove the shake class after the animation finishes (so it can shake again next time) AI help here
        setTimeout(() => {
          div.classList.remove("shake");
        }, 300); 
      }
    }

    // Log selected airline names
    console.log("Selected airline names:", selectedAirlines);
  }
}
