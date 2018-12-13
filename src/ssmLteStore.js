'use strict';

const AWS_SSM = new AWS.SSM();

let ssmParams = {
    Name: 'ReaktorHelloWorldTle',
    Names: [ 'ReaktorHelloWorldTle' ],
    Type: String,
    Overwrite: true,
    WithDecryption: false
};

exports.update = ( lte ) => {
    return new Promise( (resolve, reject) => {
        log( 'SSM put', lte );

        ssmParams.Value = lte // probably JSON.stringify() is needed here

        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#putParameter-property
        AWS_SSM.putParameter( ssmParams, ( error, data ) => {
            if (error){
                log( 'SSM error', error );
                reject( Error( error.stack ) );
            } else{
                log( 'SSM response', data );
                resolve( data );
            }
        });
    });
}

exports.read = ( lte ) => {
    return new Promise( (resolve, reject) => {
        log( 'SSM get', ssmParams.Name );

        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#getParameters-property
        AWS_SSM.getParameters( ssmParams, ( error, data ) => {
            if (error){
                log( 'SSM error', error );
                reject( Error( error.stack ) );
            } else{
                log( 'SSM response', data );
                resolve( data );
            }
        });
    });
}
