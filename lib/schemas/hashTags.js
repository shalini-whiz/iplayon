twitterHashTags = new Meteor.Collection('twitterHashTags');

var twitterHashTagsSchema  =  new SimpleSchema({
	"selectedRole":{
		type:String,
		label:"role of an organizer",
		optional:true
	},
	"selectedSport":{
		type:String,
		label:"iplay on sport",
		optional:true
	},
	"entityName":{
		type:String,
		label:"association/academy/organizer",
		optional:true
	},
	"iphashTag":{
		type: String,
    	label: "iplay on hashtag",
    	optional:true
	},
	"regionSelected":{
		type: [String],
    	label: "selected regions",
    	optional:true
	},
	savedTags:{
		type: [String],
    	label: "saved tags",
    	optional:true
	}
});
twitterHashTags.attachSchema(twitterHashTagsSchema);


allHashTags = new Meteor.Collection('allHashTags');

var allHashTagsSchema  =  new SimpleSchema({
	"selectedRole":{
		type:String,
		label:"role of an organizer",
		optional:true
	},
	"selectedSport":{
		type:String,
		label:"iplay on sport",
		optional:true
	},
	"entityName":{
		type:String,
		label:"association/academy/organizer",
		optional:true
	},
	savedTags:{
		type: [String],
    	label: "saved tags",
    	optional:true
	}
});
allHashTags.attachSchema(allHashTagsSchema);

autoTweetMessages = new Meteor.Collection('autoTweetMessages');
var autoTweetMessagesSchema  =  new SimpleSchema({
	"typeOfEvent":{
		type:String,
		label:"event type",
		optional:true
	},
	"referWEB":{
		type:String,
		label:"web address",
		optional:true
	},
	"message1":{
		type:String,
		label:"message1",
		optional:true
	},
	"message2":{
		type: String,
    	label: "message2",
    	optional:true
	},
	"message3":{
		type: String,
    	label: "message3",
    	optional:true
	}
});
autoTweetMessages.attachSchema(autoTweetMessagesSchema);
