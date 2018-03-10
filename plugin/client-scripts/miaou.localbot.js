miaou(function(localbot, chat, gui, horn, locals, md, plugins, ws){

	localbot.enabled = true;
	localbot.autoload = localStorage.getItem("localbot.autoload") == "true";

	let userVars = {};

	class Event{
		constructor(eventType, {message, user}){
			this.eventType = eventType;
			this.message = message;
			this.user = user;
			this.vars = userVars;
		}
		content(){
			if (this.message) return this.message.content;
			return this.user.name;
		}
		_content(text, repliedTo, flake){
			let s = text||"";
			if (typeof repliedTo==="string") {
				s = "@"+repliedTo+" "+text;
			} else if (typeof repliedTo==="object") {
				s = "@"+repliedTo.authorname+"#"+repliedTo.id+" "+text;
			}
			if (flake) s = "!!flake " + s;
			return s;
		}
		messages({self=false, flakes=false, deleted=false} = {}){
			return $("#messages .message").map(function(){
				return $(this).dat("message");
			}).get().filter(function(m){
				if (!deleted && !m.content) return false;
				if (!self && m.author===locals.me.id) return false;
				if (!flakes && !m.id) return false;
				return true;
			});
		}
		send(text, flake){
			$("#input").val(this._content(text, null, flake));
		}
		autoSend(text, flake){
			chat.sendMessage(this._content(text, null, flake));
		}
		sendTo(text, user, flake){
			if (user===undefined || typeof user==="boolean") {
				flake = user;
				user = this.user;
			}
			$("#input").val(this._content(text, user.name, flake));
		}
		autoSendTo(text, user, flake){
			if (user===undefined || typeof user==="boolean") {
				flake = user;
				user = this.user;
			}
			chat.sendMessage(this._content(text, user.name, flake));
		}
		reply(text, flake){
			$("#input").val(this._content(text, this.message, flake));
		}
		autoReply(text, flake){
			chat.sendMessage(this._content(text, this.message, flake));
		}
		honk(){
			horn.honk();
		}
		notif(text){
			horn.show(0, null, "localbot", text);
		}
	}

	localbot.refresh = function(handler){
		let url = "localbot/script.js?time="+Date.now();
		if (handler) url += "&handler="+encodeURIComponent(handler);
		url += "&room="+locals.room.id;
		let script = document.createElement("script");
		script.setAttribute("src", url);
		document.head.appendChild(script);
	}

	localbot.editHandler = function(handler){
		let c = [
			`!!localbot edit ${handler.name}`,
			`on: ${handler.on}`
		];
		if (handler.disabled) c.push("disabled: true");
		if (handler.if) c.push(`if: ${handler.if}`);
		c.push(...handler.doBody.split("\n").map(l=>"\t"+l.trim()));
		setTimeout(function(){
			$("#input").val(c.join("\n"));
		}, 0);
	}

	// displays the error and optionally restores the message's content for edition
	function showError(error, content){
		md.showError(error);
		if (content) {
			setTimeout(function(){
				$("#input").val(content);
			}, 0);
		}
		return false;
	}

	function addStats(handler){
		ws.emit("localbot.triggered", handler.id);
	}

	chat.on("incoming_message", function(message){
		if (!localbot.enabled) return;
		if (message.author===locals.me.id) return;
		let content = message.content;
		if (!content) return;
		let event = new Event("incoming_message", {message});
		for (let h of localbot.store.handlers("incoming_message")) {
			if (h.disabled || !h.active) continue;
			if (
				!h.if ||
				h.if.test(content) // assuming regexp
			) {
				console.log("localbot handler triggered:", h);
				addStats(h);
				try {
					h.do(event);
				} catch (e) {
					console.log("Error in handler:", e);
					return showError(
						`localbot "${h.name}" handler crashed (see console).`
					);

				}
			}
		}
	});

	chat.on("sending_message", function(message){
		if (!localbot.enabled) return;
		let content = message.content;
		if (!content) return;
		if (/^!!localbot\b/.test(content)) {
			localbot.updateMenu();
			let editMatch = content.match(/^!!localbot\s+edit\s+([\w-]+)\s*$/);
			if (editMatch) {
				// user asks for edition and doesn't provide the content of the handler
				// so we complete the message
				let name = editMatch[1];
				let handler = localbot.store.getHandler(name);
				if (!handler) return showError("Handler not found", content);
				else localbot.editHandler(handler);
				return false;
			}
			return;
		}
		if (md.shownErrors().length) return;
		let event = new Event("sending_message", {message});
		for (let h of localbot.store.handlers("sending_message")) {
			if (h.disabled || !h.active) continue;
			if (
				!h.if ||
				h.if.test(content) // assuming regexp
			) {
				console.log("localbot handler triggered:", h);
				addStats(h);
				let r;
				try {
					r = h.do(event);
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

	chat.on("incoming_user", function(user){
		if (!localbot.enabled) return;
		if (user.id===locals.me.id) return;
		let event = new Event("incoming_user", {user});
		for (let h of localbot.store.handlers("incoming_user")) {
			if (h.disabled || !h.active) continue;
			if (
				!h.if ||
				h.if.test(user.name) // assuming regexp
			) {
				console.log("localbot handler triggered:", h);
				addStats(h);
				try {
					h.do(event);
				} catch (e) {
					console.log("Error in handler:", e);
					return showError(
						`localbot "${h.name}" handler crashed (see console).`
					);
				}
			}
		}
	});

	plugins.add("localbot", {
		start: function(){
			if (gui.mobile) return;
			localbot.registerAutocomplete();
			ws.on("localbot.refresh", function(arg){
				localbot.refresh(arg.handler);
			});
		}
	});

	if (localbot.autoload) localbot.refresh();
});
