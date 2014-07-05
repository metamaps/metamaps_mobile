define(function(require, exports, module) {
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var View = require('famous/core/View');

  var Scrollview = require('famous/views/Scrollview');

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

    this.listSurfaces = [];

    this.listScrollview = new Scrollview({
      //speedLimit: 2.5,
      edgeGrip: 0.05
    });
    this.listScrollview.sequenceFrom(this.listSurfaces);

    var listScrollMod = new Modifier({
      size: [window.innerWidth, window.innerHeight - 56]
    });
    this._add(listScrollMod).add(this.listScrollview);
  }

  ListView.prototype.addMap = function(map) {
    var self = this;
    var content;
    content = '<div class="list-item">'
    content += '<img class="list-icon" width="40" src="content/images/map.png" />';
    content += '<div class="list-subject">' + map.get('name') + '</div>';
    content += '<span class="list-type">map</span>';
    content += '</div>';

    var surface = new Surface({
      size: [undefined, this.options.listItemHeight],
      content: content,
      properties: {
        background: 'white',
        color: 'black'
      }
    });
    map.set('listSurface', surface);

    surface.map = map;

    surface.pipe(this.listScrollview);

    surface.on('click', function() {
      self.app.menuBarView.titleSurf.setContent(map.get('name'));
      self.app.showTopicList(this.map);
    });

    this.listSurfaces.push(surface);
    this.listSurfaces.push(new Surface({
      size: [window.innerWidth - 72, 1],
      properties: {
        borderTop: '1px solid rgba(0,0,0,0.08)',
        marginLeft: '72px'
      }
    }));
  }

  ListView.prototype.removeMap = function(map) {
    var surface = map.get('listSurface');
    var index = _.indexOf(this.listSurfaces, surface);
    // remove the surface from the array that is populating the listView, and the grey border as well
    this.listSurfaces.splice(index, 2);
  }

  module.exports = ListView;
});