teams = new Meteor.Collection('teams');

teamsSchema = new SimpleSchema({
        teamName:{
                type:String,
                label:"Team Name"
        },
        projectName:{
                type:[String],
                label:"Project Name"
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
        teamOwner:{
                type:String,
                label:"Team Owner"
        },
        venues:{
                type:[String],
                label:"Interested Venues",
                optional:true
        },
        teamMembers:{
                type:[String],
                label:"Team Members",
                optional:true
        },
        teamManager:{
                type:String,
                label:"Team Manager",
                optional:true
        },
        mainTag:{
        	type:[String],
            label:"Main Tag",
            optional:true
        },
        secondaryTag:{
        	type:[String],
            label:"Secondary Tag",
            optional:true
        }

});
teams.attachSchema(teamsSchema);
