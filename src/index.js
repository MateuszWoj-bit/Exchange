import './css/styles.css';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

const gallery = document.querySelector('.gallery');
const date = document.querySelector('.date');
const loader = document.querySelector('.load');

const ctx = document.getElementById('myChart');
const ctx1 = document.getElementById('myChart1');
const ctx2 = document.getElementById('myChart2');
const ctx3 = document.getElementById('myChart3');

// loader.addEventListener('click', loadData);

const fetchData = async () => {
  const params = 'A/last/66/';
  const table = await axios.get(
    `
https://api.nbp.pl/api/exchangerates/tables/${params}/`
  );
  console.log(table)
  return table;
};

//https://pixabay.com/api/?key=6755131-7999fe22e3bb9fa8947c67297&q=yellow+flowers&image_type=photo`
// https://api.nbp.pl/api/exchangerates/tables/${params}/

// const exe = function () {
//   loadData();
// };
// exe();

function loadData() {
  fetchData()
    .then(function (response) {
      // handle success
      renderVaules(response);
      getChartData(response, 1, 'red', ctx, 'Dolar amerykański');
      getChartData(response, 7, 'blue', ctx1, 'Euro');
      getChartData(response, 9, 'green', ctx2, 'Frank szwajcarski');
      getChartData(response, 10, 'purple', ctx3, 'Funt szterling');
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

function renderVaules(response) {
  const table = response.data.length;
  const day = `<h1>Kurs na dzień ${
    response.data[table - 1].effectiveDate
  }</h1>`;

  const markupList = response.data[table - 1].rates
    .filter(
      image =>
        image.code === 'USD' ||
        image.code === 'EUR' ||
        image.code === 'CHF' ||
        image.code === 'GBP'
    )
    .map(
      image => `<div class="column"><p class = "font"><b>${capitalizeFirstLetter(
        image.currency
      )}</b></p>
      <p class = "font">1 ${image.code} = ${image.mid} PLN</p></div>
   `
    )
    .join(``);
  date.insertAdjacentHTML('beforeend', day);
  gallery.insertAdjacentHTML('beforeend', markupList);
}

function getChartData(response, number, color, id, currency) {
  const history = [];
  for (let i = 0; i <= response.data.length - 1; i++) {
    history.push({
      day: response.data[i].effectiveDate,
      value: response.data[i].rates[number].mid,
    });
  }
  (async function () {
    const data = history;
    new Chart(id, {
      type: 'line',
      data: {
        labels: data.map(row => row.day),

        datasets: [
          {
            label: `
        ${capitalizeFirstLetter(currency)}`,
            data: data.map(row => row.value),
            borderColor: color,
            backgroundColor: color,
          },
        ],
      },
    });
  })();
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}


window.onload = loadData;