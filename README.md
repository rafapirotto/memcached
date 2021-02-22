![Build status](https://github.com/rafapirotto/memcached/actions/workflows/node.js.yml/badge.svg)


# memcached server

Memcached is an open source, high-performance, distributed memory object caching system. For more information check out the official memcached [github repository](https://github.com/memcached/memcached).

## Instructions
### Run server

**The server runs in the 1337 port by default**

* Download [zip file](https://github.com/rafapirotto/memcached/archive/master.zip)

* Unzip

* Open terminal

* Go to project location

* Run the following commands:

      npm install
      node index.js

### Run client

* Open terminal

* Run the following command:

      telnet localhost 1337
    
### Run tests

* Open terminal
* Go to project location
* Run the following command:

      npm test

## Supported commands
### Storage

* set
* add
* replace
* append
* prepend
* cas
### Retrieval

* get
* gets

## Usage

#### Storage

The sytntax goes like this:

`<command> <key> <flags> <exptime> <bytes> [noreply]\r\n`

where:

* `<command>` is one of the following: `set`, `add`, `replace`, `append` or `prepend`.

* `<key>` is a string that will uniquely identify the element.

* `<flags>` is a 32-bit integer that will be stored alongside the value.

* `<exptime>` is the expiration time in seconds.

* `<bytes>` is the length of the data sent in bytes.

* `[noreply]` is an optional string that removes the reply from the server

Note: the cas command is equal to the previous but with an extra parameter `<unique_cas_key>` which is a unique 64-bit integer
After the previous has been sent, the server will be expecting data in the following fashion:

`<data>\r\n`

where data must have a length of `<bytes>`.

The server can respond with:

* `STORED\r\n` in case of success.

and one of the following in case of failure:

* `NOT_STORED\r\n`

* `NOT_FOUND\r\n`

* `ERROR\r\n`

* `CLIENT_ERROR bad data chunk\r\nERROR\r\n`

* `CLIENT_ERROR bad command line format\r\n`

### Examples

#### Set

    set key 0 1200 2 noreply
    23
    STORED

#### Add

    add key 0 1200 2
    23
    STORED

#### Replace

    replace key 0 30 3 noreply
    333
    STORED

#### Append

    append key 0 1200 5
    hello
    NOT_STORED   

#### Prepend

    prepend key 0 1200 11 noreply
    helloworld!
    NOT_STORED 

#### Cas

    cas key 0 1200 9 1 noreply
    memcached
    STORED        

#### Retrieval

For the retrieval commands the sytntax is shorter:

`<command> <key_1> <key2> <key_3>...<key_n>\r\n`

where:

* `<command>` is one of the following: `get` or `gets`.

* `<key_x>` is a string that will uniquely identify the element.

The server can respond with:

* `VALUE <key> <flags> <bytes>\r\n<value>\r\nEND\r\n` in case the key in the get commands exist.

and the following in case of a successful gets request:

* `VALUE <key> <flags> <bytes> <cas>\r\n<value>\r\nEND\r\n` in case the key in the gets commands exist.

or in case the keys doesn't exist:

* `END\r\n`

and one of the following in case of failure:

* `ERROR\r\n`

* `CLIENT_ERROR bad data chunk\r\nERROR\r\n`