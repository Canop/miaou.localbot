miaou(function(localbot, chat, locals, md, plugins, ws){

	localbot.refresh = function(handler){
		let url = "localbot/script.js?time="+Date.now();
		if (handler) url += "&handler="+encodeURIComponent(handler);
		let script = document.createElement("script");
		script.setAttribute("src", url);
		document.head.appendChild(script);
	}

	function editHandler(handler){
		let c = [
			`!!localbot edit ${handler.name}`,
			`on: ${handler.on}`
		];
		if (handler.disabled) c.push("disabled: true");
		if (handler.if) c.push(`if: ${handler.if}`);
		c.push(handler.doBody);
		setTimeout(function(){
			$("#input").val(c.join("\n"));
		}, 0);
	}

	// displays the error and restores the message's content for edition
	function showError(error, content){
		md.showError(error);
		setTimeout(function(){
			$("#input").val(content);
		}, 0);
		return false;
	}

	chat.on("sending_message", function(message){
		let content = message.content;
		if (!content) return;
		let lb = {};
		if (/^!!localbot\b/.test(content)) {
			var editMatch = content.match(/^!!localbot\s+edit\s+([\w-]+)\s*$/);
			if (editMatch) {
				// user asks for edition and doesn't provide the content of the handler
				// so we complete the message
				let name = editMatch[1];
				let handler = localbot.store.getHandler(name);
				if (!handler) return showError("Handler not found", content);
				if (handler.room!==locals.room.id) return showError("Wrong room", content);
				else editHandler(handler);
				return false;
			}
			return;
		}
		if (md.shownErrors().length) return;
		for (var h of localbot.store.handlers("sending_message")) {
			if (h.disabled) continue;
			if (
				!h.if ||
				h.if.test(content) // assuming regexp
			) {
				console.log("localbot handler triggered:", h);
				var r;
				try {
					r = h.do(content, lb);
				} catch (e) {
					console.log("Error in handler:", e);
					return showError(
						`localbot "${h.name}" handler crashed (see console).`+
						`Hit [enter] again to send initial message.`,
						content
					);

				}
				console.log("Handler returned", r);
				if (typeof r==="string" && r!==content) {
					return showError(
						`localbot "${h.name}" handler modified the message.`+
						`Hit [enter] again to send it.`,
						r
					);
				}
				if (r===false) {
					return showError(
						`localbot's "${h.name}" handler prevented message sending`,
						content
					);
				}
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
