define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');

    function MenuBarView() {
        View.apply(this, arguments);

        _createMenu.call(this);
        _setListeners.call(this);
    }

    MenuBarView.prototype = Object.create(View.prototype);
    MenuBarView.prototype.constructor = MenuBarView;

    MenuBarView.DEFAULT_OPTIONS = {
        duration: 200
    };

    function _createMenu() {
        
        // stores whether the user has done everything they need to to create a topic
        this.canCreate = false;
        
        this.menuSurf = new Surface({
            size: [undefined, 44],
            properties: {
                backgroundColor: '#292929'
            }
        });
        this.menuMod = new Modifier({});

        //x-icon
        this.xIconSurf = new Surface({
            size: [40,40],
            content: '<img width="40" src="/content/images/x-icon.png"/>',
            properties: {
                paddingTop: '0.4px',
                paddingLeft: '2.6px'
            },
        });
        this.xIconMod = new Modifier({
            opacity: 0
        });
        
        
        //back-icon
        this.backIconSurf = new Surface({
            size: [40,40],
            content: '<img width="40" src="/content/images/arrow-icon-back.png"/>',
            properties: {
                paddingTop: '0.4px',
                paddingLeft: '2.6px'
            },
        });
        this.backIconMod = new Modifier({
            opacity: 0
        });


        //title
        this.titleSurf = new Surface({
            size: [undefined, 35],
            content: 'My Maps',
            properties: {
                fontFamily: 'Arial Narrow',
                fontSize: '24px',
                color: 'white',
                textAlign: 'center',
                paddingTop: '8px'

            }
        });
        var titleMod = new Modifier({
            origin: [0.5, 0]
        });

        //question icon
        this.checkmarkIconSurf = new Surface({
            size: [40,40],
            content: '<img width="34" src="/content/images/checkmark.png"/>',
            properties: {
                paddingTop: '5px',
                paddingRight: '30px'
            }
        });
        this.checkmarkIconMod = new Modifier({
            origin: [.99, 0],
            opacity: 0
        });


        this._add(this.menuMod).add(this.menuSurf);
        this._add(this.xIconMod).add(this.xIconSurf);
        this._add(this.backIconMod).add(this.backIconSurf);
        this._add(titleMod).add(this.titleSurf);
        this._add(this.checkmarkIconMod).add(this.checkmarkIconSurf);
    }

    function _setListeners() {
        var self = this;
        
        this.xIconSurf.on('click', function() {
            this.cancelAdd();
        }.bind(this));
        
        this.backIconSurf.on('click', function() {
            this._eventOutput.emit('goBack');
        }.bind(this));
        
        this.checkmarkIconSurf.on('click', function() {
            this.addTopic();
        }.bind(this));
    }
    
    MenuBarView.prototype.enableCreate = function() {
        if (!this.canCreate) this.showCheckIcon();
        this.canCreate = true;
    };
    
    MenuBarView.prototype.disableCreate = function() {
        if (this.canCreate) this.hideCheckIcon();
        this.canCreate = false;
    };
    
    MenuBarView.prototype.showXIcon = function() {

        var paramOptions =  {duration: this.options.duration, curve: 'easeInOut'};

        this.backIconMod.setTransform(Transform.translate(0,0,0));
        this.backIconMod.setOpacity(0);
        
        this.xIconMod.setTransform(Transform.translate(0,0,1));
        this.xIconMod.setOpacity(1, paramOptions);
        
        this.menuMod.setOpacity(0.9);
    };
    
    MenuBarView.prototype.hideXIcon = function() {

        var paramOptions =  {duration: this.options.duration, curve: 'easeInOut'};

        this.xIconMod.setOpacity(0, paramOptions);
        this.menuMod.setOpacity(1);
    };
    
    MenuBarView.prototype.showBackIcon = function() {

        var paramOptions =  {duration: this.options.duration, curve: 'easeInOut'};
        
        this.xIconMod.setTransform(Transform.translate(0,0,0));
        this.xIconMod.setOpacity(0);

        this.backIconMod.setTransform(Transform.translate(0,0,1));       
        this.backIconMod.setOpacity(1, paramOptions);
    };
    
    MenuBarView.prototype.hideBackIcon = function() {

        var paramOptions =  {duration: this.options.duration, curve: 'easeInOut'};

        this.backIconMod.setOpacity(0, paramOptions);
    };
    
    MenuBarView.prototype.showCheckIcon = function() {

        var paramOptions =  {duration: this.options.duration, curve: 'easeInOut'};
        
        this.checkmarkIconMod.setOpacity(1, paramOptions);
    };
    
    MenuBarView.prototype.hideCheckIcon = function() {

        var paramOptions =  {duration: this.options.duration, curve: 'easeInOut'};

        this.checkmarkIconMod.setOpacity(0, paramOptions);
    };
    
    MenuBarView.prototype.cancelAdd = function() {
        this.hideXIcon();
        this.hideCheckIcon();
        this.showBackIcon();
        this._eventOutput.emit('cancelAdd');
    }
    
    MenuBarView.prototype.addTopic = function() {
        if (this.canCreate) {    
            console.log('creating a new topic');
            this.hideXIcon();
            this.hideCheckIcon();
            this.showBackIcon();
            this._eventOutput.emit('addTopic');
        }
        else {
            console.log('unable to create yet');
        }
    }

    module.exports = MenuBarView;
});