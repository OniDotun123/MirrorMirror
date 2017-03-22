Module.register("jokes", {

  defaults:{
     baseUrl: "http://tambal.azurewebsites.net/joke/random"
  },

  getHeader: function(){
    return this.data.header
  },

  getTranslations: function(){
    return false
  },

  start: function(){

    Log.info("Starting module " + this.name);
    moment.locale(config.language);

    this.joke = null;
    this.sendSocketNotification("DISPLAY_JOKE");
    this.loaded = false;

  },


  getDom: function(){
    var div = document.createElement('div');
    div.className = "jokes-container";

    var jokeDisplay = document.createElement('span');
    jokeDisplay.className = 'joke-display';
    jokeDisplay.innerHTML = this.joke;
    div.appendChild(jokeDisplay);

    return div
  },

  notificationReceived: function(notification) {
    var notArr = notification.split(" ");
    if (notArr.includes("joke")){
      console.log("========== joke request ==========");
      this.sendSocketNotification("JOKE", this.defaults);
      this.show();
    }else{
      this.hide();
    }
  },

  socketNotificationReceived: function (notification, payload) {
    Log.log("socket recieved from Node Helper");
    if (notification === "JOKE_RESULT") {
      this.parsedDataSetter(payload);
    }
  },

  parsedDataSetter: function(data){
    this.joke = data["joke"]
    this.updateDom();
  },
})
