define(function(require, exports, module) {
    var Surface    = require('famous/core/Surface');
    var Modifier   = require('famous/core/Modifier');
    var Transform  = require('famous/core/Transform');
    var View       = require('famous/core/View');
    var GridLayout = require("famous/views/GridLayout");
    var Time       = require('famous/utilities/Timer');
    var InputSurface = require('famous/surfaces/InputSurface');

    function FilterView() {
        View.apply(this, arguments);

        _createBackground.call(this);
        _createTitle.call(this);
        _createStrips.call(this);
    }

    FilterView.prototype = Object.create(View.prototype);
    FilterView.prototype.constructor = FilterView;

    FilterView.DEFAULT_OPTIONS = {
        duration: null
    };

    function _createBackground() {
        this.filterSurf = new Surface({
            properties: {
                marginTop: '44px',
                backgroundColor: '#323153'
            }
        });

        this._add(this.filterSurf);
    }

    function _createTitle() {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        //var titleWidth = 100 * windowWidth / 320;
        //var titleHeight = 20 * windowHeight / 568;
        //var fontSize = Math.round( titleHeight );
        this.inputSurf = new InputSurface({
            size: [undefined, 44],
            name: 'inputSurface',
            placeholder: "What's the question?",
            value: '',
            type: 'text',
            properties: {
                color: '#333333',
                fontSize: '18px',
                fontFamily: 'Arial',
                textAlign: 'center',
                border: 'none',
                outline: 'none'
            }
        });
        this.inputMod = new Modifier({
            origin: [0.5, 0]
        });

        this._add(this.inputMod).add(this.inputSurf);
    }

    function _createStrips() {
        //create a grid for icons
        var grid = new GridLayout({
            size:[undefined, undefined],
            dimensions: [3, 3]
        });
        var surfaces = [];


        grid.sequenceFrom(surfaces);

        var iconContents = [
            {text: 'QUESTION', imageUrl: '/content/images/question.png', available: true},
            {text: 'WILDCARD', imageUrl: '/content/images/wildcard.png', available: true},
            {text: 'IDEA', imageUrl: '/content/images/idea.png', available: true},

            {text: 'CON', imageUrl: '/content/images/con_icon.png', available: true},
            {text: 'ARGUMENT', imageUrl: '/content/images/argument.png', available: true},
            {text: 'PRO', imageUrl: '/content/images/pro.png', available: true},
            
            {text: 'EXPERIENCE', imageUrl: '/content/images/experience.png', available: true},
            {text: 'PREDICTION', imageUrl: '/content/images/foresight.png', available: true},
            {text: 'LEARNING', imageUrl: '/content/images/goodpractice.png', available: true},
        ];

        this.rowModifiers = [];
        var contentCounter = 0;

        var surf, view, availability;
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
                //create surface from iconContents
                availability = iconContents[contentCounter].available ? 'available' : 'unavailable';

                surf = new Surface({
                    size: [undefined,undefined],
                    classes: ['filterIcon'],
                    content: '<img class="filterIconImg" width="' + scaledWidth + '" src="'+ iconContents[contentCounter].imageUrl +'"/>'+
                                '<div class="filterIconText '+ availability +'">' + iconContents[contentCounter].text +'</div>'
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
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 30, 0)
        });

        this._add(gridMod).add(grid);
    }

    FilterView.prototype.animate = function() {
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

    FilterView.prototype.reset = function() {
        this.inputMod.setTransform(Transform.translate(0, 0, 0));

        var scale = Transform.scale(0.1, 0.1, 0);
        var translate = Transform.translate(0, 50, 0);

        for(var row = 0; row < this.rowModifiers.length; row++) {
            this.rowModifiers[row].setTransform(
                Transform.multiply(translate, scale),
            {duration: 0});
        }
    }

    module.exports = FilterView;
});