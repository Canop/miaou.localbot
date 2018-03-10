// for now stats are in memory only

class URH{
	constructor(userId, roomId, handlerId){
		this.userId = userId;
		this.roomId = roomId;
		this.handlerId = handlerId;
		this.count = 0;
	}
	match(userId, roomId, handlerId){
		if (userId && userId!=this.userId) return false;
		if (roomId && roomId!=this.roomId) return false;
		if (handlerId && handlerId!=this.handlerId) return false;
		return true;
	}
	triggered(){
		this.count++;
	}
}

const stats = new Map; // user-room-handler => URH

function getURH(userId, roomId, handlerId){
	let key = `${userId}-${roomId}-${handlerId}`;
	let urh = stats.get(key);
	if (!urh) stats.set(key, urh = new URH(userId, roomId, handlerId));
	return urh;
}

exports.triggered = function(userId, roomId, handlerId){
	getURH(userId, roomId, handlerId).triggered();
}

function mdStatsRoom(roomId){
	let urhs = Array.from(stats.values()).filter(u => u.roomId===roomId);
	if (!urhs.length) return ["no recent localbot usage in this room"];
	let byUser = urhs.reduce((m, u)=>m.set(u.userId, (m.get(u.userId)||0)+u.count), new Map);
	let md = ["user|count", "-|-"];
	for (let [userId, count] of byUser) md.push(userId+"|"+count);
	return md;
}

function mdStatsRooms(){
	let urhs = Array.from(stats.values());
	if (!urhs.length) return ["no recent localbot usage"];
	let byRoom = urhs.reduce((m, u)=>m.set(u.roomId, (m.get(u.roomId)||0)+u.count), new Map);
	let md = ["room|count", "-|-"];
	for (let [roomId, count] of byRoom) md.push(roomId+"|"+count);
	return md;
}

function mdStatsUser(userId){
	let urhs = Array.from(stats.values()).filter(u => u.userId===userId);
	if (!urhs.length) return ["no recent localbot usage for this user"];
	let byHandler = urhs.reduce((m, u)=>m.set(u.handlerId, (m.get(u.handlerId)||0)+u.count), new Map);
	let md = ["handler|count", "-|-"];
	for (let [handlerId, count] of byHandler) md.push(handlerId+"|"+count);
	return md;
}

exports.onCommand = async function(ct){
	console.log("stats command", ct.args);
	let md;
	if (ct.args==="stats rooms") md = mdStatsRooms();
	else if (ct.args==="stats room") md = mdStatsRoom(ct.shoe.room.id);
	else md = mdStatsUser(ct.shoe.publicUser.id);
	console.log('md:', md);
	ct.reply(md.join('\n'));
}
