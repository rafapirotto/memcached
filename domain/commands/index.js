const Get = require('./retrieval/Get');
const Gets = require('./retrieval/Gets');
const Set = require('./storage/Set');
const Add = require('./storage/Add');
const Replace = require('./storage/Replace');
const DataBlock = require('./dataBlock/DataBlock');
const Append = require('./storage/Append');
const Prepend = require('./storage/Prepend');
const Cas = require('./storage/Cas');

module.exports = {
  Get,
  Gets,
  Set,
  DataBlock,
  Add,
  Replace,
  Append,
  Prepend,
  Cas,
};
