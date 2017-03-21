var NodeHelper = require("node_helper");
const exec = require('child_process').exec;
const path = require('path');
const request = require('request');
const fs = require('fs');
const FormData = require('form-data');

module.exports = NodeHelper.create({

  socketNotificationReceived: function(notification) {
    if (notification === "RECOGNIZER_STARTUP"){
      console.log("Recognizer Node Helper initialized, awaiting Activation");
      this.sendSocketNotification("RECOGNIZER_CONNECTED");

    }

    else if(notification === "RECOGNIZE_PICTURE") {
      console.log("===Selfie is being taken now====");
      var image = exec("fswebcam -r 1280x720 --no-banner ./public/webcam_pic.jpg");
      this.callForMatches();
    }
  },

  callForMatches: function() {
    console.log("Recognizer Node Helper is calling api")

    var options = {
        api_key: "9oOudn2moC5eM-pQwLy_ugUs6rYRT7aj",
        api_secret: "ROglv8QFta3JmGAppEYTpoPY68DjERzX",
        image_file: fs.createReadStream(__dirname + '/../../public/webcam_pic.jpg'),
        outer_id: "mirrormirror"
      };

    var url = "https://api-us.faceplusplus.com/facepp/v3/search";
    var self = this
    var response = request.post({url: url, formData: options}, function(err, httpRes, body) {
        var json = JSON.parse(body);
        console.log(json);
        console.log("--- json.results:" + json.results)
        var confidence = json.results[0].confidence
        var memberToken = json.results[0].face_token

        console.log("confidence: " + confidence)
        console.log("memberToken: "+ memberToken)
        var recogValue = "Unable to log in"
        if (confidence >= 75 ) {
          recogValue = "Logged In!"
        }
        self.sendSocketNotification("ROCOGNITION_RETURNED", recogValue)
    })



  }

});
