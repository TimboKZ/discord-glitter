/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2017
 * @license GPL-3.0
 */

const AnimationTypes = {
    Scan: 'scan',
    Flash: 'flash',
};

class FrameGenerator {

    /**
     * @param {string} string
     * @param {string} type
     * @returns {string[]}
     */
    static generateFrames(string, type = AnimationTypes.Flash) {
        let frames;
        switch (type) {
            case AnimationTypes.Flash:
                frames = FrameGenerator.prepareFlashFrames(string);
                break;
            case AnimationTypes.Scan:
                frames = FrameGenerator.prepareScanFrames(string);
                break;
            default:
                throw new Error(`Unrecognised animation type: '${type}'`);
        }
        return frames;
    }

    /**
     * @param {string} string
     * @return {string[]}
     */
    static prepareFlashFrames(string) {
        let indicatorStringParts = FrameGenerator.convertToIndicators(string);
        let count = indicatorStringParts.length;
        let frames = new Array(4);
        let phrase = indicatorStringParts.join('');
        frames[0] = ':clap:'.repeat(count);
        frames[1] = phrase;
        frames[2] = ':100:'.repeat(count);
        frames[3] = phrase;
        return frames;
    }

    /**
     * @param {string} string
     * @return {string[]}
     */
    static prepareScanFrames(string) {
        let indicatorStringParts = FrameGenerator.convertToIndicators(string);
        let count = indicatorStringParts.length;
        let frames = new Array(count + 2);
        frames[0] = indicatorStringParts.join('');
        frames[count + 1] = frames[0];
        for (let i = 0; i < count; i++) {
            let indicatorsCopy = indicatorStringParts.slice(0);
            indicatorsCopy[i] = ':rofl:';
            frames[i + 1] = indicatorsCopy.join('');
        }
        return frames;
    }

    /**
     * Converts the supplied string into an array of strings built with Discord regional indicators.
     * @param {string} string
     * @return {string[]}
     */
    static convertToIndicators(string) {
        string = string.replace(/[^a-z ]/gi, '').toLowerCase();
        let indicators = new Array(string.length);
        for (let i = 0; i < string.length; i++) {
            let char = string[i];
            let indicator = ':white_large_square:';
            if (char !== ' ') indicator = `:regional_indicator_${char}:`;
            indicators[i] = indicator;
        }
        return indicators;
    }

}

module.exports = FrameGenerator;
module.exports.AnimationTypes = AnimationTypes;
