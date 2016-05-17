'use strict';

const sh = require( 'shelljs' );

sh.rm( '-rf', process.argv.slice( 2 ));
