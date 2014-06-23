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
    var MediaInputSurface = require('surfaces/MediaInputSurface');
    var AudioRecorder = require('audio/AudioRecorder');

    // the goal
    // https://plus.google.com/u/0/photos/116559944503510939534/albums/6009798305267426977/6009798312345768402?pid=6009798312345768402&oid=116559944503510939534

    function CreateView() {
        View.apply(this, arguments);

        _createRecorder.call(this);
        _createImageCapture.call(this);
        _createSubmit.call(this);
        //_deleteCache.call(this);
    }

    CreateView.prototype = Object.create(View.prototype);
    CreateView.prototype.constructor = CreateView;


    function _createRecorder() {
        var mod = new Modifier({
            origin: [0, 1]
        });
        
        this.recordSurface = new Surface({
            size: [100, 100], //window.innerWidth, window.innerHeight / 5],
            content: '<button>Record</button>',
            properties: {
                backgroundColor: 'red'
            }
        });
        
        // start recording
        this.recordSurface.on('touchstart', function(e) {
    		var that = this;
    	    
    		var timeLapsed = Date.now();
            that.recordSurface.setContent(Math.floor((Date.now()-timeLapsed)/1000));
            
            this.recordingMessage = setInterval(function(){
                that.recordSurface.setContent(Math.floor((Date.now()-timeLapsed)/1000));
            }, 1000);
            
            this.recordSurface.setProperties({backgroundColor: 'green'});
            
            AudioRecorder.start();
            
        }.bind(this));
        // stop recording
        this.recordSurface.on('touchend', function(e) {
            this.recordSurface.setContent("<button>Record</button>");
            this.recordSurface.setProperties({backgroundColor: 'red'});
            
            clearInterval(this.recordingMessage);
            
            AudioRecorder.stop(function(blob) {
                console.log(blob);
                this.audioFile = blob;
                this.audioFile.name = Date.now() + ".wav";
                
            }.bind(this));
        }.bind(this));

        this._add(mod).add(this.recordSurface);
    }

    
    function _createImageCapture() {
        var mod = new Modifier({
            origin: [1, 1]
        });
        
        var mod2 = new Modifier({
            origin: [1, 1]
        });
        
        this.imagePreview = new ImageSurface({
            size: [100, 100]
        });
        
        this.imageInput = new MediaInputSurface({
            size: [100, 100],
            properties: {
                // Hide the button that does the actual work
                opacity: "0.0"
            },
            type: 'file',
            accept: 'image/*',
            capture: 'camera'
        });
        
        this.imageInput.on('change', this.previewFile.bind(this));

        this._add(mod).add(this.imagePreview);
        this._add(mod2).add(this.imageInput);
    }


    function _createSubmit() {
        var mod = new Modifier({
            origin: [1, 0]
        });
        
        this.submitSurface = new Surface({
            size: [100, 50],
            content: '<button>Send!</button>'
        });
        
        this.submitSurface.on('click', function(e) {
            //var file = this.imageInput._currTarget.files[0];
            
            if (this.audioFile) {
                this.uploadFile(this.audioFile);
            }
            
            //this.uploadFile(file);
            
        }.bind(this));

        this._add(mod).add(this.submitSurface);
    }

    CreateView.prototype.previewFile = function(ev) {
        var file = ev.origin._currTarget.files[0];
        var reader = new FileReader();
        if (file.type.indexOf("image") == 0) {
            reader.onload = function(e) {
                this.imagePreview.setContent(e.target.result);
            }.bind(this)
            reader.readAsDataURL(file);
        }
    }

    CreateView.prototype.uploadFile = function(file) {
        // var file = document.getElementById("fileselect");
        var xhr = new XMLHttpRequest();
        if (xhr.upload) {
            // file received/failed
            xhr.onreadystatechange = function(e) {
                if (xhr.readyState == 4) {
                    var message = xhr.status == 200 ? "success" : "failure";
                    console.log(message);
                }
            };
            // start upload
            xhr.open("POST", "/upload", true);
            xhr.setRequestHeader("X-File-Name", file.name);
            xhr.send(file);
            console.log("sent file!");
        }
    }
    module.exports = CreateView;
});
    