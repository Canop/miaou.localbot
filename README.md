# miaou.localbot

The `!!localbot` command lets miaou users manage kind of userscripts inside miaou without
having to lower securiy (miaou has CSP preventing unsafe-eval and inline scripts).

This is **not ready**. The API *will* change.

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
	if: !!roulette jump
	return confirm("Really?")

### Fix a typo

	!!localbot add req
	return content.replace(/requète/g, "requête")

## Restrictions

Those might be removed in the future. But there's today two specific ways to limit problems that may be raised by localbot scripts:

* !!localbot commands aren't private: anybody in the room can see them being created and edited
* !!localbot commands are defined per room, they're not called in other rooms
