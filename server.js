require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require("body-parser");
const Database = require("@replit/database");
const shortid = require("shortid");

const db = new Database();

// Basic Configuration
const port = process.env.PORT || 3000;

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl/:url", function (req, res) {
	const shortUrl = req.params.url;

	db.get(shortUrl).then((value) => {
		console.log(value);

		res.redirect(value);
	});
});

app.post("/api/shorturl", urlencodedParser, async function (req, res) {
	const originalUrl = req.body.url;
	const shortUrl = shortid.generate();

	const expression =
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

	const regex = new RegExp(expression);

	if (!originalUrl.match(regex)) {
		res.json({
			error: "invalid url",
		});
		return;
	}

	db.set(shortUrl, originalUrl)
		.then((value) => {
			res.json({
				original_url: originalUrl,
				short_url: shortUrl,
			});
		})
		.catch(() => {
			res.json({
				error: "Error!",
			});
		});
});

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});
