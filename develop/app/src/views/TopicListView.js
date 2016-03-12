define(function(require, exports, module) {
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var View = require('famous/core/View');

  var Scrollview = require('famous/views/Scrollview');
  var TopicCardView = require('views/TopicCardView');


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

  TopicListView.prototype.reset = function() {
    this.listItems = [new Surface({
      size: [undefined, 8]
    })];
    this.listScrollview.sequenceFrom(this.listItems);
  }

  TopicListView.prototype.addTopic = function(topic) {
    this.listItems.push(new TopicCardView(topic, this.listScrollview, this.app));
  }

  TopicListView.prototype.removeTopic = function(topic) {
    var topicCardView = topic.get('listItem');
    var index = _.indexOf(this.listItems, topicCardView);
    // remove the surface from the array that is populating the TopicListView
    this.listItems.splice(index, 1);
  }

  module.exports = TopicListView;
});