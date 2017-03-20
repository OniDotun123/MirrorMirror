Module.register("jokes", {

  defaults:{


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
    this.getJoke();
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

  getJoke: function(){
    var baseUrl = "http://ron-swanson-quotes.herokuapp.com/v2/quotes";

    var self = this

    var xhr = new XMLHttpRequest();

    xhr.open("GET", baseUrl);

    xhr.onreadystatechange = function(){
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

        self.parsedDataSetter(JSON.parse(this.response));

      }

    }
    xhr.send()
  },

  parsedDataSetter: function(data){
    this.joke = data[0]

    this.updateDom()
  },
})
