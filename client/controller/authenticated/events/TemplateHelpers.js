//User defined Template helpers
/**
 * @Author Vinayashree
 */
/**
 * register the helper "upcomingformatDate" this is used to format the date
 * when the helper upcomingformatDate is called the variable date contains
 * the date from called spacebar.
 * change the date format to DD MMM YYYY h:mm a using moment bootstrap
 */
Template.registerHelper('checkallprojectsUser',function(data){
	try{
	var j = tournamentEvents.find({}).fetch();
	if(j!=undefined){
		if(data.interestedProjectName.length===j.length){
			return true
		}
		else{
			return false
		}
	}
	}catch(e){
	}

});
Template.registerHelper('checkalldomainsUser',function(data){
	try{

	var j = domains.find({}).fetch();
	if(j!=undefined){
	if(data.interestedDomainName.length===j.length){
		return true
	}
	}
}catch(e){
	}
});
Template.registerHelper('tournNameView', function(data) {
		try{

	var name = events.findOne({"_id":data})
	return name.eventName
	}catch(e){
	}
});

Template.registerHelper('tournNameViewPAst', function(data) {
		try{

	var name = pastEvents.findOne({"_id":data})
	return name.eventName
	}catch(e){
	}
});

Template.registerHelper('upcomingformatDate', function(date) {
	try{
		if(date != "" || date != undefined || date != null || date.trim() != " ")
		{
			return moment(new Date(date)).format("DD MMM YYYY");
		}
	}catch(e){
	}
});

Template.registerHelper('formatDateWithTime', function(date) {
	try{
		if(date != "" || date != undefined || date != null || date.trim() != " ")
		{
			return moment(new Date(date)).format("DD MMM YYYY hh:mm a");
		}
	}catch(e){
	}
});

Template.registerHelper('liveUpcomingformatDate', function(date) {
		try{
	return moment(new Date(date)).format("h:mm a DD-MM-YYYY");
	}catch(e){
	}

});
/**
 * register the helper "displayDomainName" this is used to display only three letters
 * when the helper displayDomainName is called the variable data contains
 * the data from called spacebar.
 * change the data to 3 letters using substr
 */
Template.registerHelper('displayDomainName', function(data) {
		try{

	var s = data;
	return String(s).toUpperCase().substr(0, 3);
	}catch(e){
	}
});


/**
 * register the helper "checkRead" this is used to change the color of red event
 * when the helper checkRead is called the variable data contains
 * the data from called spacebar.
 * get the user details of current user
 * and fetch the upcomingListReadStatus
 * for userId, eventIdReadStatus.eventId, eventIdReadStaus.readStatus
 * if length of fetched data is not equal to 0 return true.
 * true changes the color to red
 */
Template.registerHelper('checkRead', function(data) {
		try{

	var userId = Meteor.users.findOne({
		"_id": Meteor.userId()
	});
	var k = 
	upcomingListsReadStatus.find({
 "userId": userId.userId,
  "eventIdReadStatus": { $elemMatch: { "eventId": data,"readStatus":false } }
}).fetch()
	if (k.length!==0)
		return true;
	}catch(e){
	}
});

Template.registerHelper('checkReadTour',function(data){
		try{

	if(data){
		return ReactiveMethod.call("eventsUnderTournHelper",data);
	}
	}catch(e){
	}
});
Template.registerHelper('checkReadTourPast',function(data){
		try{

	if(data){
		return ReactiveMethod.call("eventsPastUnderTournHelper",data);
	}
	}catch(e){
	}
});

Template.registerHelper("checkSubHide",function(data,checkForDataOrganizer){
		try{
			if(checkForDataOrganizer){
				checkForDataOrganizer = checkForDataOrganizer
			}
			else{
				checkForDataOrganizer = false
			}
			var s = ReactiveMethod.call("eventSubLastUnderTournHelper",data,checkForDataOrganizer);
			if(s)
				return s;
			else{
				//$("#eventSubscribeCancel").val("Done")
				return true;
			}
}catch(e){
	}

});

