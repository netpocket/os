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
# Required: npm install node-dev
servepi:
	NOS_TOKEN=LSv2K2 RELAY_SERVER=http://luchia.local:1337 NODE_ENV=development node_modules/node-dev/bin/node-dev ./server.js

##
# NOS_PI may be used to test integration points such as
# interfacing with Pi binaries like raspistill & friends
specpi:
	NOS_PI=1 node_modules/.bin/mocha test/**/*_spec.js -w

