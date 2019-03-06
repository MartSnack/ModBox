// drums are represented as a wave 
// for random drumwaves:
//      drumbuffer & 1 is a bitwise check of the first bit, an odd/even check
var utils = requires('./utils.js');

function white() {
    var wave = new Float32Array(32768);
    // white noise is literally random

    for (var i = 0; i < 32768; i++) {
        // Math.random() * 2 - 1.0 produces a uniform distrubution 
        // around 0, from -1 to 1.  Classic white noise.
        wave[i] = Math.random() * 2.0 - 1.0;
    }
    return wave;
}

function retro() {
    var wave = new Float32Array(32768);
    // apparently a linear feedback shift register
    // generates a "random" pattern of 0s and 1s (it will cycle once)
    // similar to white noise but oscillates from -1 to 1 discretely instead of continuously
    var drumBuffer = 1;
    for (var i = 0; i < 32768; i++) {
        wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
        var newBuffer = drumBuffer >> 1;
        if (((drumBuffer + newBuffer) & 1) == 1) {
            newBuffer += 1 << 14;
        }
        drumBuffer = newBuffer;
    }
    return wave;

}

function periodic() {
    var wave = new Float32Array(32768);
    // looks like another random oscillation between -1 and 1
    // with -1 being favored
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

function detunedPeriodic() {
    var wave = new Float32Array(32768);
    // same as before but newbuffer is double the size. 
    var drumBuffer = 1;
    for (var i = 0; i < 32767; i++) {
        wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
        var newBuffer = drumBuffer >> 2;
        if (((drumBuffer + newBuffer) & 1) == 1) {
            newBuffer += 4 << 14;
        }
        drumBuffer = newBuffer;
    }
    return wave;
}

function shine() {
    // same as "buzz" in beepbox
    // the buffer only gets updated by 40, so the pattern
    // will repeat every 40 samples
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
function hollow() {
    wave = new Float32Array(32768);
    // the hollow wave is designed in frequency space (noise spectrum) and then
    // converted to a time series with inverse RFT.  How that works is complicated.
    // The waveform is than scaled by a factor of the wavelength, probably to normalize the
    // frequencies?  
    utils.drawNoiseSpectrum(wave, 10, 11, 1, 1, 0);
    utils.drawNoiseSpectrum(wave, 11, 14, -2, -2, 0);
    utils.inverseRealFourierTransform(wave);
    utils.scaleElementsByFactor(wave, 1.0 / Math.sqrt(wave.length));
}