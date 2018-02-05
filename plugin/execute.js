
const db = require("./db.js");

module.exports = function executeCommand(userId, command){
	switch (command.verb) {
	case "add":
	case "edit":
		db.addHandler(userId, command.handler);
		return {handler: command.name};
	case "enable":
		command.handler.disabled = false;
		return {handler: command.name};
	case "disable":
		command.handler.disabled = true;
		return {handler: command.name};
	default:
		throw new Error("unknown verb: " + command.verb);
	}

}
