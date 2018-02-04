// answer to /localbot/script.js queries

const db = require("./db.js");

function handlerScript(userId, handlerName){
	let handler = db.getHandler(userId, handlerName);
	if (!handler) return `miaou.localbot.store.removeHandler("${handlerName}")`;
	return `miaou.localbot.store.setHandler("${handlerName}", {
		on: "${handler.on}",
		if: ${handler.if},
		do: ${handler.do},
	})`;
}

module.exports = function(req, res, next){
	let	userId = req.user.id,
		handlerName = req.query.handler;
	console.log('userId:', userId);
	console.log('handlerName:', handlerName);
	if (handlerName) return res.send(handlerScript(userId, handlerName));
	res.send("alert('localbot get query not understood')");
};
