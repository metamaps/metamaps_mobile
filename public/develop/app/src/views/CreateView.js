define(function(require, exports, module) {
    var Surface    = require('famous/core/Surface');
    var Modifier   = require('famous/core/Modifier');
    var Transform  = require('famous/core/Transform');
    var View       = require('famous/core/View');
    var GridLayout = require("famous/views/GridLayout");
    var Time       = require('famous/utilities/Timer');
    var InputSurface = require('famous/surfaces/InputSurface');

    function CreateView(app) {
        View.apply(this, arguments);

        this.app = app;
        
        _createBackground.call(this);
        _createInput.call(this);
        
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
        this.filterSurf = new Surface({
            properties: {
                marginTop: '44px',
                backgroundColor: '#FFF'
            }
        });

        this._add(this.filterSurf);
    }

    function _createInput() {
        var self = this;
        this.inputValue = "";
        
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        //var titleWidth = 100 * windowWidth / 320;
        //var titleHeight = 20 * windowHeight / 568;
        //var fontSize = Math.round( titleHeight );
        this.inputSurf = new InputSurface({
            size: [undefined, 44],
            name: 'inputSurface',
            placeholder: "First: choose a metacode",
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
            
            if (this.getValue() !== "" && self.selectedMetacode) {
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

    function _createStrips() {
        var self = this;
        
        this.selectedMetacode = null;
        
        //create a grid for icons
        var grid = new GridLayout({
            size:[undefined, undefined],
            dimensions: [3, 3]
        });
        var surfaces = [];


        grid.sequenceFrom(surfaces);

        var metacodesToUse = ["Question",'Wildcard','Idea','Con','Argument','Pro','Experience','Foresight','Good Practice'];
        var metacodes = [];
        
        var collection = self.app.metacodes;
        for (var i = 0; i < metacodesToUse.length; i++){
            var m = collection.findWhere({ name: metacodesToUse[i] });
            metacodes.push(m);
        };
        /*
        var iconContents = [
            {text: 'QUESTION', imageUrl: 'content/images/question-icon.png', available: true, input: "What's your question?"},
            {text: 'WILDCARD', imageUrl: 'content/images/wildcard-icon.png', available: true, input: 'Type here...'},
            {text: 'IDEA', imageUrl: 'content/images/idea-icon.png', available: true, input: "What's your idea?"},

            {text: 'CON', imageUrl: 'content/images/con-icon.png', available: true, input: 'Challenge!'},
            {text: 'ARGUMENT', imageUrl: 'content/images/argument-icon.png', available: true, input: 'Offer perspective'},
            {text: 'PRO', imageUrl: 'content/images/pro-icon.png', available: true, input: 'Support!'},
            
            {text: 'EXPERIENCE', imageUrl: 'content/images/experience-icon.png', available: true, input: 'Relate an experience'},
            {text: 'PREDICTION', imageUrl: 'content/images/prediction-icon.png', available: true, input: 'Offer a prediction'},
            {text: 'LEARNING', imageUrl: 'content/images/learning-icon.png', available: true, input: 'Share a learning'},
        ];*/

        this.rowModifiers = [];
        var contentCounter = 0;

        var surf, view, availability, type, modIndex;
        var width = window.innerWidth;
        var height = window.innerHeight;

        var scaledWidth = 50*height/320;
        var scaledHeight = 60*height/320;
        for(var row = 0; row < 3; row++) {
            for(var col = 0; col < 3; col++) {
                this.rowModifiers[(row * 3) + col] = new Modifier({
                    size: [scaledWidth, scaledHeight],
                    origin: [0.5, 0.5]
                });
                
                metacode = metacodes[contentCounter];
                //create surface from iconContents
                //availability = type.available ? 'available' : 'unavailable';

                surf = new Surface({
                    size: [undefined,undefined],
                    classes: ['filterIcon'],
                    content: '<img class="filterIconImg" width="' + scaledWidth + '" src="content/images/'+ metacode.get('icon') +'"/>'+
                                '<div class="filterIconText available">' + metacode.get('name').toUpperCase() +'</div>',
                });
                surf.index = (row * 3) + col;
                surf.typeText = metacode.get('name');
                surf.suggestText = 'Type here...'; // type.input;
                
                modIndex = (row * 3) + col;
                surf.on('touchstart', function() {
                    self.selectMetacode(this.index, this.typeText, this.suggestText);
                });

                //push view (modifier + surface) onto surfaces
                view = new View();
                view._add(this.rowModifiers[(row * 3) + col]).add(surf);
                surfaces.push(view);

                contentCounter++;
            }
        }

        var gridMod = new Modifier({
            size: [width, 360*height/568],
            origin: [0, 0],
            transform: Transform.translate(0, 150, 0)
        });

        this._add(gridMod).add(grid);
    }

    CreateView.prototype.animate = function() {
        this.reset();

        this.inputMod.setTransform(
            Transform.translate(0, 44, 0),
            {duration: this.options.duration - 100, curve: 'easeInOut'});

        var scale = Transform.scale(1, 1, 1);
        var translate = Transform.translate(0, 0, 0);
        this.rowModifiers[0].setTransform(
            Transform.multiply(translate, scale),
            {duration: this.options.duration, curve: 'easeInOut'});

        this.rowModifiers[1].setTransform(
            Transform.multiply(translate, scale),
            {duration: this.options.duration, curve: 'easeInOut'});

        this.rowModifiers[2].setTransform(
            Transform.multiply(translate, scale),
            {duration: this.options.duration, curve: 'easeInOut'});

        Time.setTimeout((function() {
            this.rowModifiers[3].setTransform(
                Transform.multiply(translate, scale),
                {duration: this.options.duration, curve: 'easeInOut'});

            this.rowModifiers[4].setTransform(
                Transform.multiply(translate, scale),
                {duration: this.options.duration, curve: 'easeInOut'});

            this.rowModifiers[5].setTransform(
                Transform.multiply(translate, scale),
                {duration: this.options.duration, curve: 'easeInOut'});
        }).bind(this), this.options.duration - 250);

        Time.setTimeout((function() {
            this.rowModifiers[6].setTransform(
                Transform.multiply(translate, scale),
                {duration: this.options.duration, curve: 'easeInOut'});

            this.rowModifiers[7].setTransform(
                Transform.multiply(translate, scale),
                {duration: this.options.duration, curve: 'easeInOut'});

            this.rowModifiers[8].setTransform(
                Transform.multiply(translate, scale),
                {duration: this.options.duration, curve: 'easeInOut'});
        }).bind(this), this.options.duration - 200);
    }

    CreateView.prototype.reset = function() {
        this.inputMod.setTransform(Transform.translate(0, 0, 0));
        this.inputSurf.setValue("");
        this.inputValue = "";
        this.inputSurf.setPlaceholder("First: pick a metacode");
        this._eventOutput.emit('cantCreateTopic');
        this.selectedMetacode = null;

        var scale = Transform.scale(0.1, 0.1, 0);
        var translate = Transform.translate(0, 50, 0);

        for(var row = 0; row < this.rowModifiers.length; row++) {
            this.rowModifiers[row].setTransform(
                Transform.multiply(translate, scale),
            {duration: 0});
            this.rowModifiers[row].setOpacity(1);
        }
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

    module.exports = CreateView;
});