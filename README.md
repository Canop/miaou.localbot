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
	if: /\bping\/i
	alert("pong!")

Then on all messages he sends whose content contains `"ping"` an alert pops with `"pong!"`.

### Confirmation

	!!localbot add nojump
	on: sending_message
	if: !!roulette jump
	return confirm("Really?")

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

## Commands

WIP

## Script API

WIP

## Restrictions

Those might be removed in the future. But there's today two specific ways to limit problems that may be raised by localbot scripts:

* !!localbot commands aren't private: anybody in the room can see them being created and edited
* !!localbot commands are defined per room, they're not called in other rooms
