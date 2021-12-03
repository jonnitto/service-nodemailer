const replaceItems = ({ string, name, email }) => {
  if (!name) name = '';
  if (!email) email = '';

  return string
    .replaceAll('%name%', name.trim())
    .replaceAll('%email%', email.trim());
};

const replacePlaceholder = (recipient, string) => {
  const split = recipient.split('<').map((item) => item.trim());

  // Only the email address is given
  if (split.length === 1) {
    return replaceItems({ string, email: split[0] });
  }

  return replaceItems({
    string,
    name: split[0],
    email: split[1].replace('>', ''),
  });
};

export default replacePlaceholder;
