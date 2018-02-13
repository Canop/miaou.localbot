# miaou.localbot

The `!!localbot` command lets miaou users manage kind of userscripts inside miaou without
having to lower securiy (miaou has CSP preventing unsafe-eval and inline scripts).

This is **not ready**. The API *will* change.

[![Chat on Miaou](https://dystroy.org/miaou/static/shields/room-fr.svg?v=1)](https://dystroy.org/miaou/2851?localbot)
[![Chat on Miaou](https://dystroy.org/miaou/static/shields/room-en.svg?v=1)](https://dystroy.org/miaou/8?Javascript)

## Examples

### Just an alert

With this command, a user registers a `ping` hook:

	!!localbot add ping-pong
	on: sending_message
	if: /\bping\b/i
	alert("pong!")

Then on all messages she sends whose content contains `"ping"` an alert pops with `"pong!"`.

### Confirmation

	!!localbot add nojump
	on: sending_message
	if: !!roulette jump
	return confirm("Really?")

If the user tries to send a message containing `!!roulette jump` he is asked confirmation and hitting [Cancel] cancels the sending.

### Fix a typo

	!!localbot add req
	on: sending_message
	return event.content().replace(/requète/g, "requête")

### Honk and display a notif if somebody enters the room

	!!localbot add wakeup
	on: incoming_user
	event.honk()
	event.notif(`${event.user.name} comes in!`)

### Greet a user entering in the room

	!!localbot add helloing
	on: incoming_user
	event.autoSendTo("Hello")

### Answer to greetings

	!!localbot edit u2
	on: incoming_message
	if: /\b(hello|bonjour|salut)\b/i
	event.autoReply("Hello", true)


### Add a personal command to point typos in other user messages

This one is much more complex, it looks at all other messages to search for a pattern, and propose a replacement. There's a confirmation before the message is sent.

	!!localbot add fix
	on: sending_message
	if: /^:s/
		let match = event.content().match(/^:s\/([^\/]+)\/([^\/]+)/)
		if (!match) return
		let messages = event.messages()
		for (let i = messages.length; i--;) {
			let message = messages[i]
			let regex = new RegExp(match[1], "ig")
			let replaced = message.content.replace(regex, "**"+match[2]+"**")
			if (replaced===message.content) continue
			return event.content()+"\n@"+message.authorname+" [did you mean](#"+message.id+")?\n> "+replaced
		}

## Event Types

A localbot script is called on events. Here are the currently supported event types:

* `incoming_message` : called when a message from another user is received
* `sending_message` : called when you're sending a message. If your script returns false, the sending is cancelled. If it returns a string, the message is modified
* `incoming_user` : called when a user enters the room
* `leaving_user` : called when a user leaves the room

## Commands

### list

Use this to see all your localbot scripts:

	!!localbot list

### add

The general syntax is

	!!localbot add <name>
	on: <event type>
	if: <optional condition>
	<script>

The condition may be a regular expression or a string. It will be tested either against the content of the message or the name of the user, depending on the event type.

The script is some javascript. It will be called with an `event` in scope (see later chapter).

Note that this event handler is only available in the current room.

### disable

The syntax is

	!!localbot disable <name>

Following this call the event handler won't be called on events.

### enable

The syntax is

	!!localbot enable <name>

## The event object

Most interactions of the script with miaou are done using the passed `event` object which has the following properties:

* `message` : only defined when the event is message related.

* `user` : only defined when the event is user related.

* `content()` : give either the message's content or the user's name, depending on the event.

* `send(text, asFlake)` : prepare a message for sending. You'll have to hit the [enter] button to send it.

* `autoSend(text, asFlake)` : identical to `send` but you don't have to hit the [enter] button to send the message.

* `reply(text, asFlake)` : prepare a reply for sending. You'll have to hit the [enter] button to send it.

* `autoReply(text, asFlake)` : identical to `reply` but immediately sent.

* `honk()` : make some noise to alert you.

* `notif(text)` : display a desktop notification.

* `messages({flakes, self})` : return an array of all displayed messages.

## Restrictions

Those might be removed in the future. But there's today two specific ways to limit problems that may be raised by localbot scripts:

* !!localbot commands aren't private: anybody in the room can see them being created and edited
* !!localbot commands are defined per room, they're not called in other rooms
