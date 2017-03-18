var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({

  updateWeather: function(){
    debugger;
    var url ="https://" + this.config.username + ":" + this.config.password +"@" + this.config.apiBaseUrl + this.config.latitude + "/" + this.config.longitude + "/" + this.config.endpoint + this.defaults.format + this.defaults.language;
    debugger;
    var self = this;

    var xhr = new XMLHttpRequest()
    xhr.open("GET", url);
    xhr.onreadystatechange = function(){
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

        self.parsedDataSetter(JSON.parse(this.response));
      } else {
        Log.error(this.name + "Could not load")
      }
    }
    xhr.send()
  }

})
