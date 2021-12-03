import core from '@actions/core';

const pid = core.getState('serviceNodeMailer');

process.kill(pid);
