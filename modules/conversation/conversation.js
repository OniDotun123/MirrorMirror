Module.register("conversation",{
  start: function() {
    this.sendSocketNotification("CONNECT")
    console.log("sent notification to node_helper")
  },

  socketNotificationReceived: function(notification, payload){
        if (notification === "KEYWORD_SPOTTED"){
            //Broadcast the message
            console.log("@@@@@@@@@@@@@conversation received notification@@@@@@@@@@@@@@@@")
            console.log("this is the payload: " + payload )
            console.log("conversation.js is now sending a notification across socket")
            this.sendNotification(payload, {type: "notification"});
        }
	},

    getDom: function() {
        var wrapper = document.createElement("div");
        var header = document.createElement("header");
        header.innerHTML = "";
        wrapper.appendChild(header);

        return wrapper;
    }
});
