# nodejs-time-microservice

Simple time micro-service application that returns the local time for a given location.

This time microservice use the Google [Time Zone](https://developers.google.com/maps/documentation/timezone/intro) and [Geocoding](https://developers.google.com/maps/documentation/geocoding/intro) APIs
and has been created to be used with my [Slack Bot API](https://github.com/coderade/nodejs-msb-slack-bot)
project.

Will be necessary [to create a Google account](https://accounts.google.com/SignUp?hl=en) and generate a API key for the [Time Zone](https://developers.google.com/maps/documentation/timezone/intro) and [Geocoding](https://developers.google.com/maps/documentation/geocoding/intro) APIs
to use this service.

## Status

[ ![Codeship Status for coderade/nodejs-time-microservice](https://app.codeship.com/projects/638192e0-0228-0136-46ac-4ef38d9281bc/status?branch=master)](https://app.codeship.com/projects/280043)

## Resilient Architecture
As this service has been created to be used with my Slack Bot API project as
an intent service to process the result the current datetime from a local to be
used on my natural language processing with [wit.ai](https://wit.ai/).
I tried to make it resilient, so the service knows the endpoint address of the
main bot application (`http://127.0.0.1:3000/service/time`) and it will try
to announce itself every 30 seconds and to intent it can serve.

The main [bot application](https://github.com/coderade/nodejs-msb-slack-bot) will
keep track of the services available and route the requests there.

## How to use

Download and install the Node.Js using the [NVM](https://github.com/creationix/nvm).

Install the [yarn](https://yarnpkg.com/en/) following the official
[documentation](https://yarnpkg.com/lang/en/docs/install/#linux-tab).

Clone the repository and install the node modules.

`yarn install`

After this, you can run the service.

## Running the service

To run this application, an API key for the
[Time Zone](https://developers.google.com/maps/documentation/timezone/intro) and [Geocoding](https://developers.google.com/maps/documentation/geocoding/intro) APIs
will be necessary.


After you create your API key for each one of these API services you will need to
pass them as environment variables.

This project uses the [dotenv](https://github.com/motdotla/dotenv) module to load the environment variables, so on the 
root directory of the project use the following command to copy the env example file to the `.env` file that will be 
used to load the environment variables.

`cp .env-example .env`

Then, you can edit the `GEOCODE_API_KEY` and `TIMEZONE_API_KEY` environment variables with your generated keys, 
like the following:

```docker
GEOCODE_API_KEY=0000-0000-0000-0000-0000
TIMEZONE_API_KEY=0000-0000-0000-0000-0000
```

You can also pass the environment variables on your IDE.

I use the [WebStorm](https://www.jetbrains.com/webstorm) IDE to
debug my Node.js applications, which you can follow this
[tutorial](https://www.jetbrains.com/help/webstorm/run-debug-configuration-node-js.html) to
set Node.js environment variables in this IDE.

Otherwise you can pass the Time Zone and Geocoding API keys directly on your command line.

To do this on the root directory of the project run the following command
passing your `GEOCODE_API_KEY` and `TIMEZONE_API_KEY` as env parameters:

`GEOCODE_API_KEY=<YOUR GEOCODE API KEY> TIMEZONE_API_KEY=<YOUR TIMEZONE API KEY> node bin/run.js`

If everything is ok, the console will show the following message:

`The time micro-service is listening on the http://localhost:PORT in development mode.`

The service will try to connect on the
[bot application](https://github.com/coderade/nodejs-msb-slack-bot), so if the
bot application is not running you also will receive the following error message:

`Error connecting to Coderade Bot.`

The service will try to connect again every 30 seconds and if the
bot application is not running yet, you will receive an error like this.

```
{ Error: connect ECONNREFUSED 127.0.0.1:3000
    at Object._errnoException (util.js:1031:13)
    at _exceptionWithHostPort (util.js:1052:20)
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1195:14)
  errno: 'ECONNREFUSED',
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 3000,
  response: undefined }
```


### Checking the service

This service has been create to be used with the bot application, but you can test
it using the your browser passing a LOCATION as URL parameter with the announced
URL on the first message on the console log:

`http://localhost:PORT/service/<LOCATION>`

Like the following example:

http://localhost:34977/service/curitiba

You will receive a json response similar to this:

```json
{
"result": "Wednesday, December 13th 2017, 9:45:46 pm"
}
```

## Testing 

This project use the [Mocha](https://mochajs.org/), [Should](https://shouldjs.github.io/) and 
[Istanbul](https://istanbul.js.org/) JS libraries to test the insfracture, the services and the Slack and Wit 
clients.

The tests are on the `test` directory. To run all the the tests, the lint and check your coverage, run the following 
command:

```
npm test
```

or directly on the root of the project use:

```
nyc mocha --recursive test --exit
``` 
