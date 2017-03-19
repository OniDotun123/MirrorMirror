var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

  socketNotificationReceived: function(notification) {
    if (notification === "RECOGNIZER_CONNECTED"){
      console.log("Recognizer Node Helper initialized, awaiting Activation");
      return;
    }

    if(notification === "TAKE_SELFIE") {
      console.log("Selfie is being taken now")

    }
	}
});
