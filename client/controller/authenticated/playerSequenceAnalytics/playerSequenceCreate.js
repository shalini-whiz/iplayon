Template.playerSequenceCreate.onCreated(function(){
	this.playerName1Searched_SPA = new ReactiveVar(undefined);
	this.playerName2Searched_SPA = new ReactiveVar(undefined);
	var self = this;
    self.autorun(function () {
     	if(Session.get("playerName1Searched_SPA")){
     		self.subscribe("usersForSequenceAnalyticsPlayers", Session.get("playerName1Searched_SPA"));
     		self.subscribe("newusersForSequenceAnalyticsPlayers", Session.get("playerName1Searched_SPA"));
     	}
     	if(Session.get("playerName2Searched_SPA")){
     		self.subscribe("usersForSequenceAnalyticsPlayers", Session.get("playerName2Searched_SPA"));
     		self.subscribe("newusersForSequenceAnalyticsPlayers", Session.get("playerName2Searched_SPA"));
     	} 
    });
});

Template.playerSequenceCreate.onRendered(function(){
	Session.set("playerName1Searched_SPA",undefined);
	Session.set("playerName2Searched_SPA",undefined);

	Session.set("selectedPlayer1Id_SPA",undefined);
	Session.set("selectedPlayer2Id_SPA",undefined);

	Session.set("playerName1Searched_SPA2",undefined);
	Session.set("playerName2Searched_SPA2",undefined);

	Session.set("servicedByPlayer",undefined)
});

Template.playerSequenceCreate.helpers({
	"player1SearchResults_SPA":function(){
		try{
        	var searchValue = Session.get("playerName1Searched_SPA2");
            if(searchValue!=undefined&&searchValue.length!=0){
                var search=new Array();
                var search2 = new Array();
                search = userDetailsTT.find({"_id":{$ne:Session.get("selectedPlayer2Id_SPA")}}).fetch();
                search2 = playerDetailsRecord.find({"_id":{$ne:Session.get("selectedPlayer2Id_SPA")}}).fetch()
                if(search.length!=0||search2.length!=0){
                	search.push.apply(search,search2);
                    return search;
                }
                else if(searchValue&&search.length==0){
                    var x=[];
                    data={
                        userId:0,
                        userName:"No Results"
                    }
                    Session.set("playerName1Searched_SPA2",undefined);
                    x.push(data)
                    //return x
                }
            }
        }catch(e){
        }
	},
	selectedPlayer1Display:function(){
		if(Session.get("selectedPlayer1UserDetails")!==undefined){
			return Session.get("selectedPlayer1UserDetails")
		}
	},
	"player2SearchResults_SPA":function(){
		try{
        	var searchValue = Session.get("playerName2Searched_SPA2");
            if(searchValue!=undefined&&searchValue.length!=0){
            	var search=new Array();
                var search2 = new Array();
                search = userDetailsTT.find({"_id":{$ne:Session.get("selectedPlayer1Id_SPA")}}).fetch();
                search2 = playerDetailsRecord.find({"_id":{$ne:Session.get("selectedPlayer1Id_SPA")}}).fetch()
                if(search.length!=0||search2.length!=0){
                	search.push.apply(search,search2);
                    return search;
                }
                else if(searchValue&&search.length==0){
                    var x=[];
                    data={
                        userId:0,
                        userName:"No Results"
                    }
                    Session.set("playerName2Searched_SPA2",undefined);
                    x.push(data)
                    //return x
                }
            }
        }catch(e){
        }
	},
	selectedPlayer2Display:function(){
		if(Session.get("selectedPlayer2UserDetails")!==undefined){
			return Session.get("selectedPlayer2UserDetails")
		}
	},
});

