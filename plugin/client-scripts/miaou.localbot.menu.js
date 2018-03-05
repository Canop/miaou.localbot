miaou(function(localbot, chat, horn, locals, md, plugins, ws){

	let	$content,
		$toggle,
		$handlers;

	function buildMenu(){
		if ($content) return;
		let $menu = $("<div id=localbot-menu>").appendTo(document.body);
		$("<div class=menu-opener>").text("🤖").appendTo($menu);
		$content = $("<div class=menu-content>").appendTo($menu);
		$handlers = $("<div class=localbot-handlers>").appendTo($content);
		$toggle = $("<button class=small>")
		.click(function(){
			localbot.enabled = !localbot.enabled;
			localbot.updateMenu();
		})
		.appendTo($content);
	}

	localbot.updateMenu = function(){
		buildMenu();
		let handlers = localbot.store.allHandlers;
		console.log('handlers:', handlers);
		$handlers.empty();
		$toggle.text((localbot.enabled ? "disable" : "enable") + " LocalBot");
		for (let handler of handlers.values()) {
			let $handler = $("<div class=localbot-handler>").append(
				$("<input type=checkbox disabled>").prop("checked", !handler.disabled),
				$("<span class=on>").text(handler.on),
				$("<span class=name>").text(handler.name),
			);
			$handler.appendTo($handlers);
		}

	}

});
