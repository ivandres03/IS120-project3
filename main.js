let allAirlinesData = [];
// Moved to top
let selectedDivs = [];
let selectedAirlines = [];     

fetch("https://flights.is120.ckearl.com")
  .then((response) => response.json())
  .then((dataObject) => {
    allAirlinesData = dataObject["data"]["airlines"]; 
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

  }
}

function taskTwo() {
  // Arrays to store selected divs and names
  selectedDivs = [];
  selectedAirlines = [];

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
    updateCompareSection();
  }
}


function updateCompareSection() {
  let compareSection = document.getElementById("compare-section");
  let compareSectionContainer = document.getElementById("compare-container");
  compareSection.innerHTML = ""; 

  // If no airlines selected, hide the section
  if (selectedAirlines.length === 0) {
    compareSection.style.display = "none";
    compareSectionContainer.style.display = "none";
    return;
  } else {
    compareSection.style.display = "block"; 
    compareSectionContainer.style.display = "block"; 
  }

  // Build the table dynamically
  let table = document.createElement("table");
  table.classList.add("table");

  let thead = document.createElement("thead");
  let headRow = document.createElement("tr");
  headRow.appendChild(document.createElement("th")); 

  selectedAirlines.forEach((name) => {
    let th = document.createElement("th");
    th.textContent = name;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  let tbody = document.createElement("tbody");

  // This came from AI helping me be more efficient
  let features = [
    { label: "Logo", key: "logo", isImage: true },
    { label: "Country", key: "country" },
    { label: "Destinations", key: "destinations" },
    { label: "Fleet Size", key: "fleet_size" },
    { label: "Headquarters", key: "headquarters" },
    {
      label: "Avg Delay (Minutes)",
      key: "recent_performance.average_delay_minutes",
    },
    { label: "Cancellation Rate", key: "recent_performance.cancellation_rate" },
    {
      label: "Customer Satisfaction",
      key: "recent_performance.customer_satisfaction",
    },
    {
      label: "On-Time Percentage",
      key: "recent_performance.on_time_percentage",
    },
  ];
  //stop AI help

  // create airline rows for each feature
  features.forEach((feature) => {
    let row = document.createElement("tr");

    // add label in each cell of row
    let featureCell = document.createElement("td");
    featureCell.textContent = feature.label;
    row.appendChild(featureCell);

    // find data for each row 
    selectedAirlines.forEach((name) => {
      let airline = allAirlinesData.find((a) => a.name === name); 
      let cell = document.createElement("td");

      // AI Helped to adjust for if it was an image
      if (airline) {
        if (feature.isImage) {
          let img = document.createElement("img");
          img.src = airline.logo;
          img.alt = airline.name + " Logo";
          img.classList.add("logo");
          cell.appendChild(img);

          // AI helped to get the stuff inside recent performance array
        } else if (feature.key.includes(".")) {
          let [main, sub] = feature.key.split(".");
          cell.textContent = airline[main] ? airline[main][sub] : "N/A";
          // grabs any exceptions
        } else {
          cell.textContent = airline[feature.key] ?? "N/A";
        }
        // grabs exceptions outside the nested loop
      } else {
        cell.textContent = "N/A";
      }
      //Stop AI help

      // add the cell to the row
      row.appendChild(cell);
    });
    // add the row to the table
    tbody.appendChild(row);
  });
  // add the table body to the table
  table.appendChild(tbody);
  // Add the table to the section
  compareSection.appendChild(table);
}
