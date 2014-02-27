# NetpocketOS

A small program designed for Raspberry Pi that exposes device features
to peers over websockets.

Firewalls and difficult network configurations become irrelevant
by utilizing an [intermediate
relay](https://github.com/netpocket/ncc-relay) in communication with other devices.

## Requirements

* [Raspbian](http://www.raspbian.org/)
* [Node.js for Raspbian](https://gist.github.com/adammw/3245130)

## Install

```bash
# Assuming your base is rasbian-ua-netinst

# Install Nodejs
https://gist.github.com/raw/3245130/v0.10.24/node-v0.10.24-linux-arm-armv6j-vfp-hard.tar.gz

git clone git@bitbucket.com:netpocket/netpocketos
```

## Usage

To get logging output, set `NODE_ENV=development`

```bash
NODE_ENV=development NOS_TOKEN=1 RELAY_SERVER=http://ncc-relay.herokuapp.com node server.js
```

