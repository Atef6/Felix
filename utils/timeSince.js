const moment = require('moment');

function timeSince(date) {
    return moment(date).fromNow();
}

module.exports = timeSince;