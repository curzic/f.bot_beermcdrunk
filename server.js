var Botkit = require('botkit')
var jobs = require('/data/jobs.json');

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
                    'payload':'f_q0'
                },
                {
                    'type':'postback',
                    'title':'What is the answer to life, universe and everything?',
                    'payload':'f_q1'
                },
                {
                    'type':'postback',
                    'title':'What is not the answer to life universe and everything?',
                    'payload':'f_q2'
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
                    'payload':'f_extend_q0'
                },
                {
                    'type':'postback',
                    'title':'Yes, please.',
                    'payload':'f_extend_q1'
                }
            ]
        }
    }
}

controller.hears(['job'],'message_received', function(bot, message){
	var reply_job_attachments =  {
        attachment: {
          'type':'template',
          'payload':{
           'template_type':'generic',
           'elements':[
            ]
          }
        }
      };
	sendJobs = function(response, convo) {
		var res = response.split(" ");
		var test=0;
		foreach(tech in res){
			foreach(job in jobs){
				if(job.fields.technologies.indexOf(tech) > -1)
				{
					test=1;
					msgTemplate=createMsgTemplate(job);
				}
			}
		}
		if(test ==0){
			convo.say("Sorry no jobs");
		}else{
			convo.say(reply_job_attachments);
		}
		
	}

	createMsgTemplate = function(job){
		var element = {
               'title':job.fields.title,
               'image_url':'https://upload.wikimedia.org/wikipedia/en/9/9a/HP_Logo_with_Banner.jpg',
               'subtitle':job.fields.description,
               'buttons':[
                 {
                   'type':'postback',
                   'title':'Know more',
                   'payload':'job_ID'+job.pk
                  }
               ]
             };
         reply_job_attachments.attachment.payload.elements.push(element);
	}

	askFlavor = function(response, convo) {
      convo.ask('Thanks for your interest in our job postings. Please enter the technologies you are interested in. I will try to sort out the jobs for you', function(response, convo) {
        convo.say('Awesome. Here are the jobs related to your interest.');
        sendJobs(response, convo);
        convo.next();
      });
    }

	bot.startConversation(message,askFlavor);
});
// Bot receives message from user
controller.hears('faq','message_received', function (bot, message) {
  console.log("Message has been received: faq")
  
  // Start a conversation to handle this response
  bot.startConversation(message,function(err,convo) {
    convo.say('Here are our FAQs.');
    convo.say(reply_faq);
    convo.say('convo');
    });
});

// Bot receives click on buttons
controller.on('postback', function (bot, message) {
    bot.say('test');
    
    switch (message){
        
        // EOC (End of Conversation) cases
        case 'eoc_q0':
            bot.say('I hope to hear from you again soon! Have a nice day.');
            break;
        
        case 'eoc_q1':
            bot.say('This feature will be available soon.');
            break;
            
        case 'eoc_q2':
            bot.say('Sure!');
            bot.say(reply_faq);
            break;
                    
          
        // FAQ (Frequently Asked Questions) cases
        case 'f_q0':
            bot.say('What else can I help you with?');
            bot.say(reply_eoc);
            break;
            
        case 'f_q1':
            bot.say('The answers is 42.');
            bot.say(reply_faq_extend);
            break;
            
        case 'f_q2':
            bot.say('The answer is not 42.');
            bot.say(reply_faq_extend);
            break;
        
        
        // FAQ_Extend cases
        case 'f_extend_q0':
            bot.say(reply_eoc);
            break;
            
        case 'f_extend_q1':
            bot.say(reply_faq);
            break;
          
         // Default case          
        default:
            bot.say(reply_eoc);
            break;
    }
});
