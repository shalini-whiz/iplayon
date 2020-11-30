Template.playerSequenceAnalyze.onCreated(function(){
	this.subscribe("onlyLoggedIn");
});

Template.playerSequenceAnalyze.onRendered(function(){
	$('.selectpickerMenu').select2({
		width: '100%',
		color:"black",
	});
	$('.selectpicker2').select2({
		width: '100%',
		color:"#fff",
		background:'#D0D0D0'
	});
	Session.set("changedPlayerSet1",0)
	Session.set("changedPlayerSet2",0)
	Session.set("changedPlayerSetA",undefined)
	Session.set("changedPlayerSet1ID",undefined)
	Session.set("changedPlayerSet2ID",undefined)
	Session.set("changedPlayerSetB",undefined)
	Session.set("changeTypeOfSort",undefined)
	Session.set("changeSortByTime",undefined)
	Session.set("typeOfSequenceSess",0)
});

Template.playerSequenceAnalyze.helpers({
	"playerSetA":function(){
		try{
		if(Meteor.userId()){
			var s = ReactiveMethod.call("getPlayerSetData",Meteor.userId());
			if(s&&s.player1Set){
				return s.player1Set
			}
		}
		}catch(e){
		}
	},
	/*"selectedPlayerSetA":function(){
		try{
			var name = this.userId;
			alert(this.userId+","+Meteor.userId())
			if(name&&Meteor.userId()){
				var userName = Meteor.users.findOne({"_id":Meteor.userId()});
				if(userName&&userName.userName){
					if(name==userName.userId){
						$('#playerSetASelect + .select2-container--default .select2-selection--single .select2-selection__rendered').text(userName.userName);
						return "selected"
					}
				}
			}
		}catch(e){
			alert(e)
		}
	},
	"opponentPlayers":function(){
		try{
			if(Session.get("changedPlayerSet1")==0){
				var s = ReactiveMethod.call("getPlayerSetData",Meteor.userId());
				if(s&&s.player1Set){
					var loggedPlayer = s.player1Set.split(",");
					var userName = Meteor.users.findOne({"_id":Meteor.userId()});
					if(userName&&userName.userName){
						var indexOf = loggedPlayer.indexOf(userName.userName);
						if(parseInt(indexOf)>-1&&s[userName.userName]){
							var opponentPlayers = s[userName.userName];
							return opponentPlayers;
						}
					}
					
				}
			}
			else if(Session.get("changedPlayerSet1")!=undefined&&Session.get("changedPlayerSet1")!=0){
				var playerChanged = Session.get("changedPlayerSet1")
				var s = ReactiveMethod.call("getPlayerSetData",Meteor.userId());
				if(s&&s[playerChanged]){
					var loggedPlayer = s[playerChanged];
					if(loggedPlayer){
						return loggedPlayer
					}					
				}
			}
		}catch(e){
			alert(e)
		}
	},*/
	opponentPlayers:function(){
		try{
			if(Session.get("changedPlayerSet1")==0){
				if(Meteor.userId()){
					var s = ReactiveMethod.call("getPlayerSetData",Meteor.userId());
					if(s&&s.player2Set){
						return s.player2Set
					}
				}
			}
			else if(Session.get("changedPlayerSet1")!=undefined&&Session.get("changedPlayerSet1")!=0){
				if(Meteor.userId()){
					var s = ReactiveMethod.call("getVsPlayerList",Meteor.userId(),Session.get("changedPlayerSet1"));
					if(s&&s.player2Set){
						return s.player2Set
					}
				}
			}
		}catch(e){
		}
	},
	lastshotAnalysisOnly:function(){
		if(Session.get("typeOfSequenceSess")=="1"){
			return "flex"
		}
		else return "none"
	}
});

Template.registerHelper("selectedPlayerSetA",function(data,data1,data2){
	if(parseInt(data)==0&&data1&&data2){
		Session.set("changedPlayerSetA",data1)
		Session.set("changedPlayerSet1ID",data2)
		$('#playerSetASelect + .select2-container--default .select2-selection--single .select2-selection__rendered').text(data1);
		return "selected"
	}
});

Template.registerHelper("selectedPlayerSet2",function(data,data1,data2){
	if(parseInt(data)==0){
		$('#playerSetBSelect + .select2-container--default .select2-selection--single .select2-selection__rendered').text(data1);
		return "selected"
	}
});

