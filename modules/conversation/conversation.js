Module.register("conversation",{
  start: function() {
    this.sendSocketNotification("CONNECT")
    console.log("sent notification to node_helper")
  },

  socketNotificationReceived: function(notification, payload){
        if (notification === "KEYWORD_SPOTTED"){
            //Broadcast the message
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
            console.log(payload)
            this.sendNotification(payload.message, {type: "notification"});
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
