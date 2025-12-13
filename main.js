// 1. DOM elements
const moviesContainer = document.getElementById('movies-container');

// 2. Load favorites from local storage on page start

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function addFavorite(id) {
  const favs = getFavorites();
  if (!favs.includes(id)) {
    favs.push(id);
    localStorage.setItem('favorites', JSON.stringify(favs));
  }
}

function removeFavorite(id) {
  const favs = getFavorites().filter((f) => f !== id);
  localStorage.setItem('favorites', JSON.stringify(favs));
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

// 3. Fetch the movies

const BASE_URL = 'https://api.themoviedb.org/3';
const MOVIES_URL =
  'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
const OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MDZlMmZlMzU0OTg1MTllM2YxNDFmNjI2OTk4MWZlMyIsIm5iZiI6MTc2NTAwOTE3NS43MjgsInN1YiI6IjY5MzNlNzE3MTNkNzEzYTBiMjQ4ZTVlOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iLpMeUELvUUN7tfBR79Nu7sVxLY2T5i7nB7kI1LuLxc',
  },
};

async function fetchMovies() {
  try {
    const response = await fetch(MOVIES_URL, OPTIONS);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const movies = await response.json();

    renderMovies(movies.results);
  } catch (error) {
    console.error(error.message);
  }
}

// 4. Show movies on screen
function renderMovies(movies) {
  moviesContainer.innerHTML = '';

  movies.forEach((movie) => {
    // Create elements
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.className =
      'bg-white rounded-xl shadow-md p-4 flex flex-col justify-between h-full';

    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    img.alt = movie.title;
    img.className = 'w-full h-32 object-cover';

    const title = document.createElement('h3');
    title.textContent = movie.title;
    title.className = 'text-lg font-semibold text-gray-800 text-center mb-2';

    const overview = document.createElement('p');
    overview.textContent = movie.overview;
    overview.className = 'text-sm text-gray-600 mt-2';

    const btn = document.createElement('button');
    function updateButton() {
      if (isFavorite(movie.id)) {
        btn.textContent = 'Added to favorites ⭐';
        btn.className =
          'bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg w-full mt-4 cursor-pointer';
      } else {
        btn.textContent = 'Add to favorites ☆';
        btn.className =
          'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full mt-4 cursor-pointer';
      }
    }

    updateButton();

    // Add the event listener to the button
    btn.addEventListener('click', () => {
      if (isFavorite(movie.id)) {
        removeFavorite(movie.id);
      } else {
        addFavorite(movie.id);
      }

      updateButton();
    });

    // Add to DOM
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(overview);
    card.appendChild(btn);

    moviesContainer.appendChild(card);
  });
}

// 5. Initialize App

fetchMovies();

// 6. Search Dialogue

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchDialog = document.getElementById('search-dialog');
const dialogContent = document.getElementById('dialog-content');
const dialogClose = document.getElementById('dialog-close');

const SEARCH_URL = `${BASE_URL}/search/movie`;

// Function to search movies
async function searchMovies(query) {
  try {
    const response = await fetch(
      `${SEARCH_URL}?query=${encodeURIComponent(query)}&language=en-US&page=1`,
      OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    renderSearchResults(data.results);
    searchDialog.showModal();
    searchDialog.scrollTop = 0;
  } catch (error) {
    console.error(error.message);
  }
}

// Add results in dialog content

function renderSearchResults(movies) {
  dialogContent.innerHTML = '';

  if (movies.length === 0) {
    dialogContent.innerHTML = '<p class="text-gray-500">No results found.</p>';
    return;
  }

  movies.forEach((movie) => {
    const card = document.createElement('div');
    card.className = 'flex gap-3 mb-4 p-2 border rounded-lg';

    const img = document.createElement('img');
    img.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : '';
    img.alt = movie.title;
    img.className = 'w-16 h-24 object-cover rounded';

    const info = document.createElement('div');

    const title = document.createElement('h3');
    title.textContent = movie.title;
    title.className = 'font-semibold';

    const overview = document.createElement('p');
    overview.textContent = movie.overview || 'No overview available';
    overview.className = 'text-sm text-gray-600 line-clamp-3';

    const btn = document.createElement('button');

    function updateButton() {
      if (isFavorite(movie.id)) {
        btn.textContent = '⭐';
        btn.className = 'cursor-pointer';
      } else {
        btn.textContent = '☆';
        btn.className = 'cursor-pointer';
      }
    }

    updateButton();

    // Add the event listener to the button
    btn.addEventListener('click', () => {
      if (isFavorite(movie.id)) {
        removeFavorite(movie.id);
      } else {
        addFavorite(movie.id);
      }

      updateButton();
    });

    const header = document.createElement('div');
    header.className = 'flex justify-between items-start gap-2';
    header.appendChild(title);
    header.appendChild(btn);

    info.appendChild(header);
    info.appendChild(overview);

    card.appendChild(img);
    card.appendChild(info);

    dialogContent.appendChild(card);
  });
}

// Event listener to the submit botton of the search

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query);
  }
});

// Close dialogue

dialogClose.addEventListener('click', () => {
  searchDialog.close();
});
