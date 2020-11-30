myUpcomingEvents = new Meteor.Collection('myUpcomingEvents');

myUpcomingEventsSchema = new SimpleSchema({
	eventName:{
		type:String,
		label:"Event Name",
	},
	projectId:{
		type:[String],
		label:"Project Id",
		optional:true
	},
	projectName:{
		type:String,
		label:"Project Name",
		optional:true
	},
	eventStartDate:{
	    type: "datetime",
	    label: "Event Start date",
	   // regEx:/((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/	
	},
	eventEndDate:{
		 type: "datetime",
		 label: "End date of the event",
		// regEx:/((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/
	},
	eventSubscriptionLastDate:{
		 type: "datetime",
		 label: "last date for event subscription" ,
		 optional:true
		// regEx:/((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/
	},
	eventStartDate1:{
		type:Date,
		optional:true
	},
	"offset":{
		type:Number,
		optional:true
	},
	"offsetOfDomain":{
		type:Number,
		optional:true
	},
	"timeZoneName":{
		type:String,
		optional:true
	},
	eventEndDate1:{
		 type: Date,
		 label: "End date of the event",
		 optional:true
		// regEx:/((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/
	},
	eventSubscriptionLastDate1:{
		 type: Date,
		 label: "last date for event subscription",
		 optional:true
		// regEx:/((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/
	},
	domainId:{
		type:[String],
		label:"venue of the event",
		optional:true
	},
	domainName:{
		type:String,
		label:"domain Name",
		optional:true
	},
	subDomain1Name:{
		type:[String],
		label:"venue1 of the event",
		optional:true
	},
	venueLatitude:{
		type:String,
		label:"venue latitude of the event",
		optional:true
	},
	venueLongitude:{
		type:String,
		label:"venue longitude of the event",
		optional:true
	},
	subDomain2Name:{
		type:[String],
		label:"venue2 of the event",
		optional:true
	},
	prize:{
		type:String,
		label:"prize title for the event",
		optional:true
		//min:2,
		//max:500,
		//exclusiveMin:true,
		//exclusiveMax:true,
		//regEx:/[a-zA-Z0-9]$/
	},
	prizePdfId:{
		type:String,
		label:"prize PDF ",
		optional:true
	},
	rulesAndRegulations:{
		type:String,
		label:"path of the pdf file",
		optional:true
	},
	eventOrganizer:{
		type:String,
		label:"Id of the user who organized the event",
		optional:true
	},
	resultsOfTheEvents:{
		type:String,
		label:"path of the pdf file",
		optional:true
	},
	description:{
		type:String,
		label:"description of the event",
		max:1000,
		optional:true
	},
	eventApprovalStatusByAdmin:{
		type:Boolean,
		label:"admin can reject the event",
	    optional:true
	},
	eventStatus:{
		type:String,
		label:"live, upcoming, past",
	    optional:true
		
	},
	sponsorLogo:{
		type:String,
		label:"path of the jpeg file",
	    optional:true
	},
	sponsorPdf:{
		type:String,
		label:"path to PDF which contain some data about sponsor",
		optional:true
	},
	sponsorUrl:{
		type:String,
		label:"weblink of sponsor",
	    optional:true
	},
	sponsorMailId:{
		type:String,
		label:"contact ID of sponsor",
	    optional:true
	},
	eventParticipants:{
		type:[String],
		label:"Id of users participating in the event",
		optional:true
	},
	/*"eventTeamParticipants.$.teamParticipants":{
		type:[String],
		label:"team participants(userIds)",
		optional:true
	},	
	"eventTeamParticipants.$.teamId":{
		type:String,
		label:"Team Id",
		optional:true
	},	*/
	eventCreatedDate : {
		type : Date,
		autoValue : function() {
			if (this.isInsert) {
			return new Date();
			} else if (this.isUpsert) {
				return {
					$setOnInsert : new Date()
				};
			} else {
				this.unset();
			}
		},
		optional:true
	},
	eventUpdatedDate : {
		type : Date,
		autoValue : function() {
			if (this.isUpdate) {
				return new Date();
			}
		},
		denyInsert : true,
		optional : true
	},
	venueAddress :{
		type : String,
		optional : true
	},
	timezoneIdEventLat:{
		type:String,
		optional:true
	},
	timezoneIdEventLng:{
		type:String,
		optional:true
	},
	tournamentEvent:{
		type:Boolean,
		optional:true
	},
	tournamentId:{
		type:String,
		optional:true
	},
	eventsUnderTournament:{
		type:[String],
		optional:true
	},
	eventsProjectIdUnderTourn:{
		type:[String],
		optional:true
	},
	projectType:{
		type:Number,
		optional:true
	},
	eventSubId:{
		type:String,
		optional:true
	},
	subscriptionTypeDirect:{
		type:String,
		optional:true
	},
	subscriptionTypeHyper:{
		type:String,
		optional:true
	},
	hyperLinkValue:{
		type:String,
		optional:true
	},
	subscriptionTypeMail:{
		type:String,
		optional:true
	},
	subscriptionTypeMailValue:{
		type:String,
		optional:true
	}
});
myUpcomingEvents.attachSchema(myUpcomingEventsSchema);


