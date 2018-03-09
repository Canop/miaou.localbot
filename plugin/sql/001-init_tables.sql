create table localbot_handler (
	id serial primary key,
	author integer references player(id) not null,
	name varchar(255) not null,
	disabled boolean not null default false,
	event_type varchar(50) not null,
	condition text,
	do_body text not null
);

create table localbot_handler_in_room (
	handler integer references localbot_handler(id) not null,
	room integer references room(id),
	primary key (handler, room)
);

