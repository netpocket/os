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
	-/opt/netpocketos/node_modules/forever/bin/forever stop /opt/netpocketos/server.js > /dev/null 2>&1
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

