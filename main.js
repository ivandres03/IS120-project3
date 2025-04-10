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

    // IMPORTANT: temporarily remove eventListener from here
    // (we'll move that into taskTwo instead)
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
  const compareSection = document.getElementById("compare-section");
  compareSection.innerHTML = ""; // Clear previous comparison content

  // If no airlines selected, hide the section
  if (selectedAirlines.length === 0) {
    compareSection.style.display = "none";
    return;
  } else {
    compareSection.style.display = "block"; // show it
  }

  // Build the table dynamically
  const table = document.createElement("table");
  table.classList.add("table");

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  headRow.appendChild(document.createElement("th")); // Empty top-left corner

  selectedAirlines.forEach((name) => {
    const th = document.createElement("th");
    th.textContent = name;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  // This came from AI helping me be more efficient
  const features = [
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

  // create airline rows for each feature
  features.forEach((feature) => {
    const row = document.createElement("tr");

    // add label in each cell of row
    const featureCell = document.createElement("td");
    featureCell.textContent = feature.label;
    row.appendChild(featureCell);

    // find data for each row 
    selectedAirlines.forEach((name) => {
      const airline = allAirlinesData.find((a) => a.name === name); 
      const cell = document.createElement("td");

      // AI Helped to adjust for if it was an image
      if (airline) {
        if (feature.isImage) {
          const img = document.createElement("img");
          img.src = airline.logo;
          img.alt = airline.name + " Logo";
          img.classList.add("logo");
          cell.appendChild(img);

          // AI helped to get the stuff inside recent performance array
        } else if (feature.key.includes(".")) {
          const [main, sub] = feature.key.split(".");
          cell.textContent = airline[main] ? airline[main][sub] : "N/A";
          // grabs any exceptions
        } else {
          cell.textContent = airline[feature.key] ?? "N/A";
        }
        // grabs exceptions outside the nested loop
      } else {
        cell.textContent = "N/A";
      }
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