Template.playerSequenceAnalyze.events({
	"change #playerSetASelect":function(e){
		e.preventDefault();		
		Session.set("changedPlayerSet1",$("#playerSetASelect").val())
		Session.set("changedPlayerSet1ID",$("#playerSetASelect").val())
		Session.set("changedPlayerSetA",$("#playerSetASelect>option:selected").html())
	},
	"change #playerSetBSelect":function(e){
		e.preventDefault();
		Session.set("changedPlayerSetB",$("#playerSetBSelect>option:selected").html())
		Session.set("changedPlayerSet2ID",$("#playerSetBSelect").val())
	},
	"change #sortByEffect":function(e){
		e.preventDefault();
		Session.set("changeTypeOfSort",$("#sortByEffect").val())
	},
	"change #sortByTime":function(e){
		e.preventDefault()
		Session.set("changeSortByTime",$("#sortByTime").val());
	},
	"change #typeOfSequence":function(e){
		e.preventDefault();
		Session.set("typeOfSequenceSess",$("#typeOfSequence").val())
		$("#renderSequenceTypes").empty();
		if($("#typeOfSequence").val()=="2"){
        	Blaze.render(Template.playerSequenceAnalyzeSubServicePoints,$("#renderSequenceTypes")[0]);		
    	}
    	else if($("#typeOfSequence").val()=="1"){
    		Blaze.render(Template.playerLastStrokeSequence,$("#renderSequenceTypes")[0]);		
    	}
    	else if($("#typeOfSequence").val()=="3"){
    		Blaze.render(Template.playerSequenceAnalyzeSubReceivePoints,$("#renderSequenceTypes")[0]);
    	}
    	else if($("#typeOfSequence").val()=="4"){
    		Blaze.render(Template.playerSequenceServiceLoss,$("#renderSequenceTypes")[0]);
    	}
    	else if($("#typeOfSequence").val()=="5"){
    		Blaze.render(Template.playerSequenceRallyLength,$("#renderSequenceTypes")[0]);
    	}
    	else if($("#typeOfSequence").val()=="6"){
    		Blaze.render(Template.playerSequenceAllStrokes,$("#renderSequenceTypes")[0]);
    	}
    	else if($("#typeOfSequence").val()=="7"){
    		Blaze.render(Template.playerSequenceErrors,$("#renderSequenceTypes")[0]);
    	}    
    	else if($("#typeOfSequence").val()=="8"){
    		Blaze.render(Template.playerSequence3RDBall,$("#renderSequenceTypes")[0]);
    	}   
    	else if($("#typeOfSequence").val()=="9"){
    		Blaze.render(Template.playerServiceResponse,$("#renderSequenceTypes")[0]);
    	}   
    	else if($("#typeOfSequence").val()=="10"){
    		Blaze.render(Template.playerServiceFault,$("#renderSequenceTypes")[0]);
    	}    	
    	      	
	},
	"click #downloadPDF":function(e){
	try{
			var player1Name;
			var player2Name;
			var player1ID;
			var player2ID;
			var sortFilterValue;
			var dateFilter;
			var userId;
			if(Meteor.userId()){
				userId = Meteor.userId()
			}
			if(Session.get("changedPlayerSetA")==undefined){
				if(Meteor.userId()){
					var userName = Meteor.users.findOne({"_id":Meteor.userId()});
					if(userName&&userName.userName){
						player1Name = userName.userName
					}
				}
			}
			else if(Session.get("changedPlayerSetA")!=undefined){
				player1Name = Session.get("changedPlayerSetA");
				player1ID = Session.get("changedPlayerSet1ID")
			}

			if(Session.get("changedPlayerSetB")==undefined){
				player2Name = "All"
			}
			else if(Session.get("changedPlayerSetB")!=undefined){
				player2Name = Session.get("changedPlayerSetB")
				player2ID = Session.get("changedPlayerSet2ID")
			}
			
			if(Session.get("changeTypeOfSort")==undefined){
				sortFilterValue = "Win Effectiveness"
			}
			else if(Session.get("changeTypeOfSort")!=undefined){
				sortFilterValue = Session.get("changeTypeOfSort")
			}

			if(Session.get("changeSortByTime")==undefined){
				dateFilter = "Any time"
			}
			else if(Session.get("changeSortByTime")!=undefined){
				sortFilterValue = Session.get("changeSortByTime")
			}

			var data = {
				player1Name:player1Name,
				player1ID:player1ID,
				player2Name:player2Name,
				player2ID:player2ID,
				sortFilterValue:sortFilterValue,
				dateFilter:dateFilter
			}
			var lastStroke = [];
			var servicePoints = [];
			var receivePoints = [];
			var serviceLoss = [];
			var rallyLength = [];
			var allStrokes = [];
			var A3BAData = [];
			var errorsRESP = [];
			$("#alreadySubscribedText_NEW").html("Opening PDF Please wait..")
			$("#savingDataPopupNew").modal({
                backdrop: 'static',
                keyboard: false
            });
			Meteor.call('serAPI',data,userId,function(e,res){                
				if(res){
					$("#savingDataPopupNew").modal('hide')
					$( '.modal-backdrop' ).remove();
					window.open("data:application/pdf;base64, " + res);
				}
			});
			/*var methodResponse = Meteor.call("fetchSummarizedSequence",userId,data,function(e,responseLASTStroke){
				if(responseLASTStroke){
					lastStroke = responseLASTStroke;
				}
			
				Meteor.call("fetchServicePoints",userId,data,function(e,servicePointsRes){
					if(servicePointsRes){
						servicePoints = servicePointsRes;
					}
					
					Meteor.call("fetchReceiverPoints",userId,data,function(e,recPoints){
						if(recPoints){
							receivePoints = recPoints;
						}
						
						Meteor.call("fetchServiceLoss",userId,data,function(e,serviceLossRes){
							if(serviceLossRes){
								serviceLoss = serviceLossRes
							}

							Meteor.call("fetchRallyAnalysis",userId,data,function(e,rallResponse){
								if(rallResponse){
									rallyLength = rallResponse
								}

								Meteor.call("fetchStrokeAnalysis",userId,data,function(e,allStrokesRes){
									if(allStrokesRes){
										allStrokes = allStrokesRes;
									}
									Meteor.call("fetch3BallAttack",userId,data,function(e,A3BAResponse){
										if(A3BAResponse){
											A3BAData = A3BAResponse
										}
										Meteor.call("fetchErrorAnalysis",userId,data,function(e,errResp){
											if(errResp){
												errorsRESP = errResp
											}

											Meteor.call("printAnalysisSheet",data,lastStroke,servicePoints,receivePoints,serviceLoss,rallyLength,allStrokes,A3BAData,errorsRESP,function(e,res){
												window.open("data:application/pdf;base64, " + res);
											});
										});
									})
								});
							})
						})
					})
				});
			});*/
	}catch(e){
	}
	}
});

