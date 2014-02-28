##
# The dev cycle via SSH into the Pi is a little painful.
# Instead we will use BTSync to keep the project in sync.
#
# These tasks will take advantage of file change events
# and restart the server and run tests on the pi for us.
#
# Using our plugged in display, we can keep an eye on it
# and continue to iterate from the faster computer. :)
#
# Usage:
# 	pane 1: `make servepi`
#   pane 2: `make specpi`
##

##
# Server watcher reloader for use on the Pi
# Required: npm install node-dev
servepi:
	NOS_TOKEN=LSv2K2 RELAY_SERVER=http://luchia.local:1337 NODE_ENV=development node_modules/node-dev/bin/node-dev ./server.js

##
# Spec watcher runner for use on the Pi
# NOS_PI may be used to test integration points such as
# interfacing with Pi binaries like raspistill & friends
specpi:
	NOS_PI=1 node_modules/.bin/mocha test/\*\*/\*_spec.js -w

##
# Simple spec watcher runner
spec:
	node_modules/.bin/mocha test/\*\*/\*_spec.js -w

##
# Use your iOS 7 device as an internet connection
iphone_tetherable: ipheth_apt ipheth_src

ipheth_apt:
	apt-get update
	apt-get -y upgrade
	apt-get -y install vim tmux git build-essential libxml2-dev python2.7 python2.7-dev fuse libtool autoconf libusb-1.0-0-dev libfuse-dev

ipheth_src:
	cd /tmp
	echo `pwd`
	if [[ -d iphone_libs ]]; then
		rm -rf iphone_libs
	fi
	mkdir iphone_libs && cd iphone_libs
	git clone https://github.com/libimobiledevice/libplist.git
	git clone https://github.com/libimobiledevice/libusbmuxd.git
	git clone https://github.com/libimobiledevice/usbmuxd.git
	git clone https://github.com/libimobiledevice/libimobiledevice.git
	git clone https://github.com/libimobiledevice/ifuse.git
	export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig
	echo "export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig" | tee -a /etc/bash.bashrc
	cd libplist && ./autogen.sh && make && make install && cd ..
	cd libusbmuxd && ./autogen.sh && make && make install && cd ..
	cd libimobiledevice && ./autogen.sh && make && make install && cd ..
	cd usbmuxd && ./autogen.sh && make && make install && cd ..
	cd ifuse && ./autogen.sh && make && make install && cd ..
	groupadd -g 140 usbmux &>/dev/null
	useradd -c 'usbmux user' -u 140 -g usbmux -d / -s /sbin/nologin usbmux &>/dev/null
	passwd -l usbmux &>/dev/null
	echo /usr/local/lib | tee /etc/ld.so.conf.d/libimobiledevice-libs.conf
	ldconfig
