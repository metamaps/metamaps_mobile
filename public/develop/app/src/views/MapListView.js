define(function(require, exports, module) {
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var View = require('famous/core/View');
  var RenderNode = require('famous/core/RenderNode');

  var Scrollview = require('famous/views/Scrollview');
  var MapCardView = require('views/MapCardView');
  
  function ListView(app) {
    View.apply(this, arguments);

    this.app = app;

    _createList.call(this);
  }

  ListView.prototype = Object.create(View.prototype);
  ListView.prototype.constructor = ListView;

  ListView.DEFAULT_OPTIONS = {
    listItemHeight: 72,
    height: null
  };

  function _createList() {

    this.listItems = [new Surface({
      size: [undefined, 8]
    })];

    this.listScrollview = new Scrollview({
      //speedLimit: 2.5,
      edgeGrip: 0.05
    });
    this.listScrollview.sequenceFrom(this.listItems);

    var listScrollMod = new Modifier();
    listScrollMod.sizeFrom(function(){
      return [window.innerWidth, window.innerHeight - 56];
    });
    
    this._add(listScrollMod).add(this.listScrollview);
  }

  ListView.prototype.addMap = function(map) {
    this.listItems.push(new MapCardView(map, this.listScrollview, this.app));
  }

  ListView.prototype.reset = function() {
    this.listItems = [new Surface({
      size: [undefined, 8]
    })];
    this.listScrollview.sequenceFrom(this.listItems);
  }
  
  ListView.prototype.removeMap = function(map) {
    var mapCardView = map.get('listItem');
    var index = _.indexOf(this.listItems, mapCardView);
    // remove the surface from the array that is populating the listView, and the grey border as well
    this.listItems.splice(index, 1);
  }

  module.exports = ListView;
});