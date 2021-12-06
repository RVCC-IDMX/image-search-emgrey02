const form = document.querySelector('.search-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

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
  const container = document.querySelector('.container');

  if (response.results < 10 || !response.results) {
    throw Error('error in results array');
  }

  for (let i = 0; i < 10; i++) {
    const dataObj = response.results[i];
    const clone = post.content.cloneNode(true);
    const postImg = clone.querySelector('.post__img');
    const author = clone.querySelector('.post__user');
    const desc = clone.querySelector('.post__desc');

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
});
