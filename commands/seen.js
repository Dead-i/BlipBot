var moment = require('moment');

module.exports = function(service) {
	service.on('lastseen', function(data) {
		if (data.ex.length < 1) {
			return service.sendMessage('This will display how long a user has been idle for.', data.user.name);
		}
		
		var user = data.ex[0];
		if (user.substring(0, 1) == '@') {
			user = user.substring(1);	
		}
		
		for (var i in service.messages) {
			var data = service.messages[i];
			if (data.user_name == user) {
				return service.sendMessage('I last saw @' + user + ' ' + moment(data.time).fromNow() + ' saying: ' + service.parseMessage(data.message), data.user.name);
			}
		}
		
		service.sendMessage('I have not seen @' + user + ' speak recently.', data.user.name);
	});
};