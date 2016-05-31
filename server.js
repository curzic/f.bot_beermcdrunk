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
controller.on('message_received', function (bot, message) {
  console.log("Message has been received")
  
  // start a conversation to handle this response
  bot.startConversation(message,function(err,convo) {
    
    convo.say('Good day, Dear Sir!');
    convo.say('If I may speak. How can I be of service, Sir?');
    
    var reply_with_attachments =  {
        attachment: {
          'type':'template',
          'payload':{
           'template_type':'generic',
           'elements':[
             {
               'title':'Classic White T-Shirt',
               'image_url':'http://petersapparel.parseapp.com/img/item100-thumb.png',
               'subtitle':'Soft white cotton t-shirt is back in style',
               'buttons':[
                 {
                   'type':'web_url',
                   'url':'https://petersapparel.parseapp.com/view_item?item_id=100',
                   'title':'View Item'
                 },
                 {
                   'type':'web_url',
                   'url':'https://petersapparel.parseapp.com/buy_item?item_id=100',
                   'title':'Buy Item'
                 },
                 {
                   'type':'postback',
                   'title':'Bookmark Item',
                   'payload':'USER_DEFINED_PAYLOAD_FOR_ITEM100'
                 }
               ]
             },
             {
               'title':'Classic Grey T-Shirt',
               'image_url':'http://petersapparel.parseapp.com/img/item101-thumb.png',
               'subtitle':'Soft gray cotton t-shirt is back in style',
               'buttons':[
                 {
                   'type':'web_url',
                   'url':'https://petersapparel.parseapp.com/view_item?item_id=101',
                   'title':'View Item'
                 },
                 {
                   'type':'web_url',
                   'url':'https://petersapparel.parseapp.com/buy_item?item_id=101',
                   'title':'Buy Item'
                 },
                 {
                   'type':'postback',
                   'title':'Bookmark Item',
                   'payload':'USER_DEFINED_PAYLOAD_FOR_ITEM101'
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
  switch(message.payload){
  case 'show_jobs':
    bot.reply(message, {
      attachement: {
        type: 'image',
        payload: {
          url:'http://i.giphy.com/pcC2u7rl89b44.gif'
        }
      }
    })
    break
  case 'show_events':
    bot.reply(message, {
      attachement: {
        type: 'image',
        payload: {
          url:'http://i.giphy.com/9gn4lhW6wiQ6c.gif'
        }
      }
    })
    break
  }  
})
