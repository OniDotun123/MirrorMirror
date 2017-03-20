Module.register("jokes", {

  defaults:{
     baseUrl: "http://ron-swanson-quotes.herokuapp.com/v2/quotes";
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
    this.loaded = false;

    this.sendSocketNotification("DISPLAY_JOKE", this.defaults);
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

  notificationRecieved: function(notification) {
    if (notification === "joke"){
      console.log("========== joke request ==========");
      this.sendSocketNotification("JOKE", this.defaults);
    }
  },

  sendSocketNotificationRecieved: function (notification, payload) {
    Log.log("socket recieved from Node Helper");
    if (notification === "JOKE_RESULT") {
      var jokeJSON = payload;
      // for (var i = 0; i < 5; i++) {
      this.parsedDataSetter(jokeJSON)
        this.jokes = jokeJSON[0]
      // }

    }
  },



  // getJoke: function(){
  //   var baseUrl = "http://ron-swanson-quotes.herokuapp.com/v2/quotes";
  //
  //   var self = this
  //
  //   var xhr = new XMLHttpRequest();
  //
  //   xhr.open("GET", baseUrl);
  //
  //   xhr.onreadystatechange = function(){
  //     if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
  //
  //       self.parsedDataSetter(JSON.parse(this.response));
  //
  //     }
  //
  //   }
  //   xhr.send()
  // },

  parsedDataSetter: function(data){
    this.joke = data[0]

    this.updateDom()
  },
})
