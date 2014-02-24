# NetpocketOS

A small program designed for Raspberry Pi that exposes device features
to peers over websockets.

Firewalls and difficult network configurations become irrelevant
by utilizing an [intermediate
relay](https://github.com/netpocket/ncc-relay) in communication with other devices.

## Requirements

### Raspberry Pi

* [Raspbian](http://www.raspbian.org/)
* [Node.js for Raspbian](https://gist.github.com/adammw/3245130)

## Usage

### Raspbian

```bash
sudo apt-get install git
git clone git@github.com:netpocket/netpocketos
cd netpocketos
node server.js
```

