miaou(function(localbot, chat, horn, locals, md, plugins, ws){

	let	$content,
		$toggleLocalbot,
		$toggleAutoload,
		$handlers;

	function buildMenu(){
		if ($content) return;
		let $menu = $("<div id=localbot-menu>").appendTo(document.body);
		$("<div class=menu-opener>").text("🤖").appendTo($menu);
		$content = $("<div class=menu-content>").appendTo($menu);
		$handlers = $("<div class=localbot-handlers>").appendTo($content);
		$buttons = $("<div class=buttons>").appendTo($content);
		$toggleLocalbot = $("<button class=small>")
		.click(function(){
			localbot.enabled = !localbot.enabled;
			localbot.updateMenu();
		})
		.appendTo($buttons);
		$toggleAutoload = $("<button class=small>")
		.click(function(){
			localbot.autoload = !localbot.autoload;
			localStorage.setItem("localbot.autoload", localbot.autoload);
			if (localbot.autoload) localbot.refresh();
			localbot.updateMenu();
		})
		.appendTo($buttons);
	}

	localbot.updateMenu = function(){
		buildMenu();
		let handlers = localbot.store.allHandlers;
		console.log('handlers:', handlers);
		$handlers.empty();
		$toggleLocalbot.text((localbot.enabled ? "disable" : "enable") + " LocalBot");
		$toggleAutoload.text((localbot.autoload ? "disable" : "enable") + " autoloading");
		for (let handler of handlers.values()) {
			let $handler = $("<div class=localbot-handler>").append(
				$("<span class=on>").text(handler.on),
				$("<span class=name>").text(handler.name).click(()=>{
					localbot.editHandler(handler);
				})
			);
			if (handler.disabled) {
				$("<input type=checkbox disabled>").prependTo($handler);
			} else if (handler.active) {
				$("<input type=checkbox checked>").click(function(){
					handler.active = false;
					ws.emit("localbot.unactivate", {handlerId:handler.id, roomId:locals.room.id});
				}).prependTo($handler);
			} else {
				$("<input type=checkbox>").click(function(){
					handler.active = true;
					ws.emit("localbot.activate", {handlerId:handler.id, roomId:locals.room.id});
				}).prependTo($handler);
			}
			$handler.appendTo($handlers);
		}

	}

});
