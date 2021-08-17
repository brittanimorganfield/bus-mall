const itemContainer = document.querySelector("#all_items");
const aside = document.querySelector("aside");

const myButton = document.createElement("button");
const clearButton = document.createElement("button");
clearButton.textContent = "Clear Data"
myButton.textContent = "View Results";
const ctx = document.querySelector("#myChart").getContext("2d");

const maxClicksAllowed = 10;
let totalClicks = 0;
let leftCatalogItem = null;
let middleCatalogItem = null;
let rightCatalogItem = null;

const barChart = {
 type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Number Of Votes",
        data: [],
        backgroundColor: "color: black",
      },
      {
        label: "Times Shown",
        data: [],
        backgroundColor: "color: blue",
      },
    ],
  },
  options: {
    responsive: false,
    
    plugins: {
      legend: {
        labels: {
          font: {
            family: "Times New Roman",
          },
        },
      },
    },
  },
};

// Help
const randomize = (arr) => {
  return Math.floor(Math.random() * arr.length);
};

const determinePlural = (num, string) => {
  if (num === 1) return `${num} ${string.slice(0, -1)}`;
  return `${num} ${string}`;
};

const listResults = () => {
  updateLocalData();
  const catalogHeader = document.getElementById("catalogHeader");

  for (const item of catalogItems) {
    barChart.data.labels.push(item.name);
    barChart.data.datasets[0].data.push(item.clicks);
    barChart.data.datasets[1].data.push(item.timesShown);
  }
  myButton.removeEventListener("click", listResults);
  const resultsChart = new Chart(ctx, barChart);
  document.body.append(clearButton);
  clearButton.addEventListener("click", (e) => {
    localStorage.clear();
    window.location.reload();
 });
};

// Define properties for OD
class CatalogItem {
  
  timesShown = 0;
  clicks = 0;
  // constructor
  constructor(name, imgSrc) {
    this.name = name; 
    this.imgSrc = imgSrc; 
  }
}
// show options in array
let catalogItems = [
  new CatalogItem("Bag", "assets/bag.jpg"),
  new CatalogItem("Banana", "assets/banana.jpg"),
  new CatalogItem("Bathroom", "assets/bathroom.jpg"),
  new CatalogItem("Breakfast", "assets/breakfast.jpg"),
  new CatalogItem("Bubblegum", "assets/bubblegum.jpg"),
  new CatalogItem("Chair", "assets/chair.jpg"),
  new CatalogItem("Cthulhu", "assets/cthulhu.jpg"),
  new CatalogItem("Dog duck", "assets/dog-duck.jpg"),
  new CatalogItem("Dragon", "assets/dragon.jpg"),
  new CatalogItem("Masonic bible", "assets/masonic-bible.jpg"),
  new CatalogItem("Pen", "assets/pen.jpg"),
  new CatalogItem("Pet sweep", "assets/pet-sweep.jpg"),
  new CatalogItem("Scissors", "assets/scissors.jpg"),
  new CatalogItem("Shark", "assets/shark.jpg"),
  new CatalogItem("Sweep", "assets/sweep.png"),
  new CatalogItem("Tauntaun", "assets/tauntaun.jpg"),
  new CatalogItem("Unicorn", "assets/unicorn.jpg"),
  new CatalogItem("Water can", "assets/water-can.jpg"),
  new CatalogItem("Wine-glass", "assets/wine-glass.jpg"),
];

let prevLeft = 0;
let prevMiddle = 0;
let prevRight = 0;

