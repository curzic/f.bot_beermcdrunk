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


// Templates for conversations
var reply_faq =  {
    attachment: {
        'type':'template',
        'payload':{
            'template_type':'button',
            'text':'What would you like to know?',
            'buttons':[
                {
                    'type':'postback',
                    'title':'I need something else.',
                    'payload':'faq_q0'
                },
                {
                    'type':'postback',
                    'title':'What is the answer to life, universe and everything?',
                    'payload':'faq_q1'
                },
                {
                    'type':'postback',
                    'title':'What is not the answer to life universe and everything?',
                    'payload':'faq_q2'
                }
            ]
        }
    }
}
var reply_eoc =  {
    attachment: {
        'type':'template',
        'payload':{
            'template_type':'button',
            'text':'Is there anything else I can help you with?',
            'buttons':[
                {
                    'type':'postback',
                    'title':'That is all for now.',
                    'payload':'eoc_q0'
                },
                {
                    'type':'postback',
                    'title':'What jobs are currently available?',
                    'payload':'eoc_q1'
                },
                {
                    'type':'postback',
                    'title':'I need to see the FAQ.',
                    'payload':'eoc_q2'
                }
            ]
        }
    }
}
var reply_faq_extend = {
    attachment: {
        'type':'template',
        'payload':{
            'template_type':'button',
            'text':'Do you have another frequently asked question?',
            'buttons':[
                {
                    'type':'postback',
                    'title':'No, thanks.',
                    'payload':'faq_extend_q0'
                },
                {
                    'type':'postback',
                    'title':'Yes, please.',
                    'payload':'faq_extend_q1'
                }
            ]
        }
    }
}



// Bot receives message from user
controller.hears('faq','message_received', function (bot, message) {
  console.log("Message has been received: faq")
  
  // Start a conversation to handle this response
  bot.startConversation(message,function(err,convo) {
    convo.say('Here are our FAQs.');
    convo.say(reply_faq);
    });
});

// Bot receives click on buttons
controller.on('facebook_postback', function (bot, message) {
    switch (message){
        
        // EOC (End of Conversation) cases
        case 'eoc_q0':
            bot.say(message, 'I hope to hear from you again soon! Have a nice day.');
            break;
        
        case 'eoc_q1':
            bot.say(message, 'This feature will be available soon.');
            break;
            
        case 'eoc_q2':
            bot.say(message, 'Sure!');
            bot.say(message, reply_faq);
            break;
                    
          
        // FAQ (Frequently Asked Questions) cases
        case 'faq_q0':
            bot.say(message, 'What else can I help you with?');
            bot.say(message, reply_eoc);
            break;
            
        case 'faq_q1':
            bot.say(message, 'The answers is 42.');
            bot.say(message, reply_faq_extend);
            break;
            
        case 'faq_q2':
            bot.say(message, 'The answer is not 42.');
            bot.say(message, reply_faq_extend);
            break;
        
        
        // FAQ_Extend cases
        case 'faq_extend_q0':
            bot.say(message, reply_eoc);
            break;
            
        case 'faq_extend_q1':
            bot.say(message, reply_faq);
            break;
          
         // Default case          
        default:
            bot.say(reply_eoc);
            break;
       }
      
})
