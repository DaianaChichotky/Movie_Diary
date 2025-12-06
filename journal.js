// ---------------------------------------------------------------------------
// 1️⃣  TMDB request configuration with given token
// ---------------------------------------------------------------------------
const TMDB_URL =
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";

const TMDB_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MDZlMmZlMzU0OTg1MTllM2YxNDFmNjI2OTk4MWZlMyIsIm5iZiI6MTc2NTAwOTE3NS43MjgsInN1YiI6IjY5MzNlNzE3MTNkNzEzYTBiMjQ4ZTVlOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iLpMeUELvUUN7tfBR79Nu7sVxLY2T5i7nB7kI1LuLxc",
  },
};

// ---------------------------------------------------------------------------
// 2️⃣  Helper: create a single movie card element
// ---------------------------------------------------------------------------
function createMovieCard(movie) {
  // TMDB gives us a partial path for the poster; we need the full URL
  const posterBase = "https://image.tmdb.org/t/p/w500";
  const posterUrl = movie.poster_path
    ? `${posterBase}${movie.poster_path}`
    : "https://via.placeholder.com/400x225";

  // Build the DOM nodes (using template literals for readability)
  const card = document.createElement("div");
  card.className = "bg-white rounded-lg shadow-md overflow-hidden flex flex-col";

  card.innerHTML = `
    <img src="${posterUrl}" alt="${movie.title} Poster"
         class="w-full h-48 object-cover"/>
    <div class="p-4 flex-1 flex flex-col">
      <h3 class="text-xl font-semibold mb-2 truncate">${movie.title}</h3>
      <p class="text-gray-600 flex-1 line-clamp-3">
        ${movie.overview || "No description available."}
      </p>
      <button type="button"
              class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
              onclick="toggleNotes(this)">
        Add Note
      </button>
      <div class="mt-3 notes-enter hidden">
        <textarea rows="4"
                  class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Write your personal notes here..."></textarea>
      </div>
    </div>
  `;

  return card;
}

// ---------------------------------------------------------------------------
// 3️⃣  Render all movies into the grid
// ---------------------------------------------------------------------------
function renderMovies(movies) {
  const grid = document.querySelector("main .grid");
  if (!grid) {
    console.error("❌ Could not find the .grid container.");
    return;
  }

  // Clear any placeholder cards that might already be there
  grid.innerHTML = "";

  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    grid.appendChild(card);
  });
}

// ---------------------------------------------------------------------------
// 4️⃣  Fetch movies from TMDB and feed them to the renderer
// ---------------------------------------------------------------------------
function fetchPopularMovies() {
  fetch(TMDB_URL, TMDB_OPTIONS)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      // TMDB wraps results in a `results` array
      if (Array.isArray(data.results)) {
        renderMovies(data.results);
      } else {
        console.warn("⚠️ Unexpected TMDB response shape:", data);
      }
    })
    .catch((err) => console.error("❌ TMDB fetch error:", err));
}

// ---------------------------------------------------------------------------
// 5️⃣  Run once the DOM is ready
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  fetchPopularMovies();
});
