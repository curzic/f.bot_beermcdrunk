var Botkit = require('botkit')

var accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
var verifyToken = process.env.FACEBOOK_VERIFY_TOKEN

var port = process.env.PORT

if (!accessToken) throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN is required but missing')
if (!verifyToken) throw new Error('FACEBOOK_VERIFY_TOKEN is required but missing')
if (!port) throw new Error('FACEBOOK_PORT is required but missing')

var controller = Botkit.facebookbot({
  access_token: accessToken,
  verify_token: verifyToken
})

var bot = controller.spawn()

controller.setupWebserver(port, function(err, webserver){
  if (err) return console.log(err)
  controller.createWebhookEndpoints(webserver, bot, function () {
    console.log('Ready Player 1')
  })
})

// bot receives message from user
controller.hears(['hello', 'hi', 'hey', 'hallo', 'test', 'yo'],'message_received', function (bot, message) {
  console.log("Message has been received")
  
  // start a conversation to handle this response
  bot.startConversation(message,function(err,convo) {
    
    convo.say('Good day, Dear Sir!');
    convo.say('If I may speak. How can I be of service, Sir?');
    convo.say('Sir, which beer is more of your pleasing?');
    
    var reply_with_attachments =  {
        attachment: {
          'type':'template',
          'payload':{
           'template_type':'generic',
           'elements':[
             {
               'title':'Hacker Pschorr',
               'image_url':'https://upload.wikimedia.org/wikipedia/en/9/9a/HP_Logo_with_Banner.jpg',
               'subtitle':'A sweet Bavarian beer of high class.',
               'buttons':[
                 {
                   'type':'postback',
                   'title':'I love it.',
                   'payload':'beer_reply'
                  }
               ]
             },
             {
               'title':'Paulaner',
               'image_url':'https://www.paulaner.com/sites/all/themes/paulaner/img/paulaner_logo.png',
               'subtitle':'A classic. Like you.',
               'buttons':[
                 {
                   'type':'postback',
                   'title':'I am classy.',
                   'payload':'beer_reply'
                  }
                ]
              }
            ]
          }
        }
      }
      convo.say(reply_with_attachments);
    });
});

  

controller.on('facebook_postback', function (bot, message) {
  bot.reply(message, "If I may say, good choice, Sir!")
})
