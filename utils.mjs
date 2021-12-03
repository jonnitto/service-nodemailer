const replaceItems = ({ string, name, email }) => {
  if (!name) name = '';
  if (!email) email = '';

  return string
    .replaceAll('%name%', name.trim())
    .replaceAll('%email%', email.trim());
};

const replacePlaceholder = (recipient, string) => {
  if (typeof recipient === 'string') {
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
  }

  const name = recipient?.name || '';
  const email = recipient?.address || '';
  return replaceItems({ string, name, email });
};

const normalizeAdresses = (addresses) => {
  if (Array.isArray(addresses)) {
    return addresses;
  }

  if (typeof addresses === 'string') {
    return addresses
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item);
  }

  return [addresses];
};

export { replacePlaceholder, normalizeAdresses };
