var request = require('request');

options =  {
    url: "https://api.github.com/users/Manojkumar29IT",
    headers: {
        "User-Agent": "tabula"  // Your Github ID or application name
    }
}

request.get(options)
    .on('response', function (response) {
        console.log(response.statusCode);
        console.log(JSON.stringify(response));
    });