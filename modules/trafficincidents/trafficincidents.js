Module.register("trafficincidents", {

  defaults: {
    baseTrafficUrl: "http://www.mapquestapi.com/traffic/v2/incidents?key=",
    baseGeocodeUrl: "http://www.mapquestapi.com/geocoding/v1/address?key=",
    CK: "0MfvxPkvBhP7qwk0n7uNKAxVZzlSBXkQ",
    TL: "40.70",
    TR: "-73.99",
    BL: "40.67",
    BR: "-74.02"
  },

  getHeader: function(){
    return this.data.header //This is gonna be added in config.js file
  },

  getTranslations: function(){
    return false;
  },

  start: function(){

    Log.info("Starting module: " + this.name);

    moment.locale(config.language);

    this.fullDescription = null; // fullDesc
    this.incidents = [];
    this.TL = null;
    this.TR = null;
    this.BL = null;
    this.BR = null;

    this.sendSocketNotification("TRAFFIC_REQUEST");
    this.loaded = false;
  },

  getDom: function(){


    var div = document.createElement("div")
    div.className = "traffic-display"

    var ol = document.createElement("ol");

    for(i=0; i < this.incidents.length; i++){
      var li = document.createElement("li");

        li.className = "traffic-incident-" + i;
        li.innerHTML = this.incidents[i];
        ol.appendChild(li);
    }
    div.appendChild(ol);
    return div;
  },

  notificationReceived: function(notification){
    var notArr = notification.split(" ");
    var regexp = /\d{5}/;
    var zipCode = null;

    if(regexp.test(notArr)){
      zipCode = regexp.exec(notArr)[0]
    };

    if(zipCode !==null){
      this.geoCodeApi(zipCode);
    }

    if((zipCode !== null) && (notArr.includes("traffic"))){
      this.geoCodeApi(zipCode);
      this.sendSocketNotification("NEED_UPDATES", [this.defaults, this.TR, this.TL, this.BR, this.BL]);
      this.show();
    }else if(notArr.includes("traffic")){
      this.sendSocketNotification("NEED_UPDATES", this.defaults);
      this.show();
    }else{
      this.hide();
    }
  },

  socketNotificationReceived: function(notification, payload){
    Log.log("This is for testing");
    if(notification === "TRAFFIC_ALERTS"){
      var parsedData = payload;
      if(parsedData["incidents"].length === 0){
        this.incidents.push("There are no alerts for traffic in the nearby area")
      }else if(parsedData["incidents"].length < 5){
        for(i=0; i < parsedData["incidents"].length; i++){
          this.incidents.push(parsedData["incidents"][i]["shortDesc"])
        }}else{
        for(i=0; i<5; i++){
          this.incidents.push(parsedData["incidents"][i]["shortDesc"])
        }
      }
      this.updateDom(0);
      this.incidents = []
    }
  },

  geoCodeApi: function(zipCode){
    var compUrl = this.defaults.baseGeocodeUrl + this.defaults.CK + "&location=" + zipCode
    var xhr = new XMLHttpRequest();
    var that = this

    // xhr.onload = function(){
    //   that.coordSetter(JSON.parse(this.responseText))
    // };
    xhr.open("GET", compUrl);
    // xhr.onload = function(){ that.coordSetter(JSON.parse(this.responseText))};
    // xhr.send();
    // if(xhr.status === 200){
    //   that.coordSetter(JSON.parse(this.responseText))
    // };
    xhr.onreadystatechange = function() {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        var response = this.responseText;
        var parsedResponse = JSON.parse(response);
        that.coordSetter(parsedResponse);
      }
    }

    // xhr.onload = function(){
    //     var response = this.responseText;
    //     var parsedResponse = JSON.parse(response);
    //
    //     that.coordSetter(parsedResponse);
    // }
    xhr.send();
  },
    // request({url: compUrl, method: "GET"}, function(error,response,body){
    //   if(!error && response.statusCode === 200){
    //     var parsedResponse = JSON.parse(body);
    //     that.coordSetter(parsedResponse);
    //   }
    // })
  // },

  coordSetter: function(data){
    this.TL = (data["results"][0]["locations"][0]["latLng"]["lat"] + 0.02);
    this.TR = (data["results"][0]["locations"][0]["latLng"]["lng"] + 0.02);
    this.BL = (data["results"][0]["locations"][0]["latLng"]["lat"] - 0.02);
    this.BR = (data["results"][0]["locations"][0]["latLng"]["lng"] - 0.02);
  },

});
