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
const EMPTY_SPACE = '';
const NO_REPLY = 'noreply';

module.exports = {
  TERMINATOR,
  COMMANDS,
  EMPTY_SPACE,
  NO_REPLY,
};
