// query elements: textarea, search button, main element, section element
var searchEl = document.querySelector('#city-search');
var submitEl = document.querySelector('.submit');
var cityEl = document.querySelector('.current-city');
var historyEl = document.querySelector('.history');

// start page function: will display search history from local storage
function init() {
    displayHistory();
}

// accesses geocode API from OpenWeather and fetches search city's latitude and longitude
function citySearch() {
    var currentCity = searchEl.value.trim();
    var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${currentCity}&limit=1&appid=43ba4285918e75abf5e651327d673253`;


    fetch(geoUrl)
        .then(function (response) {
            // Will only return response if it gives a valid response from the API, else responds not found
            if (response.ok) {
                return response.json();
            } else {
                cityEl.textContent = 'Results Not Found';
                return;
            }
        })
        .then(function (data) {
            // Only pulls lat and lon if data array exists, else responds not found
            if (data.length !== 0) {
                for (var city of data) {
                    lat = city.lat;
                    lon = city.lon;
                }
                // saves the current city into local storage and passes off city name, lat, and lon to weatherSearch
                searchHistory(currentCity);
                weatherSearch(currentCity, lat, lon);
            } else {
                cityEl.textContent = 'Results Not Found';
                return;
            }
        })
        .catch(function (err) {
            console.log(err);
        })
}

// uses parameters passed from citySearch to access OpenWeather's One Call API
function weatherSearch(city, lat, lon) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=43ba4285918e75abf5e651327d673253&units=imperial`;


    // clears innerHTML before posting new content
    cityEl.innerHTML = null;

    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // creates HTML elements to then assign content and append
            var currentEl = document.createElement('section');
            var nameEl = document.createElement('h2');
            var dateEl = document.createElement('h3');
            var iconEl = document.createElement('img');
            var divEl = document.createElement('div')
            var tempEl = document.createElement('p');
            var humidEl = document.createElement('p');
            var windEl = document.createElement('p');
            var uviEl = document.createElement('p');
            var spanEl = document.createElement('span');
            var fiveDayEl = document.createElement('p');

            // uses moment.js to capture the current date
            var now = moment().format('MM/DD/YYYY');
            // pulls icon number from data object to use in icon URL
            var icon = data.current.weather[0].icon;
            var iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            // sets content to elements
            nameEl.textContent = city;
            dateEl.textContent = now;
            iconEl.src = iconUrl;
            tempEl.textContent = 'Temperature: ' + data.current.temp;
            humidEl.textContent = 'Humidity: ' + data.current.humidity;
            windEl.textContent = 'Wind Speed: ' + data.current.wind_speed;
            uviEl.textContent = 'UVI: ';
            spanEl.textContent = data.current.uvi
            fiveDayEl.textContent = '5 Day Forecast: ';

            // adds class to divEl for css styling
            divEl.className = 'current-list';

            // sets background color of spanEl depending on value of uvi
            if (data.current.uvi < 4) {
                spanEl.style.backgroundColor = 'green';
            } else if (data.current.uvi > 3 && data.current.uvi < 7) {
                spanEl.style.backgroundColor = 'orange';
            } else span.style.backgroundColor = 'red';

            // appends elements
            uviEl.appendChild(spanEl);
            divEl.append(tempEl, humidEl, windEl, uviEl);
            currentEl.append(nameEl, dateEl, iconEl);
            cityEl.append(currentEl, divEl, fiveDayEl);

            // loops to create 5 forecast cards for next days utilizing futureBlock array of data in displayFuture function
            for (i = 0; i < 5; i++) {
                var iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                var day = i + 1;
                var nextDay = data.daily[i];
                var icon = nextDay.weather[0].icon
                var date = moment().add(day, 'd').format('MM/DD/YYYY')
                var futureBlock = [date, iconUrl, nextDay.temp.max, nextDay.wind_speed, nextDay.humidity];
                displayFuture(futureBlock);
            };
        })
        .catch(function (err) {
            console.log(err);
        })
}

// creates, fills, and appends future forecast cards
function displayFuture(arr) {
    var forecastEl = document.createElement('div');
    var fDateEl = document.createElement('h4');
    var fIconEl = document.createElement('img');
    var fTempEl = document.createElement('p');
    var fWindEl = document.createElement('p');
    var fHumidEl = document.createElement('p');

    fDateEl.textContent = arr[0];
    fIconEl.src = arr[1];
    fTempEl.textContent = 'Temp: ' + arr[2];
    fWindEl.textContent = 'Wind: ' + arr[3];
    fHumidEl.textContent = 'Humidity: ' + arr[4];

    forecastEl.className = 'five-days';

    forecastEl.append(fDateEl, fIconEl, fTempEl, fWindEl, fHumidEl);
    cityEl.appendChild(forecastEl);
}

// saves city searches in local storage
function searchHistory(city) {
    var pastCities = JSON.parse(localStorage.getItem('search-history')) || [];

    // checks for duplicate searches and removes them from the history before pushing this search
    for (i = 0; i < pastCities.length; i++) {
        if (pastCities[i] == city) {
            pastCities.splice(i, 1);
        }
    }
    // Won't continue save into local storage if empty string is submitted
    if (city === '') {
        return;
    }
    pastCities.push(city);

    localStorage.setItem('search-history', JSON.stringify(pastCities))

    // after saving, displays new history
    displayHistory();
}

// pulls search history from local storage and displays it
function displayHistory() {
    var pastCities = JSON.parse(localStorage.getItem('search-history')) || [];

    // clears innerHTML before displaying searches to avoid duplication
    historyEl.innerHTML = null;
    // for of loop through the pastCities array and creating buttons for each city
    for (city of pastCities) {
        var pCityEl = document.createElement('button');

        pCityEl.textContent = city;

        historyEl.append(pCityEl);
    }
    // create clear history button at the bottom
    var clearEl = document.createElement('button');
    clearEl.textContent = 'Clear History';
    historyEl.appendChild(clearEl);
}

// event listener for clicking search button
submitEl.addEventListener('click', citySearch);

// event listener for recalling old searches
historyEl.addEventListener('click', function (event) {
    // targets which button is clicked and saves the name of the city from it
    var button = event.target
    var currentCity = button.textContent;

    // if the button is the clear history button, clears innerHTML and local storage then returns
    if (currentCity === 'Clear History') {
        historyEl.innerHTML = null;
        localStorage.clear();
        return;
    }
    // starts process of searching OpenWeather APIs for the saved city using previous fetch pattern
    var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${currentCity}&limit=1&appid=43ba4285918e75abf5e651327d673253`;
    fetch(geoUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                (cityEl.textContent = 'Results Not Found');
                return;
            }
        })
        .then(function (data) {
            if (data.length !== 0) {
                for (var city of data) {
                    lat = city.lat;
                    lon = city.lon;
                }
                weatherSearch(currentCity, lat, lon);
            } else {
                cityEl.textContent = 'Results Not Found';
                return;
            }
        })
        .catch(function (err) {
            console.log(err);
        })
});

// runs init function when page is accessed
init();