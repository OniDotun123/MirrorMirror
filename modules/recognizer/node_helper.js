var NodeHelper = require("node_helper");
const exec = require('child_process').exec;
const request = require('request');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

module.exports = NodeHelper.create({

  socketNotificationReceived: function(notification, payload) {
    if (notification === "RECOGNIZER_STARTUP"){
      console.log("Recognizer Node Helper initialized, awaiting Activation");
      this.sendSocketNotification("RECOGNIZER_CONNECTED");
    }

    else if (notification === "TAKE_SELFIE") {
      console.log("Webcam is being taken now");
      var imageSrc = "./public/webcam_pic"+payload+".jpg"
      var image = exec("fswebcam -r 1280x720 --no-banner " + imageSrc);

      this.sendSocketNotification("SELFIE_IS_GO", imageSrc);
    }

    // else if(notification === "RECOGNIZE_PICTURE") {
    //   console.log("===Selfie is being taken now====");
    //   var image = exec("fswebcam -r 1280x720 --no-banner ./public/webcam_pic.jpg");
    //   console.log("===Calling for matches ====")
    //   this.callForMatches(this.sendRecognizedNotification);
    // }

  },

  // callForMatches: function(callback) {
  //   console.log("Recognizer Node Helper is calling api")
  //
  //   var options = {
  //       api_key: "9oOudn2moC5eM-pQwLy_ugUs6rYRT7aj",
  //       api_secret: "ROglv8QFta3JmGAppEYTpoPY68DjERzX",
  //       image_file: fs.createReadStream(__dirname + '/../../public/webcam_pic.jpg'),
  //       outer_id: "mirrormirror"
  //     };
  //
  //   var url = "https://api-us.faceplusplus.com/facepp/v3/search";
  //
  //   var response = request.post({url: url, formData: options}, function(err, httpRes, body) {
  //     console.log("The response body is :");
  //     console.log(body);
  //     callback(body);
  //   })
  // }
});
