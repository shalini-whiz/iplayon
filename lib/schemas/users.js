users = new Meteor.Collection('user');

/**
 * Users Schema
 * @CollectionName: users
 * @Attributes: 1. userName(name of the user)
 * 				 	@Regex: validates for only letters 
 * 				 	 and length is 5 to 50 characters. @DataType:String
 * 			  	2. selectedDomains(array of domain Names) 
 * 					@DataType: array of strings
 * 				3. selectedDomains1(array of sub domain Names1)  
 * 					@DataType: array of strings
 * 				4. selectedDomains2(array of sub domain Names1)
 * 					@DataType: array of strings
 * 				5. selectedProjects(array of project names) 
 * 					@DataType: array of strings
 * 				6. groupsOwnedByUser (array of groups id owned by user)
 * 					@DataType: array of strings
 * 				7. memberOfGroup (array of group id's in which user is 
 * 					the member of) @DataType: array of strings
 * 				8. eventsOrganized (array of Event id's, the user is 
 * 					participating in)  @DataType: array of strings
 * 				9. profileCreatedDate (user profile created date)
 * 					auto generated date
 * 				10. profileUpdatedDate (user profile updated date)
 * 					auto generated date
 *   
 */
var usersSchema = new SimpleSchema({
	userName:{
		type:String,
		label:"User Name",
		/*min:5,
		max:50,
		exclusiveMin:true,
		exclusiveMax:true,
		regEx:/[a-zA-Z]$/*/
	},
	userId:{
		type:String
	},
	oAuthId:{
		type:String,
		label:"User Id",
		optional:true
	},
	emailAddress:{
		type:String,
		label:"Email Address of user"
	},
	interestedDomainName:{
		type:[String],
		label:"Domain Names",
		minCount:1,
		optional:true
		},
	interestedSubDomain1Name:{
		type:[String],
		label:"Sub Domain Names1",
		optional:true
		},
	interestedSubDomain2Name:{
		type:[String],
		label:"Sub Domain Names2",
		optional:true
	},
	interestedProjectName:{
		type:[String],
		label:"Project Names",
		optional:true
		},
	groupsOwned : {
		type : [ String ],
		label : "Group ids, owned by him",
		optional:true
	},
	memberOfGroup:{
		type:[String],
		label:"Group ids, the user is the member of",
		optional:true
	},
	eventsOrganized:{
		type:[String],
		label:"Event ids, organized by the user",
		optional:true
	},
	eventsParticipating:{
		type:[String],
		label:"Event ids, the user is participating in",
		optional:true
	},
	userStatusByAdmin:{
		type:Boolean,
		label:"enabled or disabled",
		optional:true
	},
	profileCreatedDate : {
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
	profileUpdatedDate : {
		type : Date,
		autoValue : function() {
			if (this.isUpdate) {
				return new Date();
			}
		},
		denyInsert : true,
		optional : true
	},
	password:{
		type:String,
		optional:true
	},
	otp:{
		type:String,
		optional:true
	},
	role:{
		type:String,
		optional:true
	},
	gender:{
		type:String,
		optional:true
	},
	source:{
		type:String,
		optional:true
	}
	
});

users.attachSchema(usersSchema);