Template.playerLastStrokeSequence.onCreated(function(){
	this.subscribe("onlyLoggedIn");
});

Template.playerLastStrokeSequence.helpers({	
	LastSeqAnalysisData:function(){
		try{
			var player1Name;
			var player1ID;
			var player2ID;
			var player2Name;
			var sortFilterValue;
			var dateFilter;
			var userId;
			if(Meteor.userId()){
				userId = Meteor.userId()
			}
			if(Session.get("changedPlayerSetA")==undefined){
				if(Meteor.userId()){
					var userName = Meteor.users.findOne({"_id":Meteor.userId()});
					if(userName&&userName.userName){
						player1Name = userName.userName						
					}
				}
			}
			else if(Session.get("changedPlayerSetA")!=undefined){
				player1Name = Session.get("changedPlayerSetA");
				player1ID = Session.get("changedPlayerSet1ID")
			}

			if(Session.get("changedPlayerSetB")==undefined){
				player2Name = "All"
			}
			else if(Session.get("changedPlayerSetB")!=undefined){
				player2Name = Session.get("changedPlayerSetB")
				player2ID = Session.get("changedPlayerSet2ID")
			}
			
			if(Session.get("changeTypeOfSort")==undefined){
				sortFilterValue = "Win Effectiveness"
			}
			else if(Session.get("changeTypeOfSort")!=undefined){
				sortFilterValue = Session.get("changeTypeOfSort")
			}

			if(Session.get("changeSortByTime")==undefined){
				dateFilter = "Any time"
			}
			else if(Session.get("changeSortByTime")!=undefined){
				sortFilterValue = Session.get("changeSortByTime")
			}

			var data = {
				player1Name:player1Name,
				player1ID:player1ID,
				player2Name:player2Name,
				player2ID:player2ID,
				sortFilterValue:sortFilterValue,
				dateFilter:dateFilter
			}
			var methodResponse = ReactiveMethod.call("fetchSummarizedSequence",userId,data);
			return methodResponse;
		}catch(e){
		}
	}
});

