"use strict";

/*global require,__dirname*/
/*jshint es3:false*/

var express = require('express');
var path = require('path');

var yargs = require('yargs').options({
    'port' : {
        'default' : 3002,
        'description' : 'Port to listen on.'
    },
    'public' : {
        'type' : 'boolean',
        'default' : true,
        'description' : 'Run a public server that listens on all interfaces.'
    },
    'help' : {
        'alias' : 'h',
        'type' : 'boolean',
        'description' : 'Show this help.'
    }
});
var argv = yargs.argv;

if (argv.help) {
    return yargs.showHelp();
}

var app = express();
app.disable('etag');
app.use(express.static(path.join(__dirname, 'wwwroot')));

console.log('Listening on port ' + argv.port);
app.listen(argv.port, argv.public ? undefined : 'localhost');
