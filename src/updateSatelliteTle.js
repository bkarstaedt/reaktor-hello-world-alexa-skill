'use strict';

const https = require('https');
const TLE = require( 'tle' );
const AWS = require('aws-sdk');
const AWS_SSM = new AWS.SSM();

const TLE_URL = "https://celestrak.com/NORAD/elements/tle-new.txt"
const TLE_ID = "18096K" // Reaktor Hello World Satellite

/**
 * Main lambda entry point.
 */
exports.handler = async (event, context) => {

    log('starting execution...');

    retrieveSatelliteTle(TLE_URL, TLE_ID)
        .then( setSatelliteTle )
        .then( () => log( 'successfully set the new tle value' ) )
        .catch( error => log('ERROR occurred: ', error.message) )
        // .finally( () => log( 'PROMISE FINISHED' ) );

    return 'finished execution...';
}

/**
 * Utility functions
 */

const log = ( ...messages ) => {
    console.log( ...messages );
}

const retrieveSatelliteTle = ( tleUrl, tleId ) => {
    return new Promise( (resolve, reject) => {
            log('starting LTEs download...');
            https.get(tleUrl, (response) => {

                if( response.statusCode !== 200 ){
                    log( 'LTEs retrieving error', response );
                    reject( Error( `HTTP ${response.statusCode} ${response.statusMessage}` ) );
                } else {
                    log( 'LTEs downloaded', response.statusMessage )
                }

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
            }).on('error', e => {
                log( 'error on LTEs download', e.message);
                reject( Error( e.message ) )
            });
        }
    );
}

const setSatelliteTle = ( tle ) => {
    return new Promise( (resolve, reject) => {
        const params = {
            Name: 'ReaktorHelloWorldTle', // TODO: refactor as ENV from sam-template.yml
            Type: String,
            Value: tle, // JSON.stringify()
            Overwrite: true
        };
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#putParameter-property
        AWS_SSM.putParameter( params, ( error, data ) => {
            if (error){
                log( 'SSM error', error );
                reject(Error( error.stack ));
            } else{
                log( 'SSM response', data );
                resolve( data );
            }
        });
    });
}
