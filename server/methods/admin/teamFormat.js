import {
    emailRegex
}
from '../dbRequiredRole.js'

Meteor.methods({

	"insertTeamFormat":function(teamFormatObj)
	{
		try{
			check(teamFormatObj,Object);
			var insertTeamFormatEntry = teamsFormat.insert(teamFormatObj);
			var teamSport = teamFormatObj.selectedProjectId;
			if(insertTeamFormatEntry)
			{
				var tournamentUpdate = tournamentEvents.update({ _id: teamSport },
				{ $addToSet: {projectSubName: 
					{ "_id" : insertTeamFormatEntry, 
					"projectName" : teamFormatObj.teamFormatName.trim().replace(/\s+/g,' '), 
					"abbName" : teamFormatObj.teamFormatName.trim().replace(/\s+/g,' '), "projectType" : 2, "gender" : "NA","dobType":"NA","teamType":teamFormatObj.teamFormatName.trim().replace(/\s+/g,' ')} } });
				if(tournamentUpdate)
				{
					tournamentEvents.update({ _id: teamSport },{ $addToSet: 
						{categoryOrder:teamFormatObj.teamFormatName.trim().replace(/\s+/g,' '),teamEventsOrder:teamFormatObj.teamFormatName.trim().replace(/\s+/g,' ')}});
				}
				return true;
			}
		}catch(e){}
		
		
			
	},
	"updateTeamFormat":function(teamFormatObj,teamFormatId)
	{
		try{
			check(teamFormatObj,Object);
			var teamFormatInfo = teamsFormat.findOne({"_id":teamFormatId});
			if(teamFormatInfo)
				oldTFAbbName = teamFormatInfo.teamFormatName;
			var updateTeamFormatEntry = teamsFormat.update({"_id":teamFormatId},{$set:teamFormatObj});
			if(updateTeamFormatEntry)
			{
				var teamSport = teamFormatObj.selectedProjectId;
				var teamFormatName = teamFormatObj.teamFormatName.trim().replace(/\s+/g,' ');
				var tournamentUpdate = tournamentEvents.update({ _id: teamSport,
					"projectSubName._id":teamFormatId},
					{$set:{"projectSubName.$.projectName" :teamFormatObj.teamFormatName.trim().replace(/\s+/g,' '),
					"projectSubName.$.abbName" : teamFormatName.trim().replace(/\s+/g,' '),
					"projectSubName.$.teamType" :teamFormatName.trim().replace(/\s+/g,' ')
					}});

				if(tournamentUpdate)
				{
					var temp = tournamentEvents.update({"_id":teamSport},
	    				    {$pull:{"categoryOrder":oldTFAbbName,"teamEventsOrder":oldTFAbbName}});
					var temp1 = tournamentEvents.update({ _id: teamSport },{ $addToSet: 
						{categoryOrder:teamFormatObj.teamFormatName.trim().replace(/\s+/g,' '),teamEventsOrder:teamFormatObj.teamFormatName.trim().replace(/\s+/g,' ')}});
				}
				return true;
			}
		}catch(e){}
	},
	"deleteTeamFormat":function(id)
	{
		try
		{
			var teamsFormatInfo = teamsFormat.findOne({"_id":id});
			if(teamsFormatInfo)
			{
				var teamSport = teamsFormatInfo.selectedProjectId;
				var teamAbbName = teamsFormatInfo.teamFormatName;
				var deleteEntry = teamsFormat.remove({"_id":id});
				if(deleteEntry)
				{
					var temp = tournamentEvents.update({"_id":teamSport},
    				    {$pull:{"projectSubName":{"projectName":teamAbbName.trim().replace(/\s+/g,' ')}, 
    				    "categoryOrder":teamAbbName.trim().replace(/\s+/g,' '),"teamEventsOrder":teamAbbName.trim().replace(/\s+/g,' ')}}
						,{multi:true});
					return deleteEntry;
				}
			}
		}catch(e){}
	},
	"checkTeamFormatName":function(teamFormatName)
	{
		try
		{
			var teamFormatInfo = teamsFormat.findOne({
				teamFormatName:emailRegex(teamFormatName.trim().replace(/\s+/g,' '))
			})
			if(teamFormatInfo){
				return true
			}
			else
				return false;
		}catch(e){}
	}


});