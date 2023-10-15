import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { createCard, createSelectMarkup } from './createMarkup.js';

export const breedSelect = document.querySelector('.breed-select');
const loaderText = document.querySelector('.body__loader');
const errorText = document.querySelector('.body__error');
export const catInfo = document.querySelector('.cat-info');

errorText.hidden = true;
breedSelect.hidden = true;

breedSelect.addEventListener('change', onSearch);

setTimeout(() => {
  fetchBreeds()
    .then(data => {
      createSelectMarkup(data);
      breedSelect.hidden = false;
      errorText.hidden = true;
      loaderText.hidden = true;
    })
    .catch(err => {
      console.log(err);
      Notiflix.Notify.failure(
        'Error! Please make sure you are connected to the internet.'
      );
      loaderText.hidden = true;
      breedSelect.hidden = true;
      catInfo.classList.toggle('hidden');
    });
}, 500);

function onSearch(evt) {
  loaderText.hidden = false;

  breedSelect.style.marginLeft = '20px';
  breedSelect.style.justifySelf = 'left';
  catInfo.classList.add('hidden');
  const catId = evt.target.options[evt.target.selectedIndex].id;

  setTimeout(() => {
    fetchCatByBreed(catId)
      .then(cat => {
        loaderText.hidden = true;
        createCard(cat);
        catInfo.classList.remove('hidden');
      })
      .catch(err => {
        console.log(err);
        Notiflix.Notify.failure(
          'Error! Please make sure you are connected to the internet.'
        );
        loaderText.hidden = true;
        breedSelect.hidden = true;
        catInfo.classList.toggle('hidden');
      });
  }, 500);
}
