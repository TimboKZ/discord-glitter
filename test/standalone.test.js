/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2017
 * @license GPL-3.0
 */

const Glitter = require('../');
const config = require('./config.json');

const glitter = new Glitter({token: config.token});
glitter.start();
