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
			module: 'calendar',
			header: 'US Holidays',
			position: 'top_left',
			config: {
				calendars: [
					{
						symbol: 'calendar-check-o ',
						url: 'webcal://www.calendarlabs.com/templates/ical/US-Holidays.ics'
					}
				]
			}
		},
    {
        module: 'currentweather',
        position: 'top_right',
        header: "New York City",
        config: {
          location: "NYC, NY",
          latitude: "40.73",
          longitude: "-73.94",
          apiBaseURL: "twcservice.mybluemix.net/api/weather/v1/geocode/",
          username: "5a6159b6-edb8-4741-9584-140d1f1506f2",
          password: "rnag46J0ue",
          endpoint: "observations"

        }
    },
    {
      module: 'conversation'
    }
  ]

};
























/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined') {module.exports = config;}
