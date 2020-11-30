Template.schoolRegisterUpload.onCreated(function(){

})

Template.schoolRegisterUpload.onRendered(function(){
	Session.set("fileHandleData",undefined)
	Session.set("errorLogsSession",[])
    Session.set("ArrayInserted",[])
    Session.set("errorsThere",true)
})

Template.schoolRegisterUpload.helpers({
	"notAdmin": function() {
        try {
            var emailAddress = Meteor.user().emails[0].address;
            var boolVal = false
            var auth = authAddress.find({}).fetch();
            if (auth) {
                for (var i = 0; i < auth.length; i++) {
                    if (emailAddress && emailAddress == auth[i].data) {
                        boolVal = false;
                    } else {
                        boolVal = false;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {}
    },
})

Template.schoolRegisterUpload.events({
	"click #clearFirst":function(){
		var input = $("input[name=insertPlayersADMIN1][type='file']");
        input.html(input.html()).val('');
        Session.set("fileHandleData",[])
		Session.set("errorLogsSession",[])
		$("#errorsText").html("")
		$("#successText").html("")
        Session.set("ArrayInserted",[])
        Session.set("errorsThere",true)
	},
    "click #downloadUploadedCSV":function(){
        if(Session.get("ArrayInserted")){
            JSONToCSVConvertorUsers(Session.get("ArrayInserted"), "", true, "iplayonusers")
        }
    },
    "click #adminUpload_validation":async function(){
        try{
            if (Session.get("errorLogsSession")==undefined||Session.get("errorLogsSession").length==0) {
                if (Session.get("fileHandleData")==undefined) {
                    alert("Browse file to upload")
                }else{
                    $("#errorsText").html("WAIT ANANTHAN..!!")
                    var err = true
                    var noErrors = []
                    var fileHandle = Session.get("fileHandleData")
                    var playersDetails = fileHandle;

                    for (var i = 0; i < playersDetails.length; i++) {
                        playersDetails[i].role = "school"
                        var getTeamDet = await Meteor.callPromise("validationRegisterExtAPI",playersDetails[i])
                        if(getTeamDet && getTeamDet.status==FAIL_STATUS){
                            var _1noErrors = 
                                {
                                    "line":i + 1,
                                    "message":JSON.stringify(getTeamDet.message)
                                }
                            noErrors.push(_1noErrors)
                            err = false
                            //$("#errorsText").html(JSON.stringify(noErrors))
                        }
                    }

                    var dupArr = [];
                    var groupedByCount = _.countBy(playersDetails, function(item) {
                        return item.phoneNumber;
                    });

                    var dupArr2 = []
                    var groupedByCount2 = _.countBy(playersDetails, function(item) {
                        return item.emailAddress.trim().toLowerCase();
                    });

                    var dupArr3 = []
                    var groupedByCount3 = _.countBy(playersDetails, function(item) {
                        return item.abbrevation.trim().toLowerCase();
                    });
                    for (var emailAddress in groupedByCount2) {
                        if (groupedByCount2[emailAddress] > 1 && emailAddress.trim().length != 0) {
                           dupArr2.push(emailAddress.toUpperCase());
                        }
                    };


                    for (var abbrevation in groupedByCount3) {
                        if (groupedByCount3[abbrevation] > 1 && abbrevation.trim().length != 0) {
                            dupArr3.push(abbrevation);
                        }
                    };

                    for (var phoneNumber in groupedByCount) {
                        if (groupedByCount[phoneNumber] > 1 && phoneNumber.trim().length != 0) {
                            dupArr.push(phoneNumber);
                        }
                    };
                    if (dupArr.length != 0) {
                        var data = {
                            line: "repeated phone numbers",
                            message: JSON.stringify(dupArr)
                        }
                        noErrors.push(data)
                    }
                    if (dupArr2.length != 0) {
                        var data = {
                            line: "repeated emailAddress",
                            message: JSON.stringify(dupArr2)
                        }
                        noErrors.push(data)
                    } 
                    if (dupArr3.length != 0) {
                        var data = {
                            line: "repeated abbrevation",
                            message: JSON.stringify(dupArr3)
                        }
                        noErrors.push(data)
                    }
                    $("#errorsText").html(JSON.stringify(noErrors))

                    if(noErrors.length){
                        Session.set("errorsThere",true)
                    }
                    else{
                        $("#errorsText").html("click upload now")
                        Session.set("errorsThere",false)
                    }
                }
            }else{
                alert("cannot upload, correct the errors and try again")
            }
        }catch(e){
            alert(e)
        }
    },
	"click #adminUpload_button21":async function(){
		try{
            if(Session.get("errorsThere")==true){
                alert("Click validate and correct validation failed details")
            }
            else{
    			if (Session.get("errorLogsSession")==undefined||Session.get("errorLogsSession").length==0) {
    				if (Session.get("fileHandleData")==undefined) {
    					alert("Browse file to upload")
                    }else{
                    	var err = true
                    	var noErrors = []
                    	var fileHandle = Session.get("fileHandleData")
                        var playersDetails = fileHandle;
                        for (var i = 0; i < playersDetails.length; i++) {
                        	playersDetails[i].role = "school"
                        	var getTeamDet = await Meteor.callPromise("registerSchoolExtAPI",playersDetails[i])

                        	if(getTeamDet && getTeamDet.status==SUCCESS_STATUS){
                        		var _1noErrors = 
                        			{
                        				"emailAddress":playersDetails[i].emailAddress,
                        				"_id":getTeamDet.resultID
                        			}
                        		noErrors.push(_1noErrors)
                        		err = false
                        		$("#successText").html(JSON.stringify(noErrors))
                        		continue;
                        	}else if(getTeamDet && (getTeamDet.message||getTeamDet.response)){
                        		err = true
                        		$("#errorsText").html(JSON.stringify(getTeamDet.message)+" at sl no."+parseInt(i+1))
                        		break;
                        	}
                        }

                        Session.set("ArrayInserted",noErrors)

                    }
    			}else{
    				$("#errorsText").html(JSON.stringify(Session.get("errorLogsSession")))
    				alert(JSON.stringify(Session.get("errorLogsSession")))
                    alert("cannot upload, correct the errors and try again")
    			}
            }
		}catch(e){
			alert(e)
		}
	},
	'change [name="insertPlayersADMIN1"]': function(event, template) {
        if (true) {
        	var fileHandle = event.target.files[0];
        	var errorsArray = [];
            try {
                Papa.parse(fileHandle, {
                    header: true,
                    keepEmptyRows: false,
                    skipEmptyLines: true,
                    beforeFirstChunk: function(chunk) {
                        var rows = chunk.split(/\r\n|\r|\n/);
                        var headings = rows[0].split(',');
                        var key = ["Sl.No", "emailAddress", "userName", "phoneNumber", "address", "city", "pinCode", "state", "abbrevation"];
                        if (_.isEqual(headings, key)) {
                            Session.set("errorsInHead", 0)
                            errorsArray = []
                            Session.set("errorLogsSession", errorsArray)
                            return chunk;
                        } else {
                            var data = {
                                line: 1,
                                message: "Unequal headers, headers should be in the following format:[Sl.No, emailAddress, userName, phoneNumber, address, city, pinCode, state, abbrevation]"
                            }
                            Session.set("errorsInHead", 1)
                            errorsArray.push(data)
                            Session.set("errorLogsSession", errorsArray)
                            return false;
                        }
                    },
                    complete: function(fileData, file) {
                        if (Session.get("errorsInHead") == 0) {
                            Session.set("fileHandleData", fileData.data)
                            if (fileData.errors.length == 0) {
                                if (fileData.data.length == 0) {
                                    var data = {
                                        line: 2,
                                        message: "data is empty"
                                    }
                                    errorsArray.push(data)
                                    Session.set("errorLogsSession", errorsArray)
                                }
                            } else if (fileData.errors.length !== 0) {
                                for (var e = 0; e < fileData.errors.length; e++) {
                                    var data = {
                                        line: "CSV PARSE ERROR",
                                        message: JSON.stringify(fileData.errors[e])
                                    }
                                    errorsArray.push(data)
                                }
                                Session.set("errorLogsSession", errorsArray)
                            }
                            if (fileData.errors.length == 0 && fileData.data.length != 0) {
                                for (var i = 0; i < fileData.data.length; i++) {

                                    fileData.data[i]["Sl.No"] = fileData.data[i]["Sl.No"].trim().replace(/\s+/g,' ')
                                    fileData.data[i].emailAddress = fileData.data[i].emailAddress.trim().replace(/\s+/g,' ');
                                    fileData.data[i].userName = fileData.data[i].userName.trim().replace(/\s+/g,' ');
                                    fileData.data[i].phoneNumber = fileData.data[i].phoneNumber.trim().replace(/\s+/g,' ');
                                    fileData.data[i].address = fileData.data[i].address.trim().replace(/\s+/g,' ');
                                    fileData.data[i].city = fileData.data[i].city.trim().replace(/\s+/g,' ');
                                    fileData.data[i].pinCode = fileData.data[i].pinCode.trim().replace(/\s+/g,' ');
                                    fileData.data[i].abbrevation = fileData.data[i].abbrevation.trim().replace(/\s+/g,' ');
                                    fileData.data[i].state = fileData.data[i].state.trim().replace(/\s+/g,' ');

                                    Session.set("fileHandleData", fileData.data)
                                    var findForEmptyslno = fileData.data[i]["Sl.No"];
                                    var findForEmptyemailAddress = fileData.data[i].emailAddress;
                                    var findForEmptyUserName = fileData.data[i].userName;
                                    var findForEmptyPhoneNumber = fileData.data[i].phoneNumber
                                    var findForEmptyAddress = fileData.data[i].address;
                                    var findForEmptyCity = fileData.data[i].city;
                                    var findForEmptyPinCode = fileData.data[i].pinCode;
                                    var findForEmptyState = fileData.data[i].state;
                                    var findForEmptyAbb = fileData.data[i].abbrevation;
                                   
                                }

                            }
                        }
                    }
                });
            } catch (e) {
            	alert(e)
            }
        } else {
            var input = $("input[type='file']");
            input.html(input.html()).val('');
            alert("Select State Association")
        }
    },
})


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