// parse !!localbot commands

const db = require("./db.js");
const Error = require("./Error.js");

function parseHandler(body){
	if (!body) throw new Error("Empty handler");
	let h = {};
	let doLines = [];
	for (let line of body.split("\n")) {
		let m = line.match(/^on:?\s+([\w-]+)$/);
		if (m) {
			h.on = m[1];
			continue;
		}
		m = line.match(/^disabled:?\s+(true|false)$/);
		if (m) {
			h.disabled = m[1]=="true";
			continue;
		}
		m = line.match(/^if:\s+(.+?)\s*$/);
		if (m) {
			if (/^\/(.+)\/(\w*)$/.test(m[1])) {
				h.if = m[1];
			} else {
				h.if = new RegExp(m[1].replace(/[!$()*+.:<=>?[\\\]^{|}-]/g, "\\$&")).toString();
			}
			continue;
		}
		m = line.match(/^(?:do:)?\s*(.+)$/);
		console.log('do m:', m);
		if (m) {
			doLines.push(m[1]);
		}
	}
	if (!doLines.length) throw new Error("No function body found");
	h.doBody = doLines.join("\n");
	new Function("content", h.doBody); // basic check of correctness
	if (h.on) {
		if (h.on!=="sending_message") throw new Error("unknown event type");
	} else {
		h.on = "sending_message";
	}
	h.disabled = !!h.disabled;
	return h;
}

// returns a command object, or throws an error
// commands are {verb, name, handler}
module.exports = function parse(message){
	let m = message.content.match(/^!!\w+\s+(\w+)(?:\s+(.*))?(?:\n([\s\S]+))?/);
	console.log('m:', m);
	if (!m) throw new Error("Invalid localbot command");
	let [, verb, name, body] = m;
	let handler;
	switch (verb) {
	case "edit":
		// we'll handle edition like addition, but we check room is the same
		if (!name) throw new Error("missing name");
		handler = db.getHandler(message.author, name);
		if (handler) {
			if (handler.room!==message.room) {
				throw new Error("room changed");
			}
		}
	case "add":
		if (!name) throw new Error("missing name");
		handler = parseHandler(body);
		handler.name = name;
		handler.room = message.room;
		break;
	case "enable":
	case "disable":
		handler = db.getHandler(message.author, name);
		if (!name) throw new Error("missing name");
		break;
	default:
		throw new Error("unknown command : " + verb);
	}
	return {name, verb, handler};
}
