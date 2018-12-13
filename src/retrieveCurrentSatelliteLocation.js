'use strict';

const LTE_STORE = require( './ssmLteStore' );
const TLE = require( 'tle' );
const AWS = require('aws-sdk');


/**
 * Main lambda entry point.
 */
exports.handler = async (event, context) => {

    log('starting execution...');

    // 1. read lte from SSM
    LTE_STORE.read()
        .then( calculateGroundLocation )
    // 2. get ground location
    // 3. convert location to human understandable location

    return 'finished execution...';
}

/**
 * Utility functions
 */

const calculateGroundLocation = ( lte ) => {
    log('TEST');
}

 // refactor to file
const log = ( ...messages ) => {
    console.log( ...messages );
}
