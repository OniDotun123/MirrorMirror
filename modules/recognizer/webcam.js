// WebcamJS v1.0.22
// Webcam library for capturing JPEG/PNG images in JavaScript
// Attempts getUserMedia, falls back to Flash
// Author: Joseph Huckaby: http://github.com/jhuckaby
// Based on JPEGCam: http://code.google.com/p/jpegcam/
// Copyright (c) 2012 - 2017 Joseph Huckaby
// Licensed under the MIT License

(function(window) {
var _userMedia;

// declare error types

// inheritance pattern here:
// https://stackoverflow.com/questions/783818/how-do-i-create-a-custom-error-in-javascript
function FlashError() {
	var temp = Error.apply(this, arguments);
	temp.name = this.name = "FlashError";
	this.stack = temp.stack;
	this.message = temp.message;
}

function WebcamError() {
	var temp = Error.apply(this, arguments);
	temp.name = this.name = "WebcamError";
	this.stack = temp.stack;
	this.message = temp.message;
}

IntermediateInheritor = function() {};
IntermediateInheritor.prototype = Error.prototype;

FlashError.prototype = new IntermediateInheritor();
WebcamError.prototype = new IntermediateInheritor();

var Webcam = {
	version: '1.0.22',

	// globals
	protocol: location.protocol.match(/https/i) ? 'https' : 'http',
	loaded: false,   // true when webcam movie finishes loading
	live: false,     // true when webcam is initialized and ready to snap
	userMedia: true, // true when getUserMedia is supported natively

	iOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,

	params: {
		width: 0,
		height: 0,
		dest_width: 0,         // size of captured image
		dest_height: 0,        // these default to width/height
		image_format: 'jpeg',  // image format (may be jpeg or png)
		jpeg_quality: 90,      // jpeg image quality from 0 (worst) to 100 (best)
		enable_flash: true,    // enable flash fallback,
		force_flash: false,    // force flash mode,
		flip_horiz: false,     // flip image horiz (mirror mode)
		fps: 30,               // camera frames per second
		upload_name: 'webcam', // name of file in upload post data
		constraints: null,     // custom user media constraints,
		swfURL: '',            // URI to webcam.swf movie (defaults to the js location)
		flashNotDetectedText: 'ERROR: No Adobe Flash Player detected.  Webcam.js relies on Flash for browsers that do not support getUserMedia (like yours).',
		noInterfaceFoundText: 'No supported webcam interface found.',
		unfreeze_snap: true,    // Whether to unfreeze the camera after snap (defaults to true)
		iosPlaceholderText: 'Click here to open camera.',
		user_callback: null,    // callback function for snapshot (used if no user_callback parameter given to snap function)
		user_canvas: null       // user provided canvas for snapshot (used if no user_canvas parameter given to snap function)
	},

	errors: {
		FlashError: FlashError,
		WebcamError: WebcamError
	},

	hooks: {}, // callback hook functions

	init: function() {
		// initialize, check for getUserMedia support
		var self = this;

		// Setup getUserMedia, with polyfill for older browsers
		// Adapted from: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
		this.mediaDevices = (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ?
			navigator.mediaDevices : ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
				getUserMedia: function(c) {
					return new Promise(function(y, n) {
						(navigator.mozGetUserMedia ||
						navigator.webkitGetUserMedia).call(navigator, c, y, n);
					});
				}
		} : null);

		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
		this.userMedia = this.userMedia && !!this.mediaDevices && !!window.URL;

		// Older versions of firefox (< 21) apparently claim support but user media does not actually work
		if (navigator.userAgent.match(/Firefox\D+(\d+)/)) {
			if (parseInt(RegExp.$1, 10) < 21) this.userMedia = null;
		}

		// Make sure media stream is closed when navigating away from page
		if (this.userMedia) {
			window.addEventListener( 'beforeunload', function(event) {
				self.reset();
			} );
		}
	},





	attach: function(elem) {
		// create webcam preview and attach to DOM element
		// pass in actual DOM reference, ID, or CSS selector
		if (typeof(elem) == 'string') {
			elem = document.getElementById(elem) || document.querySelector(elem);
		}
		if (!elem) {
			return this.dispatch('error', new WebcamError("Could not locate DOM element to attach to."));
		}
		this.container = elem;
		elem.innerHTML = ''; // start with empty element

		// insert "peg" so we can insert our preview canvas adjacent to it later on
		var peg = document.createElement('div');
		elem.appendChild( peg );
		this.peg = peg;

		// set width/height if not already set
		if (!this.params.width) this.params.width = elem.offsetWidth;
		if (!this.params.height) this.params.height = elem.offsetHeight;

		// make sure we have a nonzero width and height at this point
		if (!this.params.width || !this.params.height) {
			return this.dispatch('error', new WebcamError("No width and/or height for webcam.  Please call set() first, or attach to a visible element."));
		}

		// set defaults for dest_width / dest_height if not set
		if (!this.params.dest_width) this.params.dest_width = this.params.width;
		if (!this.params.dest_height) this.params.dest_height = this.params.height;

		this.userMedia = _userMedia === undefined ? this.userMedia : _userMedia;
		// if force_flash is set, disable userMedia
		if (this.params.force_flash) {
			_userMedia = this.userMedia;
			this.userMedia = null;
		}

		// check for default fps
		if (typeof this.params.fps !== "number") this.params.fps = 30;

		// adjust scale if dest_width or dest_height is different
		var scaleX = this.params.width / this.params.dest_width;
		var scaleY = this.params.height / this.params.dest_height;

		if (this.userMedia) {
			// setup webcam video container
			var video = document.createElement('video');
			video.setAttribute('autoplay', 'autoplay');
			video.style.width = '' + this.params.dest_width + 'px';
			video.style.height = '' + this.params.dest_height + 'px';

			if ((scaleX != 1.0) || (scaleY != 1.0)) {
				elem.style.overflow = 'hidden';
				video.style.webkitTransformOrigin = '0px 0px';
				video.style.mozTransformOrigin = '0px 0px';
				video.style.msTransformOrigin = '0px 0px';
				video.style.oTransformOrigin = '0px 0px';
				video.style.transformOrigin = '0px 0px';
				video.style.webkitTransform = 'scaleX('+scaleX+') scaleY('+scaleY+')';
				video.style.mozTransform = 'scaleX('+scaleX+') scaleY('+scaleY+')';
				video.style.msTransform = 'scaleX('+scaleX+') scaleY('+scaleY+')';
				video.style.oTransform = 'scaleX('+scaleX+') scaleY('+scaleY+')';
				video.style.transform = 'scaleX('+scaleX+') scaleY('+scaleY+')';
			}

			// add video element to dom
			elem.appendChild( video );
			this.video = video;

			// ask user for access to their camera
			var self = this;
			this.mediaDevices.getUserMedia({
				"audio": false,
				"video": this.params.constraints || {
					mandatory: {
						minWidth: this.params.dest_width,
						minHeight: this.params.dest_height
					}
				}
			})
			.then( function(stream) {
				// got access, attach stream to video
				video.onloadedmetadata = function(e) {
					self.stream = stream;
					self.loaded = true;
					self.live = true;
					self.dispatch('load');
					self.dispatch('live');
					self.flip();
				};
				video.src = window.URL.createObjectURL( stream ) || stream;
			})
			.catch( function(err) {
				// JH 2016-07-31 Instead of dispatching error, now falling back to Flash if userMedia fails (thx @john2014)
				// JH 2016-08-07 But only if flash is actually installed -- if not, dispatch error here and now.
				if (self.params.enable_flash && self.detectFlash()) {
					setTimeout( function() { self.params.force_flash = 1; self.attach(elem); }, 1 );
				}
				else {
					self.dispatch('error', err);
				}
			});
		}
		else if (this.iOS) {
			// prepare HTML elements
			var div = document.createElement('div');
			div.id = this.container.id+'-ios_div';
			div.className = 'webcamjs-ios-placeholder';
			div.style.width = '' + this.params.width + 'px';
			div.style.height = '' + this.params.height + 'px';
			div.style.textAlign = 'center';
			div.style.display = 'table-cell';
			div.style.verticalAlign = 'middle';
			div.style.backgroundRepeat = 'no-repeat';
			div.style.backgroundSize = 'contain';
			div.style.backgroundPosition = 'center';
			var span = document.createElement('span');
			span.className = 'webcamjs-ios-text';
			span.innerHTML = this.params.iosPlaceholderText;
			div.appendChild(span);
			var img = document.createElement('img');
			img.id = this.container.id+'-ios_img';
			img.style.width = '' + this.params.dest_width + 'px';
			img.style.height = '' + this.params.dest_height + 'px';
			img.style.display = 'none';
			div.appendChild(img);
			var input = document.createElement('input');
			input.id = this.container.id+'-ios_input';
			input.setAttribute('type', 'file');
			input.setAttribute('accept', 'image/*');
			input.setAttribute('capture', 'camera');

			var self = this;
			var params = this.params;
			// add input listener to load the selected image
			input.addEventListener('change', function(event) {
				if (event.target.files.length > 0 && event.target.files[0].type.indexOf('image/') == 0) {
					var objURL = URL.createObjectURL(event.target.files[0]);

					// load image with auto scale and crop
					var image = new Image();
					image.addEventListener('load', function(event) {
						var canvas = document.createElement('canvas');
						canvas.width = params.dest_width;
						canvas.height = params.dest_height;
						var ctx = canvas.getContext('2d');

						// crop and scale image for final size
						ratio = Math.min(image.width / params.dest_width, image.height / params.dest_height);
						var sw = params.dest_width * ratio;
						var sh = params.dest_height * ratio;
						var sx = (image.width - sw) / 2;
						var sy = (image.height - sh) / 2;
						ctx.drawImage(image, sx, sy, sw, sh, 0, 0, params.dest_width, params.dest_height);

						var dataURL = canvas.toDataURL();
						img.src = dataURL;
						div.style.backgroundImage = "url('"+dataURL+"')";
					}, false);

					// read EXIF data
					var fileReader = new FileReader();
					fileReader.addEventListener('load', function(e) {
						var orientation = self.exifOrientation(e.target.result);
						if (orientation > 1) {
							// image need to rotate (see comments on fixOrientation method for more information)
							// transform image and load to image object
							self.fixOrientation(objURL, orientation, image);
						} else {
							// load image data to image object
							image.src = objURL;
						}
					}, false);

					// Convert image data to blob format
					var http = new XMLHttpRequest();
					http.open("GET", objURL, true);
					http.responseType = "blob";
					http.onload = function(e) {
						if (this.status == 200 || this.status === 0) {
							fileReader.readAsArrayBuffer(this.response);
						}
					};
					http.send();

				}
			}, false);
			input.style.display = 'none';
			elem.appendChild(input);
			// make div clickable for open camera interface
			div.addEventListener('click', function(event) {
				if (params.user_callback) {
					// global user_callback defined - create the snapshot
					self.snap(params.user_callback, params.user_canvas);
				} else {
					// no global callback definied for snapshot, load image and wait for external snap method call
					input.style.display = 'block';
					input.focus();
					input.click();
					input.style.display = 'none';
				}
			}, false);
			elem.appendChild(div);
			this.loaded = true;
			this.live = true;
		}
		else if (this.params.enable_flash && this.detectFlash()) {
			// flash fallback
			window.Webcam = Webcam; // needed for flash-to-js interface
			var div = document.createElement('div');
			div.innerHTML = this.getSWFHTML();
			elem.appendChild( div );
		}
		else {
			this.dispatch('error', new WebcamError( this.params.noInterfaceFoundText ));
		}

		// setup final crop for live preview
		if (this.params.crop_width && this.params.crop_height) {
			var scaled_crop_width = Math.floor( this.params.crop_width * scaleX );
			var scaled_crop_height = Math.floor( this.params.crop_height * scaleY );

			elem.style.width = '' + scaled_crop_width + 'px';
			elem.style.height = '' + scaled_crop_height + 'px';
			elem.style.overflow = 'hidden';

			elem.scrollLeft = Math.floor( (this.params.width / 2) - (scaled_crop_width / 2) );
			elem.scrollTop = Math.floor( (this.params.height / 2) - (scaled_crop_height / 2) );
		}
		else {
			// no crop, set size to desired
			elem.style.width = '' + this.params.width + 'px';
			elem.style.height = '' + this.params.height + 'px';
		}
	},

	reset: function() {
		// shutdown camera, reset to potentially attach again
		if (this.preview_active) this.unfreeze();

		// attempt to fix issue #64
		this.unflip();

		if (this.userMedia) {
			if (this.stream) {
				if (this.stream.getVideoTracks) {
					// get video track to call stop on it
					var tracks = this.stream.getVideoTracks();
					if (tracks && tracks[0] && tracks[0].stop) tracks[0].stop();
				}
				else if (this.stream.stop) {
					// deprecated, may be removed in future
					this.stream.stop();
				}
			}
			delete this.stream;
			delete this.video;
		}

		if ((this.userMedia !== true) && this.loaded && !this.iOS) {
			// call for turn off camera in flash
			var movie = this.getMovie();
			if (movie && movie._releaseCamera) movie._releaseCamera();
		}

		if (this.container) {
			this.container.innerHTML = '';
			delete this.container;
		}

		this.loaded = false;
		this.live = false;
	},

	set: function() {
		// set one or more params
		// variable argument list: 1 param = hash, 2 params = key, value
		if (arguments.length == 1) {
			for (var key in arguments[0]) {
				this.params[key] = arguments[0][key];
			}
		}
		else {
			this.params[ arguments[0] ] = arguments[1];
		}
	},

	on: function(name, callback) {
		// set callback hook
		name = name.replace(/^on/i, '').toLowerCase();
		if (!this.hooks[name]) this.hooks[name] = [];
		this.hooks[name].push( callback );
	},

	off: function(name, callback) {
		// remove callback hook
		name = name.replace(/^on/i, '').toLowerCase();
		if (this.hooks[name]) {
			if (callback) {
				// remove one selected callback from list
				var idx = this.hooks[name].indexOf(callback);
				if (idx > -1) this.hooks[name].splice(idx, 1);
			}
			else {
				// no callback specified, so clear all
				this.hooks[name] = [];
			}
		}
	},

	dispatch: function() {
		// fire hook callback, passing optional value to it
		var name = arguments[0].replace(/^on/i, '').toLowerCase();
		var args = Array.prototype.slice.call(arguments, 1);

		if (this.hooks[name] && this.hooks[name].length) {
			for (var idx = 0, len = this.hooks[name].length; idx < len; idx++) {
				var hook = this.hooks[name][idx];

				if (typeof(hook) == 'function') {
					// callback is function reference, call directly
					hook.apply(this, args);
				}
				else if ((typeof(hook) == 'object') && (hook.length == 2)) {
					// callback is PHP-style object instance method
					hook[0][hook[1]].apply(hook[0], args);
				}
				else if (window[hook]) {
					// callback is global function name
					window[ hook ].apply(window, args);
				}
			} // loop
			return true;
		}
		else if (name == 'error') {
			if ((args[0] instanceof FlashError) || (args[0] instanceof WebcamError)) {
				message = args[0].message;
			} else {
				message = "Could not access webcam: " + args[0].name + ": " +
					args[0].message + " " + args[0].toString();
			}

			// default error handler if no custom one specified
			alert("Webcam.js Error: " + message);
		}

		return false; // no hook defined
	},

	setSWFLocation: function(value) {
		// for backward compatibility.
		this.set('swfURL', value);
	},

	detectFlash: function() {
		// return true if browser supports flash, false otherwise
		// Code snippet borrowed from: https://github.com/swfobject/swfobject
		var SHOCKWAVE_FLASH = "Shockwave Flash",
			SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
        	FLASH_MIME_TYPE = "application/x-shockwave-flash",
        	win = window,
        	nav = navigator,
        	hasFlash = false;

        if (typeof nav.plugins !== "undefined" && typeof nav.plugins[SHOCKWAVE_FLASH] === "object") {
        	var desc = nav.plugins[SHOCKWAVE_FLASH].description;
        	if (desc && (typeof nav.mimeTypes !== "undefined" && nav.mimeTypes[FLASH_MIME_TYPE] && nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) {
        		hasFlash = true;
        	}
        }
        else if (typeof win.ActiveXObject !== "undefined") {
        	try {
        		var ax = new ActiveXObject(SHOCKWAVE_FLASH_AX);
        		if (ax) {
        			var ver = ax.GetVariable("$version");
        			if (ver) hasFlash = true;
        		}
        	}
        	catch (e) {;}
        }

        return hasFlash;
	},




	freeze: function() {
		// show preview, freeze camera
		var self = this;
		var params = this.params;

		// kill preview if already active
		if (this.preview_active) this.unfreeze();

		// determine scale factor
		var scaleX = this.params.width / this.params.dest_width;
		var scaleY = this.params.height / this.params.dest_height;

		// must unflip container as preview canvas will be pre-flipped
		this.unflip();

		// calc final size of image
		var final_width = params.crop_width || params.dest_width;
		var final_height = params.crop_height || params.dest_height;

		// create canvas for holding preview
		var preview_canvas = document.createElement('canvas');
		preview_canvas.width = final_width;
		preview_canvas.height = final_height;
		var preview_context = preview_canvas.getContext('2d');

		// save for later use
		this.preview_canvas = preview_canvas;
		this.preview_context = preview_context;

		// scale for preview size
		if ((scaleX != 1.0) || (scaleY != 1.0)) {
			preview_canvas.style.webkitTransformOrigin = '0px 0px';
			preview_canvas.style.mozTransformOrigin = '0px 0px';
			preview_canvas.style.msTransformOrigin = '0px 0px';
			preview_canvas.style.oTransformOrigin = '0px 0px';
			preview_canvas.style.transformOrigin = '0px 0px';
			preview_canvas.style.webkitTransform = 'scaleX('+scaleX+') scaleY('+scaleY+')';
			preview_canvas.style.mozTransform = 'scaleX('+scaleX+') scaleY('+scaleY+')';
			preview_canvas.style.msTransform = 'scaleX('+scaleX+') scaleY('+scaleY+')';
			preview_canvas.style.oTransform = 'scaleX('+scaleX+') scaleY('+scaleY+')';
			preview_canvas.style.transform = 'scaleX('+scaleX+') scaleY('+scaleY+')';
		}

		// take snapshot, but fire our own callback
		this.snap( function() {
			// add preview image to dom, adjust for crop
			preview_canvas.style.position = 'relative';
			preview_canvas.style.left = '' + self.container.scrollLeft + 'px';
			preview_canvas.style.top = '' + self.container.scrollTop + 'px';

			self.container.insertBefore( preview_canvas, self.peg );
			self.container.style.overflow = 'hidden';

			// set flag for user capture (use preview)
			self.preview_active = true;

		}, preview_canvas );
	},

	unfreeze: function() {
		// cancel preview and resume live video feed
		if (this.preview_active) {
			// remove preview canvas
			this.container.removeChild( this.preview_canvas );
			delete this.preview_context;
			delete this.preview_canvas;

			// unflag
			this.preview_active = false;

			// re-flip if we unflipped before
			this.flip();
		}
	},







	snap: function(user_callback, user_canvas) {
		// use global callback and canvas if not defined as parameter
		if (!user_callback) user_callback = this.params.user_callback;
		if (!user_canvas) user_canvas = this.params.user_canvas;

		// take snapshot and return image data uri
		var self = this;
		var params = this.params;

		if (!this.loaded) return this.dispatch('error', new WebcamError("Webcam is not loaded yet"));
		// if (!this.live) return this.dispatch('error', new WebcamError("Webcam is not live yet"));
		if (!user_callback) return this.dispatch('error', new WebcamError("Please provide a callback function or canvas to snap()"));

		// if we have an active preview freeze, use that
		if (this.preview_active) {
			this.savePreview( user_callback, user_canvas );
			return null;
		}

		// create offscreen canvas element to hold pixels
		var canvas = document.createElement('canvas');
		canvas.width = this.params.dest_width;
		canvas.height = this.params.dest_height;
		var context = canvas.getContext('2d');

		// flip canvas horizontally if desired
		if (this.params.flip_horiz) {
			context.translate( params.dest_width, 0 );
			context.scale( -1, 1 );
		}

		// create inline function, called after image load (flash) or immediately (native)
		var func = function() {
			// render image if needed (flash)
			if (this.src && this.width && this.height) {
				context.drawImage(this, 0, 0, params.dest_width, params.dest_height);
			}

			// crop if desired
			if (params.crop_width && params.crop_height) {
				var crop_canvas = document.createElement('canvas');
				crop_canvas.width = params.crop_width;
				crop_canvas.height = params.crop_height;
				var crop_context = crop_canvas.getContext('2d');

				crop_context.drawImage( canvas,
					Math.floor( (params.dest_width / 2) - (params.crop_width / 2) ),
					Math.floor( (params.dest_height / 2) - (params.crop_height / 2) ),
					params.crop_width,
					params.crop_height,
					0,
					0,
					params.crop_width,
					params.crop_height
				);

				// swap canvases
				context = crop_context;
				canvas = crop_canvas;
			}

			// render to user canvas if desired
			if (user_canvas) {
				var user_context = user_canvas.getContext('2d');
				user_context.drawImage( canvas, 0, 0 );
			}

			// fire user callback if desired
			user_callback(
				user_canvas ? null : canvas.toDataURL('image/' + params.image_format, params.jpeg_quality / 100 ),
				canvas,
				context
			);
		};

		// grab image frame from userMedia or flash movie
		if (this.userMedia) {
			// native implementation
			context.drawImage(this.video, 0, 0, this.params.dest_width, this.params.dest_height);

			// fire callback right away
			func();
		}
		else if (this.iOS) {
			var div = document.getElementById(this.container.id+'-ios_div');
			var img = document.getElementById(this.container.id+'-ios_img');
			var input = document.getElementById(this.container.id+'-ios_input');
			// function for handle snapshot event (call user_callback and reset the interface)
			iFunc = function(event) {
				func.call(img);
				img.removeEventListener('load', iFunc);
				div.style.backgroundImage = 'none';
				img.removeAttribute('src');
				input.value = null;
			};
			if (!input.value) {
				// No image selected yet, activate input field
				img.addEventListener('load', iFunc);
				input.style.display = 'block';
				input.focus();
				input.click();
				input.style.display = 'none';
			} else {
				// Image already selected
				iFunc(null);
			}
		}
		else {
			// flash fallback
			var raw_data = this.getMovie()._snap();

			// render to image, fire callback when complete
			var img = new Image();
			img.onload = func;
			img.src = 'data:image/'+this.params.image_format+';base64,' + raw_data;
		}

		return null;
	}
};

Webcam.init();

if (typeof define === 'function' && define.amd) {
	define( function() { return Webcam; } );
}
else if (typeof module === 'object' && module.exports) {
	module.exports = Webcam;
}
else {
	window.Webcam = Webcam;
}

}(window));
