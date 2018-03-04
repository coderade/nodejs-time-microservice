const config = require('../config');
const request = require('superagent');
const service = require('../server/service')(config);
const http = require('http');
const log = require('../config').log();

const server = http.createServer(service);
server.listen();

server.on('listening', () => {
    log.info(`The time micro-service is listening on the http://localhost:${server.address().port} in ${service.get('env')} mode.`);

    const announce = () => {
        request.put(`http://127.0.0.1:3000/service/time/${server.address().port}`, (err, res) => {
            if (err) {
                log.error('Error connecting to Codebot.');
                log.debug(err);
                return;
            }
            log.info(res.body);
        });
    };

    announce();
    setInterval(announce, 15 * 1000);
});