Template.playerSequenceCreate.events({
	'keyup #searchUser1ForSPA, change #searchUser1ForSPA,input #searchUser1ForSPA,keydown #searchUser1ForSPA ': function(e,template){
		e.preventDefault();
		Session.set("playerName2Searched_SPA2",undefined);
        //if(e.target.value.trim().length>=3){
        	Session.set("playerName1Searched_SPA2",e.target.value);
            Session.set("playerName1Searched_SPA",e.target.value)
        //}
        if(e.keyCode == 8 ||e.keyCode == 46){
        	Session.set("playerName1Searched_SPA2",e.target.value);
        	Session.set("selectedPlayer1Id_SPA",undefined);
        }
	},
	'focus #searchUser1ForSPA':function(){
         $("#searchUserForTeam").text("")
    },
    'mouseover p[name=userName]':function(e){
        $("#searchUserManage_P").text("")
        if(e.target.id!=0)
        $("#"+e.target.id).css("color", "#0297DB");
    },
    'mouseout p[name=userName]':function(e){
        $("#searchUserManage_P").text("")
        if(e.target.id!=0)
        $("#"+e.target.id).css("color", "black");
    },
    'keyup #searchUser2ForSPA, change #searchUser2ForSPA,input #searchUser2ForSPA,keydown #searchUser2ForSPA ': function(e,template){
		e.preventDefault();
		Session.set("playerName1Searched_SPA2",undefined);
        //if(e.target.value.trim().length>=3){
            Session.set("playerName2Searched_SPA2",e.target.value);
            Session.set("playerName2Searched_SPA",e.target.value)
        //}
        if(e.keyCode == 8 ||e.keyCode == 46){
        	Session.set("playerName2Searched_SPA2",e.target.value);
        	Session.set("selectedPlayer2Id_SPA",undefined);			
        }
	},
	'click div[name=player2Focused]':function(e,template){
    	e.preventDefault();
    	var userName;
    	if(this.userId!=0){
	    	if(this.userName){
	    		userName = this.userName
	    	}
	    	else if(this.playerName){
	    		userName = this.playerName
	    	}
	    	$("#searchUser2ForSPA").val(userName)
	    	Session.set("playerName2Searched_SPA",userName)
	    	Session.set("playerName2Searched_SPA2",undefined);
	    	Session.set("selectedPlayer2Id_SPA",this._id);
			
    	}
    },
    'click div[name=player1Focused]':function(e,template){
    	e.preventDefault();
    	if(this.userId!=0){
    		if(this.userName){
    			userName = this.userName
    		}
	    	else if(this.playerName){
    			userName = this.playerName
    		}
    		$("#searchUser1ForSPA").val(userName)
    		Session.set("playerName1Searched_SPA",userName)
    		Session.set("playerName1Searched_SPA2",undefined);
    		Session.set("selectedPlayer1Id_SPA",this._id);
    	}
    },
});

Template.playerSequenceCreateSub.onCreated(function(){
	var self = this;
    Deps.autorun(function () {
     	if(Session.get("serviceStrokeSearch")){
     		self.subscribe("serviceStrokesSearchPub", Session.get("serviceStrokeSearch"));
     	}
    });
});

Template.playerSequenceCreateSub.onRendered(function(){
	Session.set("serviceStrokeSearch",undefined);
	Session.set("destinationStrokesSearch",undefined);
	Session.set("serviceStrokeId",undefined);
	Session.set("destStrokeId",undefined);
	Session.set("divRowLength",1)
	Session.set("whichInput",0)
});