Template.registerHelper("checkSubHideLastDATESUB",function(data){
		try{
			var s = ReactiveMethod.call("eventSubLastUnderTournHelper",data);
			if(s)
				return true;
			else{
				return false;
			}
}catch(e){
	}

});
Template.registerHelper("checkSubHideStar",function(data){
		try{
			var s = ReactiveMethod.call("eventSubLastUnderTournHelper2",data);
			if(s)
				return s;
			else{
				return false;
			}
}catch(e){
	}

});
Template.registerHelper("checkSubHide2",function(data){
		try{

	var s ;
	if(data){
		var s = ReactiveMethod.call("eventsPastUnderTournHelper",data);
			return true
	}
	}catch(e){
	}
});


Template.registerHelper('checkReadTourMy',function(data){
	try{
	if(data){
		var response =  ReactiveMethod.call("myeventsUnderTournHelper",data);
		return response;
	}
	}catch(e){
	}
});
Template.registerHelper('checkSubscribedEvent_Entries',function(data){
	try{

	if(data){
		var response =  ReactiveMethod.call("myeventsSubscribedUnderTournHelper",data);
		return response;
	}
	}catch(e){
	}
});
Template.registerHelper('checkViewReadTour', function(data) {
		try{

	var userId = Meteor.users.findOne({
		"_id": Meteor.userId()
	});
	var k = 
	upcomingListsReadStatus.find({
 "userId": userId.userId.toString(),
  "eventIdReadStatus": { $elemMatch: { "eventId": data.toString(),"readStatus":false } }
}).fetch()
	if (k.length!==0)
		return true;
	}catch(e){
	}
});

/**
 * register the helper "checkRead" this is used to change the color of red event
 * when the helper checkRead is called the variable data contains
 * the data from called spacebar.
 * get the user details of current user
 * and fetch the upcomingListReadStatus
 * for userId, eventIdReadStatus.eventId, eventIdReadStaus.readStatus
 * if length of fetched data is not equal to 0 return true.
 * true changes the color to red
 */
Template.registerHelper('checkEditRead', function(data) {
		try{

	var userId = Meteor.users.findOne({
		"_id": Meteor.userId()
	});
	var k = 	upcomingListsReadStatus.findOne({
 "userId": userId.userId,
  "eventIdReadStatus": { $elemMatch: { "eventId": data,"readStatus":true } }
})
	if (k)
		return true;
	}catch(e){
	}
});

/**
 * register the helper "pastformatDate" this is used to format the date
 * when the helper pastformatDate is called the variable date contains
 * the date from called spacebar.
 * change the date format to DD MMM YYYY h:mm a using moment bootstrap
 */
Template.registerHelper('pastformatDate', function(date) {
		try{

	return moment(new Date(date)).format("DD MMM YYYY");
	}catch(e){
	}
});

/**
 * register the helper "formatDate" this is used to format the date when the
 * helper formatDate is called the variable data contains the data from called
 * spacebar. change the date format to DD MMM YYYY using moment bootstrap
 */
Template.registerHelper('formatDate', function(data) {
		try{

	return moment(new Date(data)).format("DD MMM YYYY");
	}catch(e){
	}
});

/**
 * register the helper "displayDomainName" this is used to display only three
 * letters when the helper displayDomainName is called the variable data
 * contains the data from called spacebar. change the data to 3 letters using
 * substring
 */
Template.registerHelper('displayingDomainName', function(data) {
		try{

	var s = data
	var domainName = domains.findOne({
		"_id": data.toString()
	});
	if(domainName!=undefined)
	return String(domainName.domainName.toString()).toUpperCase().substr(0, 3);
	}catch(e){
	}
})

