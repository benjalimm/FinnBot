// Add your requirements
var restify = require('restify');
var builder = require('botbuilder');
var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/cdb04d45-bcda-427b-a7fe-c0c5e5736596?subscription-key=b74e88b7598949a781a39931a8aa610d&verbose=true')
var intents = new builder.IntentDialog({ recognizers: [recognizer] });


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
// bot.dialog('/', [
//     function (session, args, next) {
//         if (!session.userData.name) {
//             session.beginDialog('/profile');
//         } else {
//             next();
//         }
//     },
//     function (session, results) {
//         session.send('Hello %s!', session.userData.name);
//     }
// ]);
//
// bot.dialog('/profile', [
//     function (session) {
//         builder.Prompts.text(session, 'Hi! What is your name?');
//     },
//     function (session, results) {
//         session.userData.name = results.response;
//         session.endDialog();
//     }
// ]);

bot.dialog('/', intents);

intents.matches('logExpense', [
    function (session, args, next) {
        var item = builder.EntityRecognizer.findEntity(args.entities, 'Item');
        var cost = builder.EntityRecognizer.findEntity(args.entities, 'money');
        if (!item) {
            builder.Prompts.text(session, "What expense are you trying to log?");
        } else {
            next({ response: item.entity});
        }
    },
    function (session, results) {
        if (results.response) {
            // ... save task
            session.send("Ok... Added the '%s' item.", results.response);
        } else {
            session.send("Ok");
        }
    }
]);

//Bot dialogs

server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));
