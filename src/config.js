// import {ispowerOf2,scaleElementsByFactor,reverseIndexBits,countBits,inverseRealFourierTransform} from './utils.js'
var utils = require('./utils.js');
var SampledDrum = require('./SampledDrum.js');
class Config{
    // the config class for all the configurable variables.
    constructor() {
        // init the base drum waves
        this._drumWaves = [

        ]
    }

    _centerWave(wave) {
        // distributes the wave about 0 by subtracting the average from every point
        var sum = 0.0;
        for (var i = 0; i < wave.length; i++)
            sum += wave[i];
        var average = sum / wave.length;
        for (var i = 0; i < wave.length; i++)
            wave[i] -= average;
        return new Float64Array(wave);
    }

    getDrumWave(index) {
        var wave = Config._drumWaves[index];
        if (wave == null) {
            wave = new Float32Array(32768);
            Config._drumWaves[index] = wave;
            if (index == 0) {
                var drumBuffer = 1;
                for (var i = 0; i < 32768; i++) {
                    wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                    var newBuffer = drumBuffer >> 1;
                    if (((drumBuffer + newBuffer) & 1) == 1) {
                        newBuffer += 1 << 14;
                    }
                    drumBuffer = newBuffer;
                }
            }
            else if (index == 1) {
                for (var i = 0; i < 32768; i++) {
                    wave[i] = Math.random() * 2.0 - 1.0;
                }
            }
            else if (index == 2) {
                var drumBuffer = 1;
                for (var i = 0; i < 32768; i++) {
                    wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                    
                    var newBuffer = drumBuffer >> 1;
                    if (((drumBuffer + newBuffer) & 1) == 1) {
                        newBuffer += 2 << 14;
                    }
                    drumBuffer = newBuffer;
                }
            }
            else if (index == 3) {
                var drumBuffer = 1;
                for (var i = 0; i < 32767; i++) {
                    wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                    var newBuffer = drumBuffer >> 2;
                    if (((drumBuffer + newBuffer) & 1) == 1) {
                        newBuffer += 4 << 14;
                    }
                    drumBuffer = newBuffer;
                }
            }
            else if (index == 4) {
                var drumBuffer = 1;
                for (var i = 0; i < 32768; i++) {
                    wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                    var newBuffer = drumBuffer >> 1;
                    if (((drumBuffer + newBuffer) & 1) == 1) {
                        newBuffer += 10 << 2;
                    }
                    drumBuffer = newBuffer;
                }
            }
            else if (index == 5) {
                utils.drawNoiseSpectrum(wave, 10, 11, 1, 1, 0);
                utils.drawNoiseSpectrum(wave, 11, 14, -2, -2, 0);
                utils.inverseRealFourierTransform(wave);
                utils.scaleElementsByFactor(wave, 1.0 / Math.sqrt(wave.length));
            }
            else if (index == 6) {
                Config.drawNoiseSpectrum(wave, 1, 10, 1, 1, 0);
                Config.drawNoiseSpectrum(wave, 20, 14, -2, -2, 0);
                beepbox.inverseRealFourierTransform(wave);
                beepbox.scaleElementsByFactor(wave, 1.0 / Math.sqrt(wave.length));
            }
            else if (index == 7) {
                var drumBuffer = 1;
                for (var i = 0; i < 32768; i++) {
                    wave[i] = (drumBuffer & 1) * 4.0 * Math.random(1, 15);
                    var newBuffer = drumBuffer >> 1;
                    if (((drumBuffer + newBuffer) & 1) == 1) {
                        newBuffer += 15 << 2;
                    }
                    drumBuffer = newBuffer;
                }
            }
            else if (index == 8) {
                var drumBuffer = 1;
                for (var i = 0; i < 32768; i++) {
                    wave[i] = (drumBuffer & 1) / 2.0 + 0.5;
                    var newBuffer = drumBuffer >> 1;
                    if (((drumBuffer + newBuffer) & 1) == 1) {
                        newBuffer -= 10 << 2;
                    }
                    drumBuffer = newBuffer;
                }
            }
            else {
                throw new Error("Unrecognized drum index: " + index);
            }
        }
        return wave;
    }
}
// var config = new Config();
// config.getDrumWave(1);
console.log(utils);