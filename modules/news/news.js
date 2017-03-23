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

  getStyles: function(){
    return ['news.css']
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

    this.headlines = [];
    this.attributionLink = null;
    this.sendSocketNotification("LISTEN_NEWS", this.defaults);
    this.loaded = false;
  },

  getDom: function() {
    var div = document.createElement("div");
    div.className = "news-display";

    var articleDisplay = document.createElement("span");
    articleDisplay.className = "article-display";

    var ol = document.createElement("ol");
        ol.className = "ordered-list-headers";

    for(i = 0; i < this.headlines.length; i++) {
        var li = document.createElement("li");
            li.className = "article-" + i;
            li.innerHTML = this.headlines[i];
            ol.appendChild(li);
    }
    articleDisplay.appendChild(ol);
    var sourceLi = document.createElement("li");
        sourceLi.className = "attribution-link"
        sourceLi.innerHTML = this.attributionLink;
        sourceLi.style.fontSize = "medium";
        sourceLi.style.listStyleType = "none";

    div.appendChild(articleDisplay);
    div.appendChild(sourceLi);

    return div;
  },

  notificationReceived: function(notification){
      if(notification.split(" ").includes("news")){
        console.log("======== news request ========");
        this.sendSocketNotification("NEWS", this.defaults);
        this.show();
      }else{
        this.hide();
      }
  },

  socketNotificationReceived: function(notification, payload){
    Log.log("socket received from Node Helper");
    if(notification === "NEWS_RESULT"){
      var newsJSON = payload;
        for(i = 0; i < 6; i++){
          this.headlines.push(newsJSON["articles"][i]["title"]);
        }
        this.attributionLink = "powered by News API";
        this.updateDom();
        this.headlines = []
    }
  }

});
