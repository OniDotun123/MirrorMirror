Module.register("currentweather", {

  defaults: {
    // location is blank by default. User input will determine the location via city name or postal createTextNode
    // We will need to implement logic to extract location from watson text response.
    location: "",
    units: "units=e",
    //Location needs to be appended to the baseURL to make query.
    apiBaseUrl: "twcservice.mybluemix.net:443/api/weather/v3/location/",
    language:"language=en-US",
    format: ".json";
  },

  getHeader: function(){
    return this.data.header + "location" //This needs to display the location we set in out defaults.
  },

  getTranslations: function(){
    return false;
  },

  start: function(){
    Log.info("Starting module: " + this.name);

    // moment.locale(config.language);

    this.temperature = null; // temp
    this.phrase = null; // wx_phrase
    this.feelsLike = null; // feels_like
    this.uvIndex = null; // uv_index
    this.wind = null; // wdir_cardinal
    this.icon = null; // refer to docs for function to retrive image. wx_icon

    this.loaded = false;
  },

  // Define reuest url later on in module with valuues set in default.
  // Need to add username and password to url to make api call
  // paramters need to be concated with '&' in between
  getDom: function() {
    var div = document.createElement("div");
    div.className = "weather-display";

      var locationDisplay = document.createElement("span");
      locationDisplay.className = "location-display";
      locationDisplay.innerHTML = defaults.location; // might need to look into getting and setting location.
      div.appendChild(locationDisplay);

      var temperatureDisplay = document.createElement("span")
      temperatureDisplay.className = "temp-display"
      temperatureDisplay.innerHTML = " " + this.temperature + "&deg;"
      div.appendChild(temperatureDisplay);

      var phraseDisplay = document.createElement("span");
      phraseDisplay.className = "phrase-display";
      phraseDisplay.innerHTML = "It is " + this.phrase;
      div.appendChild(phraseDisplay);

      var feelsLikeDisplay = document.createElement("span");
      feelsLikeDisplay.className = "feels-like-display";
      feelsLikeDisplay.innerHTML = "It feels like " + this.feelsLike +"&deg";
      div.appendChild(feelsLikeDisplay);

      var uvIndexDisplay = document.createElement("span");
      uvIndexDisplay.className = "uv-index-display";
      uvIndexDisplay.innerHTML = "UV Index: " + this.uvIndex
      div.appendChild(uvIndexDisplay);

      var windDisplay = document.createElement("span");
      windDisplay.className = "wind-display";
      windDisplay.innerHTML = "Wind Condition: " + this.wind;
      div.appendChild(windDisplay);

      var iconDisplay = document.createElement("span");
      iconDisplay.className = "icon-display";
      iconDisplay.innerHTML = this.icon;
      div.appendChild(iconDisplay);

    return div
  },

  weatherGetter: function(){

  }

});
