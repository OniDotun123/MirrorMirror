var NodeHelper = require("node_helper");
const exec = require('child_process').exec;

module.exports = NodeHelper.create({


  socketNotificationReceived: function(notification) {
    if (notification === "RECOGNIZER_STARTUP"){
      console.log("Recognizer Node Helper initialized, awaiting Activation");
      this.sendSocketNotification("RECOGNIZER_CONNECTED");

    }

    else if(notification === "TAKE_SELFIE") {
      console.log("===Selfie is being taken now====")
      image = exec('fswebcam -r 1280x720 --no-banner ./modules/recognizer/output.jpg')
      this.sendSocketNotification("SELFIE_IS_GO")
    }
  }
});
