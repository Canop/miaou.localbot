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
