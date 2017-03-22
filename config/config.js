var config = {

  port: 8080,
  ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],
  language: 'en',
  untis: 'imperial',

  modules: [
    {
			module: "updatenotification",
			position: "top_bar"
		},
    {
			module: 'clock',
			position: 'top_left'
		},
  
    {
        module: 'currentweather',
        position: 'top_left',
        header: "New York City",
        
    },
    {

        module: 'news',
        position: 'bottom_right',
        header: "News"

    },

     {
         module: 'maps',
        	 
         position: 'middle_center',
         config: {
           apikey: 'AIzaSyA60mxJ7eqA6zxthZ7JE44uomf5TTcnOKA',
           origin: '',
           destination: '',
           width: "100%",
           height: "500px"
         }
     },

    {

      module: 'youtube',
      position: 'bottom_left'

    },
    {
        module: 'fb',
        position: 'right',
        config: {
          style: 'border:none;overflow:hidden',
          width: "540",
          height: "1700"
        }
    },
    {
	module: 'trafficincidents',
	position: 'middle_center',
	header: 'Traffic'
    },
    {
      module: 'jokes',
      position: 'middle_center',
      header: 'Jokes By Ron Swanson'
		},
    {
        module: 'conversation'
    },
  ]

};
























/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined') {module.exports = config;}
