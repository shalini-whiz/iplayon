Template.movePlayersAcrossClub.onCreated(function(){
	this.subscribe("authAddress");
	this.subscribe("users");
	this.subscribe("lastInsertedAffId");
});

Template.movePlayersAcrossClub.onRendered(function(){
	Session.set("selectedAcadOfAssoc",undefined)
	Session.set("selectedAsocToMove",undefined)
	Session.set("selectAssociationValueAdmin",undefined);
	Session.set('searchForAcademy_P',undefined);
	Session.set("addAcademyArraySess_P",undefined);
	Session.set("deleteSelectedClub_P",undefined);
	Session.set("userIdToDeleteSess",undefined);
	Session.set("DeletedLogs",undefined)
	Session.set("selectedAssocToMove2",undefined)
	Session.set("movedLogs",undefined)
	Session.set("selectedAcadToMove2",undefined)
});

Template.movePlayersAcrossClub.onDestroyed(function(){
	Session.set("selectedAcadOfAssoc",undefined)
	Session.set("selectedAsocToMove",undefined)
	Session.set("selectAssociationValueAdmin",undefined);
	Session.set('searchForAcademy_P',undefined);
	Session.set("addAcademyArraySess_P",undefined);
	Session.set("deleteSelectedClub_P",undefined);
	Session.set("userIdToDeleteSess",undefined);
	Session.set("DeletedLogs",undefined)
	Session.set("movedLogs",undefined)
	Session.set("selectedAssocToMove2",undefined)
	Session.set("selectedAcadToMove2",undefined)
});

Template.movePlayersAcrossClub.helpers({
	"notAdmin":function(){
		try{
			var emailAddress = Meteor.user().emails[0].address;
			var boolVal = false
			var auth = authAddress.find({}).fetch();
			if(auth){
				for(var i=0;i<auth.length;i++){
					if(emailAddress&&emailAddress==auth[i].data){
						boolVal=false;
					}
					else{
						boolVal=true;
						break;
					}
				};
			}
			return boolVal
		}catch(e){
		}
	},
	"stateAssocChecked":function(){
		try{
			return Meteor.users.find({"role":"Association",associationType:"State/Province/County"}).fetch();
		}catch(e){

		}
	},
	"selectAcadOfState":function(){
		try{
			if(Session.get("selectedAsocToMove")){
				return Meteor.users.find({role:"Academy",$or:[
					{"associationId":Session.get("selectedAsocToMove")},
					{"parentAssociationId":Session.get("selectedAsocToMove")}
				]})
			}
		}catch(e){

		}
	},
	searchResultsOfMNM_P: function() {
		if(Session.get("selectedAcadOfAssoc")!==undefined&&Session.get('selectedAcadOfAssoc')!=undefined&&Session.get('selectedAcadOfAssoc').trim().length!=0){
		if(Session.get('searchForAcademy_P')!=undefined&&Session.get('searchForAcademy_P').trim().length!=0){
			try{
				var reObj = new RegExp(Session.get('searchForAcademy_P'), 'i');
		   		var search="";
		   		search = Meteor.users.find({ userName: {$regex:reObj},role:"Player",
		   			clubNameId:Session.get("selectedAcadOfAssoc")
		   		}).fetch();
		   		if(search.length!=0){
			   		Session.set("searResults",search)
					return search;
				}
				else if(Session.get('searchForAcademy_P')&&search.length==0){
					var x=[];
					data={
						_id:0,
						userName:"No Results"
					}
					x.push(data)
					return x
				}
			}catch(e){
			}
		}
		}
		else if(Session.get('searchForAcademy_P')!=undefined&&Session.get('searchForAcademy_P').trim().length!=0){
			var x=[];
			data={
				_id:0,
				userName:"Select Academy"
			}
			x.push(data)
			return x
		}
	},
	addedAcademyArray_P:function(){
		if(Session.get("addAcademyArraySess_P")){
			if(Session.get("addAcademyArraySess_P")){
				return Session.get("addAcademyArraySess_P")
			}
		}
	},
	"MoveSelectedClub_P":function(){
		if(Session.get("deleteSelectedClub_P")){
			return Session.get("deleteSelectedClub_P")
		}
	},
	"movedLogs":function(){
		if(Session.get("movedLogs")!=undefined){
			return Session.get("movedLogs")
		}
	},
	"updatedPlayerCount":function(){
		if(Session.get("movedLogs")!=undefined){
			return Session.get("movedLogs").length;
		}
	},
	"selectAssocOfState_ToMOVE":function(){
		try{
			return Meteor.users.find({"role":"Association",associationType:"State/Province/County"}).fetch();
		}catch(e){

		}
	},
	"selectAcadOfState_TOMOVE":function(){
		try{
			if(Session.get("selectedAssocToMove2")!=undefined){
				return Meteor.users.find({role:"Academy",$or:[
					{"associationId":Session.get("selectedAssocToMove2")},
					{"parentAssociationId":Session.get("selectedAssocToMove2")}
				],
				"_id":{$ne:Session.get("selectedAcadOfAssoc")}
			}).fetch()
			}
		}catch(e){
		}
	},

});

