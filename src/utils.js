function inverseRealFourierTransform(array) {
    // inverse fourier transform, go from frequency -> time
    // lots of math I don't remember from signals and systems lul
    var fullArrayLength = array.length;
    var totalPasses = countBits(fullArrayLength);
    if (fullArrayLength < 4)
        throw new Error("FFT array length must be at least 4.");
    for (var pass = totalPasses - 1; pass >= 2; pass--) {
        var subStride = 1 << pass;
        var midSubStride = subStride >> 1;
        var stride = subStride << 1;
        var radiansIncrement = Math.PI * 2.0 / stride;
        var cosIncrement = Math.cos(radiansIncrement);
        var sinIncrement = Math.sin(radiansIncrement);
        var oscillatorMultiplier = 2.0 * cosIncrement;
        for (var startIndex = 0; startIndex < fullArrayLength; startIndex += stride) {
            var startIndexA = startIndex;
            var midIndexA = startIndexA + midSubStride;
            var startIndexB = startIndexA + subStride;
            var midIndexB = startIndexB + midSubStride;
            var stopIndex = startIndexB + subStride;
            var realStartA = array[startIndexA];
            var imagStartB = array[startIndexB];
            array[startIndexA] = realStartA + imagStartB;
            array[midIndexA] *= 2;
            array[startIndexB] = realStartA - imagStartB;
            array[midIndexB] *= 2;
            var c = cosIncrement;
            var s = -sinIncrement;
            var cPrev = 1.0;
            var sPrev = 0.0;
            for (var index = 1; index < midSubStride; index++) {
                var indexA0 = startIndexA + index;
                var indexA1 = startIndexB - index;
                var indexB0 = startIndexB + index;
                var indexB1 = stopIndex - index;
                var real0 = array[indexA0];
                var real1 = array[indexA1];
                var imag0 = array[indexB0];
                var imag1 = array[indexB1];
                var tempA = real0 - real1;
                var tempB = imag0 + imag1;
                array[indexA0] = real0 + real1;
                array[indexA1] = imag1 - imag0;
                array[indexB0] = tempA * c - tempB * s;
                array[indexB1] = tempB * c + tempA * s;
                var cTemp = oscillatorMultiplier * c - cPrev;
                var sTemp = oscillatorMultiplier * s - sPrev;
                cPrev = c;
                sPrev = s;
                c = cTemp;
                s = sTemp;
            }
        }
    }
    for (var index = 0; index < fullArrayLength; index += 4) {
        var index1 = index + 1;
        var index2 = index + 2;
        var index3 = index + 3;
        var real0 = array[index];
        var real1 = array[index1] * 2;
        var imag2 = array[index2];
        var imag3 = array[index3] * 2;
        var tempA = real0 + imag2;
        var tempB = real0 - imag2;
        array[index] = tempA + real1;
        array[index1] = tempA - real1;
        array[index2] = tempB + imag3;
        array[index3] = tempB - imag3;
    }

    reverseIndexBits(array);
}

function countBits(n) {
    if (!isPowerOf2(n))
        throw new Error("FFT array length must be a power of 2.");
    return Math.round(Math.log(n) / Math.log(2));
}
function reverseIndexBits(array) {
    // this ones a bit tricky and updates the array in place (gross)
    // honestly I have no idea what it's doing.  Supposedly reversing an array of 
    // bits for the FFT transform, probably in frequency space so it's difficult to
    // tell what it's doing exactly with those hex numbers.
    var fullArrayLength = array.length;
    var bitCount = countBits(fullArrayLength);
    if (bitCount > 16)
        throw new Error("FFT array length must not be greater than 2^16.");
    var finalShift = 16 - bitCount;
    for (var i = 0; i < fullArrayLength; i++) {
        var j = void 0;
        j = ((i & 0xaaaa) >> 1) | ((i & 0x5555) << 1);
        j = ((j & 0xcccc) >> 2) | ((j & 0x3333) << 2);
        j = ((j & 0xf0f0) >> 4) | ((j & 0x0f0f) << 4);
        j = ((j >> 8) | ((j & 0xff) << 8)) >> finalShift;
        // this is interesting because its swapping position
        // i and j in the array but while i iterates, j seems dependent
        // on i.  
        if (j > i) {
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}

function scaleElementsByFactor(array, factor) {
    // pretty self explanatory, iterate through the array
    // and multiply by /factor/
    for (var i = 0; i < array.length; i++) {
        array[i] *= factor;
    }
}

function isPowerOf2(n) {
    //  a power of 2 (n) minus 1 will be all 1's.  For examples:
    //  8 (1000) - 1 (0001) = 7 (0111)
    //  n & (n - 1) 
    //  if its a power of 2, n & n-1 will be:
    //   1000...000000
    // & 0111...111111
    //  ---------------
    //   0000...000000
    // so !(n & (n-1)) is only true when n is a power of 2
    // but what if n is 0?  That's what !!n guards against.  
    return !!n && !(n & (n - 1));
}

function drawNoiseSpectrum(wave, lowOctave, highOctave, lowPower, highPower, overalSlope) {
    var referenceOctave = 11;
    var referenceIndex = 1 << referenceOctave;
    var lowIndex = Math.pow(2, lowOctave) | 0;
    var highIndex = Math.pow(2, highOctave) | 0;
    var log2 = Math.log(2);
    for (var i = lowIndex; i < highIndex; i++) {
        var amplitude = Math.pow(2, lowPower + (highPower - lowPower) * (Math.log(i) / log2 - lowOctave) / (highOctave - lowOctave));
        amplitude *= Math.pow(i / referenceIndex, overalSlope);
        var radians = Math.random() * Math.PI * 2.0;
        wave[i] = Math.cos(radians) * amplitude;
        wave[32768 - i] = Math.sin(radians) * amplitude;
    }
}

module.exports = {
    isPowerOf2,
    scaleElementsByFactor,
    countBits,
    inverseRealFourierTransform,
    reverseIndexBits,
    drawNoiseSpectrum
}