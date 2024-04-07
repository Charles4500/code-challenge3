// Your code here
document.addEventListener('DOMContentLoaded', function () {
  // Base URL for API
  const baseUrl = 'http://localhost:3000';

  // Function to fetch movie data
  async function fetchMovies() {
    const response = await fetch(`${baseUrl}/films`);
    const data = await response.json();
    return data;
  }

  // Function to fetch movie details by ID
  async function fetchMovieById(id) {
    const response = await fetch(`${baseUrl}/films/${id}`);
    const data = await response.json();
    return data;
  }

  // Function to update tickets sold
  async function updateTicketsSold(id, ticketsSold) {
    await fetch(`${baseUrl}/films/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tickets_sold: ticketsSold }),
    });
  }

  // Function to buy a ticket
  async function buyTicket(movie) {
    const newTicketsSold = movie.tickets_sold + 1;
    await updateTicketsSold(movie.id, newTicketsSold);
    return newTicketsSold;
  }

  // Function to render movie details
  async function renderMovieDetails(movie) {
    const poster = document.getElementById('poster');
    const title = document.getElementById('title');
    const runtime = document.getElementById('runtime');
    const filmInfo = document.getElementById('film-info');
    const showtime = document.getElementById('showtime');
    const ticketNum = document.getElementById('ticket-num');
    const buyTicketBtn = document.getElementById('buy-ticket');

    poster.src = movie.poster;
    title.textContent = movie.title;
    runtime.textContent = `${movie.runtime} minutes`;
    filmInfo.textContent = movie.description;
    showtime.textContent = movie.showtime;
    const remainingTickets = movie.capacity - movie.tickets_sold;
    ticketNum.textContent = `${remainingTickets} remaining tickets`;

    if (remainingTickets <= 0) {
      buyTicketBtn.disabled = true;
      buyTicketBtn.textContent = 'Sold Out';
    }

    buyTicketBtn.onclick = async () => {
      if (remainingTickets <= 0) {
        alert('This showing is sold out.');
        return;
      }

      const newTicketsSold = await buyTicket(movie);
      ticketNum.textContent = `${movie.capacity - newTicketsSold} remaining tickets`;

      if (newTicketsSold >= movie.capacity) {
        buyTicketBtn.disabled = true;
        buyTicketBtn.textContent = 'Sold Out';
      }
    };
  }

  // Function to render movies menu
  async function renderMoviesMenu() {
    const movies = await fetchMovies();
    const filmsList = document.getElementById('films');

    filmsList.innerHTML = '';
    movies.forEach((movie) => {
      const li = document.createElement('li');
      li.classList.add('film', 'item');
      li.textContent = movie.title;
      li.addEventListener('click', async () => {
        const movieDetails = await fetchMovieById(movie.id);
        renderMovieDetails(movieDetails);
      });
      filmsList.appendChild(li);
    });
  }

  // Initialize the app
  renderMoviesMenu();
  fetchMovieById(1).then(renderMovieDetails);
});