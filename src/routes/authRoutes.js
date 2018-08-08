const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
	authRouter.route('/signUp')
		.post((req, res) => {
			const { username, password } = req.body;
			const url = 'mongodb://127.0.0.1:27017';
			const dbName = 'libraryApp';
			(async function addUser() {
				let client;
				try {
					client = await MongoClient.connect(url);
					debug('connected to the server');
					const db = client.db(dbName);
					const collection = db.collection('users');
					const user = { username, password };
					const result = await collection.insertOne(user);
					req.login(result.ops[0], () => {
						res.redirect('/auth/profile');
					});
					debug(result);
				} catch (err) {
					debug(err.stack);
				}
				client.close();
			}());
		});

	authRouter.route('/signin')
		.get((req, res) => {
			res.render(
				'signin',
				{
					nav,
					title: 'Sign In'
				}
			);
		})
		.post(passport.authenticate('local', {
			successRedirect: '/auth/profile',
			failerRedirect: '/',
		}));

	authRouter.route('/signout')
		.get((req, res) => {
			req.logout();
			res.redirect('/');
		});

	authRouter.route('/profile')
		.all((req, res, next) => {
			if (req.user) {
				next();
			} else {
				res.redirect('/');
			}
		})
		.get((req, res) => {
			res.redirect('/books');
		});

	return authRouter;
}

module.exports = router;
