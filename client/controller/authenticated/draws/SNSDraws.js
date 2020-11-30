Template.SNSDraws.onCreated(function(){
	this.subscribe("users");
	this.subscribe("allEvents");
	this.subscribe("tournamentEvents");
	Meteor.subscribe("SNSCollectionDB");
});

Template.SNSDraws.onRendered(function(){
	Session.set("matchNumber",0);
	Session.set("setScoresA",undefined);
	Session.set("setScoresB",undefined);
	Session.set("poinsOfPlayerA",undefined);
	Session.set("changeFirstUserId",undefined);
});

Template.SNSDraws.helpers({
	participants:function(){
		try{
			//get the event name selected
			var eventName = Session.get("eventName");
			var userDetails=[];
			//get the sns records for the tournament
			var eventParticipants = SNSCollectionDB.findOne({"tournamentId":Router.current().params._id,"eventName":eventName});
			if(eventParticipants!=undefined&&eventParticipants.eventParticipants!=undefined){
				//set the session for id of sns record
				Session.set("eventId_SNS",eventParticipants._id);
				//get the array of eventparticipants
				var evePart = eventParticipants.eventParticipants;
				//get the userdetails of each participant
				for(var i=0;i<evePart.length;i++){
					var users = Meteor.users.findOne({"userId":evePart[i].toString()});
					if(users!=undefined){
						var data ={
							userId:users.userId,
							userName:users.userName,
						}
						//push the details to array
						userDetails.push(data)
					}
				}
			}
			if(Session.get("changeFirstUserId")==undefined){
				userDetails.sort(sortUserName("userName"));
				//add matchNumber
				userDetails.map(function(document, index){
					document["matchNumber"]=index
				});
				//set session as first user
				Session.set("firstUser",userDetails[0]);
				//init if no records in SNS match collection
				return userDetails;
			}
			else{
				//if name is clicked
				var changedArray  = userDetails.filter(function( obj ) {
				    return obj.userId !== Session.get("changeFirstUserId");
				});
				//sort the array a/c to userName
				changedArray.sort(sortUserName("userName"));

				//add matchNumber
				changedArray.map(function(document, index){
					document["matchNumber"]=index+1;
				});
				//get the details of user
				var userName2 = Meteor.users.findOne({"userId":Session.get("changeFirstUserId")});
				if(userName2!=undefined&&userName2.userName!=undefined){
					var userDetails2 = {
						userId:Session.get("changeFirstUserId"),
						userName:userName2.userName
					}
					Session.set("firstUser",undefined);
					Session.set("firstUser",userDetails2);
					return changedArray;
				}
			}
		}catch(e){
		}
	},

	selectedParticipant:function(){
		var userDetails=[];
		try{
			//save player A details
			userDetails.push(Session.get("firstUser"))
			for(var i=0;i<=userDetails.length;i++){
				if(userDetails[i]!=undefined&&userDetails[i].userId!=undefined){
					//set session for player A id
					Session.set("topPlayerId",userDetails[i].userId);
				}
			}
			return userDetails
		}catch(e){
		}
	},

	//player A scores
	scoreA1:function(){
		try{
			if(Session.get("topPlayerId")!==undefined){
				var setScoresARrayA = [];
				var r;
				var id={
					'tourn':Router.current().params._id,"eventName":Session.get("eventName"), "mainPlayerID":Session.get("topPlayerId"),
					'subPlayerID':this.userId
				}
				if(Session.get("changeFirstUserId")==undefined){
					r =  SNSCollectionDB.findOne(
							{
							 	"tournamentId":id.tourn,"eventName":id.eventName,
							  	"snsRecords.mainPlayerID":Session.get("topPlayerId")
							},{fields:{"snsRecords":1}});
				}
				else{
					r =  SNSCollectionDB.findOne(
							{
							 	"tournamentId":id.tourn,"eventName":id.eventName,
							  	"snsRecords.mainPlayerID":Session.get("changeFirstUserId")
							},{fields:{"snsRecords":1}});
				}
				if(r!=undefined){
					var snsRecordsArray = r.snsRecords;
						//for the length of snrecords array, find the playswith array
						//for the length of palywith array find the given playerId
						// if it matches return the respective scores
						for(var i=0;i<snsRecordsArray.length;i++){
							var playsWithArray = snsRecordsArray[i].playsWith;
							for(var j=0;j<playsWithArray.length;j++){
								if(playsWithArray[j].playerId==this.userId&&snsRecordsArray[i].mainPlayerID==Session.get("topPlayerId")){
									var returnData={}
									returnData = playsWithArray[j].scores;
									setScoresARrayA=returnData.setScoresA;
								}
								if(setScoresARrayA.length!=0){
									return setScoresARrayA
								}
							}

					}
				}
			}
		}catch(e){
		}
	},
	pointsA:function(){
		try{
			if(Session.get("topPlayerId")!==undefined){
				var pointsA = 0;
				var r;
				var id={
					'tourn':Router.current().params._id,"eventName":Session.get("eventName"), "mainPlayerID":Session.get("topPlayerId"),
					'subPlayerID':this.userId
				}
				if(Session.get("changeFirstUserId")==undefined){
					r =  SNSCollectionDB.findOne(
							{
							 	"tournamentId":id.tourn,"eventName":id.eventName,
							  	"snsRecords.mainPlayerID":Session.get("topPlayerId")
							},{fields:{"snsRecords":1}});
				}
				else{
					r =  SNSCollectionDB.findOne(
							{
							 	"tournamentId":id.tourn,"eventName":id.eventName,
							  	"snsRecords.mainPlayerID":Session.get("changeFirstUserId")
							},{fields:{"snsRecords":1}});
				}
				if(r!=undefined){
					var snsRecordsArray = r.snsRecords;
						//for the length of snrecords array, find the playswith array
						//for the length of palywith array find the given playerId
						// if it matches return the respective scores
						for(var i=0;i<snsRecordsArray.length;i++){
							var playsWithArray = snsRecordsArray[i].playsWith;
							for(var j=0;j<playsWithArray.length;j++){
								if(playsWithArray[j].playerId==this.userId&&snsRecordsArray[i].mainPlayerID==Session.get("topPlayerId")){
									pointsA=playsWithArray[j].points;
									return pointsA;
								}
							}
						}
				}
			}
		}catch(e){
		}
	},

	//player B scores
	scoreB1:function(){
		try{
			var setScoresARrayB = []
			var id={
				'tourn':Router.current().params._id,"eventName":Session.get("eventName"), "mainPlayerID":Session.get("topPlayerId"),
				'subPlayerID':this.userId
			}
			var r =  /*SNSCollectionDB.findOne(
					{
					 	"tournamentId":id.tourn,"eventName":id.eventName,
					  	"snsRecords.mainPlayerID":id.mainPlayerID,
					},{fields:{"snsRecords.playsWith":1}});
			var d =*/ SNSCollectionDB.findOne(
					{
					 	"tournamentId":id.tourn,"eventName":id.eventName,
					  	"snsRecords": { $elemMatch: { "mainPlayerID":id.mainPlayerID} }
					},{fields:{"snsRecords":1}});
			if(r!=undefined){
				var snsRecordsArray = r.snsRecords;
					//for the length of snrecords array, find the playswith array
					//for the length of palywith array find the given playerId
					// if it matches return the respective scores
					for(var i=0;i<snsRecordsArray.length;i++){
						var playsWithArray = snsRecordsArray[i].playsWith;
						for(var j=0;j<playsWithArray.length;j++){
							if(playsWithArray[j].playerId==this.userId&&snsRecordsArray[i].mainPlayerID==Session.get("topPlayerId")){
								returnData = playsWithArray[j].scores;
								Session.set("setScoresB",undefined)
								Session.set("setScoresB",returnData.setScoresB)
								setScoresARrayB = returnData.setScoresB;	
							}
							if(setScoresARrayB.length!=0){
								return setScoresARrayB
							}
						}

				}
				//return 0th score of player a
			}
		}catch(e){
		}
	},

	//total points
	totalPoints:function(){
		try{
			if(Session.get("topPlayerId")!==undefined){
				var totalPoints = 0;
				var r;
				var id={
					'tourn':Router.current().params._id,"eventName":Session.get("eventName"), "mainPlayerID":Session.get("topPlayerId"),
					'subPlayerID':this.userId
				}
				if(Session.get("changeFirstUserId")==undefined){
					r =  SNSCollectionDB.findOne(
							{
							 	"tournamentId":id.tourn,"eventName":id.eventName,
							  	"snsRecords.mainPlayerID":Session.get("topPlayerId")
							},{fields:{"snsRecords":1}});
				}
				else{
					r =  SNSCollectionDB.findOne(
							{
							 	"tournamentId":id.tourn,"eventName":id.eventName,
							  	"snsRecords.mainPlayerID":Session.get("changeFirstUserId")
							},{fields:{"snsRecords":1}});
				}
				if(r!=undefined){
					var snsRecordsArray = r.snsRecords;
						for(var i=0;i<snsRecordsArray.length;i++){
							if(snsRecordsArray[i].mainPlayerID==Session.get("topPlayerId")){
								totalPoints=snsRecordsArray[i].totalPoints;
								return totalPoints;
							}
						}
				}
				else{
					return totalPoints;
				}
			}
		}catch(e){
		}		
	},

	//color

	colorOfPlayer:function(){
	try{
		if(Session.get("topPlayerId")!==undefined){
			var colorB ='otherUserName_SNS';
			var r;
			var id={
				'tourn':Router.current().params._id,"eventName":Session.get("eventName"), "mainPlayerID":Session.get("topPlayerId"),
				'subPlayerID':this.userId
			}
			if(Session.get("changeFirstUserId")==undefined){
				r =  SNSCollectionDB.findOne(
						{
						 	"tournamentId":id.tourn,"eventName":id.eventName,
						  	"snsRecords.mainPlayerID":Session.get("topPlayerId")
						},{fields:{"snsRecords":1}});
			}
			else{
				r =  SNSCollectionDB.findOne(
						{
						 	"tournamentId":id.tourn,"eventName":id.eventName,
						  	"snsRecords.mainPlayerID":Session.get("changeFirstUserId")
						},{fields:{"snsRecords":1}});
			}
			if(r!=undefined){
				var snsRecordsArray = r.snsRecords;
					//for the length of snrecords array, find the playswith array
					//for the length of palywith array find the given playerId
					// if it matches return the respective scores
						for(var i=0;i<snsRecordsArray.length;i++){
						var playsWithArray = snsRecordsArray[i].playsWith;
						for(var j=0;j<playsWithArray.length;j++){
							if(playsWithArray[j].playerId==this.userId&&snsRecordsArray[i].mainPlayerID==Session.get("topPlayerId")){
								colorB=playsWithArray[j].color;
								return colorB;
							}
						}
					}
			}
		}
	}catch(e){
	}		
	},

	//check who edits score
	checkWhichUser:function(){
		var userId=Meteor.users.findOne({"_id":Meteor.userId()});
		if(userId!=undefined&&userId.userId!=undefined){
			if(userId.userId==this.userId||Session.get("topPlayerId")==userId.userId){
				return false;
			}
			else {
				return true;
			}
		}
	},

	//check who edits score
	checkWhichUserOnfocus:function(){
		var userId=Meteor.users.findOne({"_id":Meteor.userId()});
		if(userId!=undefined&&userId.userId!=undefined){
			if(userId.userId==this.userId||Session.get("topPlayerId")==userId.userId){
				return "";
			}
			else {
				return "this.blur()";
			}
		}
	},

	//set glyphicon class name 
	byeWalkOverPlayerBL:function(){
		var userId=Meteor.users.findOne({"_id":Meteor.userId()});
		if(userId!=undefined&&userId.userId!=undefined){
			if(userId.userId==this.userId||Session.get("topPlayerId")==userId.userId){
				return "cog";
			}
			else {
				return "";
			}
		}
	},

	//set css class name 
	match_Number_SNS:function(){
		var userId=Meteor.users.findOne({"_id":Meteor.userId()});
		if(userId!=undefined&&userId.userId!=undefined){
			if(userId.userId==this.userId||Session.get("topPlayerId")==userId.userId){
				return "match_Number_SNS";
			}
			else {
				return "match_Number_SNS2";
			}
		}
	},

	//set string
	askForApproval:function(){
		var userId=Meteor.users.findOne({"_id":Meteor.userId()});
		if(userId!=undefined&&userId.userId!=undefined){
			if(userId.userId==this.userId||Session.get("topPlayerId")==userId.userId){
				return "Ask for approval?";
			}
			else {
				return "";
			}
		}
	},

	//set css class name 
	askForApprovalCSSname:function(){
		var userId=Meteor.users.findOne({"_id":Meteor.userId()});
		if(userId!=undefined&&userId.userId!=undefined){
			if(userId.userId==this.userId||Session.get("topPlayerId")==userId.userId){
				return "askforAprrovalmatch_Number_SNS";
			}
			else {
				return "match_Number_SNS";
			}
		}
	},

	//set css class name 
	askForApprovalCSSdiv:function(){
		var userId=Meteor.users.findOne({"_id":Meteor.userId()});
		if(userId!=undefined&&userId.userId!=undefined){
			if(userId.userId==this.userId||Session.get("topPlayerId")==userId.userId){
				return "askforAprrovalscoresMAinDiv_SNStopUp2";
			}
			else {
				return "scoresMAinDiv_SNStopUp2" ;
			}
		}
	},

	//set css class name 
	askforAprrovalmatchNumber_SNS:function(){
		var userId=Meteor.users.findOne({"_id":Meteor.userId()});
		if(userId!=undefined&&userId.userId!=undefined){
			if(userId.userId==this.userId||Session.get("topPlayerId")==userId.userId){
				return "askforAprrovalmatchNumber_SNS";
			}
			else {
				return "matchNumber_SNS" ;
			}
		}
	},

	//set css class name 
	scoresMAinDiv_SNStophead:function(){
		var userId=Meteor.users.findOne({"_id":Meteor.userId()});
		if(userId!=undefined&&userId.userId!=undefined){
			if(userId.userId==this.userId||Session.get("topPlayerId")==userId.userId){
				return "askforAprrovalscoresMAinDiv_SNStophead";
			}
			else {
				return "scoresMAinDiv_SNStophead" ;
			}
		}
	},

	//fetch rank list
	rankingList:function(){
		try{
			var totalPoints = 0;
			var r;
			var id={
				'tourn':Router.current().params._id,"eventName":Session.get("eventName"), "mainPlayerID":Session.get("topPlayerId"),
				'subPlayerID':this.userId
			}
			r =  SNSCollectionDB.findOne(
					{
				 	"tournamentId":id.tourn,"eventName":id.eventName,
					},{sort: {totalPoints: -1}});
			if(r!=undefined){
				var snsRecordsArray = r.snsRecords;
				snsRecordsArray.sort(function(a, b){
				    return parseInt(b.totalPoints) - parseInt(a.totalPoints);
				});
				snsRecordsArray.map(function(document, index){
					document["matchNumber"]=index+1
				});
				return snsRecordsArray
			}
			else{
			}
		}catch(e){
		}				
	}
});

