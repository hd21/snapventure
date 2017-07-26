const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });
mongoose.Promise = global.Promise;

require('./models/Entry');

const app = require('./app');

let server;

 const runServer = (databaseUrl = process.env.DATABASE_URL, port = process.env.PORT) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
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

const closeServer= () => {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
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
    runServer().catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer };
