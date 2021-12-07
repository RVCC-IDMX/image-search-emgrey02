const form = document.querySelector('.search-form');
const container = document.querySelector('.container');
const clearButton = document.querySelector('.clear');
const modal = document.querySelector('#modal');
const closeBtn = document.querySelector('#close-btn');
const modalContent = document.querySelector('#modal-content');
const localStorage = window.localStorage;
let cardData;

checkLocalStorage();

window.addEventListener('load', checkLocalStorage);
clearButton.addEventListener('click', clearPage);

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (container.innerHTML != '') {
    container.innerHTML = '';
  }

  const formData = new FormData(event.target);

  const response = await fetch('/.netlify/functions/unsplash-search', {
    method: 'POST',
    body: JSON.stringify({
      query: formData.get('query'),
    }),
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.error(err));

  const post = document.querySelector('#template');

  if (response.results < 10 || !response.results) {
    throw Error('error in results array');
  }

  for (let i = 0; i < 10; i++) {
    const dataObj = response.results[i];
    const clone = post.content.cloneNode(true);
    const postImg = clone.querySelector('.post__img');
    const author = clone.querySelector('.post__user');
    const desc = clone.querySelector('.post__desc');
    const card = clone.querySelector('.card');

    card.dataset.key = `${i}`;
    postImg.src = dataObj.urls.small;
    postImg.alt = dataObj.alt_description;

    author.textContent = dataObj.user.name;

    if (dataObj.description) {
      if (dataObj.description.length > 100) {
        desc.textContent = `${dataObj.description.slice(0, 100)}...`;
      } else {
        desc.textContent = dataObj.description;
      }
    }
    container.appendChild(clone);
  }
  initiateModal(response.results);
  populateStorage(response.results);
});

function populateStorage(searchQuery) {
  localStorage.setItem('query', document.querySelector('#query').value);
  localStorage.setItem(
    'search results',
    document.querySelector('.container').innerHTML
  );
  localStorage.setItem('search query', JSON.stringify(searchQuery));
}

function checkLocalStorage() {
  if (localStorage) {
    document.querySelector('#query').value = localStorage.getItem('query');
    document.querySelector('.container').innerHTML =
      localStorage.getItem('search results');

    searchResults = JSON.parse(localStorage.getItem('search query'));
    initiateModal(searchResults);
  }
}

function clearPage() {
  localStorage.clear();
  location.reload();
}

closeBtn.addEventListener('click', (event) => {
  modal.classList.remove('open');
});

function initiateModal(imageInfo) {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) =>
    card.addEventListener('click', () => {
      cardData = imageInfo[card.dataset.key];
      const modalImg = modalContent.querySelector('.modal__img');
      const modalAuthor = modalContent.querySelector('.modal__user');
      const modalDesc = modalContent.querySelector('.modal__desc');

      modalImg.src = cardData.urls.regular;
      modalImg.alt = cardData.alt_description;
      modalAuthor.textContent = cardData.user.name;
      if (cardData.description) {
        modalDesc.textContent = cardData.description;
      }
      modal.classList.add('open');
    })
  );
}
