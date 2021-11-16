//targets & global variables
let addToy = false;
const displayToys = document.querySelector('#toy-collection');
const form = document.querySelector('.add-toy-form');
const nameText = document.querySelector('#text-input');
const imageUrl = document.querySelector('#url-input');
const toyFormContainer = document.querySelector(".container");
let toyArray = [];
let html = '';

//Starter code given for the "add new toy" button show/hide form plus the two main functions
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  getDbToys();
  submitNewToy();
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//Function to render toy cards on screen once the DOM has loaded from the DB
function getDbToys() {
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(data => {
    toyArray = data;
    renderToyCards(toyArray);
  });
}

//resuable function to render each toy card on screen and add a listener to the new like button in all scenarios
function renderToyCards(data) {
  data.forEach(toy => {
    html = html + createHtml(toy);
  });
  displayToys.innerHTML = html;
  toyArray.forEach(toy => {
    const likeButton = document.getElementById(`${toy.id}`);
    likeButton.addEventListener('click', () => {
      updateDb(toy);
    });
  })
};


//reusable function to create the html for each toy card in all scenarios
function createHtml(toy) {
   return `<div class="card">
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}"> Like </button>
  </div>`;
}

//function to update the likes in the database and return the updated value
//Find the index in the toyArray and replace with the new returned value and re-render the set of toy cards on screen
function updateDb(item) {
  const numberOfLikes = item.likes + 1;
  const updateLike = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": parseInt(`${numberOfLikes}`)
    })
  };
  fetch(`http://localhost:3000/toys/${item.id}`, updateLike)
  .then(function(response) {
    return response.json();
  })
  .then(function(updatedLikes) {
    const index = toyArray.indexOf(item);
    toyArray.splice(index, 1, updatedLikes)
    html = '';
    renderToyCards(toyArray);
  })
}

//Function to submit a new toy and then remove the submitted data from the fields and hide the form again
function submitNewToy () {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitToDatabase();
    nameText.value = '';
    imageUrl.value = '';
    toyFormContainer.style.display = "none";
  });
}

//Function to post the new toy data from the form to the database & return it back 
function submitToDatabase() {
  const newToyInfo = {
    name: `${nameText.value}`,
    image: `${imageUrl.value}`,
    likes: 0
  };
  const toyToSend = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(newToyInfo)
  };
fetch("http://localhost:3000/toys", toyToSend)
  .then(function(response) {
  return response.json();
  })
  .then(function(newData) {
    toyArray.push(newData);
    renderToyCards(toyArray);
  });
}
