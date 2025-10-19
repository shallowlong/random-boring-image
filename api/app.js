const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();

const url = 'https://gengtu.net/memes/random/';

app.use(cors());
app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

app.get('/scrape', async (req, res) => {
	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);

		const imgUrls = [];
		$('.image-placeholder img').each((index, element) => {
			const src = $(element).attr('src');
			if (src) {
				imgUrls.push(src);
			}
		});

		let imageUrl = null;
		if (imgUrls.length > 0) {
			const randomIndex = Math.floor(Math.random() * imgUrls.length);
			imageUrl = imgUrls[randomIndex];
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