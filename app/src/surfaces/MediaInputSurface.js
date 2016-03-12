/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var InputSurface = require('famous/surfaces/InputSurface');

    // the goal
    // https://plus.google.com/u/0/photos/116559944503510939534/albums/6009798305267426977/6009798312345768402?pid=6009798312345768402&oid=116559944503510939534

    function MediaInputSurface(options) {
        this._accept        = options.accept || '';
        this._capture       = options.capture || '';
        
        InputSurface.apply(this, arguments);
    }
    
    MediaInputSurface.prototype = Object.create(InputSurface.prototype);
    MediaInputSurface.prototype.constructor = MediaInputSurface;

    /**
     * Place the document element this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    MediaInputSurface.prototype.deploy = function deploy(target) {
        InputSurface.prototype.deploy.call(this, target);
        
        target.accept = this._accept;
        target.capture = this._capture;
    };
    
    module.exports = MediaInputSurface;
});