const core = require('@actions/core');
const nodemailer = require('nodemailer');

const service = core.getInput('service', { required: true });
const user = core.getInput('user', { required: true });
const pass = core.getInput('pass', { required: true });
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
  to: core.getInput('to', { required: true }),
  subject: core.getInput('subject', { required: true }),
  text: core.getInput('text', { required: false }),
  html: core.getInput('html', { required: false }),
};

core.saveState('serviceNodeMailer', { ...options, ...data });

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
transport.sendMail(data, (err, info) => {
  if (err) {
    core.error('err', err);
  }
  core.notice('Email was sent successfully');
});
