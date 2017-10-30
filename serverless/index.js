// Google Home Action
'use strict';

function getActionContext(intent, resolvedQuery) {
    let dashes = `${'-'.repeat(40)}\n`;
    let actionContext = `${dashes}Intent is ${intent}\n` +
        `resolvedQuery is ${resolvedQuery}\n${dashes}`;

    return actionContext ? actionContext : 'Unable to get intent.';
}

module.exports = function (context, req) {
    const intent = req.body.result.action;
    const resolvedQuery = req.body.result.resolvedQuery;
    context.log(getActionContext(intent, resolvedQuery));
    switch (intent) {
        case 'what_is_serverless':
            context.res.send({
                speech: "You simoultaneously have a server and you don't have a server. " +
                "In a sense, serverless is Schroedinger's compute."
            });
            break;

        case 'get_news':
            const feedparser = require('feedparser-promised');
            const feedUrl = 'https://blogs.msdn.microsoft.com/appserviceteam/feed/';
            let posts = [];
            feedparser.parse(feedUrl).then(items => {
                items.forEach(item => {
                    posts.push(item.title);
                });
            }).then(() => {
                let prettyPosts = new String;
                posts.forEach(entry => {
                    prettyPosts += `${entry}. The next post is `;
                });
                context.res.send({
                    speech: "Here are Azure Functions headlines: " + prettyPosts
                });
            }).catch(error => {
                context.log(error);
                context.res.send({
                    speech: "I couldn't connect to Azure Functions news feed"
                });
            });
            break;

        case 'run_the_demo':
            context.res.send({
                speech: "Computer says no!"
            });
            break;
        
        case 'about_guests':
            let wikipediaUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&exintro&titles=RoEduNet&redirects=';
            const request = require('request');
            request(wikipediaUrl, function (error, response, body) {
                context.log('error:', error); // Print the error if one occurred
                context.log('statusCode:', response && response.statusCode);
                context.log('body:', body);
                context.log(body.query.pages[0].extract);
                context.res.send({
                    speech: body.query.pages[0].extract
                });
            });

        default:
            context.res.send({
                speech: "This is Azure Functions backend speaking. " +
                "Google Home has successfully reached me but i can't figure out " +
                "what it is that you want me to do."
            });
    }
}