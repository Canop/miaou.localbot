// answer to /localbot/script.js queries

const db = require("./db.js");

function handlerScript(handler){
	return `miaou.localbot.store.setHandler({
		id: ${handler.id},
		name: "${handler.name}",
		on: "${handler.on}",
		disabled: ${handler.disabled},
		if: ${handler.if},
		doBody: ${JSON.stringify(handler.doBody)},
		do: (event)=>{ ${handler.doBody} },
	}${handler.activeInRoom ? ", true" : ""});`;
}

module.exports = async function(req, res, next){
	let	userId = req.user.id,
		roomId = req.query.room,
		handlerName = req.query.handler;
	res.set('Content-Type', 'application/javascript');
	if (handlerName) {
		let handler = await db.getHandlerByName(userId, handlerName);
		return res.send(handlerScript(handler));
	} else {
		let handlers = await db.getRoomUserHandlers(userId, roomId);
		return res.send(handlers.map(handlerScript).join("\n"));
	}
};
