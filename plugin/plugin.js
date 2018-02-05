// The localbot plugin

const parse = require("./parse.js");
const execute = require("./execute.js");

function onCommand(ct){
	let command = parse(ct.message); // throws if not successful
	console.log('command:', command);
	ct.shoe.emit("localbot.refresh", execute(ct.user().id, command));
	ct.reply("ok", true);
}

exports.registerCommands = function(cb){
	cb({
		name: 'localbot',
		fun: onCommand,
		help: "This isn't documented right now. Ask @dystroy if you want"
	});
}

exports.registerRoutes = map=>{
	map("get", /^\/localbot\/script.js/, require("./script.js"));
}
