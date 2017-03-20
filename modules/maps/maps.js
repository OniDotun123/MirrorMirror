
Module.register("maps",{
    // Default module config.
    defaults: {
  apikey: 'AIzaSyBAZyGBZhoCCvjD7jcf4SeWrr_h9d3BKNg',
  origin: 'origin_here',
  destination: 'destination_here',
  baseurl: 'https://www.google.com/maps/embed/v1/place?key=',
  style: 'border:0;-webkit-filter: grayscale(100%);filter: grayscale(100%);',
  },

  start: function(){

    Log.info("Starting module: " + this.name);

    moment.locale(config.language);

    this.author = null;
    this.description = null;
    this.url = null;
    this.urlToImage = null;

    this.headlines = []
    this.sendSocketNotification("LISTEN_MAPS", this.defaults);
    this.loaded = false;
  },

    getDom: function() {
    // var completeURL = this.config.baseurl + this.config.apikey + '&origin=' + this.config.origin + '&destination=' + this.config.destination;
    var completeURL = this.config.baseurl + this.config.apikey + '&q=' + this.config.origin + '&zoom=13';

    var iframe = document.createElement("IFRAME");
    iframe.style = this.config.style;
    iframe.width = this.config.width;
    iframe.height = this.config.height;
    iframe.src =  completeURL;
    return iframe;
  }
});





