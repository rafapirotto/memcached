const { parseArgsStringToArgv } = require('string-argv');

const { TERMINATOR } = require('../domain/constants');

const bufferToString = (bufferRequest) => bufferRequest.toString('utf-8');

const removeNewLine = (stringRequest) => stringRequest.split(TERMINATOR)[0];

const parse = (bufferRequest) => {
  let stringRequest = bufferToString(bufferRequest);
  stringRequest = removeNewLine(stringRequest);
  // stringRequest gets transformed to array like ["command","arg1",...,"argN"]
  const parsedRequest = parseArgsStringToArgv(stringRequest);
  return parsedRequest;
};
module.exports = { parse };
