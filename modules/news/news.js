Module.register("news", {

  defaults: {
    articlesEndpoint: "https://newsapi.org/v1/articles?",
    sourcesEndpoint: "https://newsapi.org/v1/sources",
    source: "source=cnn",
    sortBy: "sortBy=top",
    apiKey: "apiKey=2c22fec0b0b74305a40943b3a6ff4d9c"
  },

  getHeader: function(){
    return this.data.header //--> need to set header to News Feed
  },

  getTranslations: function(){
    return false;
  },

  start: function(){

    Log.info("Starting module: " + this.name);

    moment.locale(config.language);

    this.author = null;
    this.description = null;
    this.url = null;
    this.urlToImage = null;

    this.headlines = []
    this.updateNews()
    this.loaded = false;
  },

  getDom: function() {
    var div = document.createElement("div");
    div.className = "news-display";

    var articleDisplay = document.createElement("span");
    articleDisplay.className = "article-display";

    var ol = document.createElement("ol");

    for(i = 0; i < this.headlines.length; i++) {
        var li = document.createElement("li");
            li.className = "article-" + i;
            li.innerHTML = this.headlines[i];
            ol.appendChild(li);
    }
    articleDisplay.appendChild(ol);
    div.appendChild(articleDisplay);

    return div;
  },

  updateNews: function(){

    var url = this.defaults.articlesEndpoint + this.defaults.source + "&" + this.defaults.sortBy + "&" + this.defaults.apiKey;

    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function(){
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          self.dataSetter(JSON.parse(this.response));
        }
    }
    xhr.send();
  },

  dataSetter: function(data){
    for(i = 0; i < 5; i++){
      this.headlines.push(data["articles"][i]["title"]);
    }
    this.updateDom();
  }


});