Template.movePlayersAcrossClub.events({
	"change #selectAssoc_Move":function(e){
		e.preventDefault();
		if($("#selectAssoc_Move").val()!=1){
			Session.set("selectedAcadOfAssoc",undefined)
			Session.set('searchForAcademy_P',undefined);
			Session.set("addAcademyArraySess_P",undefined);
			Session.set("deleteSelectedClub_P",undefined);
			Session.set("userIdToDeleteSess",undefined);
			Session.set("DeletedLogs",undefined)
			Session.set("selectedAssocToMove2",undefined)
			Session.set("selectedAcadToMove2",undefined)
			Session.set("movedLogs",undefined)
			Session.set("selectedAsocToMove",$("#selectAssoc_Move").val().trim())
		}
	},
	"change #selectAcad_Move":function(e){
		e.preventDefault();
		if($("#selectAcad_Move").val()!=1){
			Session.set('searchForAcademy_P',undefined);
			Session.set("addAcademyArraySess_P",undefined);
			Session.set("deleteSelectedClub_P",undefined);
			Session.set("userIdToDeleteSess",undefined);
			Session.set("DeletedLogs",undefined)
			Session.set("selectedAssocToMove2",undefined)
			Session.set("selectedAcadToMove2",undefined)
			Session.set("movedLogs",undefined)
			Session.set("selectedAcadOfAssoc",$("#selectAcad_Move").val().trim())
		}
	},
	'keyup #searchUserManage_P, change #searchUserManage_P,input #searchUserManage_P,keydown #searchUserManage_P ': function(e){
		e.preventDefault();
	    Session.set('searchForAcademy_P', e.target.value);
	    $("#searchUserManage_P").text("")
	},
	'focus #searchUserManage_P':function(){
		 $("#searchUserManage_P").text("")
	},
	'focus #searchUserManage_P':function(){
		 $("#searchUserManage_P").text("")
	},
	'click div[name=addAcademyMNM_P]':function(e){
	 	e.preventDefault()
	 	Session.set("movedLogs",undefined)
	 	if(e.target.id!=0){
	 		var addAcademyArray_P=[]
		 	var data = {
		 		userId:this._id,
		 		_id:this._id,
		 		guardianName:this.guardianName,
		 		address:this.address,
				userName:this.userName,
				state:this.state,
				pinCode:this.pinCode,
				city:this.city,
				phoneNumber:this.phoneNumber,
				emailAddress:this.emailAddress
		 	}
			if (_.findWhere(addAcademyArray_P, this) == null) {
			    addAcademyArray_P.push(this);
			}
		 	Session.set("addAcademyArraySess_P",addAcademyArray_P);
		 	$("#searchUserManage_P").val("");  		
			Session.set("searchForAcademy_P",undefined)
			$('input:checkbox').removeAttr('checked');
			Session.set("deleteSelectedClub_P",undefined);
	 	}
	},
	'mouseover p[name=userName]':function(e){
		$("#searchUserManage_P").text("")
		if(e.target.id!=0)
		$("#"+e.target.id).css("color", "green");
	},
	'mouseout p[name=userName]':function(e){
		$("#searchUserManage_P").text("")
		if(e.target.id!=0)
		$("#"+e.target.id).css("color", "rgb(56,56,56)");
    },
    "click #addSearchedPLayers":function(e){
    	e.preventDefault()
    	if(Session.get("searResults")){
    		Session.set("movedLogs",undefined)
    		$("#searchUserManage_P").val("");  		
    		Session.set("searchForAcademy_P",undefined)
    		Session.set('addAcademyArraySess_P',Session.get("searResults"));
    		$('input:checkbox').removeAttr('checked');
    		Session.set("deleteSelectedClub_P",undefined);
    	}
    },
    "change #checkedPlayers":function(e){
		var num = $('#checkedPlayers:checked').size();
		if($(e.target).is(":checked")){
			var id = this._id
			if(num!=0)
				Session.set("deleteSelectedClub_P",num);
			else
				Session.set("deleteSelectedClub_P",undefined);
		}	
		else if(!$(e.target).is(":checked")){
			var id=this._id;
			if(num!=0)
				Session.set("deleteSelectedClub_P",num);
			else
				Session.set("deleteSelectedClub_P",undefined);
		}
	},
	"change #selectAssoc_Move_2":function(){
		if($("#selectAssoc_Move_2").val()!=1){
			Session.set("selectedAssocToMove2",$("#selectAssoc_Move_2").val().trim())
		}
	},
	"change #selectAcad_Move_2":function(){
		if($("#selectAcad_Move_2").val()!=1){
			Session.set("selectedAcadToMove2",$("#selectAcad_Move_2").val().trim())
		}
	},
	"click #moveSelectedPlayers":function(e){
		e.preventDefault();
		var userIdToMove = []
		if(Session.get("selectedAssocToMove2")!=undefined&&Session.get("selectedAcadToMove2")!=undefined){
			$("#checkedPlayers:checked").each(function() {
	            userIdToMove.push($(this).attr("name"))
	            Session.set("userIdToMoveSess",userIdToMove);
	        });
			$("#confirmModalRedirectLog").html("Move "+Session.get("deleteSelectedClub_P")+" Players?")

			var fromAcad = $("#selectAcad_Move option:selected").text().trim();
			var toAcad = $("#selectAcad_Move_2 option:selected").text().trim();
			var fromAssoc = $("#selectAssoc_Move option:selected").text().trim();
			var toAssoc = $("#selectAssoc_Move_2 option:selected").text().trim();
			$("#moveClubNames").html("Do you want to move selected players from"+" "+fromAcad+" "+" of "+fromAssoc+" to"+" "+
				toAcad+" of"+" "+toAssoc+"?")
			$("#confirmMovePlayersAdmin").modal({
				backdrop: 'static',
				keyboard:false
			})
		}
		else{
			if(Session.get("selectedAssocToMove2")==undefined&&Session.get("selectedAcadToMove2")==undefined){
				alert("Select state association and Academy to move")
			}
			else if(Session.get("selectedAssocToMove2")==undefined){
				alert("Select state association to move")
			}
			else if(Session.get("selectedAcadToMove2")==undefined){
				alert("Select Academy to move")
			}
		}
	},
	
	"click #confirmModalRedirectYesMove":function(e){
		e.preventDefault()
		$("#confirmMovePlayersAdmin").modal('hide')
		Blaze.render(Template.confirmPasswordMovePlayerAdmin,$("#confirmPasswordMovePlayerAdminRen")[0]);
		$("#confirmPasswordMovePlayerAdmin").modal({
			backdrop: 'static'
		});
	},
	"click #adminMovedLog":function(e){
		e.preventDefault();
		JSONToCSVConvertorUsersDeletedByAdmin(Session.get("movedLogs"), "", true, "movedPlayers")
	}
});



