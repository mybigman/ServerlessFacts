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
    }
}