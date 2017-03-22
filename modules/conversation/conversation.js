Module.register("conversation",{
  start: function() {
    this.sendSocketNotification("CONNECT")
    console.log("sent notification to node_helper")
  },

  socketNotificationReceived: function(notification, payload){
        if (notification === "KEYWORD_SPOTTED"){
            console.log("Conversation received notification: " + payload)
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
