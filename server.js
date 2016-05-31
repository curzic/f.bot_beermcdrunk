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

controller.on('message_received', function (bot, message) {
  console.log("message has been received")
  bot.reply(message, 'Hello! Welcome to motius')
  bot.reply(message, 'What do you want to ask?')
  var reply_with_attachments = {
    'username': 'My bot' ,
    'text': 'This is a pre-text',
    'attachments': [
      {
        'fallback': 'To be useful, I need you to invite me in a channel.',
        'title': 'How can I help you?',
        'text': 'To be useful, I need you to invite me in a channel ',
        'color': '#7CD197'
      }
    ],
    'icon_url': 'http://lorempixel.com/48/48'
    }

  bot.reply(message, reply_with_attachments);
  bot.reply(message, {
    attachment: {
      type: 'template',
      payload: {
        'template_type': 'generic',
        'elements':[
         {
           'title':'Choose, peaseant.',
           'image_url':'http://petersapparel.parseapp.com/img/item100-thumb.png',
           'subtitle':'Choose something!',
            'buttons': [
              {
                'type': 'postback',
                'text': 'Jobs',
                'payload': 'show_jobs'
              },
              {
                'type': 'postback',
                'text': 'Events',
                'payload': 'show_events'
              }
            ]
          }  
        ]
      }
    }
  })
})

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
