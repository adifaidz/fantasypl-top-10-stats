// A simple hello world microservice 
// Click "Deploy Service" to deploy this code
// Service will respond to HTTP requests with a string
module['exports'] = function helloWorld (hook) {
  var request = require('request');
  const cheerio = require('cheerio');
  var $ = cheerio.load(hook.params.text);
  var output = '```md\n';
  $('h3').each(function(i, header){
      var rows = $($('table>tbody')[i]).find('tr');
      var sign = i % 2 === 0 ? ' ⬆ ' : ' ⬇ ';
      
      output += '# ' + $(header).text() + ' #:\n';

      rows.each(function(i, row){
        var cells = $(row).find('td');
        var name = $(cells[0]).text();
        var team = $(cells[1]).text();
        var newprice = $(cells[5]).text();
        // var position = $(cells[2]).text();
        // var ownership = $(cells[3]).text();
        // var oldprice = $(cells[4]).text();
        // var diff = $(cells[6]).text();

        output += name + ' ('+team+') ' + sign + newprice + '\n';
      });

      output += '\n\n';
  });
  output += '```';

  var content = {
    "username":"FPL Updates",
    "avatar_url":"https://fantasy.premierleague.com/static/libsass/plfpl/dist/img/facebook-share.png",
    "content": output,
    "embeds":[
        {
          "title": hook.params.title,
          "url": hook.params.url,
          "color":65415,
          "footer":{
              "text": "automated from /r/FantasyPL",
              "icon_url":"https://fantasy.premierleague.com/static/libsass/plfpl/dist/img/facebook-share.png"
          }
        }
    ]
  };

  return request.post({
    url : 'https://discordapp.com/api/webhooks/479192426062413825/8ITUz1M8gL4kGELGZW6ulqGFY6oUWhjOXEGYT-o_c6PVlorVWklf4avs_jjS5Z1hl9_0', 
    body : content,
    json: true
  },function (err, res, body) {
      if (err) {
        hook.res.end(err.messsage);
      }
      hook.res.end(body);
  });
};