export function removeDupWhiteSpaces(str: string) {
  const reg = /(\S+)+/gm;

  const matches = str.match(reg);

  return matches ? matches.join(' ') : '';
}
