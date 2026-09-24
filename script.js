const API_KEY = 'e11ddac9';

const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const moviesGrid = document.querySelector('#moviesGrid');
const resultsInfo = document.querySelector('#resultsInfo');
const sortSelect = document.querySelector('#sortSelect');

let currentMovies = [];

// Event Listener
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchMovies(searchTerm);
  }
});


// Show skeleton loading cards
function showSkeletons() {
  const skeletons = Array(10).fill(0).map(() => `
    <div class="movie-card movie-card--skeleton">
      <div class="movie-card__img movie-card__img--skeleton"></div>
      <div class="movie-card__title movie-card__title--skeleton"></div>
      <div class="movie-card__year movie-card__year--skeleton"></div>
    </div>
  `).join('');
  
  moviesGrid.innerHTML = skeletons;
}

// Fetch movies from API
async function fetchMovies(searchTerm) {
  showSkeletons();

  const res = await fetch(`https://www.omdbapi.com/?apikey=e11ddac9&s=${searchTerm}`);
  const data = await res.json();

  if (data.Response === 'True') {
    currentMovies = data.Search;
    resultsInfo.textContent = `Showing: ${searchTerm}`;
    sortSelect.value = 'default';
    displayMovies(currentMovies);
  } else {
    resultsInfo.textContent = `Showing: ${searchTerm}`;
    moviesGrid.innerHTML = '<p>No movies found.</p>';
    currentMovies = [];
  }
}

// Display movies
function displayMovies(movies) {
  const movieResults = movies.map((movie) => {
    const poster = movie.Poster !== 'N/A' ? movie.Poster : '';

    return `
      <div class="movie-card">
        ${poster ? `<img class="movie-card__img" src="${poster}" alt="${movie.Title}">` : `<div class="movie-card__poster-placeholder">Movie Poster<br>Not Available</div>`}
        <h2 class="movie-card__title">${movie.Title}</h2>
        <p class="movie-card__year">${movie.Year}</p>
      </div>
    `;
  }).join('');

  moviesGrid.innerHTML = movieResults;
  
  // Add error listeners after DOM insertion
  moviesGrid.querySelectorAll('.movie-card__img').forEach(img => {
    img.addEventListener('error', () => {
      const placeholder = document.createElement('div');
      placeholder.className = 'movie-card__poster-placeholder';
      placeholder.innerHTML = 'Movie Poster<br>Not Available';
      img.replaceWith(placeholder);
    });
  });
}

// Sort movies

sortSelect.addEventListener('change', (e) => {
  sortMovies(e.target.value);
});

function sortMovies(sortType) {
  let sortedMovies = [...currentMovies];

  if (sortType === 'a-z') {
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortType === 'z-a') {
    sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (sortType === 'newest') {
    sortedMovies.sort((a, b) => Number(b.Year) - Number(a.Year));
  } else if (sortType === 'oldest') {
    sortedMovies.sort((a, b) => Number(a.Year) - Number(b.Year));
  }

  displayMovies(sortedMovies);
}



// Load Marvel movies on start
fetchMovies('Avengers');
