
const db = require("./db.js");

module.exports = function executeCommand(userId, command){
	if (command.verb==="add") {
		db.addHandler(userId, command.name, command.handler);
		return {handler: command.name};
	}
	throw new Error("unknown verb: " + command.verb);

}