Template.SNSDraws.events({
	//set the session for on click of users
	"click #userNameChange":function(e){
		e.preventDefault();
		Session.set("changeFirstUserId",this.userId)
	},

	//focus on input score 
	//if the target is changed to valid number
	//call the function
	//else set to previous value
	"focusin #scoreA1":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 1, 'A', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	"focusin #scoreA2":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 2, 'A', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	"focusin #scoreA3":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 3, 'A', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	"focusin #scoreA4":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 4, 'A', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	"focusin #scoreA5":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 5, 'A', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	"focusin #scoreA6":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 6, 'A', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	"focusin #scoreA7":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 7, 'A', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	"focusin #scoreB1":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 1, 'B', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	"focusin #scoreB2":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 2, 'B', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	"focusin #scoreB3":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 3, 'B', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	"focusin #scoreB4":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 4, 'B', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	"focusin #scoreB5":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 5, 'B', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	"focusin #scoreB6":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 6, 'B', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	"focusin #scoreB7":function(e){
		e.preventDefault();
		var beforeValue=e.target.value;
		var matchRecord = this;
		$(e.target).on('change', function(e2){
			if ($(this).val().trim().length!=0) {
				var score = $(this).val();
				var reg = /^\d+$/;
				if(reg.test(score)){
					updateScoresSNS (matchRecord, 7, 'B', score);
				}
				else {
					$(this).val(beforeValue);
				}
			}
		});
	},
	//click on walkover glyphicon
	"click #byeWalkOverPlayerBL":function(e){
		e.preventDefault();
		var userId=Meteor.users.findOne({"_id":Meteor.userId()});
		if(userId!=undefined&&userId.userId!=undefined){
			if(userId.userId==this.userId||Session.get("topPlayerId")==userId.userId){
				$("#renderWalkOver").empty();
				//render the popup template
				Blaze.render(Template.WalkOverSNS, $("#renderWalkOver")[0]);
				//set session for id of player a and b
				//set session for name of player a and b
				//set session for match record
		      	var topPlayerUserName = Meteor.users.findOne({"userId":Session.get("topPlayerId")})
		      	if(topPlayerUserName!=undefined&&topPlayerUserName.userName!=undefined){
		      		Session.set("idPlayerA",Session.get("topPlayerId"));
		      		Session.set("idPlayerB",this.userId);
		      		Session.set("namePlayerA",topPlayerUserName.userName);
					Session.set("namePlayerB",this.userName);
					Session.set("WalkoverMatchSNSRec",this);
					$("#WalkOverSNS").modal({
		        		backdrop: 'static'
		      		});
		      	}
			}
			else {
				return false;
			}
		}
	},

	//click on ask for approval
	"click #askForApprovalId":function(e){
		try{
			var scoreOfA=[];
			var scoreOfB=[];
			//get the mainPalyer details
			var mainPlayerName = Meteor.users.findOne({"userId":Session.get("topPlayerId")});
			//get the subPlayer details
			var subPlayerName = Meteor.users.findOne({"userId":this.userId});
			//get the tournament details
			var tournName = events.findOne({"_id":Router.current().params._id});
			//get the score of a,b
			var sPlayer = e.target.name.toString().split("|"); 
			scoreOfA.push(sPlayer[0])
			//get the score of player a
			scoreOfA = scoreOfA[0].toString().split(",");
			scoreOfB.push(sPlayer[1]);
			//get the score of player b
			scoreOfB = scoreOfB[0].toString().split(",")
			//set the url for agree button on mail
			var url = Meteor.absoluteUrl()+"/Activate/"+Session.get("eventId_SNS")+"/"+Router.current().params._id+"/"+this.userId+"/"+Session.get("topPlayerId");

			//set the mail details
			if(mainPlayerName!=undefined&&subPlayerName!==undefined&&tournName!==undefined){
				var dataContext = {
					userName:subPlayerName.userName,
		        	message: mainPlayerName.userName + ", wants to update scores for an event played with you.",
		        	eventName:Session.get("eventName"),
		        	tournName:tournName.eventName,
		        	scoresPlayerA:scoreOfA,
		        	scoresPlayerB:scoreOfB,
		        	mainPlayerName:mainPlayerName.userName,
		        	href:Meteor.absoluteUrl()+"Activate/"+Session.get("eventId_SNS")+"/"+Router.current().params._id+"/"+this.userId+"/"+Session.get("topPlayerId")
		        }
		        var html = Blaze.toHTMLWithData(Template.sendSNSScoreApprovalEmail, dataContext);
		        var options = {
		            from: "iplayon.in@gmail.com",
		            to: subPlayerName.emails[0].address,
		        	subject: "iPlayOn:Agree to score update",
		            html: html
		        }
		       	$("#sendingMailPopup2").modal({
                    backdrop: 'static'
                  })
		        Meteor.call("sendShareEmail", options,url, function(e, re) {
					if(re){
					  $("#sendingMailPopup2").modal('hide');
                      alert("Network issue, Please try again")
                    }
                    else{
                      $("#sendingMailPopup2").modal('hide');
                      $("#alreadySubscribedText2").html("Mail sent");
                      $("#sendingMailPopup").modal({
                        backdrop: 'static'
                      });
                  	}
		        });
	    	}
    	}catch(e){}
	}

});

