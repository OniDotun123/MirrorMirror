Module.register("currentweather", {

  defaults: {
    location: "NYC, NY"
  },

  getHeader: function(){
    return this.data.header //This needs to display the location we set in out defaults.
  },

  getStyles: function(){
    return ["currentweatherstyles.css"]
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
    this.forecast = "";

    this.sendSocketNotification("WEATHER");
    this.loaded = false;
  },

  getDom: function() {

    var div = document.createElement("div");
    div.className = "weather-display";

    var locationDisplay = document.createElement("span");
    locationDisplay.className = "location-display";
    locationDisplay.innerHTML = this.defaults.location; // might need to look into getting and setting location.
    div.appendChild(locationDisplay);

    var forecastDisplay = document.createElement("span");
    forecastDisplay.className = "forecast-display";
    forecastDisplay.innerHTML = " It is " + this.forecast.toLowerCase() + " today."
    div.appendChild(forecastDisplay);

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

    return div
  },


  socketNotificationReceived: function(notification, payload){
    Log.log("socket received from Node Helper");
    if(notification === "NEWS_RESULT"){
      var weatherJSON = payload;
          this.temperature = payload['query']['results']['channel']['item']['condition']['temp']; // temp
          this.high = payload['query']['results']['channel']['item']['forecast'][0]['high'];
          this.low = payload['query']['results']['channel']['item']['forecast'][0]['low'];
          this.forecast =  payload['query']['results']['channel']['item']['forecast'][0]['text'];

          this.updateDom();
    }
  }


});
