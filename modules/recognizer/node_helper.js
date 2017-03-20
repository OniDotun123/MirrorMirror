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
      var image = exec('fswebcam --no-banner ./public/webcam_pic.jpg');


      var options = {
        url: 'https://api-us.faceplusplus.com/facepp/v3/search',
        method: 'POST',
        api_key: '9oOudn2moC5eM-pQwLy_ugUs6rYRT7aj',
        api_secret: 'ROglv8QFta3JmGAppEYTpoPY68DjERzX',
        image_file: fs.readFile('./public/webcam_pic.jpg'),
        outer_id: 'mirrormirror'
      }

      var response = request(options, function(err, res, body) {
        setTimeout( function() {
          console.log(body);
          var json = JSON.parse(body);
          console.log(json);
        })
      })


      this.sendSocketNotification("SELFIE_IS_GO", image);
    }
  }

});
