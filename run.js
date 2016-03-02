/**
 * Created by francizidar on 01/03/16.
 */

var express = require('express');
var cheerio = require('cheerio');

// should just be require("phridge") in your code
var phridge = require('phridge');

var app = express();

app.listen(3062, function(){

    console.log('server running on 3000');

});

app.get('/:user/status/:id', function(req, res){

    var twitterUser = req.params.user;
    var twitId = req.params.id;
    var oldWord;
    var newWord = 'žid';

    if(req.query.migrant){
        oldWord = 'migrant';
        newWord = req.query.migrant;
    }


    if(req.query.from && req.query.to){

        oldWord = req.query.from;
        newWord = req.query.to;

    }

    // phridge.spawn() creates a new PhantomJS process
    phridge.spawn()
        .then(function (phantom) {
            // phantom.openPage(url) loads a page with the given url

            return phantom.openPage('https://twitter.com/'+twitterUser+'/status/'+twitId);
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

            $('head').append(' <meta http-equiv="content-type" content="text/html; charset=UTF-8">');
            var re = new RegExp(oldWord,'gi');
            var replaced = $.html().replace(re,'<span id="swapped-word" style="font-weight: 500; color:#ff0000;">'+newWord+'</span>');

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

app.get('/:user', function(req, res){

    var twitterUser = req.params.user;
    var oldWord;
    var newWord = 'žid';

    if(req.query.migrant){
        oldWord = 'migrant';
        newWord = req.query.migrant;
    }


    if(req.query.from && req.query.to){

        oldWord = req.query.from;
        newWord = req.query.to;

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
            $('head').append(' <meta http-equiv="content-type" content="text/html; charset=UTF-8">');
            var re = new RegExp(oldWord,'gi');
            var replaced = $.html().replace(re,'<span style="font-weight: 500;">'+newWord+'</span>');



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


