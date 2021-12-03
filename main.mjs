import core from '@actions/core';
import nodemailer from 'nodemailer';
import replacePlaceholder from './replacePlaceholder.mjs';

const service = core.getInput('service', { required: true });
const user = core.getInput('user', { required: true });
const pass = core.getInput('pass', { required: true });
const individual = core.getBooleanInput('individual', {
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

const receiptsArray = (core.getInput('to', { required: true }) || '')
  .split(',')
  .map((item) => item.trim())
  .filter((item) => !!item);

const data = {
  from: core.getInput('from', { required: false }) || user,
  cc: core.getInput('cc', { required: false }),
  bcc: core.getInput('bcc', { required: false }),
  subject: core.getInput('subject', { required: true }),
  text: core.getInput('text', { required: false }),
  html: core.getInput('html', { required: false }),
  priority: core.getInput('priority', { required: false }),
  replyTo: core.getInput('replyTo', { required: false }),
};

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
    mailData.subject = replacePlaceholder(receipt, data.subject);
    mailData.text =
      typeof data.text === 'string'
        ? replacePlaceholder(receipt, data.text)
        : data.text;
    mailData.html =
      typeof data.html === 'string'
        ? replacePlaceholder(receipt, data.html)
        : data.html;
  }

  transport.sendMail(mailData, (error) => {
    if (error) {
      core.error(error);
    }
  });
};

if (individual) {
  receiptsArray.forEach((receipt) => sendMail(receipt, true));
} else {
  sendMail(receiptsArray, false);
}
