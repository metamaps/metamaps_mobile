/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine     = require('famous/core/Engine');
    var Modifier   = require('famous/core/Modifier');
    var Transform  = require('famous/core/Transform');
    var Surface    = require('famous/core/Surface');
    var View       = require('famous/core/View');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var InputSurface = require('famous/surfaces/InputSurface');
    
    
    // the goal
    // https://plus.google.com/u/0/photos/116559944503510939534/albums/6009798305267426977/6009798312345768402?pid=6009798312345768402&oid=116559944503510939534
    
    function LoginView() {
        View.apply(this, arguments);

        var collaboration = new ImageSurface();
        collaboration.setContent('content/images/collaboration.png');
        this._add(collaboration);
    }
    
    LoginView.prototype = Object.create(View.prototype);
    LoginView.prototype.constructor = LoginView;
    
    
    
    LoginView.prototype.getMonkeys = function() {
        
    }
   
   
    module.exports = LoginView; 
});