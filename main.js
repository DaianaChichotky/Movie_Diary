const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MDZlMmZlMzU0OTg1MTllM2YxNDFmNjI2OTk4MWZlMyIsIm5iZiI6MTc2NTAwOTE3NS43MjgsInN1YiI6IjY5MzNlNzE3MTNkNzEzYTBiMjQ4ZTVlOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iLpMeUELvUUN7tfBR79Nu7sVxLY2T5i7nB7kI1LuLxc',
  },
};

// ---- Fetch movies ----

async function fetchMovies() {
  const res = await fetch(url, options);
  const data = await res.json();

  const container = document.getElementById('movies-container');
  container.innerHTML = '';

  data.results.forEach((movie) => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden relative';

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${
        movie.poster_path
      }" class="w-full h-30 object-cover">

      <!-- Botón de estrella -->
      <button class="absolute bottom-1 right-1 text-3xl star-btn" data-id="${
        movie.id
      }">
        ${isFavorite(movie.id) ? '⭐' : '☆'}
      </button>

      <div class="p-4">
        <h3 class="font-bold text-lg">${movie.title}</h3>
        <p class="text-sm text-gray-700">
          ${movie.overview.slice(0, 100)}...
        </p>
      </div>
    `;

    container.appendChild(card);
  });

  activateStarButtons();
}

fetchMovies();

// -- Favorites

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function addFavorite(id) {
  const favs = getFavorites();
  favs.push(id);
  localStorage.setItem('favorites', JSON.stringify(favs));
}

function removeFavorite(id) {
  let favs = getFavorites();
  favs = favs.filter((f) => f !== id);
  localStorage.setItem('favorites', JSON.stringify(favs));
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

// Activate star button

function activateStarButtons() {
  document.querySelectorAll('.star-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);

      if (isFavorite(id)) {
        removeFavorite(id);
        btn.textContent = '☆';
      } else {
        addFavorite(id);
        btn.textContent = '⭐';
      }
    });
  });
}
