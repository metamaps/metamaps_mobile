define(function(require, exports, module) {

    var Surface    = require('famous/core/Surface');
    var Modifier   = require('famous/core/Modifier');
    var Transform  = require('famous/core/Transform');
    var View       = require('famous/core/View');
    var GridLayout = require("famous/views/GridLayout");
    var Time       = require('famous/utilities/Timer');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var InputSurface = require('famous/surfaces/InputSurface');
    var TextAreaSurface = require('surfaces/TextAreaSurface');
    var MediaInputSurface = require('surfaces/MediaInputSurface');
    var AudioRecorder = require('audio/AudioRecorder');

    function CreateView(app) {
        View.apply(this, arguments);

        this.app = app;
        
        _createBackground.call(this);
        _createInput.call(this);
        _createRecorder.call(this);
        _createImageCapture.call(this);
        
        this.app.metacodes.fetch({
            success: function(collection, response, options) {
               _metacodesFetched(this, collection); 
            }.bind(this)
        });
        
        
    }

    CreateView.prototype = Object.create(View.prototype);
    CreateView.prototype.constructor = CreateView;

    CreateView.DEFAULT_OPTIONS = {
        duration: 300
    };

    function _metacodesFetched(that, collection) {
        _createStrips.call(that);
        that.reset();
    }
    
    //
    // the goal of this View is to provide two variables: this.inputValue, which is the text for the title of a new topic,
    // this.selectedMetacode , which is the title of the metacode for your new topic
    
    
    //
    function _createBackground() {
        var mod = new Modifier({
            transform: Transform.translate(0,0,-4)
        });
        
        this.filterSurf = new Surface({
            properties: {
                marginTop: '44px',
                backgroundColor: '#FFF'
            }
        });

        this._add(mod).add(this.filterSurf);
    }

    function _createInput() {
        var self = this;
        this.inputValue = "";
        
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        //var titleWidth = 100 * windowWidth / 320;
        //var titleHeight = 20 * windowHeight / 568;
        //var fontSize = Math.round( titleHeight );
        this.inputSurf = new TextAreaSurface({
            size: [window.innerWidth -20, 100],
            name: 'inputSurface',
            placeholder: "Name it!",
            value: '',
            type: 'text',
            properties: {
                color: '#333333',
                fontSize: '18px',
                fontFamily: 'Arial',
                textAlign: 'center',
                border: 'none',
                outline: 'none',
                borderBottom: '1px solid #B8B8B8'
            }
        });
        this.inputSurf.on('keyup', function() {
            self.inputValue = this.getValue();
            
            if (this.getValue() !== "") {
                self._eventOutput.emit('canCreateTopic');
            }
            else {
                self._eventOutput.emit('cantCreateTopic');       
            }
        });
        
        this.inputMod = new Modifier({
            origin: [0.5, 0]
        });

        this._add(this.inputMod).add(this.inputSurf);
    }
    
    function _createImageCapture() {
        var view = new View();
    
        this.imageCapMod = new Modifier({
            origin: [0.5, 0]
        });
        
        this.emptyImageText = '<img class="addIcon" src="content/images/photo.png" width="40" height= "40" /><br><span class="addText">Tap to add photo...</span>';
        this.emptyImageProperties = {
            border: '1px solid #7A7A7A',
            textAlign: 'center',
            paddingTop: '40px',
            overflow: 'hidden'
        };
        
        this.imagePreview = new Surface({
            size: [window.innerWidth -20, 150],
            properties: this.emptyImageProperties,
            content: this.emptyImageText
        });
        
        var mod = new Modifier({
            opacity: 0
        });
        
        this.imageInput = new MediaInputSurface({
            size: [window.innerWidth -20, 150],
            type: 'file',
            accept: 'image/*',
            capture: 'camera'
        });
        
        this.imageInput.on('change', this.previewFile.bind(this));
        
        view._add(this.imagePreview);
        view._add(mod).add(this.imageInput);

        this._add(this.imageCapMod).add(view);
    }
    
    function _createRecorder() {
        this.recordMod = new Modifier({
            origin: [0.5, 0]
        });
        
        this.emptyRecorderText = '<img class="addIcon" src="content/images/audio.png" width="40" height= "40" /><br><span class="addText">Hold to record...</span>';
        this.recordingText = '<img class="addIcon" src="content/images/audio.png" width="40" height= "40" /><br><span class="addText">Recording...</span>';
        this.doneRecordingText = '<img class="addIcon" src="content/images/audio.png" width="40" height= "40" /><br><span class="addText">You captured a recording!</span>';
        
        this.recordSurface = new Surface({
            size: [window.innerWidth - 20, 100], //window.innerWidth, window.innerHeight / 5],
            properties: {
                border: '1px solid #7A7A7A',
                textAlign: 'center',
                paddingTop: '18px'
            },
            content: this.emptyRecorderText
        });
        
        // start recording
        this.recordSurface.on('touchstart', function(e) {
    		var that = this;
    	    
    		var timeLapsed = Date.now();
            
            //this.recordSurface.setContent(Math.floor((Date.now()-timeLapsed)/1000));
            this.recordSurface.setContent(this.recordingText);
            
            this.recordingMessage = setInterval(function(){
                //that.recordSurface.setContent(Math.floor((Date.now()-timeLapsed)/1000));
            }, 1000);
            
            this.recordSurface.setProperties({backgroundColor: '#81D381'});
            
            AudioRecorder.start();
            
        }.bind(this));
        
        // stop recording
        this.recordSurface.on('touchend', function(e) {
            this.recordSurface.setContent(this.doneRecordingText);
            this.recordSurface.setProperties({backgroundColor: ''});
            
            clearInterval(this.recordingMessage);
            
            AudioRecorder.stop(function(blob) {
                console.log(blob);
                this.audioFile = blob;
                this.audioFile.name = Date.now() + ".wav";
                
            }.bind(this));
        }.bind(this));

        this._add(this.recordMod).add(this.recordSurface);
    }
    
    function _createStrips() {
        var self = this;
        
        this.selectedMetacode = null;
       
        var metacodes = self.app.metacodes.models;
        

        metacodes = _.sortBy(metacodes, function(metacode){ return metacode.get('name').toLowerCase(); });
        
        //create a grid for icons
        var grid = new GridLayout({
            size:[undefined, undefined],
            dimensions: [metacodes.length, 1]
        });
        var views = [];


        grid.sequenceFrom(views);

        this.rowIconModifiers = [];
        this.rowTextModifiers = [];
        
        var metacodeSurf, iconSurf, textSurf, view, availability, type, modIndex;
        var width = window.innerWidth;
        var height = window.innerHeight;

        //var scaledWidth = 50*height/320;
        var scaledWidth = 136;
        //var scaledHeight = 60*height/320;
        var extraDiff = ((metacodes.length - 1) % 2) * (scaledWidth/2);
        var maxDiff = metacodes.length % 2 == 1 ? Math.floor(metacodes.length / 2) : Math.floor(metacodes.length / 2) - 0.5;
        maxDiff = maxDiff * scaledWidth;
        
        for(var col = 0; col < metacodes.length; col++) {
            
            var mod = new Modifier({
                size: [scaledWidth, scaledWidth],
                origin: [0.5, 0.5],
                transform: Transform.translate(0,0,-2)
            });
            
            this.rowIconModifiers[col] = new Modifier({
                size: [Math.round(scaledWidth*0.4), Math.round(scaledWidth*0.4)],
                opacity: 0.5,
                origin: [0.5, 0.75],
                transform: Transform.translate(0,0,-1)
            });
            
            this.rowTextModifiers[col] = new Modifier({
                size: [true, 30],
                opacity: 0,
                origin: [0, 0],
                transform: Transform.translate(0,0,-1)
            });
            
            metacode = metacodes[col];

            metacodeSurf = new Surface();
            metacodeSurf.index = col;
            metacodeSurf.typeText = metacode.get('name');
            metacodeSurf.suggestText = 'Type here...'; // type.input;
            
            var indexOfMetacodeToChange, originalMetacodeIndex, initialXaxis, initialXpos, lastXpos, difference, diffFromInitial, scaledWidthMinusDiff;
            
            
            metacodeSurf.on('touchstart', function(e) {
                
                initialXaxis = this.xAxis;
                initialXpos = e.targetTouches[0].clientX;
                lastXpos = e.targetTouches[0].clientX;
                originalMetacodeIndex = this.selectedMetacodeIndex;
                indexOfMetacodeToChange = undefined;
                
            }.bind(this));
            
            
            
            metacodeSurf.on('touchmove', function(e) {
                
                difference = e.targetTouches[0].clientX - lastXpos;
                this.xAxis += difference;
                this.metacodesMod.setTransform(Transform.translate(this.xAxis, 164, 0));

                diffFromInitial = Math.abs(e.targetTouches[0].clientX - initialXpos) % scaledWidth;
                // if moving to the right, start selecting the one 'behind' it to the left, and converse
                indexOfMetacodeToChange = e.targetTouches[0].clientX - initialXpos > 0 ? this.selectedMetacodeIndex - 1 : this.selectedMetacodeIndex + 1;
                
                // account for the case where you're switching to a new metacode
                diffFromInitial = Math.abs(e.targetTouches[0].clientX - initialXpos) >= scaledWidth ? scaledWidth : diffFromInitial;
                indexOfMetacodeToChange = e.targetTouches[0].clientX === initialXpos ? undefined : indexOfMetacodeToChange;
                
                //set indexOfMetacodeToChange to undefined if there is no 'next metacode'
                indexOfMetacodeToChange = metacodes[indexOfMetacodeToChange] ? indexOfMetacodeToChange : undefined;
                
                console.log(this.selectedMetacodeIndex);
                console.log(indexOfMetacodeToChange);
                
                
                scaledWidthMinusDiff = scaledWidth - diffFromInitial;
                
                var sizeIncreaseScale = scaledWidthMinusDiff / scaledWidth * 0.2 + 0.4;
                var iconOpacityIncreaseScale = scaledWidthMinusDiff / scaledWidth * 0.5 + 0.5;
                var textOpacityIncreaseScale = scaledWidthMinusDiff / scaledWidth;
                
                var sizeDecreaseScale = diffFromInitial / scaledWidth * 0.2 + 0.4;
                var iconOpacityDecreaseScale = diffFromInitial / scaledWidth * 0.5 + 0.5;
                var textOpacityDecreaseScale = diffFromInitial / scaledWidth;
                
                var remainder, size, adjust;
                
                this.rowIconModifiers[this.selectedMetacodeIndex].setSize([Math.round(scaledWidth * sizeIncreaseScale), Math.round(scaledWidth * sizeIncreaseScale)]);
                this.rowIconModifiers[this.selectedMetacodeIndex].setOpacity(iconOpacityIncreaseScale);
                this.rowTextModifiers[this.selectedMetacodeIndex].setOpacity(textOpacityIncreaseScale);
                
                if (indexOfMetacodeToChange !== undefined) {
                    this.rowIconModifiers[indexOfMetacodeToChange].setSize([Math.round(scaledWidth * sizeDecreaseScale), Math.round(scaledWidth * sizeDecreaseScale)]);
                    this.rowIconModifiers[indexOfMetacodeToChange].setOpacity(iconOpacityDecreaseScale);
                    this.rowTextModifiers[indexOfMetacodeToChange].setOpacity(textOpacityDecreaseScale);
                }
                
                if (lastXpos >= initialXpos && e.targetTouches[0].clientX <= initialXpos) {
                    this.selectedMetacodeIndex = originalMetacodeIndex;
                    this.selectedMetacode = metacodes[this.selectedMetacodeIndex].get('name');
                    console.log('switched back to original');
                    
                } else if (lastXpos <= initialXpos && e.targetTouches[0].clientX >= initialXpos) {
                    this.selectedMetacodeIndex = originalMetacodeIndex;
                    this.selectedMetacode = metacodes[this.selectedMetacodeIndex].get('name');
                    console.log('switched back to original');
                    
                } else if (diffFromInitial === scaledWidth && indexOfMetacodeToChange !== undefined) {
                    originalMetacodeIndex = indexOfMetacodeToChange;
                    this.selectedMetacodeIndex = indexOfMetacodeToChange;
                    this.selectedMetacode = metacodes[this.selectedMetacodeIndex].get('name');
                    initialXpos = e.targetTouches[0].clientX;
                    
                    remainder = Math.abs(this.xAxis) % scaledWidth;
                    sign = remainder >= scaledWidth / 2 ? -1 : 1;
                    adjust = remainder >= scaledWidth / 2 ? -1 * remainder + scaledWidth : -1 * remainder;
                    if (this.xAxis < 0) {
                        initialXaxis = this.xAxis - adjust - sign * extraDiff;
                    }
                    else if (this.xAxis >= 0) {
                        initialXaxis = this.xAxis + adjust + sign * extraDiff;
                    }
                    
                    console.log('switched to ' + metacodes[this.selectedMetacodeIndex].get('name'));
                }
                
                lastXpos = e.targetTouches[0].clientX;
                
            }.bind(this));
            
            
            
            metacodeSurf.on('touchend', function(e) {
                
                var remainder = Math.abs(this.xAxis) % scaledWidth;
                var sign = remainder >= scaledWidth / 2 ? -1 : 1;
                var adjust = remainder >= scaledWidth / 2 ? -1 * remainder + scaledWidth : -1 * remainder;
                
                
                if (this.xAxis < 0) {
                    this.xAxis = this.xAxis - adjust - sign * extraDiff;
                    
                    // send it back to the last metacode if you've 'gone too far'
                    if (Math.abs(this.xAxis) > maxDiff){
                        this.xAxis = -1 * maxDiff;
                    }
                }
                else if (this.xAxis >= 0) {
                    this.xAxis = this.xAxis + adjust + sign * extraDiff;
                    
                    // send it back to the last metacode if you've 'gone too far'
                    if (Math.abs(this.xAxis) > maxDiff){ 
                        this.xAxis = maxDiff;
                    }
                }
                
                this.metacodesMod.setTransform(
                    Transform.translate(this.xAxis, 164, 0),
                    {duration: 300, curve: 'easeInOut'});
                    
                
                console.log(this.xAxis);
                console.log(initialXaxis);
                
                if (this.xAxis === initialXaxis ) {
                    
                    this.rowIconModifiers[this.selectedMetacodeIndex].setSize([Math.round(scaledWidth*0.6), Math.round(scaledWidth*0.6)],
                        {duration: 300, curve: 'linear'});
                    this.rowIconModifiers[this.selectedMetacodeIndex].setOpacity(1,
                        {duration: 300, curve: 'linear'});
                    this.rowTextModifiers[this.selectedMetacodeIndex].setOpacity(1,
                        {duration: 300, curve: 'linear'});
                    
                    if (indexOfMetacodeToChange !== undefined) {
                        this.rowIconModifiers[indexOfMetacodeToChange].setSize([Math.round(scaledWidth * 0.4), Math.round(scaledWidth * 0.4)],
                        {duration: 300, curve: 'linear'});
                        this.rowIconModifiers[indexOfMetacodeToChange].setOpacity(0.5,
                            {duration: 300, curve: 'linear'});
                        this.rowTextModifiers[indexOfMetacodeToChange].setOpacity(0,
                            {duration: 300, curve: 'linear'});
                    }
                    
                    console.log(this.selectedMetacode);
                    
                } else if (this.xAxis !== initialXaxis && indexOfMetacodeToChange !== undefined) {
                   
                    this.rowIconModifiers[this.selectedMetacodeIndex].setSize([Math.round(scaledWidth * 0.4), Math.round(scaledWidth * 0.4)],
                        {duration: 300, curve: 'linear'});
                    this.rowIconModifiers[this.selectedMetacodeIndex].setOpacity(0.5,
                        {duration: 300, curve: 'linear'});
                    this.rowTextModifiers[this.selectedMetacodeIndex].setOpacity(0,
                        {duration: 300, curve: 'linear'});
                    
                    this.rowIconModifiers[indexOfMetacodeToChange].setSize([Math.round(scaledWidth*0.6), Math.round(scaledWidth*0.6)],
                        {duration: 300, curve: 'linear'});
                    this.rowIconModifiers[indexOfMetacodeToChange].setOpacity(1,
                        {duration: 300, curve: 'linear'});
                    this.rowTextModifiers[indexOfMetacodeToChange].setOpacity(1,
                        {duration: 300, curve: 'linear'});
                    
                    this.selectedMetacodeIndex = indexOfMetacodeToChange;
                    this.selectedMetacode = metacodes[this.selectedMetacodeIndex].get('name');
                    
                    console.log(this.selectedMetacode);
                }
                
            }.bind(this));
            
            var imageUrl = metacode.get('icon').indexOf('http://') !== -1 || metacode.get('icon').indexOf('https://') !== -1 ? 
                metacode.get('icon') : 'content/images' + metacode.get('icon');
            iconSurf = new ImageSurface({
               content: imageUrl
            });
            
            textSurf = new Surface({
                size: [136, undefined],
                content: metacode.get('name').toUpperCase(),
                properties: {
                    color: '#7A7A7A',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold'
                }   
            });

            //push view (modifier + surface) onto surfaces
            view = new View();
            
            var tempMod = view._add(mod);
            tempMod.add(this.rowIconModifiers[col]).add(iconSurf);
            tempMod.add(this.rowTextModifiers[col]).add(textSurf);
            tempMod.add(new Modifier({ transform: Transform.translate(0,0,0) })).add(metacodeSurf);
            
            views.push(view);
        }

        // set it up to start on wildcard
        var centerIndex = Math.floor((metacodes.length - 1) / 2);
        var wildcard =  _.find(metacodes, function(metacode){ return metacode.get('name') === 'Wildcard'; });
        this.indexOfWildcard = _.indexOf(metacodes, wildcard);
        
        // highlight the initial selected metacode, Wildcard
        this.selectedMetacodeIndex = this.indexOfWildcard;
        this.selectedMetacode = 'Wildcard';
        this.rowIconModifiers[this.indexOfWildcard].setSize([Math.round(scaledWidth*0.6), Math.round(scaledWidth*0.6)]);
        this.rowIconModifiers[this.indexOfWildcard].setOpacity(1);
        this.rowTextModifiers[this.indexOfWildcard].setOpacity(1);
        
        this.initialXaxis = (centerIndex - this.indexOfWildcard) * scaledWidth + extraDiff;
        this.xAxis = (centerIndex - this.indexOfWildcard) * scaledWidth + extraDiff;
        
        this.metacodesMod = new Modifier({
            size: [scaledWidth*metacodes.length, 136],
            origin: [0.5, 0],
            transform: Transform.translate(this.xAxis, 0, 0)
        });

        this._add(this.metacodesMod).add(grid);
    }

    CreateView.prototype.animate = function() {
        this.reset();
        
        this.inputMod.setTransform(
            Transform.translate(0, 54, 0),
            {duration: this.options.duration - 100, curve: 'easeInOut'});
        
        
        this.metacodesMod.setTransform(
            Transform.translate(this.initialXaxis, 164, 0),
            {duration: this.options.duration - 100, curve: 'easeInOut'});
        
        this.imageCapMod.setTransform(
            Transform.translate(0, 310, 0),
            {duration: this.options.duration - 100, curve: 'easeInOut'});

            
        this.recordMod.setTransform(
            Transform.translate(0, 470, 0),
            {duration: this.options.duration - 100, curve: 'easeInOut'});
    }

    CreateView.prototype.reset = function() {
        
        // reset the title box
        this.inputMod.setTransform(Transform.translate(0, 0, 0));
        this.inputSurf.setValue("");
        this.inputValue = "";
        this.inputSurf.setPlaceholder("Name it!");
        
        // reset the metacode select scroller
        this.metacodesMod.setTransform(Transform.translate(this.initialXaxis, 0, 0));
        this.xAxis = this.initialXaxis;
        this.rowIconModifiers[this.selectedMetacodeIndex].setSize([Math.round(136*0.4), Math.round(136*0.4)]);
        this.rowIconModifiers[this.selectedMetacodeIndex].setOpacity(0.5);
        this.rowTextModifiers[this.selectedMetacodeIndex].setOpacity(0);
        this.selectedMetacodeIndex = this.indexOfWildcard;
        this.selectedMetacode = 'Wildcard';
        this.rowIconModifiers[this.indexOfWildcard].setSize([Math.round(136*0.6), Math.round(136*0.6)]);
        this.rowIconModifiers[this.indexOfWildcard].setOpacity(1);
        this.rowTextModifiers[this.indexOfWildcard].setOpacity(1);
        
        // reset the image capture box
        this.imageCapMod.setTransform(Transform.translate(0, 0, 0));
        this.imagePreview.setContent(this.emptyImageText);
        this.imagePreview.setProperties(this.emptyImageProperties);
        
        // reset the recorder box
        this.recordMod.setTransform(Transform.translate(0, 0, 0));
        this.recordSurface.setContent(this.emptyRecorderText);
        
        // send a message to disable immediate topic creation
        this._eventOutput.emit('cantCreateTopic');
    }
    
    CreateView.prototype.selectMetacode = function(modIndex, type, text) {
        this.inputSurf.setPlaceholder(text);
        if (this.inputValue !== "") {
            this._eventOutput.emit('canCreateTopic');
            this.inputSurf.setValue(this.inputValue);
        }
        else {
            this.inputSurf.setValue("");
        }
        
        this.selectedMetacode = type;
                
        this.rowModifiers[modIndex].setOpacity(
                    1, 
                    { duration: 200, easing: 'easeInOut' });

        for(var row = 0; row < this.rowModifiers.length; row++) {
            if (row !== modIndex) {
                this.rowModifiers[row].setOpacity(
                    0.4, 
                    { duration: 200, easing: 'easeInOut' });
            }
        }
    }
    
    CreateView.prototype.previewFile = function(ev) {
        var file = ev.origin._currTarget.files[0];
        var reader = new FileReader();
        if (file.type.indexOf("image") == 0) {
            reader.onload = function(e) {
                this.imagePreview.setProperties({
                   paddingTop: '0px' 
                });
                this.imagePreview.setContent('<img src="' + e.target.result + '" width="' + (window.innerWidth - 20) + '" />');
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