Template.playerSequenceCreateSub.helpers({
	"searchServiceStrokes":function(){
		try{
        	var searchValue = Session.get("serviceStrokeSearch");
            if(searchValue!=undefined&&searchValue.length!=0){
                var search=new Array();
                search = ReactiveMethod.call("serviceStrokesSearchPublication",searchValue,Session.get("divRowLength"));
                if(search.length!=0){
                    return search;
                }
                else if(searchValue&&search.length==0){
                    var x=[];
                    data={
                        userId:0,
                        userName:"No Results"
                    }
                    Session.set("serviceStrokeSearch",undefined);
                    x.push(data)
                    //return x
                }
            }
        }catch(e){
        }
	},
	"searchdestinationStrokes":function(){
		try{
        	var searchValue = Session.get("destinationStrokesSearch");
            if(searchValue!=undefined&&searchValue.length!=0){
                var search=new Array();
                search = ReactiveMethod.call("destinationStrokesSearchPublication",searchValue,"p6DestinationPoints");
                if(search.length!=0){
                    return search;
                }
                else if(searchValue&&search.length==0){
                    var x=[];
                    data={
                        userId:0,
                        userName:"No Results"
                    }
                    Session.set("serviceStrokeSearch",undefined);
                    x.push(data)
                    //return x
                }
            }
        }catch(e){
        }
	},
	idNum:function(){
		if(Session.get("divRowLength")==undefined){
			return 1
		}
		else return Session.get("divRowLength")
	},
	idNumForHelper:function(){
		if(Session.get("divRowLength")==Session.get("whichInput")){
			return true
		}
		else{
			return false
		}
	},
	typeOfSearchDispl:function(){

	}
});

Template.hiddenTemp.inheritsHelpersFrom('playerSequenceCreateSub');

