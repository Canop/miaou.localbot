miaou(function(localbot, chat, locals, plugins){

	const handlersByEventType = {
		sending_message: new Map // name->handler
	};

	function setHandler(name, handler){
		console.log("setHandler", name, handler);
		let handlers = handlersByEventType[handler.on];
		if (!handlers) throw new Error("Unsupported Event type: " + handler.on);
		handlers.set(name, handler);
	}

	localbot.store = {
		handlers: eventType => handlersByEventType[eventType].values(),
		setHandler,
	};

});

