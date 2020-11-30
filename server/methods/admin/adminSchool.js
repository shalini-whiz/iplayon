Meteor.methods({

    "deleteSchoolDetails":function(schoolID)
    {
        try
        {
            var schoolInfo = schoolDetails.findOne({
                $or:[
                    {"userId":schoolID},
                    {"emailAddress":schoolID}
                ]
            });
            if(schoolInfo)
            {
                var raw = schoolPlayers.rawCollection();
                  var distinct = Meteor.wrapAsync(raw.distinct, raw);
                var schoolPlayersList = distinct('userId',{"schoolId":schoolID});
                
                //delete event participants
                var removeParticipants = events.update({
                    eventParticipants:
                        {$in: schoolPlayersList}
                },{
                    $pull: { eventParticipants:
                        {$in: schoolPlayersList}
                    }
                },{multi:true})

                //remove player
                var removePlayer = schoolPlayers.remove({userId:{$in: schoolPlayersList}});
                var removePlayerAccess = Meteor.users.remove({userId:{$in: schoolPlayersList}});

                //remove school team, player entries and team entries
                var removeSchoolTeams = schoolTeams.remove({"schoolId":schoolID})
                var removeSchoolPlayerEntries = schoolPlayerEntries.remove({"schoolId":schoolID});
                var removeSchoolPlayerTeamEntries = schoolPlayerTeamEntries.remove({"schoolId":schoolID});
                var removePlayerCategory = playerCategory.remove({"schoolId":schoolID})
                //delete school and user access
                var deleteSchoolInfo = schoolDetails.remove({"userId":schoolID});
                var deleteSchoolAccess = Meteor.users.remove({"userId":schoolID});


                

            }    
            else
            {
                return "School doesn't exist";
            }

        }catch(e)
        {

        }
    }
});