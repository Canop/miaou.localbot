miaou(function(localbot, chat, locals, plugins){

	const eventTypes = ["sending_message", "incoming_message", "incoming_user", "leaving_user"];

	const handlersByEventType = eventTypes.reduce((o, e) => {
		o[e]=new Set;
		return o;
	}, {});

	const allHandlers = new Map; // name=>handler

	function setHandler(handler, activeInRoom){
		console.log("setHandler", handler, activeInRoom);
		let oldHandler = allHandlers.get(handler.name);
		if (oldHandler) {
			handlersByEventType[oldHandler.on].delete(oldHandler);
		}
		let handlers = handlersByEventType[handler.on];
		if (!handlers) throw new Error("Unsupported Event type: " + handler.on);
		handlers.add(handler);
		allHandlers.set(handler.name, handler);
		handler.active = !!activeInRoom;
		localbot.updateMenu();
	}

	localbot.store = {
		handlers: eventType => handlersByEventType[eventType].values(),
		setHandler,
		getHandler: name => allHandlers.get(name),
		allHandlers
	};

});

