define(function(require, exports, module) {
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var View = require('famous/core/View');
  var SequentialLayout = require('famous/views/SequentialLayout');


  function TopicCardView(topic, listScrollview, app) {
    SequentialLayout.apply(this, arguments);

    this.app = app;
    this.listScrollview = listScrollview;
    this.topic = topic;
    this.surfaces = [];
    this.sequenceFrom(this.surfaces);
    
    //_createBackground.call(this);
    _createName.call(this);

    //_setListeners.call(this);
  }

  TopicCardView.prototype = Object.create(SequentialLayout.prototype);
  TopicCardView.prototype.constructor = TopicCardView;

  TopicCardView.DEFAULT_OPTIONS = {

  };

  function _createName() {
    var self = this;
    
    function viewTemplate(topic) {
      var content;
      var metacode = self.app.metacodes.get(topic.get('metacode_id'));
      
      var imageUrl = metacode.get('icon').indexOf('http') !== -1 ? metacode.get('icon') : 'content/images' + metacode.get('icon');

      content = '<div class="list-item">'
      content += '<img class="list-icon" width="40" src="' + imageUrl + '" />';
      content += '<div class="list-subject">' + topic.get('name') + '</div>';
      content += '<span class="list-type">' + metacode.get('name') + '</span>';
      content += '</div>';
      return content;
    }

    var contentSurf = new Surface({
      size: [window.innerWidth - 16, 72],
      content: viewTemplate(this.topic),
      properties: {
        background: 'white',
        color: 'black',
        borderRadius: '2px',
        margin: '0 8px'
      }
    });
    this.topic.set('listItem', this);

    contentSurf.topic = this.topic;

    contentSurf.pipe(this.listScrollview);

    contentSurf.on('click', function() {
      self.app.showSingleTopic(this.topic);
    });

    this.surfaces.push(contentSurf);
    this.surfaces.push(new Surface({
      size: [undefined, 8]
    }));
  }

  module.exports = TopicCardView;
});