/**
 * register the helper "displayProjectName" this is used to display project
 * names when the helper displayProjectName is called the variable data
 * contains the project Id  from called spacebar. return the id to project
 * name by fetching project name to corresponding id
 */
Template.registerHelper("displayProjectName", function(data) {
	try{
	var s = data;
	var projectName =tournamentEvents.findOne({
		"_id": data.toString()
	});/* projects.findOne({
		"_id": data.toString()
	});*/
	if(projectName!=undefined)
	return projectName.projectMainName.toString();
}catch(e){}
});

Template.registerHelper("checkaddEveChecked", function(data) {
		try{

	var s = data;
	var eve = events.findOne({"_id":Router.current().params._PostId,
	"eventsProjectIdUnderTourn":data});
	if(eve)
	return true
	else
	return false
}catch(e){
	}
});

Template.registerHelper("checkaddEveCheckedStart", function(data) {
		try{

	var s = data;

	var eve = events.findOne({"tournamentId":Router.current().params._PostId,
	"projectId":data});
	if(eve)
	return eve.eventStartDate
	else
	return false
}catch(e){
	}
});

Template.registerHelper("checkaddEveCheckedEnd", function(data) {
		try{

	var s = data;
	var eve = events.findOne({"tournamentId":Router.current().params._PostId,
	"projectId":data});
	if(eve)
	return eve.eventEndDate
	else
	return false
}catch(e){
	}
});

Template.registerHelper("checkaddEveCheckedFee", function(data) {
		try{

	var s = data;
	var eve = events.findOne({"tournamentId":Router.current().params._PostId,
	"projectId":data});
	if(eve)
	return eve.prize
	else
	return false
}catch(e){
	}
});
/**
 * register the helper "displaySubscriberName" this is used to list the
 * subscribers of an event. when the helper displaySubscriberName is called the
 * variable data contains the userId or teamId(subscribed user ids) from called
 * spacebar,fetch the db for userId or teamId. then return corresponding userName or teamName
 */
Template.registerHelper('displaySubscriberName', function(data) {
		try{

	var subUserId = data;
	var subUserName = ReactiveMethod.call("organizerName",data)
	if (subUserName == undefined) {
		var subUserName = teams.findOne({
			"_id": subUserId
		})
		var name = subUserName.teamName;
	} else
		var name = subUserName.userName;
	if (name.toString().length >= 39) {
		var data = name.toString().substring(0, 39).trim() + "..";
		return data;
	} else
		return name;
		}catch(e){
	}
});


/**
 * register the helper "displayTeamSubscriberName" this is used to list the
 * subscribers of an event. when the helper displaySubscriberName is called the
 * variable data contains the teamId(subscribed user ids) from called
 * spacebar,fetch the db for teamId. then return corresponding teamName
 */
Template.registerHelper('displayTeamSubscriberName', function(data) {
		try{

	var subUserId = data;
	var subUserName = teams.findOne({
		"_id": subUserId
	});
	//if the string is more than length of 35 characters add ..
	if (subUserName.teamName.toString().length >= 35) {
		$(".subMenuSubscriberList").attr("style","width:52% !important");
		$(".subscriberName").css("width","95% !important");
		var data = subUserName.teamName.toString().substring(0, 35).trim() + "..";
		return data;
	} else
		return subUserName.teamName;
		}catch(e){
	}
});

/**
 * register the helper "teamNameCheckSubString" this is used to  the
 * subscribed team name  of an event. when the helper teamNameCheckSubString is called the
 * variable data contains the teamId(subscribed user ids) from called
 * spacebar,fetch the db for teamId. then return corresponding teamName
 */

/**
 * register the helper "checkBlackTeam" this is check team id is black listed by
 * event organizer. when the helper checkBlackTeam is called the
 * variable data contains the team id( subscribed) from called
 * spacebar,fetch the db for userId and blackListedUsers. 
 * then return true if not blacklisted
 */
