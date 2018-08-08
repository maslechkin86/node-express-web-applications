const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

module.exports = function localStrategy() {
	passport.use(new Strategy(
		{
			usernameField: 'username',
			passwordField: 'password',
		}, (username, password, done) => {
			const url = 'mongodb://127.0.0.1:27017';
			const dbName = 'libraryApp';
			(async function addUser() {
				let client;
				try {
					client = await MongoClient.connect(url);
					debug('connected to the server');
					const db = client.db(dbName);
					const collection = db.collection('users');
					const user = await collection.findOne({ username });
					if (user.password === password) {
						done(null, user);
					} else {
						done(null, false);
					}
				} catch (err) {
					debug(err.stack);
				}
				client.close();
			}());
		}
	));
};