Template.playerSequenceAnalyzeSubServicePoints.onCreated(function(){
	this.subscribe("onlyLoggedIn");
});

Template.playerSequenceAnalyzeSubServicePoints.helpers({	
	fetchServicePointsData:function(){
		try{
			var player1Name;
			var player2Name;
			var player1ID;
			var player2ID;
			var sortFilterValue;
			var dateFilter;
			var userId;
			if(Meteor.userId()){
				userId = Meteor.userId()
			}
			if(Session.get("changedPlayerSetA")==undefined){
				if(Meteor.userId()){
					var userName = Meteor.users.findOne({"_id":Meteor.userId()});
					if(userName&&userName.userName){
						player1Name = userName.userName
					}
				}
			}
			else if(Session.get("changedPlayerSetA")!=undefined){
				player1Name = Session.get("changedPlayerSetA");
				player1ID = Session.get("changedPlayerSet1ID")
			}

			if(Session.get("changedPlayerSetB")==undefined){
				player2Name = "All"
			}
			else if(Session.get("changedPlayerSetB")!=undefined){
				player2Name = Session.get("changedPlayerSetB")
				player2ID = Session.get("changedPlayerSet2ID")
			}
			
			if(Session.get("changeTypeOfSort")==undefined){
				sortFilterValue = "Win Effectiveness"
			}
			else if(Session.get("changeTypeOfSort")!=undefined){
				sortFilterValue = Session.get("changeTypeOfSort")
			}

			if(Session.get("changeSortByTime")==undefined){
				dateFilter = "Any time"
			}
			else if(Session.get("changeSortByTime")!=undefined){
				sortFilterValue = Session.get("changeSortByTime")
			}

			var data = {
				player1Name:player1Name,
				player1ID:player1ID,
				player2Name:player2Name,
				player2ID:player2ID,
				sortFilterValue:sortFilterValue,
				dateFilter:dateFilter
			}
			var methodResponse = ReactiveMethod.call("fetchServicePoints",userId,data);
			return methodResponse;
		}catch(e){
		}
	}
});

Template.playerSequenceAnalyzeSubReceivePoints.helpers({	
	fetchReceivePointsData:function(){
		try{
			var player1Name;
			var player2Name;
			var player1ID;
			var player2ID;
			var sortFilterValue;
			var dateFilter;
			var userId;
			if(Meteor.userId()){
				userId = Meteor.userId()
			}
			if(Session.get("changedPlayerSetA")==undefined){
				if(Meteor.userId()){
					var userName = Meteor.users.findOne({"_id":Meteor.userId()});
					if(userName&&userName.userName){
						player1Name = userName.userName
					}
				}
			}
			else if(Session.get("changedPlayerSetA")!=undefined){
				player1Name = Session.get("changedPlayerSetA");
				player1ID = Session.get("changedPlayerSet1ID")
			}

			if(Session.get("changedPlayerSetB")==undefined){
				player2Name = "All"
			}
			else if(Session.get("changedPlayerSetB")!=undefined){
				player2Name = Session.get("changedPlayerSetB")
				player2ID = Session.get("changedPlayerSet2ID")
			}
			
			if(Session.get("changeTypeOfSort")==undefined){
				sortFilterValue = "Win Effectiveness"
			}
			else if(Session.get("changeTypeOfSort")!=undefined){
				sortFilterValue = Session.get("changeTypeOfSort")
			}

			if(Session.get("changeSortByTime")==undefined){
				dateFilter = "Any time"
			}
			else if(Session.get("changeSortByTime")!=undefined){
				sortFilterValue = Session.get("changeSortByTime")
			}

			var data = {
				player1Name:player1Name,
				player1ID:player1ID,
				player2Name:player2Name,
				player2ID:player2ID,
				sortFilterValue:sortFilterValue,
				dateFilter:dateFilter
			}
			var methodResponse = ReactiveMethod.call("fetchReceiverPoints",userId,data);
			return methodResponse;
		}catch(e){
		}
	}
});

Template.playerSequenceServiceLoss.onCreated(function(){
	this.subscribe("onlyLoggedIn");
});

