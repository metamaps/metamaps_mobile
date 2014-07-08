define(function(require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var EdgeSwapper = require('famous/views/EdgeSwapper');
    var CachedMap = require('famous/transitions/CachedMap');

    var MenuBarView = require('views/MenuBarView');
    var CreateView = require('views/CreateView');
    var MapListView = require('views/MapListView');
    var TopicListView = require('views/TopicListView');
    var TopicView = require('views/TopicView');
    var PlusView = require('views/PlusView');

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
        
        _setListeners.call(this);

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

        this.Metacode = Backbone.Model.extend({});
        var MetacodeCollection = Backbone.Collection.extend({
            model: this.Metacode,
            url: '/metacodes'
        });

        this.metacodes = new MetacodeCollection();
        this.metacodes.fetch();

        this.Topic = Backbone.Model.extend({
            urlRoot: '/topics',
            initialize: function() {
                this.set({
                    "user_id": 110237153,
                    "desc": '',
                    "link": '',
                    "permission": 'commons'
                });
            }

        });

        var TopicCollection = Backbone.Collection.extend({
            model: this.Topic,
            url: '/topics',
            comparator: function(a, b) {
                a = a.get('name').toLowerCase();
                b = b.get('name').toLowerCase();
                return a > b ?  1
                     : a < b ? -1
                     :          0;
            },
            render: function() {
                _.each(this.models, function(topic){
                   self.topicListView.addTopic(topic); 
                });
            }
        });

        this.Map = Backbone.Model.extend({
            urlRoot: '/maps'
        });

        var MapCollection = Backbone.Collection.extend({
            model: this.Map,
            url: '/maps',
            comparator: function(a, b) {
                a = a.get('name').toLowerCase();
                b = b.get('name').toLowerCase();
                return a > b ?  1
                     : a < b ? -1
                     :          0;
            },
            render: function() {
                _.each(this.models, function(map){
                   self.mapListView.addMap(map); 
                });
            }
        });

        this.maps = new MapCollection();
        
        this.maps.on("reset sort", function() {
            self.mapListView.reset();
            this.render();
        });

        this.maps.on("add", function(map) {

            // initialize the topic collection
            var topics = new TopicCollection();
            topics.on("reset sort", function() {
                self.topicListView.reset();
                this.render();
            });
            map.set('topics', topics);
        });

        /*
        this is the json for a 'mapping'
        {
        "category": "Topic",
        "created_at": "2014-01-29T04:57:20Z",
        "id": 23,
        "map_id": 3,
        "synapse_id": null,
        "topic_id": 7,
        "updated_at": "2014-03-02T04:20:44Z",
        "user_id": 110237153,
        "xloc": 45,
        "yloc": -65
        }*/

        this.Mapping = Backbone.Model.extend({
            urlRoot: '/mappings',
            initialize: function() {
                this.set({
                    "xloc": 0,
                    "yloc": 0,
                    "user_id": 110237153,
                    "category": "Topic",
                });
            }
        });
    }

    function _createMenuBarView() {
        this.menuBarView = new MenuBarView();

        this.storeTitle = '';

        this.menuMod = new Modifier({
            size: [undefined, 56],
            transform: Transform.translate(0, 0, 2)
        });
        this._add(this.menuMod).add(this.menuBarView);
    }

    function _createCreateView() {
        this.createView = new CreateView(this);
        
        this.createMod = new Modifier({
            opacity: 0,
            transform: Transform.translate(0, 0, -1)
        });
        this._add(this.createMod).add(this.createView);
    }

    function _createEdgeSwapperView() {
        this.edgeSwapper = new EdgeSwapper({
            inTransition: {
                duration: 300,
                easing: 'easeIn'
            },
            outTransition: {
                duration: 300,
                easing: 'easeOut'
            },
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
            transform: Transform.translate(0, 56, 1)
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

        this.singleTopicView = new TopicView(this);
        
        this.singleTopicMod = new Modifier({
            size: [0, 0],
            origin: [0.5, 0.5], 
            transform: Transform.translate(0,0,-2),
            opacity: 0
        });

        this._add(this.singleTopicMod).add(this.singleTopicView);
    }

    function _createPlusView() {
        this.plusView = new PlusView();

        this.plusMod = new Modifier({
            origin: [0.5, 0.95],
            transform: Transform.translate(0, 0, 2)
        });

        this._add(this.plusMod).add(this.plusView);
    }
    
    function _setListeners() {
        
        this.menuBarView.on('cancelation', this.slideCreateUp.bind(this, function() {
            this.createView.reset()
        }.bind(this)));
        this.menuBarView.on('goBack', this.goBack.bind(this));
        this.menuBarView.on('confirmation', this.addTopic.bind(this));
        
        this.createView.on('canCreateTopic', this.menuBarView.enableCreate.bind(this.menuBarView));
        this.createView.on('cantCreateTopic', this.menuBarView.disableCreate.bind(this.menuBarView));
        
        this.singleTopicView.on('goBack', this.goBack.bind(this));
        
        this.plusView.on('openCreateMap', this.slideCreateMapDown.bind(this));
        this.plusView.on('openCreateTopic', this.slideCreateTopicDown.bind(this));
        this.plusView.on('openCreateSynapse', this.slideCreateSynapseDown.bind(this));
    }
    
    AppView.prototype.getMyMaps = function() {
        $.ajax({
            url: "/maps/mine.json",
            success: function(results) {
                this.maps.add(results);
                this.maps.sort(); // this line also results in rendering
            }.bind(this)
        });
    }

    AppView.prototype.goBack = function() {
        if (this.currentPage === 'TopicListPage') {
            this.edgeSwapper.goBack.call(this);
            this.showMapList();
        }
        else if (this.currentPage === 'TopicPage') {
            this.hideSingleTopic();
        }
    }

    AppView.prototype.showMapList = function() {
        this.edgeSwapper.show(this.mapListContainerView);

        this.plusView.map();
        //this.plusMod.setOpacity(0);
        //this.plusMod.setTransform(Transform.translate(0,0,-1));

        this.menuBarView.hideBackIcon();
        this.currentPage = 'MapListPage';
        this.menuBarView.titleSurf.setContent('Maps');
        this.edgeSwapper.goForward.call(this);
    }

    AppView.prototype.showTopicList = function(map) {
        var self = this;

        this.topicListView.reset();

        if (map) {
            this.activeMap = map;
            var topics = map.get('topics');

            if (topics.models.length === 0) {
                // get topics
                $.ajax({
                    url: "/maps/" + map.id + ".json",
                    success: function(results) {
                        topics.add(results);
                        topics.sort(); // this line also results in rendering
                    }
                });
            }
            else {
                topics.render();
            }
        }

        this.edgeSwapper.show(this.topicListContainerView);

        this.plusView.topic();
        //this.plusMod.setTransform(Transform.translate(0,0,2));
        //this.plusMod.setOpacity(1, this.options.transition);

        this.menuBarView.showBackIcon();
        this.currentPage = 'TopicListPage';
    }


    AppView.prototype.showSingleTopic = function(topic) {
        
        this.singleTopicMod.setSize([undefined, undefined]);
        this.singleTopicView.loadTopic(topic);

        var translateTransform = Transform.translate(0,0,2);
        var scaleTransSmall = Transform.scale(0.1, 0.1);
        var scaleTransBig = Transform.scale(1, 1);
        var small = Transform.multiply(scaleTransSmall, translateTransform);
        var big = Transform.multiply(scaleTransBig, translateTransform);
        
        this.singleTopicMod.setTransform(small);
        this.singleTopicMod.setTransform(big, {duration: 200, curve: 'easeIn' });
        this.singleTopicMod.setOpacity(1, { duration: 200 });
        
        this.plusView.synapse();
        this.currentPage = 'TopicPage';
    }
    
    AppView.prototype.hideSingleTopic = function(topic) {

        var sizeTrans = Transform.scale(0.6, 0.6);
        this.singleTopicMod.setTransform(sizeTrans, {duration: 200, curve: 'easeIn' })
        this.singleTopicMod.setOpacity(0, { duration: 200 }, function() {
            this.singleTopicMod.setTransform(Transform.translate(0,0,-2));
            this.singleTopicMod.setSize([0, 0]);
        }.bind(this));

        this.plusView.topic();
        this.currentPage = 'TopicListPage';
    }

    AppView.prototype.slideCreateUp = function(callback) {
        // show the plus icon again
        this.plusMod.setOpacity(1);
        this.plusMod.setTransform(Transform.translate(0, 0, 2));

        // set the title back to what it was
        this.menuBarView.titleSurf.setContent(this.storeTitle);

        this.edgeSwapperMod.setTransform(Transform.translate(0, 56, 0), this.options.transition, callback);
        this.createMod.setOpacity(0, this.options.transition);
    }

    AppView.prototype.slideCreateMapDown = function() {

    }

    AppView.prototype.slideCreateTopicDown = function() {
        this.createMod.setOpacity(1);
        this.edgeSwapperMod.setTransform(Transform.translate(0, this.options.height, 0), this.options.transition);
        this.plusMod.setOpacity(0);
        this.plusMod.setTransform(Transform.translate(0, 0, - 2));

        this.menuBarView.showXIcon();

        this.createView.animate();
        this.storeTitle = this.menuBarView.titleSurf.getContent();
        this.menuBarView.titleSurf.setContent('Add New Topic');
    }

    AppView.prototype.slideCreateSynapseDown = function() {

    }


    AppView.prototype.addTopic = function() {
        var self = this;

        var newTopic = {};
        var metacode = this.metacodes.findWhere({
            name: this.createView.selectedMetacode
        }); // e.g. "Idea"

        newTopic.name = this.createView.inputValue;
        newTopic.metacode_id = metacode.get('id');

        var topic = new this.Topic(newTopic);

        topic.save(null, {
            success: function(model) {

                var mapping = new self.Mapping({
                    map_id: self.activeMap.id,
                    topic_id: model.id
                });
                mapping.save();

                // upload the image file, and the audio file, if present
                if (self.createView.imageInput._currTarget.files[0]) {
                    self.createView.uploadFile(self.createView.imageInput._currTarget.files[0], model.id, 'image');
                }
                if (self.createView.audioFile) {
                    self.createView.uploadFile(self.createView.audioFile, model.id, 'audio');
                }
                self.createView.reset();
            }
        });

        var activeMapTopics = this.activeMap.get('topics');
        // this line adds it to the backbone topic collection
        activeMapTopics.add(topic);
        activeMapTopics.sort();

        this.slideCreateUp.call(this, function() {
            this.showSingleTopic(topic);
        }.bind(this));
    }

    module.exports = AppView;
});