define(function(require, exports, module) {
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var View = require('famous/core/View');

  var Scrollview = require('famous/views/Scrollview');

  function TopicListView(app) {
    View.apply(this, arguments);

    this.app = app;

    _createList.call(this);
  }

  TopicListView.prototype = Object.create(View.prototype);
  TopicListView.prototype.constructor = TopicListView;

  TopicListView.DEFAULT_OPTIONS = {
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

    var listScrollMod = new Modifier();
    listScrollMod.sizeFrom(function(){
      return [window.innerWidth, window.innerHeight - 56];
    });
    
    this._add(listScrollMod).add(this.listScrollview);
  }

  TopicListView.prototype.reset = function() {
    this.listSurfaces = [];
    this.listScrollview.sequenceFrom(this.listSurfaces);
  }

  TopicListView.prototype.addTopic = function(topic) {
    var self = this;
    
    function viewTemplate(topic) {
      var content;
      var metacode = self.app.metacodes.get(topic.get('metacode_id'));

      content = '<div class="list-item">'
      content += '<img class="list-icon" width="40" src="content/images' + metacode.get('icon') + '" />';
      content += '<div class="list-subject">' + topic.get('name') + '</div>';
      content += '<span class="list-type">' + metacode.get('name') + '</span>';
      content += '</div>';
      return content;
    }

    var contentSurf = new Surface({
      size: [undefined, this.options.listItemHeight],
      content: viewTemplate(topic),
      properties: {
        background: 'white',
        color: 'black'
      }
    });
    topic.set('listSurface', contentSurf);

    topic.on('change:title', function(topic, title) {
      topic.get('listSurface').setContent(viewTemplate(topic));
    });
    topic.on('change:metacode', function(topic, metacode) {
      topic.get('listSurface').setContent(viewTemplate(topic));
    });

    contentSurf.topic = topic;

    contentSurf.pipe(this.listScrollview);

    contentSurf.on('click', function() {
      self.app.showSingleTopic(this.topic);
    });

    this.listSurfaces.push(contentSurf);
    this.listSurfaces.push(new Surface({
      size: [window.innerWidth - 72, 1],
      properties: {
        borderTop: '1px solid rgba(0,0,0,0.08)',
        marginLeft: '72px'
      }
    }));
  }

  TopicListView.prototype.removeTopic = function(topic) {
    var surface = topic.get('listSurface');
    var index = _.indexOf(this.listSurfaces, surface);
    // remove the surface from the array that is populating the TopicListView
    this.listSurfaces.splice(index, 2);
  }

  module.exports = TopicListView;
});