Template.playerSequenceServiceLoss.helpers({	
	fetchServiceLossData:function(){
		try{
			var player1Name;
			var player2Name;
			var player1ID;
			var player2ID;
			var sortFilterValue;
			var dateFilter;
			var userId;
			if(Meteor.userId()){
				userId = Meteor.userId()
			}
			if(Session.get("changedPlayerSetA")==undefined){
				if(Meteor.userId()){
					var userName = Meteor.users.findOne({"_id":Meteor.userId()});
					if(userName&&userName.userName){
						player1Name = userName.userName
					}
				}
			}
			else if(Session.get("changedPlayerSetA")!=undefined){
				player1Name = Session.get("changedPlayerSetA");
				player1ID = Session.get("changedPlayerSet1ID")
			}

			if(Session.get("changedPlayerSetB")==undefined){
				player2Name = "All"
			}
			else if(Session.get("changedPlayerSetB")!=undefined){
				player2Name = Session.get("changedPlayerSetB")
				player2ID = Session.get("changedPlayerSet2ID")
			}
			
			if(Session.get("changeTypeOfSort")==undefined){
				sortFilterValue = "Win Effectiveness"
			}
			else if(Session.get("changeTypeOfSort")!=undefined){
				sortFilterValue = Session.get("changeTypeOfSort")
			}

			if(Session.get("changeSortByTime")==undefined){
				dateFilter = "Any time"
			}
			else if(Session.get("changeSortByTime")!=undefined){
				sortFilterValue = Session.get("changeSortByTime")
			}

			var data = {
				player1Name:player1Name,
				player1ID:player1ID,
				player2Name:player2Name,
				player2ID:player2ID,
				sortFilterValue:sortFilterValue,
				dateFilter:dateFilter
			}
			var methodResponse = ReactiveMethod.call("fetchServiceLoss",userId,data);
			return methodResponse;
		}catch(e){
		}
	}
});

Template.playerSequenceRallyLength.onCreated(function(){
	this.subscribe("onlyLoggedIn");
});

Template.playerSequenceRallyLength.helpers({	
	fetchRallyLengthData:function(){
		try{
			var player1Name;
			var player2Name;
			var player1ID;
			var player2ID;
			var sortFilterValue;
			var dateFilter;
			var userId;
			if(Meteor.userId()){
				userId = Meteor.userId()
			}
			if(Session.get("changedPlayerSetA")==undefined){
				if(Meteor.userId()){
					var userName = Meteor.users.findOne({"_id":Meteor.userId()});
					if(userName&&userName.userName){
						player1Name = userName.userName
					}
				}
			}
			else if(Session.get("changedPlayerSetA")!=undefined){
				player1Name = Session.get("changedPlayerSetA");
				player1ID = Session.get("changedPlayerSet1ID")
			}

			if(Session.get("changedPlayerSetB")==undefined){
				player2Name = "All"
			}
			else if(Session.get("changedPlayerSetB")!=undefined){
				player2Name = Session.get("changedPlayerSetB")
				player2ID = Session.get("changedPlayerSet2ID")
			}
			
			if(Session.get("changeTypeOfSort")==undefined){
				sortFilterValue = "Win Effectiveness"
			}
			else if(Session.get("changeTypeOfSort")!=undefined){
				sortFilterValue = Session.get("changeTypeOfSort")
			}

			if(Session.get("changeSortByTime")==undefined){
				dateFilter = "Any time"
			}
			else if(Session.get("changeSortByTime")!=undefined){
				sortFilterValue = Session.get("changeSortByTime")
			}

			var data = {
				player1Name:player1Name,
				player1ID:player1ID,
				player2Name:player2Name,
				player2ID:player2ID,
				sortFilterValue:sortFilterValue,
				dateFilter:dateFilter
			}
			var methodResponse = ReactiveMethod.call("fetchRallyAnalysis",userId,data);
			return methodResponse;
		}catch(e){
		}
	}
});

Template.playerSequenceAllStrokes.onCreated(function(){
	this.subscribe("onlyLoggedIn");
});

