playerTeams = new Meteor.Collection('playerTeams');

playerTeamsSchema = new SimpleSchema({
        teamName:{
            type:String,
            label:"Team Name"
        },
        teamFormatId:{
            type:String,
            label:"Project Name"
        },
        teamManager:{
            type:String,
            label:"Team Manager",
        },
        "teamOwners":{
            type:String,
            label:"Team Owner",
            defaultValue:""
        },
        "teamCoach":{
            type:String,
            label:"Team Coach",
            defaultValue:""
        },
        "teamMembers.$.playerNumber":{
            type:String,
            label:"Event Id",
            optional:true
        },   
        "teamMembers.$.playerId":{
            type:String,
            label:"on or before",
            optional:true
        },
        "teamMembers.$.individualEvent":{
            type:true,
            label:"true or false",
            optional:true
        },
        "teamMembers.$.teamEvent":{
            type:true,
            label:"true or false",
            optional:true
        },
        "teamAffiliationId":{
            type:String,
            optional:true
        },
        "source":{
            type:String,
            optional:true
        },
        "schoolId":{
            type:String,
            optional:true
        },
        "subscriptionForSchool":{
            type:Boolean,
            optional:true
        },
        "createdDate" : {
            type : Date,
            autoValue : function() {
                if (this.isInsert) {
                    return new Date();
                }
                else {
                    this.unset();
                }
            }
    },
});
playerTeams.attachSchema(playerTeamsSchema);