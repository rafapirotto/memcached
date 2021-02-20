class DummySocket {
  write(text) {
    this.text = text;
  }
}

module.exports = DummySocket;
