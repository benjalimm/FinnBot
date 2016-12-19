// Add your requirements
var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 8080, function()
{
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
  appId:'e61af996-cf9e-484c-9b99-45d4c6fa4475',
  appPassword: 'SrAPpXYjYYMtDMgXq9zQG2N' });
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create bot dialogs
bot.dialog('/', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

//Bot dialogs

server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));
