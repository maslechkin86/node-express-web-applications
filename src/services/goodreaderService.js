const axious = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreaderService');

const parser = xml2js.Parser({ explicitArray: false });

function goodreaderService() {
	function getBookById(id) {
		return new Promise((resolve, reject) => {
			axious.get(`https://www.goodreads.com/book/show/${id}.xml?key=venXMEcVZUeNrLFYKIi3kg`)
				.then((response) => {
					parser.parseString(response.data, (err, result) => {
						if (err) {
							debug(err);
						} else {
							debug(result);
							resolve(result.GoodreadsResponse.book);
						}
					});
				})
				.catch((err) => {
					reject(err);
					debug(err);
				});
		});
	}

	return {
		getBookById
	};
}

module.exports = goodreaderService();
