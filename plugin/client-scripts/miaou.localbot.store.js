miaou(function(localbot, chat, locals, plugins){

	const handlersByEventType = {
		sending_message: new Map // name->handler
	};

	function setHandler(handler){
		console.log("setHandler", handler);
		let handlers = handlersByEventType[handler.on];
		if (!handlers) throw new Error("Unsupported Event type: " + handler.on);
		handlers.set(handler.name, handler);
	}

	function getHandler(name){
		return handlersByEventType.sending_message.get(name);
	}

	localbot.store = {
		handlers: eventType => handlersByEventType[eventType].values(),
		setHandler,
		getHandler,
	};

});

