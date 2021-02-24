const { parseArgsStringToArgv } = require('string-argv');

const { TERMINATOR } = require('../domain/constants');

const bufferToString = (bufferRequest) => bufferRequest.toString('utf-8');

const removeNewLine = (stringRequest) => stringRequest.split(TERMINATOR)[0];

const parse = (bufferRequest) => {
  let stringRequest = bufferToString(bufferRequest);
  stringRequest = removeNewLine(stringRequest);
  let parsedRequest = [''];
  // parseArgsStringToArgv transforms stringRequest to array like ["command","arg1",...,"argN"]
  if (stringRequest.length !== 0) parsedRequest = parseArgsStringToArgv(stringRequest);
  return parsedRequest;
};

module.exports = { parse };
