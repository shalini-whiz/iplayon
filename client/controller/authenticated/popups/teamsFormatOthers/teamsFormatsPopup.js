Template.teamsFormatsPopup.onCreated(function(){
	this.subscribe("onlyLoggedIn");
})

Template.teamsFormatsPopup.onRendered(function(){
	Session.set("noOfMatchesTest",0)
})

Template.teamsFormatsPopup.onDestroyed(function(){
	Session.set("noOfMatchesTest",0)
})

Template.teamsFormatsPopup.helpers({
	"noOfMatches":function(e){
		try{
			var i = 0
			return true
		}catch(e){

		}
	},
	insertedId:function(){
		try{
			if(Session.get("noOfMatchesTest")){
				return "divId"+Session.get("noOfMatchesTest")
			}
		}catch(e){}
	}
	
})

Template.teamsFormatsPopup.events({
	"keyup #teamFormatName":function(e){
		try{
			$("#errorMsg").html("")
		}catch(e){}
	},
	"change #selectedType":function(e){
		try{
			$("#errorMsg").html("")
		}catch(e){}
	},
	"keyup input[id=displayLabel]":function(e){
		try{
			$("#errorMsg").html("")
		}catch(e){}
	},
	"click #addNoOfMatches":function(e){
		try{
			$("#errorMsg").html("")
			var no = Session.get("noOfMatchesTest")
			Blaze.render(Template.rowOfTeamsFormat,$("#insertNewRow")[0])
			no = no + 1
			Session.set("noOfMatchesTest",no)
			$("#addedID").attr("id","newRow"+no)
			$("#removableID").attr("id","remove"+no)
			$("[id^=newRow]").each(function(i,e){
				$(this).find('#matchNo').html(i+1+".")
			})
		}catch(e){

		}
	},
	"click [id^=remove]":function(e){
		try{
			$("#errorMsg").html("")
			var id = e.target.id
			var no = Session.get("noOfMatchesTest")
			if(id && no){
				no = no - 1
				Session.set("noOfMatchesTest",no)
				$("#"+id).parent().parent().remove()
				$("[id^=newRow]").each(function(i,e){
					$(this).find('#matchNo').html(i+1+".")
				})
			}
		}catch(e){

		}
	},
	"click #createTeamFormat":function(e){
		try{
			$("#errorMsg").html("")
			if(Meteor.userId()){
				var teamFormatName = $("#teamFormatName").val()
				var organizerId = Meteor.userId()
				var specifications = []

				$("[id^=newRow]").each(function(i,e){
					var data = {
						"no":i+1,
						"displayLabel":$(this).find("#displayLabel").val(),
						"label":replaceSpaceWhiteSpaces($(this).find("#displayLabel").val()),
						"type":$(this).find("#selectedType").val(),
						"order":i+1
					}
					specifications.push(data)
				})

				var dataToSend = {
					"tournamentId":Router.current().params._id,
					formatName:teamFormatName,
					organizerId:organizerId,
					specifications:specifications
				}

				Meteor.call("createTeamsFormatByOrganizer",dataToSend,function(e,res){
					if(e){
						alert(e.reason)
					}else if(res){
						if(res.status==FAIL_STATUS && res.message){
							$("#errorMsg").html(res.message)
						}else if(res.status==SUCCESS_STATUS && res.data){
							//
							Session.set("dataFromTeamFormatCreated",res.data)
							$("#teamsFormatsPopup").modal('hide')
							
							if( $('#renderKnockOutForm').is(':empty')) {
		                        Blaze.render(Template.knockOut, $("#renderKnockOutForm")[0]);
		                        $("#knockOut").modal({
		                          backdrop: 'static'
		                        });
		                    }else{
		                        $('#knockOut').modal('show');    
		                    }
						}
					}
				})
			}
		}catch(e){

		}
	},
	"click #previousTeamFormatDraw":function(e){
		try{
			$("#errorMsg").html("")
			$('#teamsFormatsPopup').modal('hide');
			$('#selectTeamFormatsOldNew').modal('show');
		}catch(e){}
	},
	"click #closeTeamFormatCreate":function(e){
		try{
			$('#teamsFormatsPopup').modal('hide');
			$( '.modal-backdrop' ).remove();
			funcClearSessions()
		}catch(e){

		}
	}
})

Template.selectTeamFormatsOldNew.onRendered(function(){
})

Template.selectTeamFormatsOldNew.onCreated(function(){

})

Template.selectTeamFormatsOldNew.onDestroyed(function(){
	funcClearSessions()
})

