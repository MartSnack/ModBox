class SampledDrum {
    // A sampled drum generates random 
    constructor(name, shiftBit, cycleBit, period, amplitude, offset){
        this.name = name;
        this.samples = 32768
        this.shiftBit = shiftBit;
        this.cycleBit = cycleBit;
        this.period = period;
        this.amplitude = amplitude;
        this.offset = offset;

    }

    createWave(){ 
        // linear feedback shift register
        // generates a "random" pattern of 0s and 1s
        // similar to white noise but oscillates from -1 to 1 discretely instead of continuously
        var drumBuffer = 1;
        for (var i = 0; i < this.samples; i++) {
            wave[i] = (drumBuffer & 1) * amplitude + offset;
            var newBuffer = drumBuffer >> shiftBit;
            if (((drumBuffer + newBuffer) & 1) == 1) {
                newBuffer += cycleBit << period;
            }
            drumBuffer = newBuffer;
        }
        return wave;
    }

}