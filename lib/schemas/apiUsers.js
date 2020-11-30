apiUsers = new Mongo.Collection('apiUsers');

/*"consumer_key" : "tr2uwDg2XB7OBAKDBGOO0FH3o",
 "consumer_secret" : "AMqceXoCJO1YLPxioXu8ZBe58VycL5SqmJUL1wPcTn7q8Dcu86", 
 "access_token_key" : "821266657561624578-ls9QlsT2w6zv4xABgHrbvJy2cQF1RZD", 
"access_token_secret" : "GH4LYGdAnidZhDRgX7w8uqyhLyaXNmZwU4A8UNv5uMyFl"*/
var twitterSchema = new SimpleSchema({
	"consumer_key":{
		type:String,
		label:"consumer_key",
	},
	"consumer_secret":{
		type:String,
		label:"consumer_secret"
	},
	"access_token_key":{
		type:String,
		label:"access_token_key"
	},
	"access_token_secret":{
		type:String,
		label:"access_token_secret"
	}
});


var linkedInSchema = new SimpleSchema({
	"companyId":{
		type:String,
		label:"linkedin companyId",
	},
	"accessToken":{
		type:String,
		label:"linkedin accessToken"
	}
})


apiSchema = new SimpleSchema({
	apiUser: {
		type: String,
		label: "Name of website which uses the API"
	},
	userId: {
		type: String,
		label: "ID of currently logged-in user"
	},
	apiKey:{
		type: String,
		label: "Generated API key"
	},
	source:{
		type:String,
		label:"Source",
		defaultValue:""
	},
	siteImg:{
		type:String,
		label:"site image",
		defaultValue:""
	},
	pageToken:{
		type:String,
		label:"Page token",
		optional:true
	},
	tweetKeys:{
		type:twitterSchema,
		label:"App twiiter keys",
		optional:true
	},
	linkedInKeys:{
		type:linkedInSchema,
		label:"App LinkedIn keys",
		optional:true
	},
	linkedInToken:{
		type:String,
		label:"LinkedIn Token",
		optional:true
	}
});

apiUsers.attachSchema(apiSchema);