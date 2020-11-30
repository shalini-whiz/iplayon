scrollableevents = new Meteor.Collection('scrollableevents');

/**
 * Events Schema
 * @CollectionName: events
 * @Attributes: 1. eventName(name of the event)
 * 				 	@Regex: validates for only letters 
 * 				 	and length is 5 to 100 characters. @DataType:String
 * 				2. eventStartDate(date of event scheduled)
 * 				3. eventEndDate(date of event scheduled to end)
 * 				4. eventSubscriptionLastDate(last date for 
 * 		           event subscription) @DataType:String
 * 					@Regex: validates dates like 2012/22/12 
 *												 2012-Dec-22
 *												 2012-12-22
 *				5.eventVenue(venue of the event)
 *					@DataType:String
 *				6. eventDomainName(domain name of the event)
 *					@DataType:String
 *				7. prize(prize for the event)
 *					@DataType:String
 *				8. rulesAndRegulations(pdf file contains rules of an event)
 *					@DataType:String
 *				9. eventOrganizer(Id of the user who organized the event)
 *					@DataType:String
 *				10. results(pdf file contains results of an event)
 *					@DataType:String
 *				11. description(description of the event)
 *					@DataType:String @max of 1000 letters
 *				12. eventApprovalStatusByAdmin(admin can reject the event)
 *					@DataType: boolean
 *				13. eventStatus (live,upcoming,past)
 *					@DataType: String
 *				14. sponsorLogo (path to the sponsors logo)
 *					@DataType:String
 *				15. sponsorPdf (path to PDF which contain some 
 *							data about sponsor)
 *					@DataType:String
 *				16. sponsorUrl (weblink of sponsor) 
 *					@DataType:String
 *				17. sponsorMailId(contact ID of sponsor)
 *					@DataType:String
 *				18. eventParticipants(Id of users participating in the event)
 *					@DataType:String
 *				 9. eventCreatedDate (event  created date)
 * 					auto generated date
 * 				10. eventUpdatedDate (event  updated date)
 * 					auto generated date
 *			
 */		

scrollableeventsSchema = new SimpleSchema({
	eventName:{
		type:String,
		label:"Event Name",
		//min:5,
		//max:100,
		//exclusiveMin:true,
		//exclusiveMax:true,
		//regEx:/^[a-zA-Z0-9]/
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
	abbName:{
		type:String,
		label:"Abbrevation Name",
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
		type:Date
	},
	"offset":{
		type:Number
	},
	offsetOfDomain:{
		type:Number
	},
	timeZoneName:{
		type:String
	},
	eventEndDate1:{
		 type: Date,
		 label: "End date of the event",
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
		}
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
	}
});
scrollableevents.attachSchema(scrollableeventsSchema);