Template.registerHelper('checkBlackTeam', function(d) {
		try{

	var userId = Meteor.users.findOne({
		"_id": Meteor.userId()
	});
	var checkBlackTeam = Meteor.users.find({
		$and: [{
			"userId": userId.userId
		}, {
			"blackListedUsers": d.toString()
		}]
	}).fetch();
	if (checkBlackTeam.length == 0) {
		return false;
	} else {
		return true;
	}
	}catch(e){
	}
});

/**
 * register the helper "checkSubDomain1Name" this is used to check the checkbox of
 * subDomain1 or subDomain2 name.
 * when the helper checkSubDomain1Name is called the variable data contains
 * the data from called spacebar, convert the typeof data to array and check
 *  if it is there return array of subDomain1 name or subDomain2 name
 */
Template.registerHelper('checkSubDomain1Name', function(data) {
		try{

	var j = [];
	j.push(data);
	return j
	}catch(e){
	}
});

/**
 * register the helper "blackUserName" this is used to list the blackListed
 * users. when the helper blackUserName is called the variable data contains the
 * userId or teamId (blacklisted user ids or team ids) from called spacebar,
 * convert the typeof data to
 * string and fetch the db for userId or teamId. then return corresponding userName or teamName
 */
Template.registerHelper('blackUserName', function(data) {
		try{

	var blackUserName = Meteor.users.findOne({
		"userId": data.toString()
	});
	if (blackUserName == undefined) {
		var blackTeamName = teams.findOne({
			"_id": data.toString()
		});
		//if the string is more than length of 39 characters add ..
		if (blackTeamName.teamName.toString().length >= 34) {
			var data = blackTeamName.teamName.toString().substring(0, 34).trim() + "..";
			return data;
		} else return blackTeamName.teamName.toString();
	} else {
		//if the string is more than length of 39 characters add ..
		if (blackUserName.userName.toString().length >= 34) {
			var data = blackUserName.userName.toString().substring(0, 34).trim() + "..";
			return data;
		} else return blackUserName.userName.toString();
	}
}catch(e){
	}
});

/**
 * register the helper "blackTeamNameColor" this is used to list the change
 * the blackListed team color.
 * when the helper blackTeamNameColor is called the variable data contains the
 * teamId or userId (blacklisted user ids or team ids) from called spacebar,
 * if its teamId change return true
 */
Template.registerHelper('blackTeamNameColor', function(data) {
		try{

	var blackTeamName = teams.findOne({
		"_id": data.toString()
	});
	if (blackTeamName)
		return true;
	}catch(e){
	}
});

/*not used*/
Template.registerHelper('teamName', function(data) {
		try{

	var teamName = teams.findOne({
		"teamMembers": data.toString()
	});
	return teamName.teamName.toString();
	}catch(e){
	}
});

/**
 * register the helper "checkProjectName" this is used to check the checkbox of
 * sports. when the helper checkProjectName is called the variable data contains
 * the data from called spacebar, convert the typeof data to array and check
 * whether it is inside the list of interestedProjectName of current logged in
 * userId. if it is there return true, this true will the check corresponding
 * checkbox
 */
Template.registerHelper('checkProjectName', function(data) {
		try{

	var j = [];
	j.push(data);
	var k = Meteor.users.find({
		"_id": Meteor.userId(),
		"interestedProjectName": {
			$in: j
		}
	}).fetch();
	if (k.length != 0) {
		return true;
	}
	}catch(e){
	}
});

/**
 * register the helper "checkDomainName" this is used to check the checkbox of
 * place. when the helper checkDomainName is called the variable data contains
 * the data from called spacebar, convert the typeof data to array and check
 * whether it is inside the list of interestedDomainName of current logged in
 * userId. if it is there return true, this true will the check corresponding
 * checkbox
 */
Template.registerHelper('checkDomainName', function(data) {
		try{

	var j = [];
	j.push(data);
	var k = Meteor.users.find({
		"_id": Meteor.userId(),
		"interestedDomainName": {
			$in: j
		}
	}).fetch();
	if (k.length != 0) {
		return true;
	}
	}catch(e){
	}
});

