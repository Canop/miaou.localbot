miaou(function(localbot, ed){

	const argSequences = [
		["list", ["vars", "handlers"]],
		["add"],
		["edit"],
		["delete"],
		["enable"],
		["disable"],
		["set"],
		["get"],
		["reload"]
	];
	const NB_DEEP_ARGS = 0;
	const firstArgs = argSequences.map(function(v){
		return v[0];
	});
	function autocompleteArg(ac){
		if (!ac.previous) return firstArgs;
		for (let i=0; i<NB_DEEP_ARGS; i++) {
			let arr = argSequences[i];
			if (arr.length>1 && arr[0]===ac.previous) {
				return arr[1];
			}
		}
	}

	localbot.registerAutocomplete = function(){
		ed.registerCommandArgAutocompleter("localbot", autocompleteArg);
	}

});

