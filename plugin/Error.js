
class LocalbotError extends Error{
	constructor(str){
		super(str);
		this.log = str; // means it's a normal error, which should not involve a heavy miaou log
		Error.captureStackTrace(this, LocalbotError);
	}
}

module.exports = LocalbotError;
