// The localbot plugin

const parse = require("./parse.js");
const db = require("./db.js");
const stats = require("./stats.js");
const execute = require("./execute.js");

exports.name = "localbot";

async function onCommand(ct){
	if (/^stats/.test(ct.args)) {
		return await stats.onCommand(ct);
	}
	let command = await parse(ct.message); // throws if not successful
	console.log('command:', command);
	let r = await execute(ct.user().id, command);
	if (typeof r === "string") ct.reply(r);
	else if (typeof r === "object") ct.shoe.emit("localbot.refresh", r);
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

exports.init = function(miaou){
	require("./db.js").init(exports.name, miaou);
}

exports.onNewShoe = function(shoe){
	shoe.socket
	.on('localbot.activate', function(arg){ // FIXME check userId ?
		db.activateHandlerInRoom(arg.handlerId, arg.roomId);
	})
	.on('localbot.unactivate', function(arg){
		db.unactivateHandlerInRoom(arg.handlerId, arg.roomId);
	})
	.on('localbot.triggered', function(handlerId){
		console.log(`localbot ${handlerId} triggered for @${shoe.publicUser.name} in room ${shoe.room.id}`);
		stats.triggered(shoe.publicUser.id, shoe.room.id, handlerId);
	})
}

