Template.insertPlayers.onCreated(function() {
    this.subscribe("users");
    this.subscribe("insertedPlayersFromCsv");
});

Template.insertPlayers.onRendered(function() {
    $("#inserted").html("")
    Session.set("duplicatedPlayer", undefined)
    Session.set("playersDetailsArray", undefined)
    Session.set("playersDetailsCounter", undefined)
});

Template.insertPlayers.helpers({
    changedNames: function() {
        if (Session.get("userNameChanged")) {
            return Session.get("userNameChanged")
        }
    }
});

Template.insertPlayers.events({
    'change [name="insertPlayers"]': function(event, template) {
        $("#inserted").html("");
        var fileHandle = event.target.files[0];
        var matches;
        Papa.parse(fileHandle, {
            header: true,
            complete: function(fileData, file) {
                var playersDetails = fileData.data;
                Session.set("playersDetailsArray", playersDetails)
                for (var i = 0; i < playersDetails.length; i++) {
                    var associationDetails = "";
                    var nationalAffiliationID = "";
                    if (playersDetails[i].nationalAffiliationId) {
                        nationalAffiliationID = playersDetails[i].nationalAffiliationId
                    }
                    var affiliationId = "";
                    if (playersDetails[i].affiliationId) {
                        affiliationId = playersDetails[i].affiliationId
                    }
                    var clubDetails = Meteor.users.findOne({
                        "_id": playersDetails[i].clubNameId
                    })
                    if (clubDetails) {
                        $("#inserted").html("inserting players..");
                        Session.set("passwordDirect", randomPassword_PlayerDirect(7))
                            //if(playersDetails[i].emailAddress&&playersDetails[i].emailAddress.trim().length!=0){
                        var data = {
                            //"password":Session.get("passwordDirect"),
                            "interestedDomainName": [""],
                            "interestedProjectName": [""],
                            "interestedSubDomain1Name": [""],
                            "interestedSubDomain2Name": [""],
                            "role": "Player",
                            "emailAddress": playersDetails[i].emailAddress,
                            "userName": playersDetails[i].userName,
                            "guardianName": playersDetails[i].guardianName,
                            "clubName": clubDetails.clubName,
                            "clubNameId": playersDetails[i].clubNameId,
                            "phoneNumber": playersDetails[i].phoneNumber,
                            "associationId": playersDetails[i].associationId,
                            "state": clubDetails.state,
                            "dateOfBirth": playersDetails[i].dateOfBirth,
                            "gender": playersDetails[i].gender,
                            "country": clubDetails.country,
                            "address": playersDetails[i].address,
                            "city": playersDetails[i].city,
                            "pinCode": playersDetails[i].pinCode,
                            "affiliationId": affiliationId,
                            "statusOfUser": playersDetails[i].statusOfUser,
                            "nationalAffiliationId": nationalAffiliationID
                        }
                        var findDuplicate = Meteor.users.findOne({
                            "role": "Player",
                            "emailAddress": playersDetails[i].emailAddress,
                            "userName": playersDetails[i].userName,
                            "guardianName": playersDetails[i].guardianName,
                            "phoneNumber": playersDetails[i].phoneNumber,
                            "dateOfBirth": playersDetails[i].dateOfBirth,
                            "gender": playersDetails[i].gender,
                            "address": playersDetails[i].address,
                            "city": playersDetails[i].city,
                            "pinCode": playersDetails[i].pinCode,
                            "nationalAffiliationId": nationalAffiliationID
                        })
                        if (findDuplicate) {
                            $("#inserted").html("");
                            Session.set("duplicatedPlayer", playersDetails[i]);
                            Session.set("playersDetailsCounter", i)
                            Blaze.render(Template.confirmInsertPlayer, $("#confirmInsertPlayerRender")[0]);
                            $("#confirmInsertPlayer").modal({
                                backdrop: 'static',
                                keyboard: false
                            });
                            var input = $("input[type='file']");
                            input.html(input.html()).val('');
                            break;
                        }
                        else{
                            Meteor.call("insertPlayerFromAca_CSV",data,function(e,res){
    		 	        			if(e){
    		 	        				alert(e)
    		 	        			}
    		 	        			else{
    		 	        			$("#inserted").html("inserted players..");
    		 	        			}
    		 	        	});
                        }
                    } /*else {
                        $("#inserted").html("inserting players..");
                        var data = {
                                "interestedDomainName": [""],
                                "interestedProjectName": [""],
                                "interestedSubDomain1Name": [""],
                                "interestedSubDomain2Name": [""],
                                "role": "Player",
                                "emailAddress": playersDetails[i].emailAddress,
                                "userName": playersDetails[i].userName,
                                "guardianName": playersDetails[i].guardianName,
                                "clubName": playersDetails[i].clubName,
                                "clubNameId": "other",
                                "phoneNumber": playersDetails[i].phoneNumber,
                                "associationId": "other",
                                "state": "hsTNDPxZjqmGz3sZv",
                                "dateOfBirth": playersDetails[i].dateOfBirth,
                                "gender": playersDetails[i].gender,
                                "country": "India",
                                "address": playersDetails[i].address,
                                "city": playersDetails[i].city,
                                "pinCode": playersDetails[i].pinCode,
                                "affiliationId": playersDetails[i].affiliationId,
                                "statusOfUser": playersDetails[i].statusOfUser,
                                "nationalAffiliationId": nationalAffiliationID,
                                "districtAssociationName": playersDetails[i].districtAssociationName
                            }
                            /*Meteor.call("insertPlayerFromAca_CSV",data,function(e,res){
		 	        		if(e){
		 	        		}
		 	        		else{
		 	        			$("#inserted").html("inserted players..");
		 	        		}
		 	        	})
                    }*/
                     if(i== playersDetails.length-1) { 
                        alert("inserted1")
                        //Do something if the end of the loop    
                    }
                }

            }
        });
    },

    'click #cancelMenu': function(e) {
        e.preventDefault();
        Router.go("/upcomingEvents")
    },

    'click #changeclubNameId': function(e) {
        e.preventDefault();
        Meteor.call("changeclubNameIdHidden", function(e, r) {
            Session.set("userNameChanged", r)

        })
    },

    'click #downloadCsv': function(e) {
        e.preventDefault();
        var arrayToUp = []
        var arrayToDown = Meteor.users.find({
            role: "Player"
        }, {
            fields: {
                "emailAddress": 1,
                "userName": 1,
                "guardianName": 1,
                "clubName": 1,
                "clubNameId": 1,
                "phoneNumber": 1,
                "associationId": 1,
                "state": 1,
                "dateOfBirth": 1,
                "gender": 1,
                "country": 1,
                "address": 1,
                "city": 1,
                "pinCode": 1,
                "affiliationId": 1,
                "nationalAffiliationId": 1,
                "_id": 0,

            }
        }).fetch();
        if (arrayToDown.length != 0) {
            _.each(arrayToDown, function(user) {
                if (user.affiliationId !== undefined && user.affiliationId !== null && user.affiliationId.trim().length != 0 && user.affiliationId !== undefined) {
                    var data = {
                        "emailAddress": user.emailAddress,
                        "userName": user.userName.toUpperCase(),
                        "guardianName": user.guardianName.toUpperCase(),
                        "clubName": user.clubName.toUpperCase(),
                        "clubNameId": user.clubNameId,
                        "phoneNumber": user.phoneNumber,
                        "dateOfBirth": user.dateOfBirth,
                        "affiliationId": user.affiliationId,
                        "gender": user.gender,
                        "address": user.address.toUpperCase(),
                        "city": user.city.toUpperCase(),
                        "pinCode": user.pinCode,
                        "nationalAffiliationId": user.nationalAffiliationId,
                    }
                    if (user.nationalAffiliationId == null || user.nationalAffiliationId == undefined) {
                        data["nationalAffiliationId"] = ""
                    } else {
                        data["nationalAffiliationId"] = user.nationalAffiliationId
                    }
                    if (user.associationId == null || user.associationId == undefined) {
                        data["associationId"] = "other"
                    } else {
                        data["associationId"] = user.associationId
                    }
                    arrayToUp.push(data)
                }
            });
        }
        JSONToCSVConvertorUsers(arrayToUp, "", true, "iplayonusers")
    },
    "click #delete":function(e){
        e.preventDefault();
        var name = $("#deleteUserName").val();
        Meteor.call("deletePlayersByName",name,function(e,r){

        })
    },
    "click #downloadAllCSV":function(e){
        e.preventDefault();
        var users = Meteor.users.find({
            role: "Player"
        }).fetch();
    var fileName = "allusers";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += "".replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text;charset=utf-8,' + escape(JSON.stringify(users));

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".txt";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    },
    "click #deletedView":function(e){
        Blaze.render(Template.confirmInsertPlayer2, $("#confirmInsertPlayerRender")[0]);
        $("#confirmInsertPlayer2").modal({
                backdrop: 'static',
                keyboard: false
        });

    }
});

