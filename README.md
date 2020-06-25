# Node.js Time Microservice

Simple time microservice application that returns the local time for a given location.

This time microservice uses the Google [Time Zone](https://developers.google.com/maps/documentation/timezone/intro) and [Geocoding](https://developers.google.com/maps/documentation/geocoding/intro) APIs and has been created to be used with my [Slack Bot API](https://github.com/coderade/nodejs-msb-slack-bot) project.

You will need to [create a Google account](https://accounts.google.com/SignUp?hl=en) and generate an API key for the [Time Zone](https://developers.google.com/maps/documentation/timezone/intro) and [Geocoding](https://developers.google.com/maps/documentation/geocoding/intro) APIs to use this service.

## Status

[![Codeship Status for coderade/nodejs-time-microservice](https://app.codeship.com/projects/638192e0-0228-0136-46ac-4ef38d9281bc/status?branch=master)](https://app.codeship.com/projects/280043)

## Resilient Architecture

As this service has been created to be used with my Slack Bot API project as an intent service to process the result of the current datetime from a location to be used on my natural language processing with [wit.ai](https://wit.ai/), I have tried to make it resilient. The service knows the endpoint address of the main bot application (`http://127.0.0.1:3000/service/time`) and it will try to announce itself every 30 seconds to the intent it can serve.

The main [bot application](https://github.com/coderade/nodejs-msb-slack-bot) will keep track of the services available and route the requests there.

## How to Use

1. Download and install Node.js using [NVM](https://github.com/creationix/nvm).
2. Install [yarn](https://yarnpkg.com/en/) following the official [documentation](https://yarnpkg.com/lang/en/docs/install/#linux-tab).
3. Clone the repository and install the node modules:
    ```bash
    yarn install
    ```

## Running the Service

To run this application, an API key for the [Time Zone](https://developers.google.com/maps/documentation/timezone/intro) and [Geocoding](https://developers.google.com/maps/documentation/geocoding/intro) APIs will be necessary.

1. Create your API key for each of these API services.
2. Pass them as environment variables.

This project uses the [dotenv](https://github.com/motdotla/dotenv) module to load the environment variables. On the root directory of the project, use the following command to copy the example environment file to the `.env` file that will be used to load the environment variables:
    ```bash
    cp .env-example .env
    ```

3. Edit the `GEOCODE_API_KEY` and `TIMEZONE_API_KEY` environment variables with your generated keys, like the following:
    ```plaintext
    GEOCODE_API_KEY=0000-0000-0000-0000-0000
    TIMEZONE_API_KEY=0000-0000-0000-0000-0000
    ```

4. You can also pass the environment variables on your IDE. I use the [WebStorm](https://www.jetbrains.com/webstorm) IDE to debug my Node.js applications, which you can follow this [tutorial](https://www.jetbrains.com/help/webstorm/run-debug-configuration-node-js.html) to set Node.js environment variables in this IDE.

5. Otherwise, you can pass the Time Zone and Geocoding API keys directly on your command line. To do this on the root directory of the project, run the following command passing your `GEOCODE_API_KEY` and `TIMEZONE_API_KEY` as env parameters:
    ```bash
    GEOCODE_API_KEY=<YOUR GEOCODE API KEY> TIMEZONE_API_KEY=<YOUR TIMEZONE API KEY> node bin/run.js
    ```

If everything is ok, the console will show the following message:
```plaintext
The time micro-service is listening on http://localhost:PORT in development mode.
```

The service will try to connect to the [bot application](https://github.com/coderade/nodejs-msb-slack-bot). If the bot application is not running, you will receive the following error message:
```plaintext
Error connecting to Coderade Bot.
```

The service will try to connect again every 30 seconds. If the bot application is not running yet, you will receive an error like this:
```plaintext
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

## Checking the Service

This service has been created to be used with the bot application, but you can test it using your browser by passing a LOCATION as a URL parameter with the announced URL in the first message on the console log:

```plaintext
http://localhost:PORT/service/<LOCATION>
```

For example:
```plaintext
http://localhost:34977/service/curitiba
```

You will receive a JSON response similar to this:
```json
{
  "result": "Wednesday, December 13th 2017, 9:45:46 pm"
}
```

## Testing

This project uses [Mocha](https://mochajs.org/), [Should](https://shouldjs.github.io/), and [Istanbul](https://istanbul.js.org/) JS libraries to test the infrastructure, the services, and the Slack and Wit clients.

The tests are in the `test` directory. To run all the tests, lint the code, and check your coverage, run the following command:
```bash
npm test
```

Or directly on the root of the project, use:
```bash
nyc mocha --recursive test --exit
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.