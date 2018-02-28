var request = require('request');
var express = require('express');
var app = express();
var https = require("https");
var mongoose = require("mongoose");

var RepositoryInfo = mongoose.model('Info', {
    userName: String,
    repoDetails: Object
});

mongoose.connect('mongodb://localhost/Manoj');

app.get('/:userName', function (req, res) {
    var userName = req.params.userName;
    RepositoryInfo.findOne({ 'userName': userName }, function (err, repositoryInfo) {
        if (err) {
            console.log(err);
        }
        else {
            if (repositoryInfo && repositoryInfo.repoDetails) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Content-Type", "application/json");
                res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Content-Type");
                res.end(JSON.stringify(repositoryInfo.repoDetails));
            } else {
                var getGitHubRepos = new initialize(userName);
                getGitHubRepos.then(function (response) {
                    var repositoryInfo = new RepositoryInfo({
                        userName: userName,
                        repoDetails: response
                    })
                    repositoryInfo.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("data saved successfully");
                        }
                    });
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Content-Type", "application/json");
                    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Content-Type");
                    res.end(JSON.stringify(response));
                }, errorHandler)
            }
        }
    });
})

app.options('/:userName', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Content-Type", "text/plain");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Content-Type");
    res.send("success");
});

function initialize(userName) {
    var userName = userName;
    return new Promise(function (resolve, reject) {
        var repoUrl = "https://api.github.com/users/<userName>/repos";
        repoUrl = repoUrl.replace('<userName>', userName);
        options = {
            url: repoUrl,
            headers: {
                "User-Agent": "tabula"
            }
        }

        let body = [];
        request.get(options)
            .on('data', function (chunk) {
                body.push(chunk);
            }).on('error', function (error) {
                reject(error);
            }).on('end', function () {
                body = Buffer.concat(body).toString();
                resolve(JSON.parse(body));
            });


    });
}

function errorHandler(error) {
    console.log(error);
}

app.listen('3000', function () {
    console.log("Server is up and running on port 3000");
})
