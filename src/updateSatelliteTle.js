'use strict';

const https = require('https');
const TLE = require( 'tle' );

const TLE_URL = "https://celestrak.com/NORAD/elements/tle-new.txt"
const TLE_ID = "18096K" // Reaktor Hello World Satellite

/**
 * Main lambda entry point.
 */
exports.handler = async (event, context) => {

    /*
        TODO: store in data store
    */

    retrieveSatelliteTle(TLE_URL, TLE_ID)
        .then( storeSatelliteTle ) // tle => console.log('####### TLE: ', tle) )
        .catch( error => console.log('ERROR occurred: ', error.message) );

    return "success!";
}

/**
 * Utility functions
 */

const retrieveSatelliteTle = ( tleUrl, tleId ) => {
    return new Promise( (resolve, reject) => {
            https.get(tleUrl, (response) => {

                if( response.statusCode !== 200 ){
                    const reason = new Error( `HTTP ${response.statusCode} ${response.statusMessage}` );
                    reject(reason);
                }

                response.pipe( new TLE.Parser() )
                    .once( 'error', () => {
                        console.error( error.stack ) && process.exit(1)
                    })
                    .on( 'data', ( tle ) => {
                        if(tle.id == tleId){
                            resolve(tle);
                        }
                    });
            });
        }
    );
}

const storeSatelliteTle = ( tle ) => {
    return new Promise( (resolve, _reject) => {
        console.log('Storing', tle.id)
        resolve(tle);
    });
}

/**
 * For testing...
 */

module.exports.testRetrieveSatelliteTle = function() {
    retrieveSatelliteTle(TLE_URL, TLE_ID)
        .then( storeSatelliteTle )
        .then( tle => console.log('TLE object for', TLE_ID, tle) )
        .catch( error => console.log(error.message) );
}