'use strict';

const config = require('../config');
const request = require('superagent');
const service = require('../server/service')(config);
const http = require('http');
const log = config.log();

const server = http.createServer(service);

server.listen(() => {
    log.info(`The time micro-service is listening on http://localhost:${server.address().port} in ${service.get('env')} mode.`);

    const announce = async () => {
        try {
            const res = await request.put(`http://127.0.0.1:3000/service/time/${server.address().port}`)
                .set('X-BOT-SERVICE-TOKEN', config.serviceAccessToken)
                .set('X-BOT-API-TOKEN', config.botApiToken);

            log.info(res.body);
        } catch (err) {
            log.error('Error connecting to Codebot.');
            log.debug(err);
        }
    };

    announce();
    setInterval(announce, 15 * 1000);
});

server.on('error', (error) => {
    log.error(`Server error: ${error.message}`);
    process.exit(1);
});
