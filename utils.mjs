const replaceNameWithNameFromEmail = (address, string) => {
  let name = '';

  if (typeof address === 'string') {
    const split = address.split('<').map((item) => item.trim());
    name = split.length == 1 ? '' : split[0];
  } else if (typeof address === 'object' && address.name) {
    name = address.name;
  }

  return string.replaceAll('%name%', name);
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

export { replaceNameWithNameFromEmail, normalizeAdresses