
Meteor.methods({
    "getFileName": function(xData) {
        try{
        check(xData, String);
        var name = events.findOne({
            "_id": xData
        });
        var nam = tournamentEvents.findOne({
            "projectSubName._id": name.projectId.toString()
        }, {
            fields: {
                "projectSubName.$": 1
            }
        });
        if(nam && nam.projectSubName && nam.projectSubName[0] && nam.projectSubName[0].abbName)
            return nam.projectSubName[0].abbName.toString();
        }catch(e){

        }
    }
})

Meteor.methods({
    "getFileNamePast": function(xData) {
        try{
        check(xData, String);
        var name = pastEvents.findOne({
            "_id": xData
        });
        var nam = tournamentEvents.findOne({
            "projectSubName._id": name.projectId.toString()
        }, {
            fields: {
                "projectSubName.$": 1
            }
        });
        return nam.projectSubName[0].abbName.toString();
        }catch(e){}
    }
})


