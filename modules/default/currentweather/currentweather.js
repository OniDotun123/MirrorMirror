Module.register("currentweather", {

  defaults: {
    // We will need to implement logic to extract location from watson text response.
    units: "units=e",
    //Location needs to be appended to the baseURL to make query.
    language:"language=en-US",
    format: ".json?";
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
    var url ="https://" + this.config.username + ":" + this.config.password +"@" + this.config.apiBaseUrl + this.config.latitude + "/" + this.config.longitude + "/" + this.config.endpoint + this.defaults.format + this.defaults.language;

    var self = this;

    var xhr = new XMLHttpRequest()
    xhr.open("GET", url);
    xhr.onreadystatechange = function(){
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        self.parsedDataSetter(JSON.parse(this.response));
      } else {
        Log.error(this.name + "Could not load")
      }
    }
    xhr.send()
  },

  parsedDataSetter: function(data){
    this.temperature = data.observation.temp; // temp
    this.phrase = data.observation.wx_phrase; // wx_phrase
    this.feelsLike = data.observation.feels_like; // feels_like
    this.uvIndex = data.observation.uv_index; // uv_index
    this.wind = data.observation.wdir_cardinal; // wdir_cardinal
    this.icon = data.observation.wx_icon; // refer to docs for function to retrive image. wx_icon
  }

});
