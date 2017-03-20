Module.register("fb",{
    // Default module config.
    defaults: {
  apikey: '',
  baseurl: 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FDev-Bootcamp&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId',
  scrolling: 'yes',
  frameborder: '20',
  allowTransparency: 'true'
  },


    getDom: function() {
    var completeURL = this.config.baseurl;

    var iframe = document.createElement("IFRAME");
    iframe.style = this.config.style;
    iframe.width = this.config.width;
    iframe.height = this.config.height;
    iframe.src =  completeURL;
    return iframe;
  }
});


