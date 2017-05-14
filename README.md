Alexa that plays back random quotes from Donald Trump.

Quotes are served as MP3s from an S3 bucket.

# Installation

This is designed to be run on Lambda. It pulls the mp3s from an s3 bucket.
The AWS SDK will automatically pull credentials from environment variables, as documented
here: http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html.

Make sure you have an IAM role that allows your lambda function to access your S3 bucket. For example:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:GetObject"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::bucket-name",
                "arn:aws:s3:::bucket-name/*"
            ]
        }
    ]
}
```

For the app, set the 
"S3_BUCKET" env var

# Testing

Use [alexa-skill-test](https://github.com/voiyse/alexa-skill-test) to test this.