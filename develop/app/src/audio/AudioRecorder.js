define(function(require, exports, module) {
    var Recorder = require("./../../lib/recorder/Recorder.js");
    
    var audioContext        = null,
            audioInput      = null,
            realAudioInput  = null,
            inputPoint      = null,
            core            = Recorder,
            rafID           = null,
            stream          = null;
            
    var initAudio = function() {
        
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        
        audioContext = new AudioContext();
        
        inputPoint = audioContext.createGain();
        
        core = new Recorder(inputPoint, {
            workerPath: "/lib/recorder/recorderWorker.js"
        });
    };
    
    var saveAudio = function(buffers, done) {
        // the ONLY time gotBuffers is called is right after a new recording is completed - 
        // so here's where we should set up the download.
        core.exportWAV(done);
    };

    var start = function() {
        
        if (navigator.getUserMedia) {
            navigator.getUserMedia({audio:true}, gotStream, function(e) {
                alert('Error getting audio');
                console.log(e);
            });
        }
        
        if (audioContext === null) initAudio();
        
        core.clear();
        core.record();
    };
    
    var stop = function(done) {
        stream.stop();
        core.stop();
        core.getBuffer(function(buff) {
            saveAudio(buff, done);
        });
    };

    var convertToMono = function(input) {
        var splitter = audioContext.createChannelSplitter(2);
        var merger = audioContext.createChannelMerger(2);

        input.connect( splitter );
        splitter.connect( merger, 0, 0 );
        splitter.connect( merger, 0, 1 );
        return merger;
    };

    var toggleMono = function() {
        if (audioInput != realAudioInput) {
            audioInput.disconnect();
            realAudioInput.disconnect();
            audioInput = realAudioInput;
        } else {
            realAudioInput.disconnect();
            audioInput = convertToMono( realAudioInput );
        }

        audioInput.connect(inputPoint);
    };

    var gotStream = function(str) {
        
        stream = str;
        
        // Create an AudioNode from the stream.
        realAudioInput = audioContext.createMediaStreamSource(str);
        audioInput = realAudioInput;
        audioInput.connect(inputPoint);

        //    audioInput = convertToMono( input );
        var analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        inputPoint.connect( analyserNode );

        var zeroGain = audioContext.createGain();
        zeroGain.gain.value = 0.0;
        inputPoint.connect( zeroGain );
        zeroGain.connect( audioContext.destination );
    };
    
    module.exports = {
        start: start,
        stop: stop
    };
});
