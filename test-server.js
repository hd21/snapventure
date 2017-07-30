const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });
mongoose.Promise = global.Promise;

require('./models/Entry');

const app = require('./app');

 const runTestServer = (testDatabaseUrl = process.env.TEST_DATABASE_URL, port = process.env.PORT) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(testDatabaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                    console.log(`Your app is now listening on PORT ${port}.`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

const closeTestServer= () => {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing test server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runTestServer().catch(err => console.error(err));
};

module.exports = { app, runTestServer, closeTestServer };
