'use strict';

import Alexa from 'alexa-sdk'
import AWS from 'aws-sdk'

const INVOCATION_NAME = process.env.INVOCATION_NAME || "Fourty Five";
const APP_ID = process.env.APP_ID;
const S3_REGION = process.env.S3_REGION || "us-west-2";
const S3_BUCKET = process.env.S3_BUCKET;

function getHelpResponse(){
    let examples = [
        "about his tax returns",
        "about Michael Flynn",
        "how to solve the Israeli Palestinian conflict",
        "how to bake cookies",
        "what his favorite color is",
        "why the sky is blue",
        "how he's doing",
        "about the weather"
    ];

    let randomIndex = Math.floor((Math.random() * examples.length));
    let randomExample = examples[randomIndex];

    let speechOutput = `You can ask ${INVOCATION_NAME} anything. For example, ask ${INVOCATION_NAME} ${randomExample}`;
    return speechOutput;
}

// Note: these functions can't be ES6 arrow functions; "this" ends up undefined if you do that.
const handlers = {
    'LaunchRequest': function(){
        let speechOutput = getHelpResponse();
        this.emit(':ask', speechOutput, "What would you like to ask?");
    },
    'AMAZON.HelpIntent': function(){
        let speechOutput = getHelpResponse();
        this.emit(':ask', speechOutput, "What would you like to ask?");
    },
    'AMAZON.StopIntent': function(){
        let speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.CancelIntent': function(){
        let speechOutput = "Okay";
        this.emit(':tell', speechOutput);
    },
    'AskTrumpIntent': function(){
        const s3 = new AWS.S3();
        let params = {
            Bucket: S3_BUCKET
        };
        let listObjectsPromise = s3.listObjects(params).promise();
        listObjectsPromise.then((data) => {
            let audioFiles = data.Contents;
            audioFiles = audioFiles.map(item => {
                return `https://s3-${S3_REGION}.amazonaws.com/${S3_BUCKET}/${item.Key}`;
            });

            let randomIndex = Math.floor((Math.random() * audioFiles.length));
            this.emit(':tell', `<audio src="${audioFiles[randomIndex]}" />`);
        }).catch(err => {
            console.error(err, err.stack);
            this.emit(':tell', "Sorry, a tremendous error occurred!");
        });
    }
};

exports.handler = (event, context, callback) => {
    let alexa = Alexa.handler(event, context);
    // Only set appId if not debugging
    if ('undefined' === typeof process.env.DEBUG) {
        alexa.appId = APP_ID;
    }
    alexa.registerHandlers(handlers);
    alexa.execute();
};