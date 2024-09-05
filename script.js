let data;
let darkMode = false;
let pendingData = true;
const countries = document.querySelector(".countries-grid");
const btnTheme = document.querySelector(".theme");
const body = document.body;
const header = document.querySelector(".frontBar");
const searchBar = document.querySelector(".searchbar");
const filter = document.querySelector(".filter");
const page1 = document.querySelector(".page-1");
const page2 = document.querySelector('.country--info');
const searchbar = document.querySelector('.searchbar');

(async function () {
  try {
    const res = await fetch('/data.json');
    const data = await res.json();
    countries.innerHTML = '';
    let index = 0;
    const displayCountry = function (country) {
      console.log(country);
      let html = ` <button class="back-button">🔙 Back</button>
      <div class="details">
        <div>
        <img class="country__flag" src="${country.flag}" />
        </div>
        <div class="country-details">
          <h2 class="country__name">${country.name}</h2>
          <div class="country-statistics">
            <div class="first-column">
              <p>Native Name: <span>${country.nativeName}</span></p>
              <p>Population: <span>${country.population}</span></p>
              <p>Region: <span>${country.region}</span></p>
              <p>Sub Region: <span>${country.subregion}</span></p>
              <p>Capital: <span>${country.capital}</span></p>
            </div>
            <div class="secound-column">
              <p>Top Level Domain: <span>${country.topLevelDomain[0]}</span></p>
              <p>Currencies: <span>${country.currencies[0].name}</span></p>
              <p>
                Languages:
                <span>${country.languages[0].name}</span>
              </p>
              </div>
          </div>
          `;
      if (country.borders) {
        html += '<div class="border-countries"><p>Border Countries:</p>';
        country.borders.forEach(borderCode => {
          const border = data.find(el => el.alpha3Code === borderCode);
          if (border) {
            const htmlB = `
            <button class="border-country--btn">${border.name}</button>
            `;
            html += htmlB;
          }
        });
      }
      html += '</div></div></div>';

      page1.classList.add('hidden');
      page2.innerHTML = '';
      page2.insertAdjacentHTML('afterbegin', html);
      page2.classList.remove('hidden');
      const borderContainer = document.querySelector('.border-countries');
      const backBtn = document.querySelector('.back-button');
      borderContainer.addEventListener('click', e => {
        const btn = e.target;
        const name = e.target.textContent;
        const borCountry = data.find(country => country.name === name);
        displayCountry(borCountry);
      });
      backBtn.addEventListener('click', e => {
        page2.classList.add('hidden');
        page1.classList.remove('hidden');
      });
      if (darkMode) {
        document.querySelector('.back-button').style.color = 'white';
        document.querySelector('.back-button').style.backgroundColor =
          '#2e3a4b';
        document.querySelectorAll('.border-country--btn').forEach(btn => {
          btn.style.color = 'white';
          btn.style.backgroundColor = '#2e3a4b';
        });
      }
    };
    data.forEach((element, i) => {
      const html = `
      <div class="country" index=${index++}>
      <img class="flag" src="${element.flag}" />
      <p class="name">${element.name}</p>
      <div class="info">
      <p>Population: <span class="data">${element.population}</span></p>
      <p>Region: <span class="data">${element.region}</span></p>
      <p>Capital: <span class="data">${element.capital}</span></p>
      </div>
      </div>`;
      countries.insertAdjacentHTML('beforeend', html);
    });
    countries.addEventListener('click', e => {
      const countryEl = e.target.closest('.country');
      if (!countryEl) return;
      const country = data[+countryEl.getAttribute('index')];
      displayCountry(country);
    });
    btnTheme.addEventListener('click', function (e) {
      e.preventDefault();
      darkMode = !darkMode;
      const cards = document.querySelectorAll('.country');
      const allData = document.querySelectorAll('.data');
      if (darkMode) {
        btnTheme.textContent = '🌞 Light Mode';
        body.classList.add('dark-mode');
        header.style.backgroundColor = '#2e3a4b';
        searchBar.style.backgroundColor = '#2e3a4b';
        filter.style.backgroundColor = '#2e3a4b';
        document.querySelector('.back-button').style.color = 'white';
        document.querySelector('.back-button').style.backgroundColor =
          '#2e3a4b';
        document.querySelectorAll('.border-country--btn').forEach(btn => {
          btn.style.color = 'white';
          btn.style.backgroundColor = '#2e3a4b';
        });
        allData.forEach(
          span => (span.style.color = 'rgba(200, 200, 200, 0.7)')
        );
        cards.forEach(card => (card.style.backgroundColor = '#2e3a4b'));
      } else {
        btnTheme.textContent = '🌜 Dark Mode';
        body.classList.remove('dark-mode');
        header.style.backgroundColor = 'white';
        searchBar.style.backgroundColor = 'white';
        filter.style.backgroundColor = 'white';
        allData.forEach(span => (span.style.color = ' rgba(0, 0, 0, 0.7)'));
        cards.forEach(card => (card.style.backgroundColor = 'white'));
        document.querySelector('.back-button').style.color = 'black';
        document.querySelector('.back-button').style.backgroundColor = 'white';
        document.querySelectorAll('.border-country--btn').forEach(btn => {
          btn.style.color = 'black';
          btn.style.backgroundColor = 'white';
        });
      }
    });
    const allCountries = [...document.querySelectorAll('.country')];
    body.addEventListener('keydown', e => {
      if (e.code !== 'Enter') return;
      const serCountryName = searchbar.value.toLowerCase();
      const serCountry = allCountries.find(
        el => el.querySelector('p').textContent.toLowerCase() === serCountryName
      );
      if (!serCountry) {
        allCountries.forEach(el => el.classList.remove('hidden'));
        return;
      }
      allCountries.forEach(el => el.classList.add('hidden'));
      serCountry.classList.remove('hidden');
    });
    filter.addEventListener('change', e => {
      e.preventDefault();
      const region = filter.value;
      console.log(region);
      const regionalCountries = data.filter(el => el.region === region);
      countries.innerHTML = '';
      regionalCountries.forEach((element, i) => {
        const html = `
        <div class="country" index=${index++}>
        <img class="flag" src="${element.flag}" />
        <p class="name">${element.name}</p>
        <div class="info">
        <p>Population: <span class="data">${element.population}</span></p>
        <p>Region: <span class="data">${element.region}</span></p>
        <p>Capital: <span class="data">${element.capital}</span></p>
        </div>
        </div>`;
        countries.insertAdjacentHTML('beforeend', html);
      });
    });
  } catch (err) {
    console.error(err.message);
  }
})();

