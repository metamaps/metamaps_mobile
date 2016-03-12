define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');

    function MenuBarView(options) {
        View.apply(this, arguments);

        _createMenu.call(this);
        _setListeners.call(this);
    }

    MenuBarView.prototype = Object.create(View.prototype);
    MenuBarView.prototype.constructor = MenuBarView;

    MenuBarView.DEFAULT_OPTIONS = {
        duration: 200,
        title: 'Maps'
    };

    function _createMenu() {
        
        // stores whether the user has done everything they need to be able to confirm whatever they're trying to do
        this.canConfirm = false;
        
        this.menuSurf = new Surface({
            size: [undefined, 56],
            properties: {
                backgroundColor: '#009688', // #FAFAFA greyish white
                boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 5px'
            }
        });
        this.menuMod = new Modifier({});

        //x-icon
        this.xIconSurf = new Surface({
            size: [25,25],
            content: '<img width="25" src="content/images/50_x_button.png"/>',
        });
        this.xIconMod = new Modifier({
            origin: [0, 0.5],
            opacity: 0
        });
        
        
        //back-icon
        this.backIconSurf = new Surface({
            size: [25,25],
            content: '<img width="25" src="content/images/50_back_button.png"/>'
        });
        this.backIconMod = new Modifier({
            origin: [0, 0.5],
            opacity: 0
        });


        //title
        this.titleSurf = new Surface({
            size: [undefined, 28],
            content: this.options.title,
            properties: {
                fontFamily: 'robotomedium',
                fontSize: '20px',
                color: '#FFF', //#4D4D4D
                textAlign: 'left'
            }
        });
        var titleMod = new Modifier({
            size: [undefined, 28],
            origin: [0, 0.5],
            transform: Transform.translate(72, 0, 0)
        });

        //question icon
        this.checkmarkIconSurf = new Surface({
            size: [25,25],
            content: '<img width="25" src="content/images/checkmark.png"/>'
        });
        this.checkmarkIconMod = new Modifier({
            origin: [1, 0.5],
            opacity: 0
        });


        this._add(this.menuMod).add(this.menuSurf);
        this._add(this.xIconMod).add(new Modifier({ transform: Transform.translate(16,0,0) })).add(this.xIconSurf);
        this._add(this.backIconMod).add(new Modifier({ transform: Transform.translate(16,0,0) })).add(this.backIconSurf);
        this._add(titleMod).add(this.titleSurf);
        this._add(this.checkmarkIconMod).add(new Modifier({ transform: Transform.translate(-16,0,0) })).add(this.checkmarkIconSurf);
    }

    function _setListeners() {
        var self = this;
        
        this.xIconSurf.on('click', function() {
            this.cancelation();
        }.bind(this));
        
        this.backIconSurf.on('click', function() {
            this._eventOutput.emit('goBack');
        }.bind(this));
        
        this.checkmarkIconSurf.on('click', function() {
            this.confirmation();
        }.bind(this));
    }
    
    MenuBarView.prototype.enableCreate = function() {
        if (!this.canConfirm) this.showCheckIcon();
        this.canConfirm = true;
    };
    
    MenuBarView.prototype.disableCreate = function() {
        if (this.canConfirm) this.hideCheckIcon();
        this.canConfirm = false;
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
    
    MenuBarView.prototype.cancelation = function() {
        this.hideXIcon();
        this.hideCheckIcon();
        this.showBackIcon();
        this._eventOutput.emit('cancelation');
    }
    
    MenuBarView.prototype.confirmation = function() {
        if (this.canConfirm) {
            this.hideXIcon();
            this.hideCheckIcon();
            this.showBackIcon();
            this._eventOutput.emit('confirmation');
        }
        else {
            console.log('unable to take this action yet');
        }
    }

    module.exports = MenuBarView;
});