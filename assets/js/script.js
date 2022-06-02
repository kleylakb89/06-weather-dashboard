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

// TODO: Add No Results Found for failed search

// TODO: In order to search for a city:
// query textarea and button
// add event listener to button
// fail state for searched city?
// fetch API for geocode of city

var searchEl = document.querySelector('#city-search');
var submitEl = document.querySelector('.submit');
var cityEl = document.querySelector('.current-city');
var historyEl = document.querySelector('.history');

var lat;
var lon;

function init() {
    displayHistory();
}

function citySearch() {
    var currentCity = searchEl.value;
    var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${currentCity}&limit=1&appid=43ba4285918e75abf5e651327d673253`;
    
    searchHistory(currentCity);
    
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
    .catch(function(err) {
        console.log(err);
        cityEl.textContent = 'Results Not Found';
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
        tempEl.textContent = 'Temperature: ' + data.current.temp;
        humidEl.textContent = 'Humidity: ' + data.current.humidity;
        windEl.textContent = 'Wind Speed: ' + data.current.wind_speed;
        uviEl.textContent = 'UVI: ' + data.current.uvi;
        
        if (data.current.uvi < 4) {
            uviEl.style.backgroundColor = 'green';
        } else if (data.current.uvi > 3 && data.current.uvi < 7) {
            uvi.style.backgroundColor = 'orange';
        } else uvi.style.backgroundColor = 'red';
        
        currentEl.append(nameEl, dateEl, iconEl, tempEl, humidEl, windEl, uviEl);
        cityEl.appendChild(currentEl);
        
        
            for (i = 0; i < 5; i++) {
                var iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                var day = i + 1;
                var nextDay = data.daily[i];
                var icon = nextDay.weather[0].icon
                var date = moment().add(day,'d').format('MM/DD/YYYY')
                var futureBlock = [date, iconUrl, nextDay.temp.max, nextDay.wind_speed, nextDay.humidity];
                displayFuture(futureBlock);
            };
        })
        .catch(function(err) {
            console.log(err);
            cityEl.textContent = 'Results Not Found';
        })
    }
    
function displayFuture(arr) {
    var forecastEl = document.createElement('section');
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

    forecastEl.append(fDateEl, fIconEl, fTempEl, fWindEl, fHumidEl);
    cityEl.appendChild(forecastEl);
}

function searchHistory(city) {
    var pastCities = JSON.parse(localStorage.getItem('search-history')) || [];

    // checks for duplicate searches and removes them from the history before pushing this search
    for (i=0; i<pastCities.length; i++) {
        if (pastCities[i] == city) {
            pastCities.splice(i, 1);
        } 
    }
    // Won't continue save into local storage if empty string is submitted
    if (city === '') {
        return 
    }
    pastCities.push(city);
    
    localStorage.setItem('search-history', JSON.stringify(pastCities))

    displayHistory();
}

function displayHistory() {
    var pastCities = JSON.parse(localStorage.getItem('search-history')) || [];

    historyEl.innerHTML = null;
    for (city of pastCities) {
        var pCityEl = document.createElement('button');

        pCityEl.textContent = city;

        historyEl.append(pCityEl);
    }
}

submitEl.addEventListener('click', citySearch);

historyEl.addEventListener('click', function(event){
    var button = event.target
    var currentCity = button.textContent;
    console.log(button, currentCity);
    var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${currentCity}&limit=1&appid=43ba4285918e75abf5e651327d673253`;
    
    searchHistory(currentCity);

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
    .catch(function(err) {
        console.log(err);
    })
});

init();