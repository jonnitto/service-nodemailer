const core = require('@actions/core');

const pid = core.getState('serviceNodeMailer');

process.kill(pid);
