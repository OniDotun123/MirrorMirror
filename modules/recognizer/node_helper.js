var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

  getScripts: function() {
    // return ["webcam.js"];
  },

  socketNotificationReceived: function(notification) {
    if (notification === "RECOGNIZER_STARTUP"){
      console.log("Recognizer Node Helper initialized, awaiting Activation");
      self.sendSocketNotification("RECOGNIZER_CONNECTED", model);
      return;
    }

    if(notification === "TAKE_SELFIE") {
      console.log("Selfie is being taken now")
      image = exec('fswebcam -r 1280 x 720 --no-banner output.jpg', null)
    }
	}
});
