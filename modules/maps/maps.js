
Module.register("maps",{
    defaults: {
  apikey: 'AIzaSyA60mxJ7eqA6zxthZ7JE44uomf5TTcnOKA',
  origin: '',
  destination: 'PA+US',
  baseurl: 'https://www.google.com/maps/embed/v1/place?key=',
  style: 'border:0;-webkit-filter: grayscale(100%);filter: grayscale(100%);',
  zoom: '15'
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

    var map = document.createElement("IFRAME");
    map.style = this.config.style;
    map.width = this.config.width;
    map.height = this.config.height;
    map.src =  this.completeURL;
    return map;
  },

  notificationReceived: function(notification){
    if (notification.includes("map")){
      var command = notification.split(" ");
      var extra = 'show me a map of';
      var origin = [];

      for (i = 0; i < command.length; i++) {
        if (!extra.includes(command[i])) {
          origin.push(command[i]);
        }
      }

      var formatedOrigin = origin.splice(0, 1);

      if (origin.length > 0) {
        for (i = 0; i < origin.length; i++) {
          formatedOrigin.push("+");
          formatedOrigin.push(origin[i]);
        }
      }

      this.defaults.origin = formatedOrigin.join("");
      console.log("======== map request ========");
      this.sendSocketNotification("MAP", this.defaults);
      this.show();  
    }
    else if (notification === "zoom in") {
      this.defaults.zoom = (Number(this.defaults.zoom) + 3).toString();
      console.log("======== zoom in request ========");
      this.sendSocketNotification("MAP", this.defaults);
      this.show();  
    }
    else if (notification === "zoom out") {
      this.defaults.zoom = (Number(this.defaults.zoom) - 3).toString();
      console.log("======== zoom out request ========");
      this.sendSocketNotification("MAP", this.defaults);
       this.show();  
    }else{
        this.hide();
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





