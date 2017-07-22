const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASE_URL, { useMongoClient: true });
mongoose.connection.on('error', (err) => {
  console.error('You have encountered an error!');
});

const app = require('./app');
app.set('port', process.env.PORT);
const server = app.listen(3000, () => {
  console.log(`Listening on PORT ${server.address().port}`);
});
