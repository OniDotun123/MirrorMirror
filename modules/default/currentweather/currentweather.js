Module.register("currentweather", {

  defaults: {
    // We will need to implement logic to extract location from watson text response.
    units: "units=e",
    //Location needs to be appended to the baseURL to make query.
    language:"language=en-US",
    format: ".json?"
  },

  getHeader: function(){
    return this.data.header //This needs to display the location we set in out defaults.
  },

  getTranslations: function(){
    return false;
  },

  start: function(){

    Log.info("Starting module: " + this.name);

    moment.locale(config.language);

    this.temperature = null; // temp
    this.high = null;
    this.low = null;
    this.forecast = null;
    // this.phrase = null; // wx_phrase
    // this.feelsLike = null; // feels_like
    // this.uvIndex = null; // uv_index
    // this.wind = null; // wdir_cardinal
    // this.icon = null; // refer to docs for function to retrive image. wx_icon
    this.updateWeather();
    this.loaded = false;
  },

  getDom: function() {

    var div = document.createElement("div");
    div.className = "weather-display";

    var locationDisplay = document.createElement("span");
    locationDisplay.className = "location-display";
    locationDisplay.innerHTML = this.config.location; // might need to look into getting and setting location.
    div.appendChild(locationDisplay);

    var temperatureDisplay = document.createElement("span")
    temperatureDisplay.className = "temp-display"
    temperatureDisplay.innerHTML = " Temperature: " + this.temperature + "&deg;"
    div.appendChild(temperatureDisplay);

    var tempHighDisplay = document.createElement("span");
    tempHighDisplay.className = "high-display"
    tempHighDisplay.innerHTML = " High: " + this.high + "&deg";
    div.appendChild(tempHighDisplay);

    var tempLowDisplay = document.createElement("span");
    tempLowDisplay.className = "low-display";
    tempLowDisplay.innerHTML = " Low: " + this.low + "&deg";
    div.appendChild(tempLowDisplay);


    var forecastDisplay = document.createElement("span");
    forecastDisplay.className = "forecast-display";
    forecastDisplay.innerHTML = " It is " + this.forecast + " today"
    div.appendChild(forecastDisplay);

    return div
  },

  updateWeather: function(){

    // var url ="https://" + this.config.username + ":" + this.config.password +"@" + this.config.apiBaseURL + this.config.latitude + "/" + this.config.longitude + "/" + this.config.endpoint + this.defaults.format + this.defaults.language;

    var baseUrl = "https://query.yahooapis.com/v1/public/yql?q=";
    var yql_query = "select * from weather.forecast where woeid=2459115";
    yql_url = baseUrl + encodeURIComponent(yql_query) + "&format=json"

    var self = this;

    var xhr = new XMLHttpRequest()

    xhr.open("GET", yql_url);
    // xhr.setRequestHeader("content-type", "https://*.ibm.com")

    xhr.onreadystatechange = function(){
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

        self.parsedDataSetter(JSON.parse(this.response));
      }
      // } else {
      //   Log.error(this.name + "Could not load")
      // }
    }
    xhr.send()
  },

  parsedDataSetter: function(data){

    this.temperature = data['query']['results']['channel']['item']['condition']['temp']; // temp
    this.high = data['query']['results']['channel']['item']['forecast'][0]['high'];
    this.low = data['query']['results']['channel']['item']['forecast'][0]['low'];
    this.forecast =  data['query']['results']['channel']['item']['forecast'][0]['text'];
    // this.phrase = data.observation.wx_phrase; // wx_phrase
    // this.feelsLike = data.observation.feels_like; // feels_like
    // this.uvIndex = data.observation.uv_index; // uv_index
    // this.wind = data.observation.wdir_cardinal; // wdir_cardinal
    // this.icon = data.observation.wx_icon; // refer to docs for function to retrive image. wx_icon
    this.updateDom(this, 0)
  },

  // Define reuest url later on in module with valuues set in default.
  // Need to add username and password to url to make api call
  // paramters need to be concated with '&' in between

});
