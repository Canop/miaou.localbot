// manage persistance of user vars and handlers

const userStores = new Map; // userId=>{handlers}

function getUserStore(userId){
	let us = userStores.get(userId);
	if (!us) {
		userStores.set(userId, us={handlers: new Map});
	}
	return us;
}

exports.addHandler = function(userId, name, handler){
	getUserStore(userId).handlers.set(name, handler);
}

exports.getHandler = function(userId, name){
	return getUserStore(userId).handlers.get(name);
}
