/**
 * Created by francizidar on 01/03/16.
 */

var express = require('express');
var cheerio = require('cheerio');

// should just be require("phridge") in your code
var phridge = require('phridge');

var app = express();

app.listen(3000, function(){

    console.log('server running on 3000');

});

app.get('/:user', function(req, res){

    var twitterUser = req.params.user;
    var newWord = 'žid';

    if(req.query.migrant){
        newWord = req.query.migrant;
    }

    // phridge.spawn() creates a new PhantomJS process
    phridge.spawn()
        .then(function (phantom) {
            // phantom.openPage(url) loads a page with the given url
            return phantom.openPage("https://twitter.com/"+twitterUser);
        })

        .then(function (page) {
            // page.run(fn) runs fn inside PhantomJS
            return page.run(function () {
                // Here we're inside PhantomJS, so we can't reference variables in the scope

                // 'this' is an instance of PhantomJS' WebPage as returned by require("webpage").create()
                return this.evaluate(function () {
                    return document.querySelector("html").innerHTML;
                });
            });
        })
        .then(function (text) {
            console.log("Headline on example.com: '%s'", text);
            var body = '<!DOCTYPE html><html>'+text+'</html>';

            $ = cheerio.load(body);

            var replaced = $.html().replace(/migrant/g,newWord);



            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(body),
                'Content-Type': 'text/html; charset=utf-8'
            });

            res.write(replaced);
            res.end();

        })
        .catch(function (err) {
            console.error(err.stack);
        })
        // phridge.disposeAll() exits cleanly all previously created child processes.
        // This should be called in any case to clean up everything.
        .then(phridge.disposeAll);

});



//


