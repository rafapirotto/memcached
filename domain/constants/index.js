const TERMINATOR = '\r\n';
const COMMANDS = {
  get: 'get',
  gets: 'gets',
  set: 'set',
  add: 'add',
  replace: 'replace',
  append: 'append',
  prepend: 'prepend',
  cas: 'cas',
};

module.exports = {
  TERMINATOR,
  COMMANDS,
};