Template.playerSequenceAllStrokes.helpers({	
	fetchAllStrokesData:function(){
		try{
			var player1Name;
			var player2Name;
			var player1ID;
			var player2ID;
			var sortFilterValue;
			var dateFilter;
			var userId;
			if(Meteor.userId()){
				userId = Meteor.userId()
			}
			if(Session.get("changedPlayerSetA")==undefined){
				if(Meteor.userId()){
					var userName = Meteor.users.findOne({"_id":Meteor.userId()});
					if(userName&&userName.userName){
						player1Name = userName.userName
					}
				}
			}
			else if(Session.get("changedPlayerSetA")!=undefined){
				player1Name = Session.get("changedPlayerSetA");
				player1ID = Session.get("changedPlayerSet1ID")
			}

			if(Session.get("changedPlayerSetB")==undefined){
				player2Name = "All"
			}
			else if(Session.get("changedPlayerSetB")!=undefined){
				player2Name = Session.get("changedPlayerSetB")
				player2ID = Session.get("changedPlayerSet2ID")
			}
			
			if(Session.get("changeTypeOfSort")==undefined){
				sortFilterValue = "Win Effectiveness"
			}
			else if(Session.get("changeTypeOfSort")!=undefined){
				sortFilterValue = Session.get("changeTypeOfSort")
			}

			if(Session.get("changeSortByTime")==undefined){
				dateFilter = "Any time"
			}
			else if(Session.get("changeSortByTime")!=undefined){
				sortFilterValue = Session.get("changeSortByTime")
			}

			var data = {
				player1Name:player1Name,
				player1ID:player1ID,
				player2Name:player2Name,
				player2ID:player2ID,
				sortFilterValue:sortFilterValue,
				dateFilter:dateFilter
			}
			var methodResponse = ReactiveMethod.call("fetchStrokeAnalysis",userId,data);
			return methodResponse;
		}catch(e){
		}
	}
});

Template.playerSequenceErrors.onCreated(function(){
	this.subscribe("onlyLoggedIn");
});

Template.playerSequenceErrors.helpers({	
	fetchErrorSequenceData:function(){
		try{
			var player1Name;
			var player2Name;
			var player1ID;
			var player2ID;
			var sortFilterValue;
			var dateFilter;
			var userId;
			if(Meteor.userId()){
				userId = Meteor.userId()
			}
			if(Session.get("changedPlayerSetA")==undefined){
				if(Meteor.userId()){
					var userName = Meteor.users.findOne({"_id":Meteor.userId()});
					if(userName&&userName.userName){
						player1Name = userName.userName
					}
				}
			}
			else if(Session.get("changedPlayerSetA")!=undefined){
				player1Name = Session.get("changedPlayerSetA");
				player1ID = Session.get("changedPlayerSet1ID")
			}

			if(Session.get("changedPlayerSetB")==undefined){
				player2Name = "All"
			}
			else if(Session.get("changedPlayerSetB")!=undefined){
				player2Name = Session.get("changedPlayerSetB")
				player2ID = Session.get("changedPlayerSet2ID")
			}
			
			if(Session.get("changeTypeOfSort")==undefined){
				sortFilterValue = "Win Effectiveness"
			}
			else if(Session.get("changeTypeOfSort")!=undefined){
				sortFilterValue = Session.get("changeTypeOfSort")
			}

			if(Session.get("changeSortByTime")==undefined){
				dateFilter = "Any time"
			}
			else if(Session.get("changeSortByTime")!=undefined){
				sortFilterValue = Session.get("changeSortByTime")
			}

			var data = {
				player1Name:player1Name,
				player1ID:player1ID,
				player2Name:player2Name,
				player2ID:player2ID,
				sortFilterValue:sortFilterValue,
				dateFilter:dateFilter
			}
			var methodResponse = ReactiveMethod.call("fetchErrorAnalysis",userId,data);
			return methodResponse;
		}catch(e){
		}
	},
	checkNet:function(){
		var type = this.dataSet;
		for(var i=0;i<type.length;i++){
			if(type[i].strokeDestination=="NET"){
				return type[i].played;
			}
		}
	},
	checkMissed:function(){
		var type = this.dataSet;
		for(var i=0;i<type.length;i++){
			if(type[i].strokeDestination=="MISSED"){
				return type[i].played;
			}
		}
	},
	checkEdge:function(){
		var type = this.dataSet;
		for(var i=0;i<type.length;i++){
			if(type[i].strokeDestination=="BE"){
				return type[i].played;
			}
		}
	},
	checkOut:function(){
		var type = this.dataSet;
		for(var i=0;i<type.length;i++){
			if(type[i].strokeDestination=="OUT"){
				return type[i].played;
			}
		}
	}
});

Template.playerSequence3RDBall.onCreated(function(){
	this.subscribe("onlyLoggedIn");
});