Template.WalkOverSNS.onCreated(function(){
	this.subscribe("users");
	this.subscribe("allEvents");
	this.subscribe("tournamentEvents");
	Meteor.subscribe("SNSCollectionDB");
});
Template.WalkOverSNS.onRendered(function(){

})
Template.WalkOverSNS.helpers({
	//helper for playerA name
  	"namePlayerA":function(){
	  	if(Session.get("namePlayerA")!=undefined){
	    	return Session.get("namePlayerA")
		}
		else{
			return "";
		}
	},
	//helper for playerB name
 	"namePlayerB":function(){
	  	if(Session.get("namePlayerB")!=undefined){
	    	return Session.get("namePlayerB");
	    }
		else{
			return "";
		}
	},
	//helper for playerA id
  	"idPlayerA":function(){
	  	if(Session.get("idPlayerA")!=undefined){
	  		return Session.get("idPlayerA");
	  	}
	  	else{
	  		return ""
	  	}
	},
	//helper for playerB id
  	"idPlayerB":function(){
	  	if(Session.get("idPlayerB")!=undefined){
	  		return Session.get("idPlayerB");
	  	}
	  	else{
	  		return "";
	  	}
 	},
});

Template.WalkOverSNS.events({
	//not used
  "change input[type=radio][name=set]":function(e){
    e.preventDefault();
    if(e.target.id=="setWalkover"){
      $("#walkoverA").prop("checked", true);
    }
  },
  //set the session for walkover ID
  "change input[type=radio][name=byeWalkover]":function(e){
    e.preventDefault();
    if(e.target.id=="walkoverA"||e.target.id=="walkoverB"){
      $("#setWalkover").prop("checked", true)
      Session.set("WalkoverPlayerId",e.target.value)
    }
  },
  //if set is clicked, check the playerID for walkover(A or B)
  //set the data 
  //call meteor waloverSNS method of server
  "click #savebyewalkover":function(e){
 	e.preventDefault();
 	var player;
 	if(Session.get("WalkoverPlayerId")==Session.get("idPlayerA")){
 		player="A"
 	}
 	else if(Session.get("WalkoverPlayerId")==Session.get("idPlayerB")){
 		player="B"
 	}
 	var data={
 		"mainPlayerID":Session.get("idPlayerA"),
		'subPlayerID':Session.get("idPlayerB"),
		'tourn':Router.current().params._id,
		"eventName":Session.get("eventName"), 
		'walkoverPlayerId':player
 	}
 	Meteor.call("setWalkoverSNS",data,function(e,res){
 		$("#WalkOverSNS").modal('hide');
 		Session.set("setWalkoverApprovalStatus",data)
 	})
  }
 });

