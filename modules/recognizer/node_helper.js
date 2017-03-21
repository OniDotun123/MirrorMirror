var NodeHelper = require("node_helper");
const exec = require('child_process').exec;
const path = require('path');
const request = require('request');
const fs = require('fs');

module.exports = NodeHelper.create({

  socketNotificationReceived: function(notification) {
    if (notification === "RECOGNIZER_STARTUP"){
      console.log("Recognizer Node Helper initialized, awaiting Activation");
      this.sendSocketNotification("RECOGNIZER_CONNECTED");

    }

    else if(notification === "TAKE_SELFIE") {
      console.log("===Selfie is being taken now====");
      var image = exec("fswebcam --no-banner ./public/webcam_pic.jpg");
      callForMatches();
      this.sendSocketNotification("SELFIE_IS_GO");
  },

  callForMatches: function() {
    // var img = fs.createReadStream(__dirname + '../../public/webcam_pic.jpg');
    console.log("Recognizer Node Helper is calling api")
    var options = {
        api_key: "9oOudn2moC5eM-pQwLy_ugUs6rYRT7aj",
        api_secret: "ROglv8QFta3JmGAppEYTpoPY68DjERzX",
        image_file: fs.createReadStream(__dirname + '../../public/webcam_pic.jpg'),
        outer_id: "mirrormirror"
      };

    var url = "https://api-us.faceplusplus.com/facepp/v3/search";

    var response = request.post({url, options}, function(err, httpRes, body) {
        var json = JSON.parse(body);
        console.log(json);
    })
  }

});
