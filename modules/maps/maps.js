
Module.register("maps",{
    defaults: {
  apikey: 'AIzaSyA60mxJ7eqA6zxthZ7JE44uomf5TTcnOKA',
  origin: 'nyc+NY',
  destination: 'PA+US',
  baseurl: 'https://www.google.com/maps/embed/v1/place?key=',
  style: 'border:0;-webkit-filter: grayscale(100%);filter: grayscale(100%);'
  },

  start: function(){

    Log.info("Starting module: " + this.name);

    moment.locale(config.language);

    this.description = null;
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

  notificationReceived: function(notification){
      if(notification === "map"){
        console.log("======== map request ========");
        this.sendSocketNotification("MAP", this.defaults);
      }
  },

  socketNotificationReceived: function(notification, url){
    console.log('socket received from Node Helper Maps');
    Log.log("socket received from Node Helper");
    if(notification === "MAPS_RESULT"){

      this.completeURL = url;
      this.updateDom();
    }
  }

});





