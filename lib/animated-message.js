/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2017
 * @license GPL-3.0
 */

const Util = require('./util');

const MAX_REPEAT_SECONDS = 20;
const MAX_REPEAT_LOOPS = 50;

class AnimatedMessage {

    /**
     * @param {Channel} channel
     * @param {string[]} frames          List of strings over which the bot will be iterating.
     * @param {number} repeatFor         Numbers of loops (seconds) to repeat the animation for.
     * @param {boolean} treatAsSeconds   If true, `repeatFor` is interpreted as seconds, otherwise as loops.
     * @param {int} startFrame
     */
    constructor(channel, frames, repeatFor = 5, treatAsSeconds = false, startFrame = 0) {
        this.channel = channel;
        this.frames = frames;
        this.frameCount = this.frames.length;
        this.startFrame = startFrame;
        this.currentFrame = this.startFrame;
        this.finished = false;

        if (treatAsSeconds) {
            this.repeatSeconds = repeatFor;
        } else {
            this.repeatLoops = repeatFor;
            this.completedLoops = 0;
        }
    }

    /**
     * Sends the initial message to the channel.
     * @returns {Promise}
     */
    send() {
        this.startTime = new Date();
        return Promise.resolve()
            .then(() => this.channel.send(this.getCurrentFrame()))
            .then(message => {
                this.incrementFrameIndex();
                this.message = message;
            });
    }

    /**
     * Plays the current frame and increments the frame index. Returns a Promise resolving to boolean determining
     * whether the animation has finished.
     * @returns {Promise.<boolean>}
     */
    playNextFrame() {
        return Promise.resolve()
            .then(() => this.message.edit(this.getCurrentFrame()))
            .then(() => {
                this.incrementFrameIndex();

                if (this.finished) return true;
                else return this.finished = this.animationFinished();
            });
    }

    /**
     * @returns {string}
     */
    getCurrentFrame() {
        return this.frames[this.currentFrame];
    }

    incrementFrameIndex() {
        this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        if (this.currentFrame === this.startFrame) this.completedLoops++;
    }

    /**
     * Determines whether the animation has finished
     * @returns {boolean}
     */
    animationFinished() {
        let secondsPassed = Util.secondsSince(this.startTime);
        if (this.completedLoops > MAX_REPEAT_LOOPS || secondsPassed > MAX_REPEAT_SECONDS)
            return true;

        if (this.repeatSeconds) {
            return secondsPassed >= this.repeatSeconds;
        } else {
            return this.completedLoops >= this.repeatLoops;
        }
    }

}

module.exports = AnimatedMessage;
