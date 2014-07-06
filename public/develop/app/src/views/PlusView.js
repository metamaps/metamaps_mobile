define(function(require, exports, module) {
	var View = require('famous/core/View');
	var Surface = require('famous/core/Surface');
	var Modifier = require('famous/core/Modifier');
	var Transform = require('famous/core/Transform');
	var Draggable = require('famous/modifiers/Draggable');

	var PlusView = function() {
		View.apply(this, arguments);

		_createPlus.call(this);
		_setListeners.call(this);

		this.createViewSelected = false;
	};

	PlusView.prototype = Object.create(View.prototype);
	PlusView.prototype.constructor = PlusView;

	PlusView.DEFAULT_OPTIONS = {};

	function _createPlus() {

		this.state = "Map";

		this.addMapContent = '<img height="56" width="56" src="content/images/MetamapsAddMap.png"/>';
		this.addTopicContent = '<img height="56" width="56" src="content/images/MetamapsAddTopic.png"/>';
		this.addSynapseContent = '<img height="56" width="56" src="content/images/MetamapsAddSynapse.png"/>';

		this.plusSurf = new Surface({
			size: [56, 56],
			content: this.addMapContent,
			properties: {
				boxShadow: 'rgba(0, 0, 0, 0.75) 1px 1px 5px',
				borderRadius: '28px'
			}
		});

		var draggable = new Draggable();
		this.plusSurf.pipe(draggable);
		this._add(draggable).add(this.plusSurf);
	};

	function _setListeners() {
		this.plusSurf.on('click', function() {
			this._eventOutput.emit('openCreate' + this.state);
		}.bind(this));
	}

	PlusView.prototype.map = function() {
		this.state = "Map";
		this.plusSurf.setContent(this.addMapContent);
	}

	PlusView.prototype.topic = function() {
		this.state = "Topic";
		this.plusSurf.setContent(this.addTopicContent);
	}

	PlusView.prototype.synapse = function() {
		this.state = "Synapse";
		this.plusSurf.setContent(this.addSynapseContent);
	}

	module.exports = PlusView;

});