Template.selectTeamFormatsOldNew.helpers({
	"listOfTeamFormats":function(){
		try{
			if(Meteor.userId()){
				var data = {
					tournamentId:Router.current().params._id,
					organizerId:Meteor.userId()
				}
				var s = ReactiveMethod.call("fetchOrganizerTeamFormats",data)
				if(s && s.status==SUCCESS_STATUS && s.data && s.data.length){
					return s.data
				}else{
					return false
				}
			}else{
				return false
			}
		}catch(e){
			alert(e)
		}
	},
	selectedRadio:function(){
		try{
			if(Session.get("selectedRadioValue")){
				return true
			}
			else{
				return false
			}
		}catch(e){
			alert(e)
		}
	},
	selectedTeamsFormatDet:function(){
		try{
			if(Session.get("selectedDetailsSess")){
				return Session.get("selectedDetailsSess")
			}else{
				return false
			}
		}catch(e){}
	},
	toStringType:function(data){
		try{
			if(data==1){
				return "Singles"
			}
			else if(data==2){
				return "Doubles"
			}
			else{
				return ""
			}
		}catch(e){}
	}
})


Template.selectTeamFormatsOldNew.events({
	"change #selectCreatedTeamsFormat":function(){
		try{
			if($("#selectCreatedTeamsFormat").val()){
				var data = {
					"teamsFormatId":$("#selectCreatedTeamsFormat").val()
				}
				Meteor.call("selectedTeamFormatIdDetails",data,function(e,res){
					if(e){
						alert(e.reason)
					}
					else if(res && res.message && res.status==SUCCESS_STATUS &&
						res.data){
						Session.set("selectedDetailsSess",res.data)
					}else if(res && res.message && res.status==FAIL_STATUS){
						Session.set("selectedDetailsSess",[])
					}
				})
			}
		}catch(e){}
	},
	"click input[name=createdTeamsFormatRadio]":function(e){
		try{
			if(e.target.value=="createTeam"){
				funcClearSessions()
				Session.set("selectedRadioValue",false)
			}else if(e.target.value=="selectTeam"){
				funcClearSessions()
				Session.set("selectedRadioValue",true)
			}
		}catch(e){}
	},
	"click #continueWithSelected":function(){
		try{
			if(Session.get("selectedRadioValue")==false){
				$('#selectTeamFormatsOldNew').modal('hide');
				if( $('#renderTeamsFormatCreate').is(':empty')) {
                	Blaze.render(Template.teamsFormatsPopup, $("#renderTeamsFormatCreate")[0]);
	                $("#teamsFormatsPopup").modal({
	                  backdrop: 'static'
	                });
	            }else{
	                $('#teamsFormatsPopup').modal('show');    
	            }
			}else if(Session.get("selectedRadioValue")==true){
				if(Session.get("selectedDetailsSess") && Session.get("selectedDetailsSess")._id){
					var data = {
						"_id":Session.get("selectedDetailsSess")._id
					}
					Session.set("dataFromTeamFormatCreated",data)
					$("#selectTeamFormatsOldNew").modal('hide')
							
					if( $('#renderTeamsFormatSelect').is(':empty')) {
		                Blaze.render(Template.knockOut, $("#renderTeamsFormatSelect")[0]);
		                $("#knockOut").modal({
		                    backdrop: 'static'
		                });
		            }else{
		                $('#knockOut').modal('show');    
		            }
				}
				
			}
			
		}catch(e){}
	},
	"click #previousTeamFormatDraw1":function(){
		try{
			$('#selectTeamFormatsOldNew').modal('hide');
			$( '.modal-backdrop' ).remove();
			$('#createDraw').modal('show');
		}catch(e){

		}
	},
	"click #closeTeamFormat1":function(){
		try{
			$('#selectTeamFormatsOldNew').modal('hide');
			$( '.modal-backdrop' ).remove();
			$('input[name=createdTeamsFormatRadio]').attr('checked',false);
			funcClearSessions()
		}catch(e){

		}
	}
})

export const funcClearSessions = function(){
	try{
		Session.set("selectedRadioValue",false)
		Session.set("selectedTeamsFormatDet",[])
		Session.set("noOfMatchesTest",0)
		Session.set("selectedDetailsSess",[])
		Session.set("dataFromTeamFormatCreated",undefined)
		$("#insertNewRow").empty()
		$('#renderTeamsFormatCreate').empty()
		$('#renderTeamsFormatSelect').empty()
	}catch(e){}
}