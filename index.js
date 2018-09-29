const puppeteer = require('puppeteer');
const $ = require('cheerio');
const schedule = require('node-schedule');
const accountSid = process.env.TWILIO_ID;
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);
const url = 'https://apps.wharton.upenn.edu/spike/';
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`QSR Rooms listening on port ${port}!`))



var j = schedule.scheduleJob({hour: 12, minute: 00}, function(){
  puppeteer
  .launch()
  .then(function(browser) {
    return browser.newPage();
  })
  .then(function(page) {
    return page.goto(url).then(function() {
      return page.content();
    });
  })
  .then(function(html) {
  var times = $('#module_gsr', html).last().find('p').first().text().replace('\t\t\t\t','').replace((/  |\r\n|\n|\r/gm),"").replace('Quiet Study Rooms:', "").split('PM')

  for(var i = 0; i < times.length; i++){
    times[i] = times[i].trim().replace(/\t/, '');
  }
  var timeString = times.join('PM ');

  client.messages
    .create({
       body: timeString,
       from: '+19514064203',
       to: '+16616447878'
     })
    .then(message => console.log(message.sid))
    .done();
    client.messages
      .create({
         body: timeString,
         from: '+19514064203',
         to: '+19095879302'
       })
      .then(message => console.log(message.sid))
      .done();
      client.messages
        .create({
           body: timeString,
           from: '+19514064203',
           to: '+17324031686'
         })
        .then(message => console.log(message.sid))
        .done();

  })
});



//   puppeteer
//   .launch()
//   .then(function(browser) {
//     return browser.newPage();
//   })
//   .then(function(page) {
//     return page.goto(url).then(function() {
//       return page.content();
//     });
//   })
//   .then(function(html) {
//   console.log($('#module_gsr', html).last().find('p').first().text().trim().replace(/\s+/, "") );
//
//   })
//   .catch(function(err) {
//     //handle error
//   });
// });
