/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2017
 * @license GPL-3.0
 */

class Util {

    static log(/* ... */) {
        let now = new Date();
        let options = {
            hour12: false,
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        let timeString = now.toLocaleString('en-us', options);
        let args = [].slice.call(arguments);
        console.log.apply(null, [`[${timeString}]`].concat(args));
    }

    /**
     * Returns the amount of seconds passed since the specified date.
     * @param {Date} date
     * @return {number}
     */
    static secondsSince(date) {
        return (new Date().getTime() - date.getTime()) / 1000.0;
    }

    /**
     * Checks if the provided array contains the supplied element.
     * @param {string[]} array
     * @param {string} elem
     * @returns {boolean}
     */
    static contains(array, elem) {
        return array.indexOf(elem) !== -1;
    }

}

module.exports = Util;
