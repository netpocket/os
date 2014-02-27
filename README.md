# NetpocketOS

A small program designed for Raspberry Pi that exposes device features
to peers over websockets.

Firewalls and difficult network configurations become irrelevant
by utilizing an [intermediate
relay](https://github.com/netpocket/ncc-relay) in communication with other devices.

## Install

### Base OS Initial Install

Install [raspbian-ua-netinst](https://github.com/hifi/raspbian-ua-netinst) on your Raspberry Pi Model B

### Base OS First Boot Config

The system is almost completely unconfigured on first boot. Here are
some tasks you most definitely want to do on first boot.

The default **root** password is **raspbian**.

> Set new root password: `passwd`  
> Configure your default locale: `dpkg-reconfigure locales`  
> Configure your timezone: `dpkg-reconfigure tzdata`  
> Install latest kernel and firmware package: `apt-get update && apt-get
> install linux-image-rpi-rpfv raspberrypi-bootloader-nokernel`  
> Replace old kernel.img with latest kernel: `cp /vmlinuz
> /boot/kernel.img`  
> Reboot to new kernel and firmware: `reboot`  

Installing the firmware package is **strongly** recommended because the
installer does not install any kernel modules which are required for
ipv6, sound and many more stuff you might need.

> Optional: `apt-get install raspi-copies-and-fills` for improved memory
> management performance.
> Optional: Create a swap file with `dd if=/dev/zero of=/swap bs=1M
> count=512 && mkswap /swap` (example is 512MB) and enable it on boot by
> appending `/swap none swap sw 0 0` to `/etc/fstab`.

### NetpocketOS Install

```bash
git clone git@bitbucket.com:netpocket/netpocketos
./bootstrap
```

### Enabling Camera Support

```bash
apt-get install raspi-config
raspi-config # And enable the camera -- you will be asked to reboot
```

## Usage

You'll see your device in your web interface and can configure it
further there through the graphical interface.

### Development

`NODE_ENV=development` will enable verbose logging

```bash
NODE_ENV=development NOS_TOKEN=1 RELAY_SERVER=http://ncc-relay.herokuapp.com node server.js
```

