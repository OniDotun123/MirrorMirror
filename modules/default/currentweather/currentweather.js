Module.register("currentweather", {

  defaults: {

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

    this.sendSocketNotification("LISTEN_WEATHER");
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
  
  notificationReceived: function(notification){
    Log.log("socket received from Node Helper");
    if(notification === "weather"){
      console.log("======== weather request ========");
      this.sendSocketNotification("WEATHER");
    }
  },

  socketNotificationReceived: function(notification, payload){
    Log.log("socket received from Node Helper");
    if(notification === "NEWS_RESULT"){
      var weatherJSON = payload;
          this.temperature = payload['query']['results']['channel']['item']['condition']['temp']; // temp
          this.high = payload['query']['results']['channel']['item']['forecast'][0]['high'];
          this.low = payload['query']['results']['channel']['item']['forecast'][0]['low'];
          this.low =  payload['query']['results']['channel']['item']['forecast'][0]['text'];

          this.updateDom();
    }
  }


});
