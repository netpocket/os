# Netpocket OS

A thin layer that sits atop Raspbian.
It turns your raspberry pi into a Netpocket device :)

## Components

* keepalive: ensures connectivity to the ncc-relay
* modulectl: module control interface API and on/off toggle
* bootctl: control which modules start on boot
* rulectl: module-specific rules api

## Requirements

* [Raspbian](http://www.raspbian.org/)
* [ARM-compiled Node.js for hard-float](https://gist.github.com/adammw/3245130)

## Install

### From Official Repository

Not yet implemented

### From Source Code

`script/install --relay RELAY_SERVER:PORT`

## Package

`script/package --relay RELAY_SERVER:PORT`

This creates a netpocketos.deb installation file.

