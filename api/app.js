const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();

const url = 'https://freeimage.host/?random';

app.use(cors());
app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

app.get('/scrape', async (req, res) => {
	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);

		const targetElement = $('*:contains("Image URL")').filter((i, el) => {
			return $(el).text().trim() === 'Image URL';
		}).first();

		let imageUrl = null;
		if (targetElement.length) {
			const parentDiv = targetElement.closest('div.panel-share-input-label');
			const inputElement = parentDiv.find('input.text-input');

			if (inputElement.length) {
				imageUrl = inputElement.attr('value');
				if (imageUrl && !imageUrl.startsWith('http')) {
					imageUrl = new URL(imageUrl, url).href;
				}
			}
		}

		if (imageUrl) {
			res.json({
				success: true,
				imageUrl: imageUrl
			});
		} else {
			res.json({
				success: false,
				message: 'SORRY~ Now the Boring Random Image Service is dead. See you next time on the internet!'
			});
		}

	} catch (error) {
		res.status(500).json({
			error: 'Service is broken, please try later.',
			details: error.message
		});
	}
});

module.exports = app;