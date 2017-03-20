
Module.register("maps",{
    defaults: {
  apikey: 'AIzaSyBAZyGBZhoCCvjD7jcf4SeWrr_h9d3BKNg',
  origin: 'nyc+NY',
  destination: 'PA+US',
  baseurl: 'https://www.google.com/maps/embed/v1/place?key=',
  style: 'border:0;-webkit-filter: grayscale(100%);filter: grayscale(100%);'
  },

  start: function(){

    Log.info("Starting module: " + this.name);

    moment.locale(config.language);

    this.author = null;
    this.description = null;
    // this.completeURL = this.config.baseurl + this.config.apikey + '&q=' + this.config.origin + '&zoom=15';
    this.completeURL = null;
    this.sendSocketNotification("LISTEN_MAPS", this.defaults);
    this.loaded = false;
  },

    getDom: function() {
    // var completeURL = this.config.baseurl + this.config.apikey + '&origin=' + this.config.origin + '&destination=' + this.config.destination;
    // var completeURL = this.config.baseurl + this.config.apikey + '&q=' + this.config.origin + '&zoom=15';

    var map = document.createElement("IFRAME");
    map.style = this.config.style;
    map.width = this.config.width;
    map.height = this.config.height;
    map.src =  this.completeURL;
    return map;
  },

  socketNotificationReceived: function(notification, payload){
    Log.log("socket received from Node Helper");
    if(notification === "MAPS_RESULT"){

      this.completeURL = payload;
      this.updateDom();
    }
  }

});





