Template.playerAnalytics.onCreated(function(){
	this.playerName1Searched_PA = new ReactiveVar(undefined);
	this.playerName2Searched_PA = new ReactiveVar(undefined);
	var self = this;
	this.subscribe("tournamnetEvents");
    self.autorun(function () {
     	if(Session.get("playerName1Searched_PA")){
     		self.subscribe("usersForAnalyticsPlayers", Session.get("playerName1Searched_PA"));
     	}
     	if(Session.get("playerName2Searched_PA")){
     		self.subscribe("usersForAnalyticsPlayers", Session.get("playerName2Searched_PA"));
     	}
     	if(Session.get("preselectedEventName")!=undefined&&Session.get("preselectedPlayer1Id")!=undefined&&Session.get("preselectedPlayer2Id")!=undefined&&
     		Session.get("preselectedEventName")!=null&&Session.get("preselectedPlayer1Id")!=null&&Session.get("preselectedPlayer2Id")!=null&&Session.get("showTournamentsClicked")==true){
     		var currentPage = parseInt(Router.current().params.page) || 1;
            var skipCount = parseInt(parseInt((currentPage - 1)) * 10);
     		self.subscribe("selectedEventPastEvents",Session.get("preselectedEventName"),Session.get("preselectedPlayer1Id"),Session.get("preselectedPlayer2Id"),skipCount)
		}     
    });

});

Template.playerAnalytics.onRendered(function(){
	Session.set("playerName1Searched_PA",undefined);
	Session.set("selectedPlayer1UserDetails",undefined);
	Session.set("selectedPlayer2UserDetails",undefined);
	Session.set("selectedEventName",undefined);
	Session.set("selectedPlayer1Id",undefined);
	Session.set("selectedPlayer2Id",undefined);
	Session.set("showTournamentsClicked",false);
	Session.set("resultsFetched",undefined);
	Session.set("tournamentIdSelected",undefined)
});

