# miaou.localbot

The `!!localbot` command lets miaou users manages kind of userscripts inside miaou without
having to lower securiy (miaou has CSP preventing unsafe-eval and inline scripts).

This is **not ready**. The API *will* change.

## Examples

### Just an alert

With this command, a user registers a `ping` hook:

	!!localbot add ping
	on: sending_message
	if: /\bping\/i
	alert("pong!")

Then on all messages he sends whose content contains `"ping"` an alert pops with `"pong!"`.
