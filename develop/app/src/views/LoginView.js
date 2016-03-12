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
    var SubmitInputSurface = require('famous/surfaces/SubmitInputSurface');

    // the goal
    // https://plus.google.com/u/0/photos/116559944503510939534/albums/6009798305267426977/6009798312345768402?pid=6009798312345768402&oid=116559944503510939534

    function LoginView() {
        View.apply(this, arguments);
        
        this.authToken = null;

        _createBackground.call(this);
        _createInputs.call(this);
    }

    LoginView.prototype = Object.create(View.prototype);
    LoginView.prototype.constructor = LoginView;

    function _createBackground() {
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
    }
    
    function _createInputs() {
        // add the inputs, grouped under one modifier for animation purposes
        this.inputsMod = new Modifier({
            origin: [0.5, 1],
            transform: Transform.translate(0,-16,0)
        });
        this.inputsMod.sizeFrom(function(){
            return [window.innerWidth - 32, 182];   
        });
        
        var inputProperties = {
            borderRadius: '5px',
            padding: '10px',
            border: 'none',
            outline: 'none',
            textAlign: 'center'
        };
        this.inputs = {
            emailInput: new InputSurface({
                placeholder: 'Email...',
                type: 'email',
                properties: inputProperties
            }),
            passwordInput: new InputSurface({
                placeholder: 'Password...',
                type: 'password',
                properties: inputProperties
            }),
            submitInput: new SubmitInputSurface({
                type: 'submit',
                value: 'Login',
                properties: inputProperties
            })
        };
        this.inputs.submitInput.on('click', function(){
            this.inputs.submitInput.setValue('authenticating...');
            this.attemptLogin();
        }.bind(this));
        
        var inputsMod = this._add(this.inputsMod);
        inputsMod.add(new Modifier({
            size: [undefined, 50],
            transform: Transform.translate(0, 0, 0)      
        })).add(this.inputs.emailInput);
        
        inputsMod.add(new Modifier({
            size: [undefined, 50],
            transform: Transform.translate(0, 66, 0)      
        })).add(this.inputs.passwordInput);
        
        inputsMod.add(new Modifier({ 
            size: [undefined, 50],
            transform: Transform.translate(0, 132, 0)      
        })).add(this.inputs.submitInput);
    }

    LoginView.prototype.attemptLogin = function() {
        
        var data = {};
        var metadata = {};
        
        data.authenticity_token = this.authToken;
        
        metadata.email = this.inputs.emailInput.getValue();
        metadata.password = this.inputs.passwordInput.getValue();
        
        data.user = metadata;
        
        var successCallback = function(response) {
            if (response.user) {
                this.inputs.submitInput.setValue('Success!');
                this._eventOutput.emit('signedin');
            }
            else {
                this.inputs.submitInput.setValue('Login');
                alert('invalid email or password! (this alert is temporary)');
            }
        }.bind(this);
        
        var errorCallback = function(response) {
            console.log(response);
        }.bind(this);
        
        $.ajax({
            url: "/users/login.json",
            type: 'POST',
            data: data,
            success: successCallback,
            error: errorCallback
        });
    }


    module.exports = LoginView;
});