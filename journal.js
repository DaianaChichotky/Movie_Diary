/* -------------------------------------------------------------
   journal.js – shows only the movies that were marked as favourite
   on index.html.  The index page stores the IDs in localStorage
   under the key "favorites", so we read that exact key here.
   ------------------------------------------------------------- */

/* ---------- TMDB configuration (same as on index) ---------- */
const TMDB_BASE_URL = "https://api.themoviedb.org/3/movie/";
const TMDB_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MDZlMmZlMzU0OTg1MTllM2YxNDFmNjI2OTk4MWZlMyIsIm5iZiI6MTc2NTAwOTE3NS43MjgsInN1YiI6IjY5MzNlNzE3MTNkNzEzYTBiMjQ4ZTVlOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iLpMeUELvUUN7tfBR79Nu7sVxLY2T5i7nB7kI1LuLxc",
  },
};

/* ---------- Local‑storage key used by index.html ----------
   (index stores favourites under "favorites") */
const FAVORITE_KEY = "favorites";

/* ---------- Helper: read the favourite IDs ------------------- */
function getFavouriteIds() {
  const raw = localStorage.getItem(FAVORITE_KEY);
  return raw ? JSON.parse(raw) : []; // returns an array of numbers
}

/* ---------- Persist/retrieve per‑movie notes ---------------- */
function saveNoteForMovie(id, text) {
  localStorage.setItem(`journalNote_${id}`, text);
}
function loadNoteForMovie(id) {
  return localStorage.getItem(`journalNote_${id}`) || "";
}

/* ---------- Build a single card for a movie ---------------- */
function createCard(movie) {
  const posterBase = "https://image.tmdb.org/t/p/w500";
  const posterUrl = movie.poster_path
    ? `${posterBase}${movie.poster_path}`
    : "https://via.placeholder.com/400x225";

  const savedNote = loadNoteForMovie(movie.id);

  const card = document.createElement("div");
  card.className =
    "bg-white rounded-lg shadow-md overflow-hidden flex flex-col";

  card.innerHTML = `
    <img src="${posterUrl}"
         alt="${movie.title} poster"
         class="w-full h-48 object-cover">

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
                  placeholder="Write your personal notes here...">${savedNote}</textarea>
      </div>
    </div>
  `;

  // Save note when the textarea loses focus
  const textarea = card.querySelector("textarea");
  textarea.addEventListener("blur", () => {
    saveNoteForMovie(movie.id, textarea.value);
  });

  return card;
}

/* ---------- Render all favourite movies ---------------------- */
function renderFavourites() {
  const grid = document.querySelector(".grid"); // the grid container in journal.html
  if (!grid) {
    console.error("❌ No .grid element found on journal.html");
    return;
  }

  const favIds = getFavouriteIds();

  // If there are no favourites, show a friendly message
  if (favIds.length === 0) {
    grid.innerHTML = `
      <p class="col-span-full text-center text-gray-600">
        You haven’t marked any movies as favourites yet.
        Go back to the <a href="index.html" class="text-blue-600 underline">Home page</a> and add some!
      </p>`;
    return;
  }

  // Clear any placeholder cards
  grid.innerHTML = "";

  // Fetch each favourite movie individually and render it
  favIds.forEach((id) => {
    fetch(`${TMDB_BASE_URL}${id}?language=en-US`, TMDB_OPTIONS)
      .then((res) => {
        if (!res.ok) throw new Error(`TMDB ${res.status}`);
        return res.json();
      })
      .then((movie) => {
        const card = createCard(movie);
        grid.appendChild(card);
      })
      .catch((err) => {
        console.error(`❌ Failed to load movie ${id}:`, err);
      });
  });
}

/* ---------- Initialise when the DOM is ready ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderFavourites();
});

/* -------------------------------------------------------------
   The `toggleNotes` function (for expanding/collapsing the
   textarea) is already defined inline in journal.html, so we do
   not redeclare it here.
------------------------------------------------------------- */