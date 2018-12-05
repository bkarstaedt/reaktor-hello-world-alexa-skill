'use strict';

const https = require('https');
const TLE = require( 'tle' );

const TLE_URL = "https://celestrak.com/NORAD/elements/tle-new.txt"
const TLE_ID = "18096K" // Reaktor Hello World Satellite

/**
 * Main entry point.
 */
exports.handler = async function(event, context) {

    /*
        - store in data store
    */

    let completeTle = retrieveSatelliteTle(TLE_URL, TLE_ID);


    return "success!";
}

/**
 * Utility functions
 */

function exit( error ) {
    console.error( error.stack )
    process.exit(1)
}


function retrieveSatelliteTle(tleUrl, tleId) {

    let satelliteLte = {};

    https.get(tleUrl, (response) => {

        if( response.statusCode !== 200 ){
            new Error( `HTTP ${response.statusCode} ${response.statusMessage}` );
        }

        response.pipe( new TLE.Parser() )
            .once( 'error', exit )
            .on( 'data', ( tle ) => {
                if(tle.id == TLE_ID){
                    console.log( tle );
                }
            })
            .once( 'finish', () => {
                // console.log( 'Finished parsing all TLEs...' );
            });
    });
    return satelliteLte;
}

module.exports.testRetrieveSatelliteTle = function() {
    retrieveSatelliteTle(TLE_URL, TLE_ID);
}