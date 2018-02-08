// answer to /localbot/script.js queries

const db = require("./db.js");

function handlerScript(userId, handlerName){
	let handler = db.getHandler(userId, handlerName);
	if (!handler) return `miaou.localbot.store.removeHandler("${handlerName}");`;
	return `miaou.localbot.store.setHandler({
		name: "${handler.name}",
		room: ${handler.room},
		on: "${handler.on}",
		disabled: ${handler.disabled},
		if: ${handler.if},
		doBody: ${JSON.stringify(handler.doBody)},
		do: (event)=>{ ${handler.doBody} },
	});`;
}

module.exports = function(req, res, next){
	let	userId = req.user.id,
		handlerName = req.query.handler;
	if (handlerName) return res.send(handlerScript(userId, handlerName));
	res.send("alert('localbot get query not understood')");
};
