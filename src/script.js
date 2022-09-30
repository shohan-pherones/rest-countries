// Elements
const inputSearch = document.querySelector(".input-search");
const btnSearch = document.querySelector(".btn-search");
const countriesWrapper = document.querySelector(".countries-wrapper");

// Rendering country
function renderCountry(country, className = "") {
  const html = `
    <div class="country ${className} flex flex-col gap-5 w-80 overflow-hidden bg-white rounded-xl shadow-lg">
      <div class="country-img h-44 overflow-hidden">
        <img
          class="w-full"
          src="${country.flag}"
          alt="${country.name} flag"
        />
      </div>
      <div class="pl-5 flex flex-col gap-2">
        <div class="country-name text-3xl font-medium">${country.name}</div>
        <div
          class="country-region tracking-widest uppercase text-sm font-bold text-cyan-500">
          ${country.region}
        </div>
      </div>
      <div class="pl-10 pb-10 text-xl flex flex-col gap-2">
        <div class="country-capital">🏛️ ${country.capital}</div>
        <div class="country-area">🗺️ ${country.area} km² area</div>
        <div class="country-population">🧑🏻‍🤝‍🧑🏾 ${(
          country.population / 1000000
        ).toFixed(1)} million people</div>
        <div class="country-language">🗣️ ${country.languages[0].name} (${
    country.languages[0].nativeName
  })</div>
        <div class="country-currency">💰 ${country.currencies[0].name} (${
    country.currencies[0].symbol
  })</div>
      </div>
    </div>
  `;

  countriesWrapper.insertAdjacentHTML("beforeend", html);
}

// Rendering error
function renderError(err) {
  countriesWrapper.insertAdjacentText("beforeend", err);
  countriesWrapper.style.opacity = 1;
}

// Fetching countries
function fetchCountryData(countryName) {
  fetch(`https://restcountries.com/v2/name/${countryName}`)
    .then((res) => {
      if (!res.ok) throw new Error(`${res.status} - No country found`);
      return res.json();
    })
    .then((data) => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.at(0);
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then((res) => {
      if (!res.ok)
        throw new Error(`${res.status} - No neighbour country found`);
      return res.json();
    })
    .then((data) => renderCountry(data, "neighbour"))
    .catch((err) => renderError(`${err.message}, try again later!`))
    .finally(() => (countriesWrapper.style.opacity = 1));
}

// Button handler
function displayCountry() {
  btnSearch.addEventListener("click", function (e) {
    e.preventDefault();

    countriesWrapper.style.opacity = 0;
    countriesWrapper.innerHTML = "";

    const countryName = inputSearch.value;
    inputSearch.value = "";
    inputSearch.blur();

    fetchCountryData(countryName);
  });
}

displayCountry();
