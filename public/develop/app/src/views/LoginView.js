/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var InputSurface = require('famous/surfaces/InputSurface');

    // the goal
    // https://plus.google.com/u/0/photos/116559944503510939534/albums/6009798305267426977/6009798312345768402?pid=6009798312345768402&oid=116559944503510939534

    function LoginView() {
        View.apply(this, arguments);

        // add the blue background
        var blueBg = new ImageSurface();
        blueBg.setContent('content/images/bluebackground.png');
        this._add(blueBg);

        // add the collaboration image
        var collabMod = new Modifier({
            size: [window.innerWidth, window.innerWidth / 1.333],
            origin: [0.5, 0.2]
        });
        var collaboration = new ImageSurface();
        collaboration.setContent('content/images/collaboration.png');
        this._add(collabMod).add(collaboration);

        // add the inputs, grouped under one modifier for animation purposes
        this.inputsMod = new Modifier({
            size: [window.innerWidth * 0.9, 200],
            origin: [0.5, 1]
        });
        var inputProperties = {
            borderRadius: '5px',
            padding: '10px',
            border: 'none',
            outline: 'none',
            textAlign: 'center'
        };
        this.inputs = {
            usernameInput: new InputSurface({
                size: [window.innerWidth * 0.9, 50],
                placeholder: 'Username...',
                properties: inputProperties
            }),
            passwordInput: new InputSurface({
                size: [window.innerWidth * 0.9, 50],
                placeholder: 'Password...',
                properties: inputProperties
            })
        }
        var inputsMod = this._add(this.inputsMod);
        inputsMod.add(this.inputs.usernameInput)
        inputsMod.add(new Modifier({ 
            transform: Transform.translate(0, 60, 0)      
        })).add(this.inputs.passwordInput);
    }

    LoginView.prototype = Object.create(View.prototype);
    LoginView.prototype.constructor = LoginView;



    LoginView.prototype.getMonkeys = function() {

    }


    module.exports = LoginView;
});