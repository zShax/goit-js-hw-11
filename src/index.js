import './css/index.min.css';
import { FetchImagesService } from './js/fetchImagesService';
import { refs } from './js/getRefs.js';
import { LoadMoreBtn } from './js/load-more-btn.js';
import { makeImageMarkup } from './js/markupService.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const fetchImagesService = new FetchImagesService();
const loadMoreBtn = new LoadMoreBtn({ selektor: '.load-more', hidden: true });
const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

function onSearch(e) {
  e.preventDefault();

  const currentWord = e.currentTarget.elements.searchQuery.value.trim();
  if (currentWord === '') {
    return Notify.warning(`Didn't search for anything`);
  }
  fetchImagesService.searchQuery = currentWord;
  loadMoreBtn.show();
  fetchImagesService.resetPage();
  clearImageContainer();
  fetchImages();
}

function clearImageContainer() {
  refs.containerDiv.innerHTML = '';
}

function fetchImages() {
  loadMoreBtn.disabled();
  fetchImagesService
    .fetchImages()
    .then(({ data }) => {
      if (data.total === 0) {
        Notify.info(
          `Could not find "${fetchImagesService.searchQuery}". Please try again.`
        );
        loadMoreBtn.hide();
        return;
      }
      appendImagesMarkup(data);
      onPageScrolling();
      lightbox.refresh();
      const { totalHits } = data;

      if (refs.containerDiv.children.length === totalHits) {
        Notify.info(`All images loaded. Press 'Load more' to load more images`);
        loadMoreBtn.hide();
      } else {
        loadMoreBtn.enable();
        Notify.success(`${totalHits} images matching your search were found.`);
      }
    })
    .catch(handleError);
}

function handleError() {
  console.log('Error!');
}

function appendImagesMarkup(data) {
  refs.containerDiv.insertAdjacentHTML('beforeend', makeImageMarkup(data));
}

function onPageScrolling() {
  const { height: cardHeight } =
    refs.containerDiv.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

refs.formSearch.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);
