var NodeHelper = require("node_helper");
const exec = require('child_process').exec;

module.exports = NodeHelper.create({


  socketNotificationReceived: function(notification) {
    if (notification === "RECOGNIZER_STARTUP"){
      console.log("Recognizer Node Helper initialized, awaiting Activation");
      self.sendSocketNotification("RECOGNIZER_CONNECTED", model);

    }

    else if(notification === "TAKE_SELFIE") {
      console.log("===Selfie is being taken now====")
      image = exec('fswebcam -r 1280 x 720 --no-banner output.jpg', null)
      this.sendSocketNotification("SELFIE_IS_GO")
    }
	},


});