function randomPassword_PlayerDirect(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}


function JSONToCSVConvertorUsers(JSONData, ReportTitle, ShowLabel, filNam) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    // CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = '"' + "Sl.No" + '",';

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += '"' + index + '",';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    var s = 0
    for (var i = 0; i < arrData.length; i++) {
        s = s + 1;
        var row = s + ",";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            if (typeof arrData[i][index] == "string")
                row += '"' + arrData[i][index] + '",';
            else {
                row += arrData[i][index] + ","

            }
        }

        row = row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = filNam + "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}



/*	'change [name="insertClub"]': function (event, template) {
		try{
			$("#insertClub").html("");
			var fileHandle = event.target.files[0];
	        var matches;
	        Papa.parse(fileHandle, {
	        header: true,
	        complete: function (fileData, file) {
	 	        var academyDetails = fileData.data;
	 	        for(var i=0;i<academyDetails.length;i++){
	 	        	$("#insertClub").val("inserting academy")
	 	        		var data={
					   		userName:academyDetails[i].contactPersonName,
					   		emailAddress:academyDetails[i].emailAddress,
					   		password:academyDetails[i].password
					   	}
					   	var associationDetails = Meteor.users.findOne({
	 	        		"_id":academyDetails[i].associationId
	 	        	    })
	 	        	    var academyIter=academyDetails[i]
	 	        	    if(associationDetails){
					   	Meteor.call("insertAcademyFromAss",data,function(e,r){
					   		$("#insertClub").val("inserted academy")
					   		if(r){
					   			try{
					   				var lData = {
										interestedProjectName:associationDetails.interestedProjectName,
										interestedDomainName: associationDetails.interestedDomainName,
										interestedSubDomain1Name: [""],
										interestedSubDomain2Name: [""],
				  	 					associationId:academyIter.associationId,
										phoneNumber: academyIter.phoneNumber,
										clubName: academyIter.clubName,
										emailAddress:academyIter.emailAddress,
										role:'Academy',
										contactPerson:academyIter.contactPersonName,
				 	 					address:academyIter.address,
										city:academyIter.city,
										pinCode:academyIter.pinCode,
										newUserId:r,
										state:associationDetails.state,
										country:"India",
										userName:academyIter.contactPersonName,
										abbrevationAcademy:academyIter.abbrevationAcademy
									};
									Meteor.call("updateAcademyInsertedFromAss",lData,function(e,res){
										if(e){
										}
									});
					   			}catch(e){
					   			}
					   		}
					   	});
						}		
		 	        }
	 	        }
	    	});
		}catch(e){
		}
	},*/