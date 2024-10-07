document.addEventListener('DOMContentLoaded', () => {

    const getFilms = () => {
        return fetch('https://japceibal.github.io/japflix_api/movies-data.json')
            .then(res => res.json())
            .catch(error => {
                console.error(error);
            });
    };

    const searchFilms = (films) => {
        let searchBar = document.querySelector('#inputBuscar');
        let searchButton = document.querySelector('#btnBuscar');

        searchButton.addEventListener('click', function () {
            const query = searchBar.value.toLowerCase();

            if (query.trim() !== "") {
                const filteredFilms = films.filter(film => {
                    const genreNames = film.genres.map(genre => genre.name.toLowerCase()).join(', ');

                    return film.title.toLowerCase().includes(query) ||
                        film.tagline.toLowerCase().includes(query) ||
                        genreNames.includes(query) ||
                        film.overview.toLowerCase().includes(query);
                });
                showFilms(filteredFilms);
            } else {
                clearFilms();
            }
        });
    };

    const showFilms = (films) => {
        let contenedor = document.getElementById('lista');
        contenedor.innerHTML = '';

        films.forEach(film => {
            let article = document.createElement('article');
            let stars = '★'.repeat(film.vote_average) + '☆'.repeat(10 - film.vote_average);
            article.innerHTML = `
            <h2>${film.title}</h2>
            <p>${film.tagline}</p>
            <p>Rating: ${stars}</p>
        `;
            contenedor.appendChild(article);
            article.addEventListener('click', () => {
                showFilmDetails(film);
            });
        });
    };

    const showFilmDetails = (film) => {
        const detailsContainer = document.getElementById('filmDetails');
        detailsContainer.innerHTML = '';

        const genreNames = film.genres.map(genre => genre.name).join(', ');

        detailsContainer.innerHTML = `
        <div class="detailsHeader">
            <h2>${film.title}</h2>
            <button id="closeDetails" class="detailsButton">✖</button>
        </div>
        <p>${film.overview}</p>
        <p><strong>Géneros:</strong> ${genreNames}</p>
        <button id="toggleDetails" class="detailsButton">more</button>
        <section id="additionalInfo" class="additionalInfo" style="display: none;">
            <div class="infoContainer">
                <h3 class="addInfoHeading">Año de lanzamiento:</h3>
                <p class="addInfoData">${film.release_date.split('-')[0]}</p>
                <h3 class="addInfoHeading">Duración:</h3>
                <p class="addInfoData">${film.runtime} minutos</p>
                <h3 class="addInfoHeading">Presupuesto:</h3>
                <p class="addInfoData">${film.budget.toLocaleString()}</p>
                <h3 class="addInfoHeading">Ganancias:</h3>
                <p class="addInfoData">${film.revenue.toLocaleString()}</p>
            </div>
        </section>
    `;

        const toggleButton = document.getElementById('toggleDetails');
        const closeButton = document.getElementById('closeDetails');
        const additionalInfo = document.getElementById('additionalInfo');


        toggleButton.addEventListener('click', () => {
            if (additionalInfo.style.display === 'none') {
                additionalInfo.style.display = 'block';
                toggleButton.innerHTML = "✖";
            } else {
                additionalInfo.style.display = 'none';
                toggleButton.innerHTML = 'more';
            }
        });


        closeButton.addEventListener('click', () => {
            detailsContainer.style.display = 'none';
        });

        detailsContainer.style.display = 'block';
    };

    const clearFilms = () => {
        let contenedor = document.getElementById('lista');
        contenedor.innerHTML = '';
    };

    getFilms().then(films => {
        searchFilms(films);
    });

});
