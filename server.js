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

controller.hears(['hello', 'hi'], 'message_received', function (bot, message) {
  bot.reply(message, 'Hello!')
  bot.reply(message, 'I want to show you something.')
  bot.reply(message, {
    attachement: {
      type: 'template',
      payload: {
        'template_type': 'button',
        text: 'Which do you prefer?',
        buttons: [
          {
            type: 'postback',
            text: 'Cats',
            payload: 'show_cat'
          },
          {
            type: 'postback',
            text: 'Dogs',
            payload: 'show_dog'
          }
        ]
      }
    }
  })
})

controller.on('facebook_postback', function (bot, message) {
  switch(message.payload){
  case 'show_cat':
    bot.reply(message, {
      attachement: {
        type: 'image',
        payload: {
          url:'http://i.giphy.com/pcC2u7rl89b44.gif'
        }
      }
    })
    break;
  case 'show_dog':
    bot.reply(message, {
      attachement: {
        type: 'image',
        payload: {
          url:'http://i.giphy.com/9gn4lhW6wiQ6c.gif'
        }
      }
    })
    
    break;
  default:
  }  
})