/** 
 * register the helper "projectSubString" this is used to convert
 * projectId to projectName. used in editEvents.html title.
 * variable d contains project id, which is used to fetch
 * project name from projects collection
 * 
 */
Template.registerHelper('projectSubString',function(d){
		try{

    var data = projects.findOne({"_id":d.toString()});
  //if the string is more than length of 10 characters add ..
    if(data.projectName.toString().length>=10){
        data = data.projectName.toString().substring(0,10).trim() + "..";
        return data;
    }
    else return data.projectName.toString();
    }catch(e){
	}
});

/** 
 * register the helper "editDomainName" this is used to convert
 * selected id  (when event is created)of domainName to domainName.
 * used in editEvents.html venue select box.
 * variable data contains domain id, which is used to fetch
 * domain name from domains collection
 * 
 */
Template.registerHelper('editDomainName', function(data) {

	try{
    var s = data;
    var domainName = ReactiveMethod.call("DomainName",data);
    if(domainName!=undefined)
    return domainName.domainName.toString();
}catch(e){}
});

/** 
 * register the helper "eventNameSubString" this is used to change
 * eventName string length. used in editEvents.html title.
 * variable data contains eventName, if characters of 
 * data is more than 33, trim it and add ..
 */
Template.registerHelper('eventNameSubString',function(data){
	try{
    if(data.toString().length>=33){
        data = data.toString().substring(0,33).trim() + "..";
        return data;
    }
    else return data;
}catch(e){}
});

/** 
 * register the helper "sponsorPdfNameSubString" this is used to change
 * eventName string length. used in editEvents.html title.
 * variable data contains eventName, if characters of 
 * data is more than 33, trim it and add ..
 */
Template.registerHelper('sponsorPdfNameSubString',function(data){
		try{

    if(data.toString().length>=45){
        data = data.toString().substring(0,45).trim() + "..";
        return data;
    }
    else return data;
    }catch(e){
	}
});
Template.registerHelper('NameSubString',function(data){
		try{

    if(data.toString().length>=30){
        data = data.toString().substring(0,30).trim() + "..";
        return data;
    }
    else return data;
    }catch(e){
	}
});
/** 
 * not used
 */
Template.registerHelper('editformatDate', function(date) {
		try{

    return moment(new Date(date)).format("MM/DD/YYYY h:mm a");
    }catch(e){
	}
});

/** 
 * register the helper "formatId" this is used to convert
 * objectId  to string id. used in editEvents.html.
 * variable data contains object id,is converted into string
 * 
 */
Template.registerHelper('formatId', function(data) {
	try{
  return (data && data._str) || data;
}catch(e){}
});

/**
 *  not used
 */
Template.registerHelper('checkEditSubDomain1Name', function(data) {
		try{

    //var subDomain1checked = subDomain1.findOne({"subDomain1Name":data.toString()});
    var j = [];
   // j.push(subDomain1checked._id.toString());
   j.push(data);
    var k = events.findOne({
        "_id": Router.current().params._PostId,
        "subDomain1Name": {
            $in: j
        }
    });
    if (k) {
        Session.set("subDomain1ID",k.subDomain1Name.toString());
        return true;
     }
     }catch(e){
	}
});

/**
 * not used
 */
Template.registerHelper('checkEditSubDomain2Name', function(data) {
		try{

    var j = [];
    j.push(data);
    var k = events.find({
        "_id": Router.current().params._PostId,
        "subDomain2Name": {
            $in: j
        }
    }).fetch();
    if (k.length!=0) {
        Session.set("subDomain2ID",this._id);
        return true;
     }
     }catch(e){
	}
});

/**not used
 * register the helper "viewformatDate" this is used to format the date
 * when the helper viewformatDate is called the variable date contains
 * the date from called spacebar.
 * change the date format to DD using moment bootstrap
 */
