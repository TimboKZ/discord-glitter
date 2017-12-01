/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2017
 * @license GPL-3.0
 */

const Promise = require('bluebird');
const Discord = require('discord.js');
const Deque = require('double-ended-queue');
const Util = require('./util');
const FrameGenerator = require('./frame-generator');
const AnimatedMessage = require('./animated-message');

const DEFAULT_OPTIONS = {
    prefix: '!g',
};

class Glitter {

    /**
     * @param {GlitterOptions} options
     */
    constructor(options) {
        this.options = Object.assign(DEFAULT_OPTIONS, options || {});
        this.messageQueue = new Deque();
        this.bot = new Discord.Client();
        this.bot.on('message', message => {
            Promise.resolve()
                .then(() => this.messageHandler(message))
                .catch(Util.log);
        });
    }

    /**
     * @param {Message} message
     * @return {Promise}
     */
    messageHandler(message) {
        if (!message.content
            || !message.content.startsWith(this.options.prefix)
            || message.author.id === message.client.user.id
            || (message.content.length > 2 &&
                !Util.contains(['|', ' '], message.content.charAt(this.options.prefix.length))))
            return Promise.resolve();

        let string = message.content.substr(this.options.prefix.length);
        return Promise.resolve()
            .then(() => this.prepareAnimatedMessage(message, string))
            .then(animatedMessage => this.messageQueue.unshift(animatedMessage))
            .catch(error => Util.reportAndRethrow(message, error));
    }

    /**
     * @param {Message} triggerMessage
     * @param {string} string
     * @return {Promise.<AnimatedMessage>}
     */
    prepareAnimatedMessage(triggerMessage, string) {
        let animatedMessage;
        return Promise.resolve()
            .then(() => {
                let frames;
                if (string.length > 2 && string.startsWith('|')) {
                    let parts = string.split(' ', 2);
                    string = parts.length === 2 ? parts[1] : 'Discord Glitter';
                    frames = FrameGenerator.generateFrames(string.trim(), parts[0].substr(1));
                } else {
                    string = string ? string : 'Discord Glitter';
                    frames = FrameGenerator.generateFrames(string.trim());
                }
                animatedMessage = new AnimatedMessage(triggerMessage.channel, frames, 5);
                return animatedMessage.send();
            })
            .then(() => animatedMessage);
    }

    animationTick() {
        let animatedMessage = this.messageQueue.pop();
        if (!animatedMessage) {
            // TODO: Instead of just returning, notify the scheduler so that the next frame can be played immediately
            // TODO: (since we did not use up the request).
            return;
        }

        Promise.resolve()
            .then(() => animatedMessage.playNextFrame())
            .then(finished => finished ? null : this.messageQueue.unshift(animatedMessage))
            .catch(Util.log);
    }


    start() {
        setInterval(this.animationTick.bind(this), 1000);

        Promise.resolve()
            .then(() => Util.log('Glitter is connecting to Discord...'))
            .then(() => this.bot.login(this.options.token))
            .then(() => Util.log('Connected!'))
            .catch(Util.log);
    }

}

module.exports = Glitter;
