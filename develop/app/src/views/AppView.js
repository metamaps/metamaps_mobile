define(function(require, exports, module) {
    var Surface          = require('famous/core/Surface');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var View             = require('famous/core/View');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var EdgeSwapper      = require('famous/views/EdgeSwapper');
    var CachedMap        = require('famous/transitions/CachedMap');

    var MenuBarView     = require('views/MenuBarView');
    var CreateView      = require('views/CreateView');
    var MapListView     = require('views/MapListView');
    var TopicListView   = require('views/TopicListView');
    var TopicView   = require('views/TopicView');
    var PlusView        = require('views/PlusView');

    function AppView() {
        View.apply(this, arguments);

        _createAppStateTracker.call(this);
        
        _createMapListContainerView.call(this);
        _createBackbone.call(this);
        
        _createMenuBarView.call(this);
        _createCreateView.call(this);
        _createEdgeSwapperView.call(this);
        _createTopicListContainerView.call(this);
        _createSingleTopicView.call(this);
        _createPlusView.call(this);
        
        this.showMapList();
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    var height = window.innerHeight;
    AppView.DEFAULT_OPTIONS = {
        transition: {
            duration: 300,
            curve: 'easeInOut'
        },
        height: height
    };

    function _createAppStateTracker() {
        this.initialized = false;
        this.currentPage = ""; // will be a string: MapListPage, TopicListPage, or TopicPage  
        this.activeMap = null;
    }
    
    function _createBackbone() {
        var self = this;
        
        this.Metacode = Backbone.Model.extend({
        });
        var MetacodeCollection = Backbone.Collection.extend({
          model: this.Metacode,
          url: '/metacodes'
        });
        this.metacodes = new MetacodeCollection();
        this.metacodes.fetch();
        
        this.Topic = Backbone.Model.extend({
        });
        
        var TopicCollection = Backbone.Collection.extend({
          model: this.Topic,
          url: '/topics'
        });
        
        this.Map = Backbone.Model.extend({
        });
        
        var MapCollection = Backbone.Collection.extend({
          model: this.Map,
          url: '/maps'
        });
        
        this.maps = new MapCollection();
        
        this.maps.on("add", function(map) {
            
          // initialize the topic collection
          var topics = new TopicCollection();
          map.set('topics', topics);
          
          // add it to the listView    
          self.mapListView.addMap(map);
        });
        
        this.maps.on("remove", function(map) {
          self.mapListView.removeMap(map);
        });
        
        this.maps.fetch();
    }
    
    function _createMenuBarView() {
        this.menuBarView = new MenuBarView();
        this.menuBarView.on('cancelAdd', this.slideCreateUp.bind(this, function(){ this.createView.reset() }.bind(this)));
        this.menuBarView.on('goBack', this.goBack.bind(this));
        this.menuBarView.on('addTopic', this.addTopic.bind(this));
        
        this.storeTitle = '';

        this.menuMod = new Modifier({
            transform: Transform.translate(0, 0, 1)
        });
        this._add(this.menuMod).add(this.menuBarView);
    }

    function _createCreateView() {
        this.createView = new CreateView({
            duration: this.options.transition.duration
        });
        this.createView.on('canCreateTopic', this.menuBarView.enableCreate.bind(this.menuBarView));
        this.createView.on('cantCreateTopic', this.menuBarView.disableCreate.bind(this.menuBarView));
        this._add(this.createView);
    }
    
    function _createEdgeSwapperView() {
        this.edgeSwapper = new EdgeSwapper({
            inTransition: { duration: 300, easing: 'easeIn' },
            outTransition: { duration: 300, easing: 'easeOut' },
            overlap: true
        });
        
        this.edgeSwapper._controller.inOpacityFrom(function(progress) {
            return 1;   
        });
        this.edgeSwapper._controller.outOpacityFrom(function(progress) {
            return 1;   
        });
        
        this.edgeSwapper.goForward = function() {
            this.edgeSwapper._controller.inTransformFrom(CachedMap.create(_transformOutMap.bind(this.edgeSwapper, 0.0001)));
            this.edgeSwapper._controller.outTransformFrom(CachedMap.create(_transformInMap.bind(this.edgeSwapper, 0.0001)));
        }
        this.edgeSwapper.goBack = function() {
            this.edgeSwapper._controller.inTransformFrom(CachedMap.create(_transformInMap.bind(this.edgeSwapper, 0.0001)));
            this.edgeSwapper._controller.outTransformFrom(CachedMap.create(_transformOutMap.bind(this.edgeSwapper, 0.0001)));
        }
        this.edgeSwapper.goForward.call(this);
        
        // progress goes from 0 to 1
        function _transformInMap(zMax, progress) {
            return Transform.translate((-this._size[0]) * (1 - progress), 0, zMax * (1 - progress));
        }
        
        // progress goes from 1 to 0
        function _transformOutMap(zMax, progress) {
            return Transform.translate(this._size[0] * (1 - progress), 0, zMax * (1 - progress));
        }
        
        
        this.edgeSwapperMod = new Modifier({
         transform: Transform.translate(0,44,0)  
        });
        
        this._add(this.edgeSwapperMod).add(this.edgeSwapper);
    }

    function _createMapListContainerView() {

        this.mapListContainerView = new ContainerSurface({
            size: [undefined, undefined],
            properties: {
                overflow: 'hidden'
            }
        });

        this.mapListView = new MapListView(this);
        this.mapListMod = new Modifier();

        this.mapListContainerView.add(this.mapListMod).add(this.mapListView);
    }
    
    function _createTopicListContainerView() {

        this.topicListContainerView = new ContainerSurface({
            size: [undefined, undefined],
            properties: {
                overflow: 'hidden'
            }
        });

        this.topicListView = new TopicListView(this);
        this.topicListMod = new Modifier();

        this.topicListContainerView.add(this.topicListMod).add(this.topicListView);
    }
    
    function _createSingleTopicView() {

        this.singleTopicContainerView = new ContainerSurface({
            size: [undefined, undefined],
            properties: {
                overflow: 'hidden'
            }
        });

        this.singleTopicView = new TopicView(this);
        this.singleTopicMod = new Modifier();

        this.singleTopicContainerView.add(this.singleTopicMod).add(this.singleTopicView);
    }

    function _createPlusView(){
        this.plusView = new PlusView();
        this.plusView.on('openCreateView', this.slideCreateDown.bind(this));
        
        this.plusMod = new Modifier({
            origin: [0.5, 0.95],
            transform: Transform.translate(0, 0, 2),
            properties: {
                'opacity':1
            }
        });
    }

    /*AppView.prototype.persist = function() {
         var persist = _.map(this.activeMap.get('topics').toJSON(), function(model){ 
             return _.pick(model, 'author', 'description', 'metacode', 'synapses', 'title'); 
         });
         this.firebase.child(this.activeMap.get('title')).set(persist);
    }*/
    
    AppView.prototype.goBack = function() {
        if (this.currentPage === 'TopicListPage') {
            this.edgeSwapper.goBack.call(this);
            this.showMapList();
        }
        else if (this.currentPage === 'TopicPage') {
            this.edgeSwapper.goBack.call(this);
            this.menuBarView.titleSurf.setContent(this.storeTitle);
            this.showTopicList();
            
            // persist to firebase
            //this.persist();
        }
    }
    
    AppView.prototype.showMapList = function() {
        this.edgeSwapper.show(this.mapListContainerView);
        this.plusMod.setOpacity(0);
        this.menuBarView.hideBackIcon();
        this.currentPage = 'MapListPage';
        this.menuBarView.titleSurf.setContent('My Maps');
        this.edgeSwapper.goForward.call(this);
    }
    
    AppView.prototype.showTopicList = function(map) {
        var self = this;
        
        if (map) {
            this.activeMap = map;
            var topics = map.get('topics');
            
            // reset the topic list view
            this.topicListView.reset.call(this.topicListView);
            
            // get topics
            $.ajax({
                url:"/maps/" + map.id + ".json",
                success:function(results){
                    _.each(results, function(topic) {
                        var t = new this.Topic(topic);
                        
                        // add to the collection of topics for the map
                        topics.add(t);
                        // add to the topic list view
                        this.topicListView.addTopic(t);
                    }.bind(self));
                }
            });
        }
        
        this.edgeSwapper.show(this.topicListContainerView);
        this._add(this.plusMod).add(this.plusView);
        this.plusMod.setOpacity(1, this.options.transition);
        this.menuBarView.showBackIcon();
        this.currentPage = 'TopicListPage';
    }
    
    
    AppView.prototype.showSingleTopic = function(topic) {
        this.singleTopicView.loadTopic(topic);
        
        this.storeTitle = this.menuBarView.titleSurf.getContent();
        
        var metacode = this.metacodes.get(topic.get('metacode_id'));
        this.menuBarView.titleSurf.setContent(metacode.get('name').toUpperCase());
        
        this.edgeSwapper.goForward.call(this);
        this.edgeSwapper.show(this.singleTopicContainerView);
        this.plusMod.setOpacity(0, this.options.transition);
        this.menuBarView.showBackIcon();
        this.currentPage = 'TopicPage';
    }

    AppView.prototype.slideCreateUp = function(callback) {
        // show the plus icon again
        this.plusMod.setOpacity(1, this.options.transition);
        
        // set the title back to what it was
        this.menuBarView.titleSurf.setContent(this.storeTitle);
        
        this.edgeSwapperMod.setTransform(Transform.translate(0, 44, 0), this.options.transition, callback);
    }

    AppView.prototype.slideCreateDown = function() {
        this.edgeSwapperMod.setTransform(Transform.translate(0, this.options.height, 0), this.options.transition);
        this.plusMod.setOpacity(0, this.options.transition);
        
        this.menuBarView.showXIcon();
        
        this.createView.animate();
        this.storeTitle = this.menuBarView.titleSurf.getContent();
        this.menuBarView.titleSurf.setContent('Add New Topic');
    }
    
    
    AppView.prototype.addTopic = function() {
        var newTopic = {};
        newTopic.title = this.createView.inputValue;
        newTopic.metacode = this.createView.selectedMetacode;
        newTopic.author = 'poietic';
        newTopic.description = '';
        newTopic.synapses = 8;
        
        var topic = new this.Topic(newTopic);
        
        var activeMapTopics = this.activeMap.get('topics');
        // this line adds it to the backbone topic collection
        activeMapTopics.add(topic);
        
        this.slideCreateUp.call(this, function() {
            this.createView.reset();
            this.showSingleTopic(topic);
        }.bind(this));
    }

    module.exports = AppView;
});