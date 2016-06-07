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
               'subtitle':'A sweet Bavarian beer of quality taste.',
               'buttons':[
                 {
                   'type':'postback',
                   'title':'I am a sweet person.',
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
                   'title':'I am classy as @#$%.',
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

controller.on('facebook_postback', function (bot, message) {
  bot.reply(message, "If I may say, good choice, Sir!")
})
