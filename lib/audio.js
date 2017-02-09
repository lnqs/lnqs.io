/* jshint browserify: true */
'use strict';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

module.exports = {
  play: function () {
    function makeDistortionCurve() {
      var k = 400;
      var curve = new Float32Array(44100);

      for (var i = 0; i < curve.length; i++) {
        var x = i * 2 / curve.length - 1;
        curve[i] = (k + 3) * x * 20 * (Math.PI / 180) / (Math.PI + k * Math.abs(x));
      }

      return curve;
    }

    this.context = new window.AudioContext();

    this.oscillator = this.context.createOscillator();
    this.oscillator.frequency.value = 30;

    this.distortion = this.context.createWaveShaper();
    this.distortion.curve = makeDistortionCurve();
    this.distortion.oversample = '4x';

    this.gain = this.context.createGain();
    this.gain.gain.value = 0.15;

    this.oscillator.connect(this.distortion);
    this.distortion.connect(this.gain);
    this.gain.connect(this.context.destination);

    this.oscillator.start();
  },
  stop: function () {
    this.oscillator.stop();
  }
};
