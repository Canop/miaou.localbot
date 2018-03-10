
const db = require("./db.js");
const Error = require("./Error.js");

module.exports = async function executeCommand(userId, command){
	switch (command.verb) {
	case "add":
		await db.addHandler(userId, command.handler);
		return {handler: command.name};
	case "edit":
		await db.editHandler(userId, command.handler);
		return {handler: command.name};
	case "enable":
		command.handler.disabled = false;
		return {handler: command.name};
	case "disable":
		command.handler.disabled = true;
		return {handler: command.name};
	case "list":
		return ["known handlers:", ...await db.allHandlerNames(userId)].join('\n* ');
	case "load":
		return {handler: command.name};
	default:
		throw new Error("unknown verb: " + command.verb);
	}

}
