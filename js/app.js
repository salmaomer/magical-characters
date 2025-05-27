const cardContainer = document.getElementById("cardcontainer");
const dropdownContainer = document.getElementById("dropdown-container");
let allCharacters = []; 
let shownCount = 0;

async function fetchCharacters() {
  try {
    const response = await fetch("https://hp-api.onrender.com/api/characters");

    const characters = await response.json();
    
    RenderData(characters, 16);
    BoxDrop(characters);
  } 
  catch (error) {
    console.error("Fetch error:", error);
    cardContainer.innerHTML = `<img src="./images/not-found.png" alt="Not Found">`;
  }
}



function RenderData(characters, limit = 16) {
  cardContainer.innerHTML = '';
  shownCount = limit;
  allCharacters = characters;

  const slice = characters.slice(0, shownCount);
  slice.forEach(character => {
    const card = document.createElement("div");
    card.className = "cards";
    card.innerHTML = `
      <img src="${character.image || './images/not-found.png'}">
      <div class="card-content">
        <p>Name : ${character.name}</p>
        <p>House Name : ${character.house || 'Unknown'}</p>
        <p>Birth Day : ${character.dateOfBirth || 'Unknown'}</p>
      </div>
    `;
    cardContainer.appendChild(card);
  });

  const seeMoreBtn = document.getElementById('seeMoreBtn');
  if (characters.length > shownCount) {
    seeMoreBtn.style.display = 'block';
  } else {
    seeMoreBtn.style.display = 'none';
  }
}



function filterByHouse(houseName) {
  cardContainer.innerHTML = ''; 

  fetch("https://hp-api.onrender.com/api/characters")
    .then(response => response.json())
    .then(characters => {
      const filtered = characters.filter(character => character.house === houseName);

      RenderData(filtered, 16); 
    })
    .catch(error => {
      console.error("Error filtering characters by house:", error);
    });
}


function BoxDrop(characters) {
  const uniqueHouses = [...new Set(characters.map(char => char.house).filter(Boolean))];

  const dropdownContent = document.createElement("div");
  dropdownContent.className = "dropdown-Houses";

  uniqueHouses.forEach((house, index) => {
    const item = document.createElement("h3");

    item.className = "house" + (index + 1);
    item.textContent = house;

    item.addEventListener('click', () => {
      filterByHouse(house);
    });

    dropdownContent.appendChild(item);
});

  dropdownContainer.appendChild(dropdownContent);
}


function DropFunction() {
  const dropdown = document.querySelector('.dropdown-Houses');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

//Button SeeMore
document.getElementById('seeMoreBtn').addEventListener('click', () => {
  shownCount += 16;
  RenderData(allCharacters, shownCount);
});

//Closing DropDown List
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    const dropdowns = document.getElementsByClassName("dropdown-Houses");
    for (let i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove('show');
    }
  }
}

fetchCharacters();
