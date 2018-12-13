'use strict';

const LTE_STORE = require( './ssmLteStore' );
const https = require('https');
const TLE = require( 'tle' );
const AWS = require('aws-sdk');

const TLE_URL = "https://celestrak.com/NORAD/elements/tle-new.txt"
const TLE_ID = "18096K" // Reaktor Hello World Satellite

/**
 * Main lambda entry point.
 */
exports.handler = async (event, context) => {

    log('starting execution...');

    downloadSatelliteTle(TLE_URL, TLE_ID)
        .then( findSpecificSatelliteLte )
        .then( LTE_STORE.update )
        .then( () => log( 'successfully set the new tle value' ) )
        .catch( error => log('ERROR occurred: ', error.message) )

    return 'finished execution...';
}

/**
 * Utility functions
 */

const log = ( ...messages ) => {
    console.log( ...messages );
}

const downloadSatelliteTle = ( tleUrl, tleId ) => {
    return new Promise( (resolve, reject) => {
            log('starting LTEs download...');
            https.get(tleUrl, (response) => {

                if( response.statusCode !== 200 ){
                    log( 'LTEs retrieving error', response );
                    reject( Error( `HTTP ${response.statusCode} ${response.statusMessage}` ) );
                } else {
                    log( 'LTEs downloaded', response.statusMessage );
                    resolve(response);
                }

            }).on('error', e => {
                log( 'error on LTEs download', e.message);
                reject( Error( e.message ) )
            });
        }
    );
}


const findSpecificSatelliteLte = (response) => {
    return new Promise( (resolve, reject) => {
        response.pipe( new TLE.Parser() )
            .once( 'error', () => {
                log( 'LTE parsing error', error );
                reject( Error( error.stack ) )
            })
            .on( 'data', ( tle ) => {
                if(tle.id == tleId){
                    log( 'LTE found', lte );
                    resolve( tle );
                }
            })
            .once( 'finish', () => log('LTE parsing finished...') );
    })
}
