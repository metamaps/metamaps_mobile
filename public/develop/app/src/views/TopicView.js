define(function(require, exports, module) {
  var Surface         = require('famous/core/Surface');
  var Modifier        = require('famous/core/Modifier');
  var Transform       = require('famous/core/Transform');
  var View            = require('famous/core/View');
  var TextAreaSurface = require('surfaces/TextAreaSurface');

  var Scrollview = require('famous/views/Scrollview');

  function TopicView(app) {
    View.apply(this, arguments);

    this.app = app;
    
    _createStateTracking.call(this);
    _createList.call(this);
    _createBackground.call(this);
    _createMetacode.call(this);
    _createTitle.call(this);
    _createMetadata.call(this);
    _createDescription.call(this);
  }

  TopicView.prototype = Object.create(View.prototype);
  TopicView.prototype.constructor = TopicView;

  TopicView.DEFAULT_OPTIONS = {
    
  };

  function _createStateTracking() {
    
    // will store the currently selected topic
    this.activeTopic = null;
    
      
  }
    
  function _createList() {
    
    this.topicSurfaces = [];

    this.listScrollview = new Scrollview({
      //speedLimit: 2.5,
      edgeGrip: 0.05
    });
    this.listScrollview.sequenceFrom(this.topicSurfaces);

    var listScrollMod = new Modifier({
      transform: Transform.translate(0,0,1)
    });
    listScrollMod.sizeFrom(function(){
      return [window.innerWidth, window.innerHeight - 56];
    });
    
    this._add(listScrollMod).add(this.listScrollview);
  }
  
  function _createBackground() {
    
    var mod = new Modifier({
      transform: Transform.translate(0,0,0)
    });
    mod.sizeFrom(function(){
      return [window.innerWidth, window.innerHeight - 56];
    });
    
    var background = new Surface({
      properties: {
        //backgroundColor: 'white'   
      }
    });
    background.pipe(this.listScrollview);
    
    this._add(mod).add(background);
  }
    
  function _createMetacode() {
    var self = this;
      
    this.metacodeSurface = new Surface({
        size: [96, 96],
        content: '',
        properties: {
          padding: '22px 0'
        }
    });
    this.metacodeSurface.pipe(this.listScrollview);
      
    var view = new View();
    var metacodeMod = new Modifier({
        size: [96, 140],
        origin: [0.5,0] 
    });
    view._add(metacodeMod).add(this.metacodeSurface);
    
    this.topicSurfaces.push(view);
  }
    
  function _createTitle() {
    var self = this;
      
    this.titleSurface = new TextAreaSurface({
        dimensions: [1, 44],
        name: 'textareaSurface',
        placeholder: 'Add a title...',
        value: '',
        properties: {
          padding: '10px 0',
          border: '0',
          outline: '0',
          fontSize: '20px',
          lineHeight: '22px',
          resize: 'none',
          textAlign: 'center',
          fontFamily: 'robotoregular',
          color: '#4D4D4D'
        }
    });
    this.titleSurface.pipe(this.listScrollview);  
      
    this.currentLineCount = 1;
    
    this.titleSurface.on('keyup', function() {
      self.activeTopic.set('title', this.getValue());   
      
      /*if (this.getValue().lineCount() != self.currentLineCount) {
        self.updateTitleLineCount(this.getValue().lineCount());
      }*/
    });
      
    var view = new View();
    var titleMod = new Modifier({
       origin: [0.5,0] 
    });
    titleMod.sizeFrom(function(){
      return [window.innerWidth - 32, 40];
    })
    
    view._add(titleMod).add(this.titleSurface);
    
    this.topicSurfaces.push(view);
  }

  function _createMetadata() {
    var self = this;
      
    this.metadataSurface = new Surface({
        size: [undefined, 100],
        content: '',
        properties: {
          borderTop: '1px solid #BBB',
          borderBottom: '1px solid #BBB'
        }
    });
    this.metadataSurface.pipe(this.listScrollview);
    
    this.topicSurfaces.push(this.metadataSurface);
  }
    
  function _createDescription() {
    var self = this;
      
    this.descriptionSurface = new TextAreaSurface({
        name: 'textareaSurface',
        placeholder: 'Describe this topic...',
        value: '',
        properties: {
          paddingTop: '10px',
          border: '0',
          outline: '0',
          fontSize: '15px',
          resize: 'none',
          fontFamily: 'robotoregular',
          color: '#4D4D4D'
        }
    });
    this.descriptionSurface.pipe(this.listScrollview);
    
    this.descriptionSurface.on('keyup', function() {
      self.activeTopic.set('description', this.getValue());
    });
      
    var view = new View();
    var descMod = new Modifier({
       origin: [0.5,0] 
    });
    descMod.sizeFrom(function(){
      return [window.innerWidth - 32, 100];
    });
    
    view._add(descMod).add(this.descriptionSurface);
    
    this.topicSurfaces.push(view);
  }
    
  /*TopicView.prototype.updateTitleLineCount = function(lineCount) {
    this.currentLineCount = lineCount;
    var numRows = lineCount;
    var lineHeight = 22;
    var padding = 20;
    var height = (numRows * lineHeight) + padding;
    var value = this.titleSurface.getValue();
    this.titleSurface.setDims(numRows, 44); 
    this.titleSurface.setOptions({
       size: [window.innerWidth - 10, height]
    });
    this.titleSurface.setValue(value);
  }*/
  
  
  TopicView.prototype.loadTopic = function(topic) {
      
      this.activeTopic = topic;
      
      var metacode = this.app.metacodes.get(topic.get('metacode_id'));
      this.metacodeSurface.setContent('<img width="96" src="content/images/' + metacode.get('icon') + '" />');
      
      this.titleSurface.setValue(topic.get('name'));
      
      this.metadataSurface.setContent(
        '<div class="topicAuthor">' +
            '<div class="topicImageWrapper"><img width="30" src="content/images/mapper.png" /></div>' +
            '<div class="topicTextWrapper">' +
            'Created by:<br>' +
            topic.get('user_id') +
            '</div>' +
        '</div>' +
        '<div class="topicSynapses">' +
            '<div class="topicImageWrapper"><img width="30" src="content/images/synapse.png" /></div>' +
            '<div class="topicTextWrapper">' +
            'Synapses:<br>' +
            '8' +
            '</div>' +
        '</div>' 
      );
      
      this.descriptionSurface.setValue(topic.get('desc'));
      
  }

  module.exports = TopicView;
});