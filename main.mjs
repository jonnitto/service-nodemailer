import core from '@actions/core';
import nodemailer from 'nodemailer';
import { replaceNameWithNameFromEmail, normalizeAdresses } from './utils.mjs';

const service = core.getInput('service', { required: true });
const user = core.getInput('user', { required: true });
const pass = core.getInput('pass', { required: true });
const sendMultipleEmails = core.getBooleanInput('sendMultipleEmails', {
  required: false,
});
core.setSecret('pass');

const options = {
  service,
  auth: {
    user,
    pass,
  },
};

const data = {
  from: core.getInput('from', { required: false }) || user,
  to: normalizeAdresses(core.getInput('to', { required: true })),
  cc: core.getInput('cc', { required: false }),
  bcc: core.getInput('bcc', { required: false }),
  subject: core.getInput('subject', { required: true }),
  text: core.getInput('text', { required: false }),
  html: core.getInput('html', { required: false }),
};

core.saveState('serviceNodeMailer', {
  ...options,
  ...data,
  sendMultipleEmails,
});

const prefix = 'file://';
if (data.text.startsWith(prefix)) {
  data.text = {
    path: data.text.replace(prefix, ''),
  };
}
if (data.html.startsWith(prefix)) {
  data.html = {
    path: data.html.replace(prefix, ''),
  };
}

const transport = nodemailer.createTransport(options);
const sendMail = (receipt, replaceName) => {
  const mailData = { ...data };
  mailData.to = receipt;

  if (replaceName) {
    mailData.subject = replaceNameWithNameFromEmail(receipt, data.subject);
    mailData.text =
      typeof data.text === 'string'
        ? replaceNameWithNameFromEmail(receipt, data.text)
        : data.text;
    mailData.html =
      typeof data.html === 'string'
        ? replaceNameWithNameFromEmail(receipt, data.html)
        : data.html;
  }

  transport.sendMail(mailData, (error) => {
    if (error) {
      core.error(error);
    }
  });
};

if (sendMultipleEmails) {
  data.to.forEach((receipt) => sendMail(receipt, true));
} else {
  sendMail(data.to, false);
}
