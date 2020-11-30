projects = new Meteor.Collection('projects');

var projectsSchema = new SimpleSchema({

    projectName:{
        type:String,
        label:"projectName"
    },
    individualProject:{
        type:Boolean,
        label:"individualProject",
        optional:true
    },
    teamProject:{
        type:Boolean,
        label:"teamProject",
        optional:true
    },
    doublesProject:{
        type:Boolean,
        label:"doublesProject",
        optional:true
    },
    allowAgeBasedCategory:{
        type:Boolean,
        label:"allowAgeBasedCategory",
        optional:true
    },
    allowGenderBasedCategory:{
        type:Boolean,
        label:"allowGenderBasedCategory",
        optional:true
    },
    projectDecription:{
        type:String,
        label:"projectDecription",
        optional:true
    },
    logo:{
        type:String,
        label:"logo",
        optional:true
    },
    projectType:{
        type:Number,
        label:"project memebers",
        optional:true
    }
       
   
});
projects.attachSchema(projectsSchema);



projectBranch = new Meteor.Collection('projectBranch');

var projectBranchSchema = new SimpleSchema({

    projectName:{
        type:String,
        label:"projectName"
    },
    projectType:{
        type:Number,
        label:"project memebers",
        optional:true
    }
       
   
});
projectBranch.attachSchema(projectBranchSchema);

tournamentEvents = new Meteor.Collection('tournamentEvents');

var tournamentEventsSchema = new SimpleSchema({
    projectMainName:{
        type:String,
        label:"projectName"
    },
    "projectSubName.$._id":{
        type:String,
        label:"project sub names id",
        optional:true
    },
    "projectSubName.$.projectName":{
        type:String,
        label:"project sub names",
        optional:true
    },
    "projectSubName.$.abbName":{
        type:String,
        label:"project abbName",
        optional:true
    },
    "projectSubName.$.projectType":{
        type:String,
        label:"project sub names type",
        optional:true
    },   
    "projectSubName.$.teamType":{
        type:String,
        label:"project team type",
        optional:true
    },
    "projectSubName.$.gender":{
        type:String,
        label:"project gender",
        optional:true
    },
    "projectSubName.$.dobType":{
        type:String,
        label:"project dob",
    },
    "projectSubName.$.dob":{
        type:Date,
        label:"project dob",
        optional:true
    },
    "categoryOrder":{
        type:[String],
        label:"categoryOrder",
        optional:true
    },
    "singleEventsOrder":{
        type:[String],
        label:"single Events Order",
        optional:true
    },
    "teamEventsOrder":{
        type:[String],
        label:"team Events Order",
        optional:true
    }
});
tournamentEvents.attachSchema(tournamentEventsSchema);

eventsOnBefore = new Meteor.Collection('eventsOnBefore');

var eventsOnBeforeSchema = new SimpleSchema({

    projectIds:{
        type:[String],
        label:"projectId"
    },
    tournamentId:{
        type:String
    }  
   
});
eventsOnBefore.attachSchema(eventsOnBeforeSchema);

