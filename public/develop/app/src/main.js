// add functions to string objects to count lines
String.prototype.lines = function() { return this.split(/\r*\n/); }
String.prototype.lineCount = function() { return this.lines().length; }

window.onload = function() {

    // Normalize the various vendor prefixed versions of getUserMedia.
    navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || 
    navigator.msGetUserMedia);

}

/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Surface = require('famous/core/Surface');
    var AppView = require('views/AppView');
    var LoginView = require('views/LoginView');
    
	var mainContext = Engine.createContext();

	var appView = new AppView();
	var loginView = new LoginView();

	var test = navigator.userAgent.toLowerCase();
	if (test.indexOf("android") > -1) {
		mainContext.setPerspective(1000);
	}
    
    
    var logo = new Surface({
       size: [96, 96],
       content: '<img src="content/images/map.png" width="96" />',
       classes: ['backfaceVisibility']
    });

    var initialTime = Date.now();
    var centerSpinModifier = new Modifier({
       origin: [0.5, 0.5],
       transform : function() {
           var z = Transform.rotateZ(0.009 * (Date.now() - initialTime));
           var y = Transform.rotateY(0.009 * (Date.now() - initialTime));
           var x = Transform.rotateY(0.009 * (Date.now() - initialTime));
           return Transform.multiply(z, y, x);
       }
    });

    //mainContext.add(centerSpinModifier).add(logo);
    mainContext.add(appView);
    
    mainContext.on('resize', function(){
        appView.options.height = mainContext.getSize()[1];
    });
    
    /*setTimeout(function() {
        centerSpinModifier.setTransform(Transform.identity);
        logo.setOptions({
          content: '',
          properties: {
            display: 'none'   
          }
        });
        
        mainContext.add(appView);
        
    }, 0);*/
});