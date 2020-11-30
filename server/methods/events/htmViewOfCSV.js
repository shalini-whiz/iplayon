Meteor.methods({
    "htmlViewOfCSV": function(xData) {
        check(xData, String)
        var userId = Meteor.users.findOne({
            "_id": Meteor.userId()
        });
        var tournamentName=events.findOne({
            "_id": xData
        });
        var doa = events.find({
            "eventOrganizer": userId.userId.toString(),
            "tournamentId": xData
        }).fetch();
        var eveList=[];
        var getCsv = [];
        var setUsers = [];
        csvdata = {};
        setEvents = []
        var s = 0
        var sss = {}
        var prize = 0,
            noprize = 0,
            slNo = 0;
        var userIdAr = []
        Meteor.users.find({}).fetch().forEach(function(u, j) {
            flag = 0;
            for (var i = 0; i < doa.length; i++) {

                if (doa[i].eventParticipants != undefined) {
                    for (var k = 0; k < doa[i].eventParticipants.length; k++) {
                        if (doa[i].eventParticipants[k] == u.userId) {
                            flag = 1;
                            userIdAr.push(u.userId)
                        } else if (doa[i].eventParticipants[k] !== u.userId) {
                            var lj = teams.findOne({
                                "_id": doa[i].eventParticipants[k]
                            });
                            if (lj !== undefined) {
                                if (lj.teamOwner === u.userId) {
                                    flag = 1;
                                    userIdAr.push(u.userId)
                                }
                            }

                        }

                    }
                }

            }

        });
        if (userIdAr.length != 0) {
            var newArr = [],
                origLen = userIdAr.length,
                found, x, y;

            for (x = 0; x < origLen; x++) {
                found = undefined;
                for (y = 0; y < newArr.length; y++) {
                    if (userIdAr[x] === newArr[y]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    newArr.push(userIdAr[x]);
                }
            }

            if (newArr.length != 0) {
                for (var gh = 0; gh < newArr.length; gh++) {
                    Meteor.users.find({
                        "userId": newArr[gh]
                    }).fetch().forEach(function(u, j) {
                        //slNo=slNo+1;
                        //  var a = moment(eventStartDateAge[0].eventStartDate);
                        //var b = moment(u.dateOfBirth);

                        //var years = a.diff(b, 'year');
                        //b.add(years, 'years');

                        //var months = a.diff(b, 'months');
                        //b.add(months, 'months');

                        //var days = a.diff(b, 'days');
                        //if(days) months=months+1;
                        if (u.clubName == null) {
                            u.clubName = "others"
                        }
                        if (u.emailAddress == null) {
                            u.emailAddress = "others"
                        }
                        sss = {
                                //"Sl.No":slNo,
                                "Name": u.userName,
                                "Academy Name": u.clubName,
                                "emailAddress": u.emailAddress,
                                "Phone Number": parseInt(u.phoneNumber),
                                "DOB (dd/mmm/yyyy)": u.dateOfBirth
                                    //"Age (year/month)":""+years+"/"+months+""
                            }
                            //csvdatas.push("{"+"names :"+u.userName)
                        for (var i = 0; i < doa.length; i++) {
                           
                            sss[doa[i].abbName] = 0

                            if (doa[i].eventParticipants != undefined) {
                                for (var k = 0; k < doa[i].eventParticipants.length; k++) {
                                    if (doa[i].eventParticipants[k] == u.userId) {
                                        prize = doa[i].prize;
                                        sss[doa[i].abbName] = parseInt(prize)
                                    } else if (doa[i].eventParticipants[k] !== u.userId) {
                                        var lj = teams.findOne({
                                            "_id": doa[i].eventParticipants[k]
                                        });
                                        if (lj !== undefined) {
                                            if (lj.teamOwner === u.userId) {
                                                sss[doa[i].abbName] = parseInt(doa[i].prize);
                                            }
                                        } else {

                                        }
                                    }
                                };

                            }

                        }

                        var Total = 0;
                        var aa;
                        var bb;
                        var gg=[]
                        for (var key in sss) {
                           var ZX  =  ["MCB","MCG","CB","CG","SJB","SJG","JB","JG","YB","YG","M","W","NMS","NMD","OS","OD","O"]
                            if (sss.hasOwnProperty(key)) {
                                if (key != "emailAddress" && key != "Name" && /*key!="Sl.No"&&*/ key != "Academy Name" && key != "Phone Number" && key != "DOB (dd/mmm/yyyy)") {
                                    aa= JSON.parse(JSON.stringify(sss,ZX , 22));
                                    
                                    Total = Total + parseInt(sss[key]);
                                }
                            }
                           bb=JSON.parse(JSON.stringify(sss,ZX , 22));
                        }
                        for(key in aa) {
                            if(aa.hasOwnProperty(key)) {
                                var value = aa[key];
                                gg.push(value)
                            }
                        }
                        dataD={
                            tourID:xData,
                            tournamentName:tournamentName.eventName,
                            userIdD:u.userId,
                            userNameD:sss["Name"],
                            academyNameD:sss["Academy Name"],
                            emailAddressD:sss['emailAddress'],
                            phoneNumberD:sss['Phone Number'],
                            dobD:sss['DOB (dd/mmm/yyyy)'],
                            eventNamesD:bb,
                            eventsD:_.values(aa),
                            totalD:Total
                        }
                         eveList.push(dataD)
                    });
                }
            }
        }
        //var eventStartDateAge = events.find({},{sort:{"eventStartDate":1}}).fetch();
    

        if (eveList.length == 0) {
            return 0
        } else{
            eveList.sort(sortClubName_HTML("academyNameD"));
            eveList.map(function(document, index){
                document["slNoD"]=parseInt(index+1);
            });
            return eveList;
        }
    }
});


function sortClubName_HTML(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property].toUpperCase() < b[property].toUpperCase()) ? -1 : (a[property].toUpperCase() > b[property].toUpperCase()) ? 1 : 0;
        return result * sortOrder;
    }
}