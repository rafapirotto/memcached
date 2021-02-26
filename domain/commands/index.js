const Get = require('./retrievall/Get');
const Gets = require('./retrievall/Gets');
const Set = require('./storagee/Set');
const Add = require('./storagee/Add');
const Replace = require('./storagee/Replace');
const DataBlock = require('./dataBlockk/DataBlock');
const Append = require('./storagee/Append');
const Prepend = require('./storagee/Prepend');
const Cas = require('./storagee/Cas');

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