Template.playerSequenceCreateSub.events({
	"focus [name=serviceStrokeInput]":function(e){
		e.preventDefault()
		Session.set("playerName1Searched_SPA2",undefined);
		Session.set("playerName2Searched_SPA2",undefined);
		if($("#searchUser1ForSPA").val().trim().length>0&&$("#searchUser2ForSPA").val().trim().length>0){
			$("#renderServiceBy").empty();
			if(Session.get("servicedByPlayer")==undefined){
				Blaze.render(Template.serviceBYPlayerSequence, $("#renderServiceBy")[0]);
				$("#serviceBYPlayerSequence").modal({
					backdrop: 'static',
					keyboard:false
				});
				e.target.value = ""
			}
			else{
			}			
		}
		else{
			e.target.value = ""
			alert("Required Player 1 and Player 2 names");
			return false
		}
	},
	"keyup [name=serviceStrokeInput], change [name=serviceStrokeInput],input [name=serviceStrokeInput],keydown [name=serviceStrokeInput]":function(e){
		if($("#searchUser1ForSPA").val().trim().length>0&&$("#searchUser2ForSPA").val().trim().length>0){
			Session.set("serviceStrokeSearch",e.target.value)
			if(e.keyCode == 8 ||e.keyCode == 46){
				Session.set("serviceStrokeSearch",e.target.value)
        	}
			Session.set("serviceStrokeId",undefined);
		}
		else{
			e.target.value = ""
			//alert("Required Player 1 and Player 2 names");
			return false
		}
	},
	"focus [name=serviceDestInput]":function(e){
		e.preventDefault()
		Session.set("playerName1Searched_SPA2",undefined);
		Session.set("playerName2Searched_SPA2",undefined);
		if($("#searchUser1ForSPA").val().trim().length>0&&$("#searchUser2ForSPA").val().trim().length>0){
			$("#renderServiceBy").empty();
			if(Session.get("servicedByPlayer")==undefined){
				Blaze.render(Template.serviceBYPlayerSequence, $("#renderServiceBy")[0]);
				$("#serviceBYPlayerSequence").modal({
					backdrop: 'static',
					keyboard:false
				});
				$("#mainDestination1").val("");
			}			
		}
		else{
			$("#mainDestination1").val("")
			alert("Required Player 1 and Player 2 names");
			return false
		}
	},
	"keyup [name=serviceDestInput], change [name=serviceDestInput],input [name=serviceDestInput],keydown [name=serviceDestInput]":function(e){
		if($("#searchUser1ForSPA").val().trim().length>0&&$("#searchUser2ForSPA").val().trim().length>0){
			Session.set("destinationStrokesSearch",e.target.value);
			Session.set("destStrokeId",undefined);
			if(e.keyCode == 8 ||e.keyCode == 46){
				Session.set("destinationStrokesSearch",e.target.value)
        	}
        	Session.set("destStrokeId",undefined)
		}
		else{
			$("#mainDestination1").val("")
			alert("Required Player 1 and Player 2 names");
			return false
		}
	},
	'mouseover p[name^=strokesFocused]':function(e){
        $("#searchUserManage_P").text("")
        if(e.target.id!=0)
        $("#"+e.target.id).css("color", "#0297DB");
    },
    'mouseout p[name^=strokesFocused]':function(e){
        $("#searchUserManage_P").text("")
        if(e.target.id!=0)
        $("#"+e.target.id).css("color", "black");
    },
    'click div[name^=strokesServiceFocused]':function(e,template){
    	e.preventDefault();
    	var serviceName = ""
    	if(this.userId!=0){
    		if(this.serviceName){
    			serviceName = this.serviceName
    		}
    		else if(this.strokeName){
    			serviceName = this.strokeName
    		}
    		//service
    		if(Session.get("divRowLength")<1){
	    		$("#mainStroke1").val(serviceName)
	    		Session.set("serviceStrokeSearch",undefined)
	    		Session.set("serviceStrokeId",this._id);
    			if(Session.get("serviceStrokeId")&&Session.get("destStrokeId")){
					$("#mainStroke1").css("border","0px");
					$("#mainDestination1").css("border","0px")

					if(Session.get("servicedByPlayer")=="player1Name"&&Session.get("divRowLength")){
						if(parseInt(Session.get("divRowLength"))%2!=0){
							$("#mainDestination1").css("background","#99d6ff")
							$("#mainStroke1").css("background","#99d6ff")
						}
						if(parseInt(Session.get("divRowLength"))%2==0){
							$("#mainDestination1").css("background","#e8e8e8")
							$("#mainStroke1").css("background","#e8e8e8")
						}	
					}
					else if(Session.get("servicedByPlayer")=="player2Name"&&Session.get("divRowLength")){
						if(parseInt(Session.get("divRowLength"))%2!==0){
							$("#mainDestination1").css("background","#e8e8e8")
							$("#mainStroke1").css("background","#e8e8e8")
						}
						if(parseInt(Session.get("divRowLength"))%2==0){
							$("#mainDestination1").css("background","#99d6ff")
							$("#mainStroke1").css("background","#99d6ff")
						}
					}

					$("#mainStroke1").attr('disabled','disabled');
					$("#mainDestination1").attr('disabled','disabled');
					$("#mainDestination1").css("cursor","default")
					$("#mainStroke1").css("cursor","default")

					var idTorem = $(e.target).parent().parent().parent().parent().attr("class")
					$("."+idTorem).remove();
					Blaze.render(Template.hiddenTemp,$("#divToAppend")[0]);
					Session.set("divRowLength",$("#divToAppend > div").length)
					Session.set("serviceStrokeId",undefined)
					Session.set("destStrokeId",undefined)
				}
			}
			//succeeding
			else if(Session.get("divRowLength")&&Session.get("divRowLength")>=1){
				$("#mainStroke"+Session.get("divRowLength")).val(serviceName)
				var obj = "#mainStroke"+Session.get("divRowLength")
				var obj2 = "#mainDestination"+Session.get("divRowLength")
				var obj3 = "#removeRow"+Session.get("divRowLength");

	    		Session.set("serviceStrokeSearch",undefined)
	    		Session.set("serviceStrokeId",this._id);

    			if(Session.get("serviceStrokeId")&&Session.get("destStrokeId")){
    				var dest = $("#mainDestination"+Session.get("divRowLength")).val();
    				var input = $('<input />', { 'type':'text','id': 'strokeAdded', 'style': '"width: 97%; border: 0px none; margin-left: 3%; font-size: 12px; text-align: center; background: none repeat scroll 0% 0% rgb(153, 214, 255); cursor: default;', 'value': serviceName });
    				$(obj).replaceWith($('<input disabled="disabled" style="width: 97%; border: 0px none; margin-left: 3%; font-size: 12px; text-align: center; cursor: default;" id="mainStrokeChanged" name="serviceStrokeInput" type="text">'));
    				$(obj2).replaceWith($('<input disabled="disabled" style="border: 0px none; width: 97%; font-size: 12px; order: 1; margin-right: 2px; text-align: center;  cursor: default;" id="mainDestChanged" name="serviceDestInput" type="text">'));
    				$(obj3).replaceWith($('<span style="cursor: pointer !important; font-size: 12px; order: 2; margin-top: 2px; margin-left: 6px;" class="glyphicon glyphicon-trash" id="removeRowFirst"></span>'))
					
					if(Session.get("servicedByPlayer")=="player1Name"&&Session.get("divRowLength")){
						if(parseInt(Session.get("divRowLength"))%2!=0){
							$("#mainDestChanged").css("background","#99d6ff")
							$("#mainStrokeChanged").css("background","#99d6ff")
						}	
						if(parseInt(Session.get("divRowLength"))%2==0){
							$("#mainDestChanged").css("background","#e8e8e8")
							$("#mainStrokeChanged").css("background","#e8e8e8")
						}
					}
					else if(Session.get("servicedByPlayer")=="player2Name"&&Session.get("divRowLength")){
						if(parseInt(Session.get("divRowLength"))%2!=0){
							$("#mainDestChanged").css("background","#e8e8e8")
							$("#mainStrokeChanged").css("background","#e8e8e8")
						}
						if(parseInt(Session.get("divRowLength"))%2==0){
							$("#mainDestChanged").css("background","#99d6ff")
							$("#mainStrokeChanged").css("background","#99d6ff")
						}
					}

					$("#mainStrokeChanged").val(serviceName)
    				$("#mainStrokeChanged").prop("id","mainStrokeChanged"+Session.get("serviceStrokeId"));
    				$("#mainDestChanged").val(dest)
    				$("#mainDestChanged").prop("id","mainDestChanged"+Session.get("destStrokeId"));

					var idTorem = $(e.target).parent().parent().parent().parent().attr("class")
					$("."+idTorem).remove();
					Blaze.render(Template.hiddenTemp,$("#divToAppend")[0]);
					Session.set("divRowLength",$("#divToAppend > div").length)
					Session.set("serviceStrokeId",undefined)
					Session.set("destStrokeId",undefined)

					$("#removeRowFirst").remove()
					$("#removeRow").prop("id","removeRowFirst");
				}
			}
    	}
    },
    'click div[name^=strokesDestFocused]':function(e,template){
    	e.preventDefault();
    	var destinationName = ""
    	if(this.userId!=0){
    		if(this.destinationName){
    			serviceName = this.destinationName
    		}
    		
    		Session.set("destinationStrokesSearch",undefined)    		
			Session.set("destStrokeId",this._id);
			//service
    		if(Session.get("divRowLength")<1){
    			$("#mainDestination1").val(serviceName)
				if(Session.get("serviceStrokeId")!=undefined&&Session.get("destStrokeId")!=undefined){
					$("#mainStroke1").css("border","0px");
					$("#mainDestination1").css("border","0px")

					if(Session.get("servicedByPlayer")=="player1Name"&&Session.get("divRowLength")){
						if(parseInt(Session.get("divRowLength"))%2!=0){
							$("#mainDestination1").css("background","#99d6ff")
							$("#mainStroke1").css("background","#99d6ff")
						}
						if(parseInt(Session.get("divRowLength"))%2==0){
							$("#mainDestination1").css("background","#e8e8e8")
							$("#mainStroke1").css("background","#e8e8e8")
						}	
					}
					else if(Session.get("servicedByPlayer")=="player2Name"&&Session.get("divRowLength")){
						if(parseInt(Session.get("divRowLength"))%2!=0){
							$("#mainDestination1").css("background","#e8e8e8")
							$("#mainStroke1").css("background","#e8e8e8")
						}
						if(parseInt(Session.get("divRowLength"))%2==0){
							$("#mainDestination1").css("background","#99d6ff")
							$("#mainStroke1").css("background","#99d6ff")
						}
					}

					$("#mainStroke1").attr('disabled','disabled');
					$("#mainDestination1").attr('disabled','disabled');
					$("#mainDestination1").css("cursor","default")
					$("#mainStroke1").css("cursor","default")
					

					var idTorem = $(e.target).parent().parent().parent().parent().attr("class")
					$("."+idTorem).remove();
					Blaze.render(Template.hiddenTemp,$("#divToAppend")[0]);
					Session.set("divRowLength",$("#divToAppend > div").length)
					Session.set("serviceStrokeId",undefined)
					Session.set("destStrokeId",undefined)
				}
			}
			//succeeding
			else if(Session.get("divRowLength")&&Session.get("divRowLength")>=1){
				$("#mainDestination"+Session.get("divRowLength")).val(serviceName)

				var obj = "#mainStroke"+Session.get("divRowLength")
				var obj2 = "#mainDestination"+Session.get("divRowLength")
				var obj3 = "#removeRow"+Session.get("divRowLength");

	    		Session.set("serviceStrokeSearch",undefined)
	    		Session.set("destStrokeId",this._id);

    			if(Session.get("serviceStrokeId")!=undefined&&Session.get("destStrokeId")!=undefined){
    				var stroke = $("#mainStroke"+Session.get("divRowLength")).val();
    				$(obj).replaceWith($('<input disabled="disabled" style="width: 97%; border: 0px none; margin-left: 3%; font-size: 12px; text-align: center; cursor: default;" id="mainStrokeChanged" name="serviceStrokeInput" type="text">'));
    				$(obj2).replaceWith($('<input disabled="disabled" style="border: 0px none; width: 97%; font-size: 12px; order: 1; margin-right: 2px; text-align: center; cursor: default;" id="mainDestChanged" name="serviceDestInput" type="text">'));
    				$(obj3).replaceWith($('<span style="cursor: pointer !important; font-size: 12px; order: 2; margin-top: 2px; margin-left: 6px;" class="glyphicon glyphicon-trash" id="removeRowFirst"></span>'))

					if(Session.get("servicedByPlayer")=="player1Name"&&Session.get("divRowLength")){
						if(parseInt(Session.get("divRowLength"))%2!=0){
							$("#mainDestChanged").css("background","#99d6ff")
							$("#mainStrokeChanged").css("background","#99d6ff")
						}	
						if(parseInt(Session.get("divRowLength"))%2==0){
							$("#mainDestChanged").css("background","#e8e8e8")
							$("#mainStrokeChanged").css("background","#e8e8e8")
						}
					}
					else if(Session.get("servicedByPlayer")=="player2Name"&&Session.get("divRowLength")){
						if(parseInt(Session.get("divRowLength"))%2!==0){
							$("#mainDestChanged").css("background","#e8e8e8")
							$("#mainStrokeChanged").css("background","#e8e8e8")
						}
						if(parseInt(Session.get("divRowLength"))%2==0){
							$("#mainDestChanged").css("background","#99d6ff")
							$("#mainStrokeChanged").css("background","#99d6ff")
						}
					}

					$("#mainDestChanged").val(serviceName)
					$("#mainStrokeChanged").val(stroke)
    				$("#mainStrokeChanged").prop("id","mainStrokeChanged"+Session.get("serviceStrokeId"));

    				$("#mainDestChanged").prop("id","mainDestChanged"+Session.get("destStrokeId"));

					var idTorem = $(e.target).parent().parent().parent().parent().attr("class")
					$("."+idTorem).remove();
					Blaze.render(Template.hiddenTemp,$("#divToAppend")[0]);
					Session.set("divRowLength",$("#divToAppend > div").length)
					Session.set("serviceStrokeId",undefined)
					Session.set("destStrokeId",undefined)
					if(Session.get("divRowLength")>2){
						$("#removeRowFirst").remove()
						$("#removeRow"+Session.get("divRowLength")).prop("id","removeRowFirst");
					}
				}
			}

    	}
    },
    "click #removeRowFirst":function(e){
    	e.preventDefault();
    	
    	if($("#divToAppend > div").length>1){
    		$("#confirmDELETEShot").modal({
            	backdrop: 'static',
            	keyboard: false
        	});
        	Session.set("deleteTargetClass",e)
    		//alert($(e.target).parent().parent().prev().children().eq(1).attr("class"))
	    	//$(e.target).parent().parent().remove();
	    	//alert($("#divToAppend > div").length);
	    	//Session.set("divRowLength",$("#divToAppend > div").length)
	    	//Session.set("serviceStrokeId",undefined)
			//Session.set("destStrokeId",undefined)
    	}
    	else if($("#divToAppend > div").length==1){
    		Session.set("divRowLength",$("#divToAppend > div").length)
    		Session.set("serviceStrokeId",undefined)
			Session.set("destStrokeId",undefined)
			$("#mainStroke1").val("");
			$("#mainDestination1").val("");
    	}
    },
    "click #yesButtonDelShot":function(e){
    	if(Session.get("deleteTargetClass")){
    		var eventToDelete  = Session.get("deleteTargetClass");
    		$(eventToDelete.target).parent().parent().prev().children().eq(1).append('<span style="cursor: pointer !important; font-size: 12px; order: 2; margin-top: 2px; margin-left: 6px;" class="glyphicon glyphicon-trash" id="removeRowFirst"></span>');
	    	$(eventToDelete.target).parent().parent().remove();
	    	//alert($("#divToAppend > div").length);
	    	Session.set("divRowLength",$("#divToAppend > div").length)
	    	Session.set("serviceStrokeId",undefined)
			Session.set("destStrokeId",undefined)
    	}
    }

});