// function 
const selectPreferredItem = () => {

  const leftItemImg = document.querySelector("#left_catalog_item_img");
  const middleItemImg = document.querySelector("#middle_catalog_item_img");
  const rightItemImg = document.querySelector("#right_catalog_item_img");
  const leftItemName = document.querySelector("#left_catalog_item_name");
  const middleItemName = document.querySelector("#middle_catalog_item_name");
  const rightItemName = document.querySelector("#right_catalog_item_name");

  let prevRound = [prevLeft, prevMiddle, prevRight];

//number of items
  let leftIndex = randomize(catalogItems);
  let middleIndex = randomize(catalogItems);
  let rightIndex = randomize(catalogItems);

  
  let leftMiddle = leftIndex === middleIndex;
  let rightLeft = rightIndex === leftIndex;
  let middleRight = middleIndex === rightIndex;

  if (totalClicks < 1) {
    while (leftMiddle || rightLeft || middleRight) {
      if (leftMiddle) {
        leftIndex = randomize(catalogItems);
      } else if (rightLeft) {
        rightIndex = randomize(catalogItems);
      } else if (middleRight) {
        middleIndex = randomize(catalogItems);
      }
      leftMiddle = leftIndex === middleIndex;
      rightLeft = rightIndex === leftIndex;
      middleRight = middleIndex === rightIndex;
    }

  } else {
    while (
      leftMiddle ||
      rightLeft ||
      middleRight ||
      prevRound.indexOf(leftIndex) > -1 ||
      prevRound.indexOf(middleIndex) > -1 ||
      prevRound.indexOf(rightIndex) > -1
    ) {
      if (leftMiddle || prevRound.indexOf(leftIndex) > -1)
        leftIndex = randomize(catalogItems);
      else if (rightLeft || prevRound.indexOf(rightIndex) > -1)
        rightIndex = randomize(catalogItems);
      else if (middleRight || prevRound.indexOf(middleIndex) > -1)
        middleIndex = randomize(catalogItems);

      leftMiddle = leftIndex === middleIndex;
      rightLeft = rightIndex === leftIndex;
      middleRight = middleIndex === rightIndex;
    }
  }

  // move around options
  prevLeft = leftIndex;
  prevMiddle = middleIndex;
  prevRight = rightIndex;

  // move around options
  leftCatalogItem = catalogItems[leftIndex];
  middleCatalogItem = catalogItems[middleIndex];
  rightCatalogItem = catalogItems[rightIndex];

  
  leftItemName.textContent = leftCatalogItem.name;
  middleItemName.textContent = middleCatalogItem.name;
  rightItemName.textContent = rightCatalogItem.name;

  leftItemImg.src = leftCatalogItem.imgSrc;
  middleItemImg.src = middleCatalogItem.imgSrc;
  rightItemImg.src = rightCatalogItem.imgSrc;
};

// show what was picked
const handleClickOnItem = (e) => {
  console.log(`You clicked this target element id ${e.target.id}`);
  
  
  if (totalClicks < maxClicksAllowed) {
    const itemId = e.target.id;

    const idOptions = [
      "left_catalog_item_img",
      "middle_catalog_item_img",
      "right_catalog_item_img",
    ];

    // If clicked
    if (idOptions.includes(itemId)) {
      // list item
      leftCatalogItem.timesShown++;
      middleCatalogItem.timesShown++;
      rightCatalogItem.timesShown++;
      // you've clicked this many items
      catalogHeader.innerText = `You have clicked on ${totalClicks+1} items so far`;

      // left
      if (idOptions.indexOf(itemId) === 0) {
        leftCatalogItem.clicks++; 
        console.log(
          `Left item ${leftCatalogItem.name} has ${determinePlural(
            leftCatalogItem.clicks,
            "clicks"
          )} so far`
        );
        // mid
      } else if (idOptions.indexOf(itemId) === 1) {
        middleCatalogItem.clicks++;
        console.log(
          `Middle item ${middleCatalogItem.name} has ${determinePlural(
            middleCatalogItem.clicks,
            "clicks"
          )} so far`
        );
        //right
      } else {
        rightCatalogItem.clicks++; 
        console.log(
          `Right item ${rightCatalogItem.name} has ${determinePlural(
            rightCatalogItem.clicks,
            "clicks"
          )} so far`
        );
      }
      totalClicks++;
      console.log(
        `Left item ${leftCatalogItem.name} has been shown ${determinePlural(
          leftCatalogItem.timesShown,
          "times"
        )}.\nMiddle item ${
          middleCatalogItem.name
        } has been shown ${determinePlural(
          middleCatalogItem.timesShown,
          "times"
        )} times.\nRight item ${
          rightCatalogItem.name
        } has been shown ${determinePlural(
          rightCatalogItem.timesShown,
          "times"
        )} times.`
      );
      if (totalClicks !== maxClicksAllowed) selectPreferredItem();
    }
  }

  if (totalClicks === maxClicksAllowed) {
    itemContainer.removeEventListener("click", handleClickOnItem);
    console.log(`Thanks for clicking ${maxClicksAllowed} of your favorite items!`);
    alert(`Thanks for clicking ${maxClicksAllowed} of your favorite items!`);
    aside.append(myButton);
   myButton.addEventListener("click", listResults);
  
  }
};


function updateLocalData() { // function
  
  const json = JSON.stringify(catalogItems); 
  localStorage.setItem("catalogItems", json); 
};

function getLocalStorage() { // function
  
  const oldData = localStorage.getItem("catalogItems");  
  const oldItemData = JSON.parse(oldData); 
  if (oldItemData !== null) { 
    catalogItems = oldItemData;
    console.log(localStorage.getItem("catalogItems")); // display data
  }
  
};

getLocalStorage();


itemContainer.addEventListener("click", handleClickOnItem);
selectPreferredItem();