Template.playerSequence3RDBall.helpers({	
	fetch3RDBallSequenceData:function(){
		try{
			var player1Name;
			var player2Name;
			var player1ID;
			var player2ID;
			var sortFilterValue;
			var dateFilter;
			var userId;
			if(Meteor.userId()){
				userId = Meteor.userId()
			}
			if(Session.get("changedPlayerSetA")==undefined){
				if(Meteor.userId()){
					var userName = Meteor.users.findOne({"_id":Meteor.userId()});
					if(userName&&userName.userName){
						player1Name = userName.userName
					}
				}
			}
			else if(Session.get("changedPlayerSetA")!=undefined){
				player1Name = Session.get("changedPlayerSetA");
				player1ID = Session.get("changedPlayerSet1ID")
			}

			if(Session.get("changedPlayerSetB")==undefined){
				player2Name = "All"
			}
			else if(Session.get("changedPlayerSetB")!=undefined){
				player2Name = Session.get("changedPlayerSetB")
				player2ID = Session.get("changedPlayerSet2ID")
			}

			if(Session.get("changeTypeOfSort")==undefined){
				sortFilterValue = "Win Effectiveness"
			}
			else if(Session.get("changeTypeOfSort")!=undefined){
				sortFilterValue = Session.get("changeTypeOfSort")
			}

			if(Session.get("changeSortByTime")==undefined){
				dateFilter = "Any time"
			}
			else if(Session.get("changeSortByTime")!=undefined){
				sortFilterValue = Session.get("changeSortByTime")
			}

			var data = {
				player1Name:player1Name,
				player1ID:player1ID,
				player2Name:player2Name,
				player2ID:player2ID,
				sortFilterValue:sortFilterValue,
				dateFilter:dateFilter
			}
			var methodResponse = ReactiveMethod.call("fetch3BallAttack",userId,data);
			return methodResponse;
		}catch(e){
		}
	}
});

Template.playerServiceFault.onCreated(function(){
	this.subscribe("onlyLoggedIn");
});

Template.playerServiceFault.helpers({	
	fetchServiceserviceFaultSequenceData:function(){
		try{
			var player1Name;
			var player2Name;
			var player1ID;
			var player2ID;
			var sortFilterValue;
			var dateFilter;
			var userId;
			if(Meteor.userId()){
				userId = Meteor.userId()
			}
			if(Session.get("changedPlayerSetA")==undefined){
				if(Meteor.userId()){
					var userName = Meteor.users.findOne({"_id":Meteor.userId()});
					if(userName&&userName.userName){
						player1Name = userName.userName
					}
				}
			}
			else if(Session.get("changedPlayerSetA")!=undefined){
				player1Name = Session.get("changedPlayerSetA");
				player1ID = Session.get("changedPlayerSet1ID")
			}

			if(Session.get("changedPlayerSetB")==undefined){
				player2Name = "All"
			}
			else if(Session.get("changedPlayerSetB")!=undefined){
				player2Name = Session.get("changedPlayerSetB")
				player2ID = Session.get("changedPlayerSet2ID")
			}

			if(Session.get("changeTypeOfSort")==undefined){
				sortFilterValue = "Win Effectiveness"
			}
			else if(Session.get("changeTypeOfSort")!=undefined){
				sortFilterValue = Session.get("changeTypeOfSort")
			}

			if(Session.get("changeSortByTime")==undefined){
				dateFilter = "Any time"
			}
			else if(Session.get("changeSortByTime")!=undefined){
				sortFilterValue = Session.get("changeSortByTime")
			}

			var data = {
				player1Name:player1Name,
				player1ID:player1ID,
				player2Name:player2Name,
				player2ID:player2ID,
				sortFilterValue:sortFilterValue,
				dateFilter:dateFilter
			}

			var methodResponse = ReactiveMethod.call("fetchServiceFault",userId,data);
			return methodResponse;
		}catch(e){
		}
	}
});
 //


 Template.playerServiceResponse.onCreated(function(){
	this.subscribe("onlyLoggedIn");
});
Template.playerServiceResponse.helpers({	
	fetchServiceResponseData:function(){
		try{
			var player1Name;
			var player2Name;
			var player1ID;
			var player2ID;
			var sortFilterValue;
			var dateFilter;
			var userId;
			if(Meteor.userId()){
				userId = Meteor.userId()
			}
			if(Session.get("changedPlayerSetA")==undefined){
				if(Meteor.userId()){
					var userName = Meteor.users.findOne({"_id":Meteor.userId()});
					if(userName&&userName.userName){
						player1Name = userName.userName
					}
				}
			}
			else if(Session.get("changedPlayerSetA")!=undefined){
				player1Name = Session.get("changedPlayerSetA");
				player1ID = Session.get("changedPlayerSet1ID")
			}

			if(Session.get("changedPlayerSetB")==undefined){
				player2Name = "All"
			}
			else if(Session.get("changedPlayerSetB")!=undefined){
				player2Name = Session.get("changedPlayerSetB")
				player2ID = Session.get("changedPlayerSet2ID")
			}

			if(Session.get("changeTypeOfSort")==undefined){
				sortFilterValue = "Win Effectiveness"
			}
			else if(Session.get("changeTypeOfSort")!=undefined){
				sortFilterValue = Session.get("changeTypeOfSort")
			}

			if(Session.get("changeSortByTime")==undefined){
				dateFilter = "Any time"
			}
			else if(Session.get("changeSortByTime")!=undefined){
				sortFilterValue = Session.get("changeSortByTime")
			}

			var data = {
				player1Name:player1Name,
				player1ID:player1ID,
				player2Name:player2Name,
				player2ID:player2ID,
				sortFilterValue:sortFilterValue,
				dateFilter:dateFilter
			}

			var methodResponse = ReactiveMethod.call("fetchServiceResponse",userId,data);
			return methodResponse;
		}catch(e){
		}
	}
});


