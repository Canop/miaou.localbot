miaou(function(localbot, chat, locals, plugins, ws){

	localbot.refresh = function(handler){
		let url = "localbot/script.js?time="+Date.now();
		if (handler) url += "&handler="+encodeURIComponent(handler);
		let script = document.createElement("script");
		script.setAttribute("src", url);
		document.head.appendChild(script);
	}

	chat.on("sending_message", function(message){
		if (!message.content) return;
		if (/^!!localbot\b/.test(message.content)) {
			return;
		}
		for (var h of localbot.store.handlers("sending_message")) {
			if (h.if.test(message.content)) {
				console.log("localbot handler triggered:", h);
				h.do();
			}
		}
	});

	plugins.add("localbot", {
		start: function(){
			localbot.registerAutocomplete();
			ws.on("localbot.refresh", function(arg){
				console.log('ws.receive refresh arg:', arg);
				if (arg.handler) localbot.refresh(arg.handler);
			});
		}
	});
});