Template.playerAnalytics.helpers({
	"player1SearchResults":function(){
		try{
        	var searchValue = Template.instance().playerName1Searched_PA.get();
            if(searchValue!=undefined&&searchValue.length!=0){
                var search="";
                search = userDetailsTT.find({}).fetch();
                if(search.length!=0){
                    return search;
                }
                else if(searchValue&&search.length==0){
                    var x=[];
                    data={
                        userId:0,
                        userName:"No Results"
                    }
                    x.push(data)
                    return x
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
	"player2SearchResults":function(){
		try{
        	var searchValue = Template.instance().playerName2Searched_PA.get();
            if(searchValue!=undefined&&searchValue.length!=0){
                var search="";
                search = userDetailsTT.find({}).fetch();
                if(search.length!=0){
                    return search;
                }
                else if(searchValue&&search.length==0){
                    var x=[];
                    data={
                        userId:0,
                        userName:"No Results"
                    }
                    x.push(data)
                    return x
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
	sportsDetails:function(){
		try{
			var events = ReactiveMethod.call("getEventDetails");
			return events
		}catch(e){
		}
	},
	pastEventsDetails:function(){
		try{
			if(Session.get("preselectedEventName")!=undefined&&Session.get("preselectedPlayer1Id")!=undefined&&Session.get("preselectedPlayer2Id")!=undefined&&
     		Session.get("preselectedEventName")!=null&&Session.get("preselectedPlayer1Id")!=null&&Session.get("preselectedPlayer2Id")!=null&&Session.get("showTournamentsClicked")==true){
     			var findPastEvents = pastEvents.find({}).fetch();
     			Session.set("resultsFetched",findPastEvents)
     			if(findPastEvents)
     				return findPastEvents;
     		}
     		else if(Session.get("resultsFetched")){
     			return Session.get("resultsFetched")
     		}
		}catch(e){

		}
	},
	tournamnetNAMe:function(){
		var tournamnetNAMe = ReactiveMethod.call("tournamnetNAMeFindPA",this.tournamentId);
		if(tournamnetNAMe)
			return tournamnetNAMe.eventName
	},
	tournamentStartDate:function(){
		try{
			var tournamnetNAMe = ReactiveMethod.call("tournamnetNAMeFindPA",this.tournamentId);
			if(tournamnetNAMe)
				return tournamnetNAMe.eventStartDate
		}catch(e){
		}
	},
	roundNames:function(){
		try{
			var player1ID = Session.get("preselectedPlayer1Id");
			var player2ID = Session.get("preselectedPlayer2Id");
			var tournamentId = this.tournamentId;
			var eventName = Session.get("preselectedEventName");
			var s = ReactiveMethod.call("searchForRoundName",tournamentId,eventName,player1ID,player2ID)
			if(s)
				return s;
			else 
				return "-";
		}catch(e){
		}
	},
	prevPage: function() {
        try {
            var currentPage = parseInt(Router.current().params.page) || 1;
            var previousPage = currentPage === 1 ? 1 : parseInt(currentPage - 1);
            return Router.routes.playerAnalytics.path({
                _PostId: Router.current().params._PostId,
                page: previousPage
            })

        } catch (e) {}
    },
    nextPage: function() {
        try {
            var currentPage = parseInt(Router.current().params.page) || 1;
            var nextPage = parseInt(currentPage + 1);
            return Router.routes.playerAnalytics.path({
                _PostId: Router.current().params._PostId,
                page: nextPage
            })
        } catch (e) {}
    },
    prevPageClass: function() {
        return currentPage() <= 1 ? "none" : "";
    },
    nextPageClass: function() {
        return hasMorePages() ? "" : "none";
    },
});

var currentPage = function() {
    return parseInt(Router.current().params.page) || 1;
}

var hasMorePages = function() {
    var totalPlayers = Counts.get('pastEventsPlayerAnalytics');
    return currentPage() * parseInt(10) < totalPlayers;
}

Template.registerHelper("checkForSingleEvents",function(data){
	if(parseInt(data)==1){
		return true
	}
})
Template.playerAnalytics.events({
	'keyup #searchUser1ForPA, change #searchUser1ForPA,input #searchUser1ForPA,keydown #searchUser1ForPA ': function(e,template){
		e.preventDefault();
		template.playerName2Searched_PA.set(undefined);
        if(e.target.value.trim().length>=3){
            template.playerName1Searched_PA.set(e.target.value);
            Session.set("playerName1Searched_PA",e.target.value)
            Session.set("playerName2Searched_PA",undefined);
        }
        if(e.target.value.trim().length<3&&(e.keyCode == 8 ||e.keyCode == 46)){
            template.playerName1Searched_PA.set(e.target.value);
        }
	},
	'focus #searchUser1ForPA':function(){
         $("#searchUserForTeam").text("")
    },
    'mouseover p[name=userName]':function(e){
        $("#searchUserManage_P").text("")
        if(e.target.id!=0)
        $("#"+e.target.id).css("color", "mediumaquamarine");
    },
    'mouseout p[name=userName]':function(e){
        $("#searchUserManage_P").text("")
        if(e.target.id!=0)
        $("#"+e.target.id).css("color", "white");
    },
    'click div[name=player1Focused]':function(e,template){
    	e.preventDefault()
    	var findPlayer2Duplicate = Session. get("selectedPlayer2UserDetails");
    	var player1FocusedId = this.userId;
    	if(findPlayer2Duplicate!=undefined){
    		for(var J=0;J<findPlayer2Duplicate.length;J++){
    			if(findPlayer2Duplicate[J].userId==player1FocusedId){
    				$("#conFirmHeaderOk").text("Player 1 cannot be same as player 2");
            		$("#confirmOkDelete").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    return false;
    			}
    		}
    	}
    	if(parseInt(this.userId)!=0){
	    	var selectedPlayer1Id = this.userId;
	    	var selectedPlayer1Name = this.userName;
	    	var data = {
	    		userId:selectedPlayer1Id,
	    		userName:selectedPlayer1Name
	    	}
	    	var arrPalyer1Details= [];
	    	arrPalyer1Details.push(data);
	    	Session.set("selectedPlayer1UserDetails",arrPalyer1Details);
	    	Session.set("selectedPlayer1Id",selectedPlayer1Id);
	    	template.playerName1Searched_PA.set(undefined);
	    	Session.set("showTournamentsClicked",false)
            
    	}
    },
    'keyup #searchUser2ForPA, change #searchUser2ForPA,input #searchUser2ForPA,keydown #searchUser2ForPA ': function(e,template){
		e.preventDefault();
		template.playerName1Searched_PA.set(undefined);
        if(e.target.value.trim().length>=3){
            template.playerName2Searched_PA.set(e.target.value);
            Session.set("playerName2Searched_PA",e.target.value)
            Session.set("playerName1Searched_PA",undefined);
        }
        if(e.target.value.trim().length<3&&(e.keyCode == 8 ||e.keyCode == 46)){
            template.playerName2Searched_PA.set(e.target.value);
        }
	},
	'click div[name=player2Focused]':function(e,template){
    	e.preventDefault();
    	var findPlayer1Duplicate = Session. get("selectedPlayer1UserDetails");
    	var player2FocusedId = this.userId;
    	if(findPlayer1Duplicate!=undefined){
    		for(var i=0;i<findPlayer1Duplicate.length;i++){
    			if(findPlayer1Duplicate[i].userId==player2FocusedId){
    				$("#conFirmHeaderOk").text("Player 2 cannot be same as player 1");
            		$("#confirmOkDelete").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    return false;
    			}
    		}
    	}
    	if((findPlayer1Duplicate!=undefined||findPlayer1Duplicate==undefined)&&parseInt(this.userId)!=0){
	    	var selectedPlayer2Id = this.userId;
	    	var selectedPlayer2Name = this.userName;
	    	var data = {
	    		userId:selectedPlayer2Id,
	    		userName:selectedPlayer2Name
	    	}
	    	var arrPalyer2Details= [];
	    	arrPalyer2Details.push(data);
	    	Session.set("selectedPlayer2UserDetails",arrPalyer2Details);   	
			Session.set("selectedPlayer2Id",selectedPlayer2Id);
	    	template.playerName2Searched_PA.set(undefined);
	    	Session.set("showTournamentsClicked",false)
            
    	}
    },
    "change #selectEventPlayerAnalytics":function(e){
    	e.preventDefault();
    	var selectedValue = $("#selectEventPlayerAnalytics").val();
    	if(selectedValue.trim()){
    		Session.set("selectedEventName",selectedValue.trim())
    		Session.set("showTournamentsClicked",false)
    	}
    },
    "click #showTournaments":function(e){
    	e.preventDefault();
    	if(Session.get("selectedEventName")!=undefined&&Session.get("selectedPlayer1Id")!=undefined&&Session.get("selectedPlayer2Id")!=undefined&&
     		Session.get("selectedEventName")!=null&&Session.get("selectedPlayer1Id")!=null&&Session.get("selectedPlayer2Id")!=null){
     		Session.set("showTournamentsClicked",true)
     		var player1id = Session.get("selectedPlayer1Id");
     		var player2id = Session.get("selectedPlayer2Id");
     		var eventname = Session.get("selectedEventName");
     		Session.set("preselectedPlayer1Id",player1id);
     		Session.set("preselectedPlayer2Id",player2id);
     		Session.set("preselectedEventName",eventname);
     		Router.go("playerAnalytics",{page:1});
     	}
     	else{
     		$("#conFirmHeaderOk").text("Please select all fields");
   			$("#confirmOkDelete").modal({
   	            backdrop: 'static',
   	            keyboard: false
             });
   	        return false;
     	}
    },
    "click #tournamentInfoBTN":function(e){
    	e.preventDefault();
    	$("#renderTournaMentInfo").empty();
        Blaze.render(Template.tournamentInfo, $("#renderTournaMentInfo")[0]);
        $("#tournamentInfo").modal({
            backdrop: 'static'
        });
        Session.set("tournamentIdSelected",this.tournamentId);
    },
    "click #cancelRegNewPlayer2":function(e){
    	e.preventDefault();
    	$("#tournamentInfo").modal('hide');
    }
});


Template.tournamentInfo.helpers({
	tournamentInfoPlayerAnalytics:function(){
		try{
			if(Session.get("tournamentIdSelected")){
				var tournDetails = ReactiveMethod.call("tournamentInfoPlayerAnalytics",Session.get("tournamentIdSelected"));
				return tournDetails;
			}
		}catch(e){
		}
	}
})