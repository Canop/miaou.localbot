// manage persistance of user vars and handlers

let	db;

// called by plugin.js
exports.init = function(name, miaou){
	db = miaou.db;
	db.upgrade(name, require("path").resolve(__dirname, 'sql'));
}

// add the handler and return it with the new id
exports.addHandler = async function(userId, handler){
	await db.do(async function(con){
		return await con.queryRow(
			"insert into localbot_handler"+
			" (author, name, disabled, event_type, condition, do_body)"+
			" values ($1, $2, $3, $4, $5, $6) returning *",
			[
				userId,
				handler.name,
				handler.disabled,
				handler.on,
				handler.if,
				handler.doBody
			],
			"localbot / add_handler"
		);
	});
}

exports.editHandler = async function(userId, handler){
	await db.do(async function(con){
		await con.execute(
			"update localbot_handler"+
			" set name=$2, disabled=$4, event_type=$5, condition=$6, do_body=$7"+
			" where id=$1",
			[
				handler.id,
				handler.name,
				handler.disabled,
				handler.on,
				handler.if,
				handler.doBody
			],
			"localbot / edit_handler"
		);
	});
}

exports.allHandlerNames = async function(userId){
	return await db.do(async function(con){
		let rows = await con.queryRows(
			"select name from localbot_handler where author=$1",
			[userId],
			"localbot / all_handler_names"
		);
		return rows.map(row => row.name);
	});
}

function rowToHandler(row){
	return {
		id: row.id,
		name: row.name,
		disable: row.disabled,
		on: row.event_type,
		activeInRoom: row.active_in_room,
		if: row.condition,
		doBody: row.do_body
	};

}

// get all user handlers with the activeInRoom bool set according to the room
exports.getRoomUserHandlers = async function(userId, roomId){
	return await db.do(async function(con){
		let rows = await con.queryRows(
			"select *,"+
			" exists(select * from localbot_handler_in_room where handler=id and room=$2) active_in_room"+
			" from localbot_handler where author=$1",
			[userId, roomId],
			"localbot / get_room_user_handlers"
		);
		return rows.map(rowToHandler);
	});
}

exports.getUserHandlers = async function(userId){
	return await db.do(async function(con){
		let rows = await con.queryRows(
			"select * from localbot_handler where author=$1",
			[userId],
			"localbot / get_user_handlers"
		);
		return rows.map(rowToHandler);
	});
}

exports.getHandlerByName = async function(userId, handlerName){
	return await db.do(async function(con){
		let row = await con.queryRow(
			"select * from localbot_handler where author=$1 and name=$2",
			[userId, handlerName],
			"localbot / get_handler_by_name"
		);
		return rowToHandler(row);
	});
}

exports.getHandler = async function(handlerId){
	return await db.do(async function(con){
		let row = await con.queryRow(
			"select * from localbot_handler where id=$1",
			[handlerId],
			"localbot / get_handler"
		);
		return rowToHandler(row);
	});
}

exports.getActiveRoomHandlers = async function(userId, roomId){
	return await db.do(async function(con){
		let rows = await con.queryRows(
			"select id from localbot_handler join localbot_handler_in_room on id=handler where room=$1 and author=$2",
			[roomId, userId],
			"localbot / active_room_handlers"
		);
		return rows.map(row => row.id);
	});
}

exports.activateHandlerInRoom = async function(handlerId, roomId){
	return await db.do(async function(con){
		await con.execute(
			"insert into localbot_handler_in_room (handler, room) values ($1, $2)",
			[handlerId, roomId],
			"localbot / activate_room_handler"
		);
	});
}

exports.unactivateHandlerInRoom = async function(handlerId, roomId){
	return await db.do(async function(con){
		await con.execute(
			"delete from localbot_handler_in_room where handler=$1 and room=$2",
			[handlerId, roomId],
			"localbot / unactivate_room_handler"
		);
	});
}
