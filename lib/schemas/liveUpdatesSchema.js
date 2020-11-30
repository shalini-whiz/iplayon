liveUpdates = new Meteor.Collection('liveUpdates');

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

liveUpdatesSchema = new SimpleSchema({
	"eventId":{
		type:String,
		label:"Event Id",
		//min:5,
		//max:100,
		//exclusiveMin:true,
		//exclusiveMax:true,
		//regEx:/^[a-zA-Z0-9]/
	},
	"tournamentId":{
		type:String,
		label:"tournament Id",
		//min:5,
		//max:100,
		//exclusiveMin:true,
		//exclusiveMax:true,
		//regEx:/^[a-zA-Z0-9]/
	},

	"liveUpdateMessageTime.$.liveUpdateTime":{
		type:String,
		label:"live update Time",
	},	
	"liveUpdateMessageTime.$.liveUpdateMessage":{
		type:String,
		label:"Live Update Message",
		optional:true
	},


});
liveUpdates.attachSchema(liveUpdatesSchema);
