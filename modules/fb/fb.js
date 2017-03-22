Module.register("fb",{

    defaults: {
  apikey: '',
  baseurl: 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F',
  page: 'devbootcamp',
  endPoint: '&tabs=timeline&width=540&height=1700&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId',
  scrolling: 'yes',
  frameborder: '20',
  allowTransparency: 'true'
  },



  start: function(){

    Log.info("Starting module: " + this.name);

    moment.locale(config.language);

    this.description = null;
    this.completeURL = '';
    this.sendSocketNotification("LISTEN_FB_TIMELINE", this.defaults);
    this.loaded = false;
  },

    getDom: function() {

    var fbTimeine = document.createElement("IFRAME");
    fbTimeine.style = this.config.style;
    fbTimeine.width = this.config.width;
    fbTimeine.height = this.config.height;
    fbTimeine.src =  this.completeURL;
    return fbTimeine;
  },

   notificationReceived: function(notification){
     var notArr = notification.split(" ");
      if(notArr.includes("facebook")){
        console.log("======== facebook request ========");
        this.sendSocketNotification("FB", this.defaults);
        this.show();
      }else{
        this.hide();
      }
  },

  socketNotificationReceived: function(notification, url){
    Log.log("socket received from Node Helper");
    if(notification === "FB_RESULT"){
      this.completeURL = url;
      this.updateDom();
    }
  }

});
