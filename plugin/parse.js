// parse !!localbot commands

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
		m = line.match(/^if:\s+(.+?)\s*$/);
		if (m) {
			if (/^\/(.+)\/(\w*)$/.test(m[1])) {
				h.if = m[1];
			} else {
				h.if = `(s)=>s.includes(${JSON.stringify(m[1])})`;
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
	let doBody = doLines.join("\n");
	new Function("content", doBody);
	h.do = `(content)=>{${doBody}}`;
	if (h.on) {
		if (h.on!=="sending_message") throw new Error("unknown event type");
	} else {
		h.on = "sending_message";
	}
	if (!h.if) h.if = "()=>true";
	return h;
}

// returns a command object, or throws an error
// commands are {verb, name, handler}
module.exports = function parse(content){
	let m = content.match(/^!!\w+\s+(\w+)(?:\s+(.*))?(?:\n([\s\S]+))?/);
	console.log('m:', m);
	if (!m) throw new Error("Invalid localbot command");
	let [, verb, name, body] = m;
	switch (verb) {
	case "add":
		if (!name) throw new Error("missing name");
		let handler = parseHandler(body);
		return {name, verb, handler};
	default:
		throw new Error("unknown command : " + verb);
	}
}
