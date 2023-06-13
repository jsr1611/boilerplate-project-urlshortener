require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
let bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

//localStorage definition
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}

// Your first API endpoint
app.get("/api/hello", function (req, res) {
    res.json({ greeting: "hello API" });
});

app.route("/api/shorturl").post(function (req, res) {
    let url = req.body.url;

    if (url.length === 0 || /^(http|https)[://.]/.test(url)) {
        if (!localStorage.getItem("count")) {
            localStorage.setItem("count", 0);
        }
        let shortOne = Number(localStorage.count) + 1;
        localStorage.setItem("count", shortOne);
        localStorage.setItem(shortOne, url);
        res.json({ original_url: url, short_url: shortOne });
    } else {
        res.json({ error: "invalid url" });
    }
});

app.get("/api/shorturl/:shorturl", function (req, res) {
    let shortOne = req.params.shorturl;
    if (!localStorage.getItem(shortOne)) {
        res.json({ error: "invalid url" });
    } else {
        res.redirect(localStorage.getItem(shortOne));
    }
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
