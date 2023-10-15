import { breedSelect } from './index';
import { catInfo } from './index';

export function createSelectMarkup(arr) {
  const listSelect = arr
    .map(({ id, name }) => {
      return `<option id="${id}">${name}</option>`;
    })
    .join('');
  breedSelect.insertAdjacentHTML('beforeend', listSelect);
}

export function createCard(cat) {
  const { url } = cat;
  const { name, origin, description, temperament } = cat.breeds[0];

  const catCard = document.createElement('div');
  catCard.classList.add('cat-card');

  const catImage = document.createElement('img');
  catImage.classList.add('cat-image');
  catImage.src = url;
  catImage.alt = name;

  const catDescription = document.createElement('div');
  catDescription.classList.add('cat-description');
  catDescription.innerHTML = `
    <h2>${name}</h2>
    <h4>Country: ${origin}</h4>
    <h5>Temperament: ${temperament}</h5>
    <p>${description}</p>
  `;

  catCard.appendChild(catImage);
  catCard.appendChild(catDescription);

  catInfo.innerHTML = '';

  catInfo.appendChild(catCard);
}