function sortUserName(property) {
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

function updateScoresSNS(snsRecord, scoreIndex, player, scoreValue){
	var setScoresA=[];
	var setScoresB=[];
	var datas={
		'tourn':Router.current().params._id,
		"eventName":Session.get("eventName"), 
		"mainPlayerID":Session.get("topPlayerId"),
		"subPlayerID":snsRecord.userId,
		"indexP":parseInt(scoreIndex-1),
		"scoreValue":parseInt(scoreValue),
		"player":player
	}
	Meteor.call("getScoresSNSForPlayer",datas,function(e, response){
		try{
			/*if(response){
				setScoresA=response.setScoresA;
				setScoresB=response.setScoresB;
				if(player=='A') {
					setScoresA[parseInt(scoreIndex-1)]=scoreValue;
				}
				if(player=='B'){
					setScoresB[parseInt(scoreIndex-1)]=scoreValue;
				}
				var data = {
					"mainPlayerID":Session.get("topPlayerId"),
					"subPlayerID":snsRecord.userId,
					"scores":{
						setScoresA:setScoresA,
						setScoresB:setScoresB
					}
				}
				checkForCompletionSNS(data)
			}*/
		}catch(e){
		}
	});
}

var checkForCompletionSNS = function(data){
}

//set match number
Template.registerHelper('addMatchNumber',function(data){
  try{
 	if(data){
		var i=Session.get("matchNumber");
		Session.set("matchNumber",i+1);
		return Session.get("matchNumber")
  	}
  }catch(e){}
});


//this is used to remove first user in array
Template.registerHelper('checkMatchNumDup',function(data){
  try{
 	if(data){
		if(data==0){
			return false;
		}
		else return true
  	}
  }catch(e){}
});

//not used
Template.registerHelper('topPlayer',function(data){
  try{
 	if(data){
		if(data){
			var datas={
			'tourn':Router.current().params._id,"eventName":Session.get("eventName"), "mainPlayerID":data
			}
			Meteor.call("getMatchedPlaysWith",datas,function(e,r){
				if(r){
					for(var i=0;i<r.length;i++){
						Session.set("snsScores",r[i].playsWith);
						Session.set("setScoresA",r[i].scores.setScoresA);
						Session.set("setScoresB",r[i].scores.setScoresB);
						return true
					}
				}
			});
		}
		else return false
  	}
  }catch(e){
  }
});


//this is used to remove first user in array
Template.registerHelper('walkoverglyph',function(data){
  try{
 	if(data){
		if(data=="otherUserName_SNSWalkover"){
			return "glyphicon glyphicon-remove";
		}
		else if(data=="otherUserName_SNSWalkOver2"){
			return "glyphicon glyphicon-ok";
		}
		else return ""
  	}
  }catch(e){}
});

//walkover if player A set radio button
Template.registerHelper('walkoverglyph2',function(data){
			try{
			if(Session.get("topPlayerId")!==undefined){
				var colorB ='otherUserName_SNS';
				var r;
				var id={
					'tourn':Router.current().params._id,"eventName":Session.get("eventName"), "mainPlayerID":Session.get("topPlayerId"),
					'subPlayerID':this.userId
				}
				if(Session.get("changeFirstUserId")==undefined){
					r =  SNSCollectionDB.findOne(
							{
							 	"tournamentId":id.tourn,"eventName":id.eventName,
							  	"snsRecords.mainPlayerID":Session.get("topPlayerId")
							},{fields:{"snsRecords":1}});
				}
				else{
					r =  SNSCollectionDB.findOne(
							{
							 	"tournamentId":id.tourn,"eventName":id.eventName,
							  	"snsRecords.mainPlayerID":Session.get("changeFirstUserId")
							},{fields:{"snsRecords":1}});
				}
				if(r!=undefined){
					var snsRecordsArray = r.snsRecords;
						//for the length of snrecords array, find the playswith array
						//for the length of palywith array find the given playerId
						// if it matches return the respective scores
							for(var i=0;i<snsRecordsArray.length;i++){
							var playsWithArray = snsRecordsArray[i].playsWith;
							for(var j=0;j<playsWithArray.length;j++){
								if (data==Session.get("idPlayerA")){
								if(playsWithArray[j].playerId==Session.get("idPlayerB")&&snsRecordsArray[i].mainPlayerID==Session.get("idPlayerA")){
									colorB=playsWithArray[j].matchStatus;
									if(colorB=="walkover"){
										return true
									}
									//return colorB;
								}
								}
							}
						}
				}
			}
		
		}catch(e){
		}		
})

//walkover if player b set radio button
Template.registerHelper('walkoverglyph3',function(data){
			try{
			if(Session.get("topPlayerId")!==undefined){
				var colorB ='otherUserName_SNS';
				var r;
				var id={
					'tourn':Router.current().params._id,"eventName":Session.get("eventName"), "mainPlayerID":Session.get("topPlayerId"),
					'subPlayerID':this.userId
				}
				if(Session.get("changeFirstUserId")==undefined){
					r =  SNSCollectionDB.findOne(
							{
							 	"tournamentId":id.tourn,"eventName":id.eventName,
							  	"snsRecords.mainPlayerID":Session.get("idPlayerB")
							},{fields:{"snsRecords":1}});
				}
				else{
					r =  SNSCollectionDB.findOne(
							{
							 	"tournamentId":id.tourn,"eventName":id.eventName,
							  	"snsRecords.mainPlayerID":Session.get("idPlayerB")
							},{fields:{"snsRecords":1}});
				}
				if(r!=undefined){
					var snsRecordsArray = r.snsRecords;
						//for the length of snrecords array, find the playswith array
						//for the length of palywith array find the given playerId
						// if it matches return the respective scores
							for(var i=0;i<snsRecordsArray.length;i++){
							var playsWithArray = snsRecordsArray[i].playsWith;
							for(var j=0;j<playsWithArray.length;j++){
								if (data==Session.get("idPlayerB")){
								if(playsWithArray[j].playerId==Session.get("idPlayerA")&&snsRecordsArray[i].mainPlayerID==Session.get("idPlayerB")){
									colorB=playsWithArray[j].matchStatus;
									if(colorB=="walkover"){
										return true
									}
									//return colorB;
								}
								}
							}
						}
				}
			}
		
		}catch(e){
		}		
});

//get user name for userID
Template.registerHelper('userNameForUserIDSNS',function(data){
	if(data){
		var users = Meteor.users.findOne({"userId":data});
		if(users!=undefined&&users.userName!=undefined){
			return users.userName
		}
	}
});