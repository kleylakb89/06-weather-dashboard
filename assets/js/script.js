// TODO: Search for city, display weather conditions
// TODO: City name, date, icon of weather conditions, temp, humidity, wind speed, UV index
// TODO: Color code UV index
// TODO: Future forecast: 5 days, date, icon of weather conditions, temp, wind speed, humidity
// TODO: Search history to redisplay conditions (local storage)

// TODO: init function
// TODO: fetch geocoding API
// TODO: fetch forecast API with latitude and longitude
// TODO: display function to dynamically write to HTML
// TODO: save searches to local storage to reaccess easily
// TODO: Format page

// TODO: In order to search for a city:
// query textarea and button
// add event listener to button
// fail state for searched city?
// fetch API for geocode of city

var searchEl = document.querySelector('#city-search');
var submitEl = document.querySelector('.submit');
var cityEl = document.querySelector('.current-city');

var lat;
var lon;

function init() {

}

function citySearch() {
    var currentCity = searchEl.value;
    var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${currentCity}&limit=1&appid=43ba4285918e75abf5e651327d673253`;

    fetch(geoUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (var city of data) {
                lat = city.lat;
                lon = city.lon;
            }
            weatherSearch(currentCity, lat, lon);
        })
}


function weatherSearch(city, lat, lon) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=43ba4285918e75abf5e651327d673253&units=imperial`;

    cityEl.innerHTML = null;

    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var currentEl = document.createElement('section');
            var nameEl = document.createElement('h2');
            var dateEl = document.createElement('h3');
            var iconEl = document.createElement('img');
            var tempEl = document.createElement('p');
            var humidEl = document.createElement('p');
            var windEl = document.createElement('p');
            var uviEl = document.createElement('p');
            
            var now = moment().format('MM/DD/YYYY');
            var icon = data.current.weather[0].icon;
            var iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            nameEl.textContent = city;
            dateEl.textContent = now;
            iconEl.src = iconUrl;
            tempEl.textContent = data.current.temp;
            humidEl.textContent = data.current.humidity;
            windEl.textContent = data.current.wind_speed;
            uviEl.textContent = data.current.uvi;

            currentEl.append(nameEl, dateEl, iconEl, tempEl, humidEl, windEl, uviEl);
            cityEl.appendChild(currentEl);

            var futureBlock = [moment().add(1,'d').format('MM/DD/YYYY'), data.daily[0].weather[0].icon, data.daily[0].temp.max, data.daily[0].wind_speed, data.daily[0].humidity];

            console.log(futureBlock);
        })
}

submitEl.addEventListener('click', citySearch);

init();