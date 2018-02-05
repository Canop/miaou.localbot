// manage persistance of user vars and handlers

const userStores = new Map; // userId=>{handlers}

function getStore(userId){
	let us = userStores.get(userId);
	if (!us) {
		userStores.set(userId, us={handlers: new Map});
	}
	return us;
}

exports.addHandler = function(userId, handler){
	getStore(userId).handlers.set(handler.name, handler);
}

exports.getHandler = function(userId, name){
	return getStore(userId).handlers.get(name);
}