Template.confirmPasswordMovePlayerAdmin.onCreated(function(){
	this.subscribe("users")
});

Template.confirmPasswordMovePlayerAdmin.events({
	'submit form': function(e) {
		e.preventDefault();
		$("#changePasswordSucc").html("")
	},
	'focus #oldPassword':function(e){
		$("#changePasswordSucc").html("")
	},
});

Template.confirmPasswordMovePlayerAdmin.onRendered(function(){
	$('#application-confirmPasswordMovePlayerAdmin').validate({
	  	onkeyup:false,
	    rules: {
	    	oldPassword: {
	          required: true,
	          minlength:6,
	      },
	    },
	    // Display only one error at a time
	    showErrors: function(errorMap, errorList) {
	        $("#application-confirmPasswordMovePlayerAdmin").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        if(errorList.length) {
	            $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+errorList[0]['message']);
	            $(errorList[0]['element']).addClass("error");
	        }
	    },
	    messages: {
	    	oldPassword: {
	          required: "Please enter  your password ",
	          minlength: "Please enter a valid  password.",
	      },
	    },
	    submitHandler: function(){
	    	$("#changePasswordError").html("");
	    	var digest = Package.sha.SHA256($('#oldPassword').val());
	    	try{
	    	Meteor.call('checkPassword', digest, function(err, result) {
	    		try{
			      if (result.error==null) {
			      	$("#confirmPasswordMovePlayerAdmin").modal('hide');
			      	var data = {
			      		assocFrom : Session.get("selectedAsocToMove"),
			      		acadFrom : Session.get("selectedAcadOfAssoc"),
			      		assocTo : Session.get("selectedAssocToMove2"),
			      		acadTo: Session.get("selectedAcadToMove2")
			      	}
			      	Meteor.call("movePlayersAcrossClub",data,Session.get("userIdToMoveSess"),function(e,r){
			      		if(r){
			      			Session.set("movedLogs",r)
			      			//Session.set("selectedAcadOfAssoc",undefined)
							Session.set('searchForAcademy_P',undefined);
							Session.set("addAcademyArraySess_P",undefined);
							Session.set("deleteSelectedClub_P",undefined);
							Session.set("userIdToDeleteSess",undefined);
							Session.set("DeletedLogs",undefined)
							Session.set("selectedAssocToMove2",undefined)
							Session.set("selectedAcadToMove2",undefined)
							//Session.set("selectedAsocToMove",undefined)
			      		}else{
			      		}
			      	})
			      }
			      else{
					$("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+result.error.reason);
			      }
				}catch(e){}
			});
			}catch(e){
						
			}
	    }
	  });
});


function JSONToCSVConvertorUsersDeletedByAdmin(JSONData, ReportTitle, ShowLabel, filNam) {
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