Template.serviceBYPlayerSequence.onCreated(function(){
})

Template.serviceBYPlayerSequence.onRendered(function(){
})

Template.serviceBYPlayerSequence.helpers({
	"player1Name":function(){
		if(Session.get("playerName1Searched_SPA"))
			return Session.get("playerName1Searched_SPA")
	},
	"player2Name":function(){
		if(Session.get("playerName2Searched_SPA"))
			return Session.get("playerName2Searched_SPA")
	}
});

Template.serviceBYPlayerSequence.events({
	"click #saveServiceBySequence":function(e){
		e.preventDefault();
		if($('input:radio[name=serviceBy]').is(':checked')){
			$("#errorTagService").html("");
			var id = $('input:radio[name=serviceBy]:checked').attr("id")
			//alert($('input:radio[name=serviceBy]:checked').attr("id"))
			if(id=="player1Name"||id=="player2Name"){
				Session.set("servicedByPlayer",$('input:radio[name=serviceBy]:checked').attr("id"))
				$("#serviceBYPlayerSequence").modal('hide')
			}
		}
		else if($('input:radio[name=serviceBy]').is(':checked')==false){
			$("#errorTagService").html("**Please select a player")
		}
	},
	"change [name=serviceBy]":function(){
		$("#errorTagService").html("");
	},
	"click #cancelServiceBySequence":function(e){
		e.preventDefault();
		if(Session.get("servicedByPlayer")==undefined){
			$("#mainStroke").val("")
			$("#mainDestination1").val("")
		}
		$("#serviceBYPlayerSequence").modal('hide');
	}
})