Template.registerHelper('viewformatDate', function(date) {
		try{

	return moment(new Date(date)).format("DD");
	}catch(e){
	}
});

/**
 * register the helper "currentEntryUserName" this is used to get the organizer name
 *when the helper currentEntryUserName is called the variable data contains the
 * userId from called spacebar, convert the typeof data to
 * string and fetch the db for userId. then return corresponding userName
 */
Template.registerHelper('currentEntryUserName', function(data) {
		try{

	var currentEntryUserName = ReactiveMethod.call("organizerName",data)
	return currentEntryUserName.userName.toString();
	}catch(e){
	}
});

/**
 * register the helper "viewformatDate1" this is used to format the date
 * when the helper viewformatDate is called the variable date contains
 * the date from called spacebar.
 * change the date format to DD MMM YYYY using moment bootstrap
 */
Template.registerHelper('viewformatDate1', function(date) {
		try{

	return moment(new Date(date)).format("DD MMM, YYYY");
	}catch(e){
	}
});

/**
 * register the helper "viewClosureDate" this is used to format the date
 * when the helper viewClosureDate is called the variable date contains
 * the date from called spacebar.
 * change the date format to DD MMM YYYY hh:mm a (hour minute am/pm) using moment bootstrap
 */
Template.registerHelper('viewClosureDate', function(date) {
		try{

	return moment(new Date(date)).format("DD MMM, YYYY");
	}catch(e){
	}
});

/** 
 * register the helper "sponsorNameSubString" this is used to change
 * sponsor name string length. used in viewEvents.html, viewEventsPast.html.
 * variable data contains eventName, if characters of 
 * data is more than 41, trim it and add ..
 */
Template.registerHelper('sponsorNameSubString',function(data){
		try{

    if(data.toString().length>=41){
        data = data.toString().substring(0,41).trim() + "..";
        return data;
    }
    else return data;
    }catch(e){
	}
});

Template.registerHelper("academyNAMEMAIL",function(data){
	try{
    var aca1 = Meteor.users.findOne({
        "_id":data.trim().toString()
    })
    if(aca1&&aca1.clubName){
        return aca1.clubName
    }
    else{
        return "other"
    }
	}catch(e){}
})

Template.registerHelper("affiliIDMAIL",function(data){
	try{
    var aca2 = Meteor.users.findOne({
        "_id":data.trim().toString()
    })
    if(aca2&&aca2.affiliationId){
        return aca2.affiliationId
    }
    else{
        return " "
    }
	}catch(e){}
})

Template.registerHelper("emailMAIL",function(data){
	try{
    var aca3 = Meteor.users.findOne({
        "_id":data.trim().toString()
    })
    if(aca3&&aca3.emailAddress){
        return aca3.emailAddress
    }
    else{
        return " "
    }
	}catch(e){}
})

Template.registerHelper("phoneNUMBMAIL",function(data){
	try{
    var aca4 = Meteor.users.findOne({
        "_id":data.trim().toString()
    })
    if(aca4&&aca4.phoneNumber){
        return aca4.phoneNumber
    }
    else{
        return " "
    }
	}catch(e){}

})

Template.registerHelper("guardNAMEMAIL",function(data){
	try{
    var aca5 = Meteor.users.findOne({
        "_id":data.trim().toString()
    })
    if(aca5&&aca5.guardianName){
        return aca5.guardianName
    }
    else{
        return " "
    }
	}catch(e){}
})

Template.registerHelper("addressMAIL",function(data){
	try{
    var aca6 = Meteor.users.findOne({
        "_id":data.trim().toString()
    })
    if(aca6&&aca6.address){
        return aca6.address
    }
    else{
        return " "
    }
	}catch(e){}
})

Template.registerHelper("slNUM",function(data){
	try{
		return parseInt(parseInt(data)+1)
	}catch(e){}
})