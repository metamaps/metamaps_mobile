define(function(require, exports, module) {
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var View = require('famous/core/View');
  var SequentialLayout = require('famous/views/SequentialLayout');


  function MapCardView(map, listScrollview, app) {
    SequentialLayout.apply(this, arguments);

    this.app = app;
    this.listScrollview = listScrollview;
    this.map = map;
    this.surfaces = [];
    this.sequenceFrom(this.surfaces);
    
    //_createBackground.call(this);
    _createName.call(this);

    //_setListeners.call(this);
  }

  MapCardView.prototype = Object.create(SequentialLayout.prototype);
  MapCardView.prototype.constructor = MapCardView;

  MapCardView.DEFAULT_OPTIONS = {

  };

  function _createName() {
    var self = this;
    var content;
    content = '<div class="list-item">'
    content += '<div class="list-subject">' + this.map.get('name') + '</div>';
    content += '</div>';

    var surface = new Surface({
      size: [window.innerWidth - 16, 72], // 8px padding both sides
      content: content,
      properties: {
        background: 'white',
        color: 'black',
        borderRadius: '2px',
        margin: '0 8px'
      }
    });
    this.map.set('listItem', surface);

    surface.map = this.map;

    surface.pipe(this.listScrollview);

    surface.on('click', function() {
      self.app.menuBarView.titleSurf.setContent(this.map.get('name'));
      self.app.showTopicList(this.map);
    });

    this.surfaces.push(surface);
    this.surfaces.push(new Surface({
      size: [undefined, 8]
    }));
  }

  module.exports = MapCardView;
});