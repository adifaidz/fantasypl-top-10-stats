// A simple hello world microservice 
// Click "Deploy Service" to deploy this code
// Service will respond to HTTP requests with a string
module['exports'] = function helloWorld (hook) {
  console.log(hook.params);

  var request = require('request');
  const cheerio = require('cheerio');
  var Table = require('easy-table');
  var $ = cheerio.load(hook.params.text);
  var output = '```md\n';

  $('h3').each(function(i, header){
      var rows = $($('table>tbody')[i]).find('tr');
      var sign = i % 2 === 0 ? ' ⬆ ' : ' ⬇ ';
      
      output += '# ' + $(header).text() + ' #:\n\n';
      var table = new Table;
      rows.each(function(i, row){
        var cells = $(row).find('td');
        table.cell('Name', $(cells[0]).text());
        table.cell('Net Transfers', $(cells[1]).text());
        table.cell('Change %', $(cells[2]).text());
        table.cell('Ownership %', $(cells[3]).text());
        table.newRow();
      });
      output += table.toString();
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

  console.log(content);

  return request.post({
    url : 'https://discordapp.com/api/webhooks/479192426062413825/8ITUz1M8gL4kGELGZW6ulqGFY6oUWhjOXEGYT-o_c6PVlorVWklf4avs_jjS5Z1hl9_0', 
    body : content,
    json: true
  },function (err, res, body) {
      if (err) {
        console.log("Error : "+err.message);
        return hook.res.end(err.messsage);
      }
      console.log("Success");
      hook.res.end(body);
  });
};