Template.registerHelper("backgroundDiv",function(data){
	if(data!=undefined){
		if(parseInt(data)==0){
			return "#D5EEF6"
		}
		else if(parseInt(parseInt(data+1)%2)==0){
			return "#fff"
		}
		else if(parseInt(parseInt(data+1)%2)!==0){
			 return "#D5EEF6 ";
		}
	}
});

Template.registerHelper("checkWhichRowToBefilled",function(data1){
	if(data1!=undefined){
		if(parseInt(data1)==0)
			return true
	}
});


Template.registerHelper("backgroundDivANAL",function(data){
	if(data!=undefined){
		if(parseInt(data)==0){
			return "#D5EEF6"
		}
		else if(parseInt(parseInt(data+1)%2)==0){
			return "#fff"
		}
		else if(parseInt(parseInt(data+1)%2)!==0){
			 return "#D5EEF6 ";
		}
	}
});

Template.registerHelper("fullStroke",function(data){
	if(data!=undefined){
		if(data=="Unknown"){
			return "Unknown"
		}
		else{
		var str = data
		m = str.match (/(.+)-(.+)/)
		if(m[1]){
			var s = ReactiveMethod.call("getFullNameOfStroke",m[1])
			return s;
		}
		}
	}
});

Template.registerHelper("fullDest",function(data){
	if(data!=undefined){
		if(data=="Unknown"){
			return "Unknown"
		}
		else{
		var str = data;
		m = str.match (/(.+)-(.+)/)
		if(m[2]){
			var s = ReactiveMethod.call("getFullNameOfDest",m[2])
			return s;
		}
		}
	}
});

Template.registerHelper("fullNAmeService",function(data){
	if(data!=undefined){
		if(data=="Unknown"){
			return "Unknown"
		}
		else{
			var s = ReactiveMethod.call("getFullNameServiceStrokes",data)
			return s;
		}
	}
});

Template.registerHelper("fullNAmeDest",function(data){
	if(data!=undefined){
		if(data=="Unknown"){
			return "Unknown"
		}
		else{
			var s = ReactiveMethod.call("getFullNameOfDest",data)
			return s;
		}
	}
});

Template.registerHelper("fullNameWinningShot",function(data1,data2){
	if(data1!=undefined&&data2!=undefined){
		var s = ReactiveMethod.call("getCombinedNAmeOfstrokes",data1,data2)
		return s;
	}
});

Template.registerHelper("getFullNameOfStroke",function(data1,data2){
	if(data1!=undefined&&data2!=undefined){
		var s = ReactiveMethod.call("getFullNameOfStroke",data1,data2)
		return s;
	}
});

Template.registerHelper("normalizeDecimal",function(data){
    if(data!=undefined){
        var num = parseFloat(data)
        var normalized = Math.round(num*100)/100;
        return normalized;
    }
});