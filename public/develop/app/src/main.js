// add functions to string objects to count lines
String.prototype.lines = function() {
    return this.split(/\r*\n/);
}
String.prototype.lineCount = function() {
    return this.lines().length;
}

window.onload = function() {

    // Normalize the various vendor prefixed versions of getUserMedia.
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

}

/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Surface = require('famous/core/Surface');
    var RenderNode = require('famous/core/RenderNode');
    var RenderController = require('famous/views/RenderController');

    var AppView = require('views/AppView');
    var LoginView = require('views/LoginView');

    var mainContext = Engine.createContext();
    var renderController = new RenderController();
    mainContext.add(renderController);

    var test = navigator.userAgent.toLowerCase();
    if (test.indexOf("android") > -1) {
        mainContext.setPerspective(1000);
    }

    var appView = new AppView();
    mainContext.on('resize', function() {
        appView.options.height = mainContext.getSize()[1];
    });
    
    var loginView = new LoginView();
    loginView.on('signedin', function(){
        appView.getMyMaps();
        renderController.show(appView);  
    });

    var logo = new Surface({
        size: [96, 96],
        content: '<img src="content/images/map.png" width="96" />',
        classes: ['backfaceVisibility']
    });
    var initialTime = Date.now();
    var centerSpinModifier = new Modifier({
        origin: [0.5, 0.5],
        transform: function() {
            var z = Transform.rotateZ(0.009 * (Date.now() - initialTime));
            var y = Transform.rotateY(0.009 * (Date.now() - initialTime));
            var x = Transform.rotateY(0.009 * (Date.now() - initialTime));
            return Transform.multiply(z, y, x);
        }
    });
    var load = new RenderNode();
    load.add(centerSpinModifier).add(logo);

    // add the spinning logo
    renderController.show(load);

    // now make an ajax call to check if authenticated, whichever takes longer, the 2 second timeout or the callback, will be
    // the one to call addView() which is what will either add the login screen or the appView
    var authCheckFinished = false;
    var timeoutFinished = false;
    var authenticated = false;

    function addView() {
        if (authenticated.user !== "unauthenticated") {
            appView.getMyMaps();
            renderController.show(appView);
        }
        else {
            renderController.show(loginView);
            loginView.authToken = authenticated.token;
        }
    };

    var timeout = setTimeout(function() {
        timeoutFinished = true;
        if (authCheckFinished) {
            addView();
        }
    }, 2000);

    var successCallback = function(response) {
        console.log(response);
        
        authenticated = response; // false OR the user object with user_name, user_id, user_image
        
        authCheckFinished = true;
        if (timeoutFinished) {
            addView();
        }
    };

    // check if authenticated
    $.ajax({
        url: "/authenticate",
        success: successCallback
    });
});