myPastEvents = new Meteor.Collection('myPastEvents');

myPastEventsSchema = new SimpleSchema({
	eventName:{
		type:String,
		label:"Event Name",
	},
	projectId:{
		type:[String],
		label:"Project Id",
		optional:true
	},
	projectName:{
		type:String,
		label:"Project Name",
		optional:true
	},
	eventStartDate:{
	    type: "datetime",
	    label: "Event Start date",
	   // regEx:/((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/	
	},
	eventEndDate:{
		 type: "datetime",
		 label: "End date of the event",
		// regEx:/((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/
	},
	eventSubscriptionLastDate:{
		 type: "datetime",
		 label: "last date for event subscription" ,
		 optional:true
		// regEx:/((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/
	},
	eventStartDate1:{
		type:Date,
		optional:true
	},
	"offset":{
		type:Number,
		optional:true
	},
	"offsetOfDomain":{
		type:Number,
		optional:true
	},
	"timeZoneName":{
		type:String,
		optional:true
	},
	eventEndDate1:{
		 type: Date,
		 label: "End date of the event",
		 optional:true
		// regEx:/((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/
	},
	eventSubscriptionLastDate1:{
		 type: Date,
		 label: "last date for event subscription",
		 optional:true
		// regEx:/((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/
	},
	domainId:{
		type:[String],
		label:"venue of the event",
		optional:true
	},
	domainName:{
		type:String,
		label:"domain Name",
		optional:true
	},
	subDomain1Name:{
		type:[String],
		label:"venue1 of the event",
		optional:true
	},
	venueLatitude:{
		type:String,
		label:"venue latitude of the event",
		optional:true
	},
	venueLongitude:{
		type:String,
		label:"venue longitude of the event",
		optional:true
	},
	subDomain2Name:{
		type:[String],
		label:"venue2 of the event",
		optional:true
	},
	prize:{
		type:String,
		label:"prize title for the event",
		optional:true
		//min:2,
		//max:500,
		//exclusiveMin:true,
		//exclusiveMax:true,
		//regEx:/[a-zA-Z0-9]$/
	},
	prizePdfId:{
		type:String,
		label:"prize PDF ",
		optional:true
	},
	rulesAndRegulations:{
		type:String,
		label:"path of the pdf file",
		optional:true
	},
	eventOrganizer:{
		type:String,
		label:"Id of the user who organized the event",
		optional:true
	},
	resultsOfTheEvents:{
		type:String,
		label:"path of the pdf file",
		optional:true
	},
	description:{
		type:String,
		label:"description of the event",
		max:1000,
		optional:true
	},
	eventApprovalStatusByAdmin:{
		type:Boolean,
		label:"admin can reject the event",
	    optional:true
	},
	eventStatus:{
		type:String,
		label:"live, upcoming, past",
	    optional:true
		
	},
	sponsorLogo:{
		type:String,
		label:"path of the jpeg file",
	    optional:true
	},
	sponsorPdf:{
		type:String,
		label:"path to PDF which contain some data about sponsor",
		optional:true
	},
	sponsorUrl:{
		type:String,
		label:"weblink of sponsor",
	    optional:true
	},
	sponsorMailId:{
		type:String,
		label:"contact ID of sponsor",
	    optional:true
	},
	eventParticipants:{
		type:[String],
		label:"Id of users participating in the event",
		optional:true
	},
	/*"eventTeamParticipants.$.teamParticipants":{
		type:[String],
		label:"team participants(userIds)",
		optional:true
	},	
	"eventTeamParticipants.$.teamId":{
		type:String,
		label:"Team Id",
		optional:true
	},	*/
	eventCreatedDate : {
		type : Date,
		autoValue : function() {
			if (this.isInsert) {
			return new Date();
			} else if (this.isUpsert) {
				return {
					$setOnInsert : new Date()
				};
			} else {
				this.unset();
			}
		},
		optional:true
	},
	eventUpdatedDate : {
		type : Date,
		autoValue : function() {
			if (this.isUpdate) {
				return new Date();
			}
		},
		denyInsert : true,
		optional : true
	},
	venueAddress :{
		type : String,
		optional : true
	},
	timezoneIdEventLat:{
		type:String,
		optional:true
	},
	timezoneIdEventLng:{
		type:String,
		optional:true
	},
	tournamentEvent:{
		type:Boolean,
		optional:true
	},
	tournamentId:{
		type:String,
		optional:true
	},
	eventsUnderTournament:{
		type:[String],
		optional:true
	},
	eventsProjectIdUnderTourn:{
		type:[String],
		optional:true
	},
	projectType:{
		type:Number,
		optional:true
	},
	eventSubId:{
		type:String,
		optional:true
	},
	subscriptionTypeDirect:{
		type:String,
		optional:true
	},
	subscriptionTypeHyper:{
		type:String,
		optional:true
	},
	hyperLinkValue:{
		type:String,
		optional:true
	},
	subscriptionTypeMail:{
		type:String,
		optional:true
	},
	subscriptionTypeMailValue:{
		type:String,
		optional:true
	}
});
myPastEvents.attachSchema(myPastEventsSchema);