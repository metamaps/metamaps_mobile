define(function(require, exports, module) {
    require("recorder/Recorder");
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    var audioContext    = new AudioContext(),
        audioInput      = null,
        realAudioInput  = null,
        inputPoint      = null,
        core            = Recorder,
        rafID           = null;

    var saveAudio = function(buffers, done) {
        // the ONLY time gotBuffers is called is right after a new recording is completed - 
        // so here's where we should set up the download.
        core.exportWAV(done);
    };

    var start = function() {
        if (!core) return;
        console.log(core);
        core.clear();
        core.record();
    };
    
    var stop = function(done) {
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

    var gotStream = function(stream) {
        inputPoint = audioContext.createGain();

        // Create an AudioNode from the stream.
        realAudioInput = audioContext.createMediaStreamSource(stream);
        audioInput = realAudioInput;
        audioInput.connect(inputPoint);

    //    audioInput = convertToMono( input );

        var analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        inputPoint.connect( analyserNode );

        core = new Recorder(inputPoint, {
            workerPath: "/develop/app/lib/recorder/recorderWorker.js"
        });

        var zeroGain = audioContext.createGain();
        zeroGain.gain.value = 0.0;
        inputPoint.connect( zeroGain );
        zeroGain.connect( audioContext.destination );
    };

    var initAudio = function() {
            if (!navigator.getUserMedia)
                navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if (!navigator.cancelAnimationFrame)
                navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
            if (!navigator.requestAnimationFrame)
                navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

        navigator.getUserMedia({audio:true}, gotStream, function(e) {
                alert('Error getting audio');
                console.log(e);
            });
    };

    initAudio();

    module.exports = {
        start: start,
        stop: stop
    };
});