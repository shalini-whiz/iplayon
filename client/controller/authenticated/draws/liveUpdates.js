Template.liveUpdates.onCreated(function() {
	//this.subscribe("projects");
	this.subscribe("domains");

	this.subscribe("onlyLoggedIn");
	this.subscribe("liveUpdates")
	this.subscribe("eventsTournament");
	this.prizeEventId = new ReactiveVar(0);
	//not used
	this.venueLatitude = new ReactiveVar(0);
	this.venueLongitude = new ReactiveVar(0);


});

Template.liveUpEventName2Template.onCreated(function() {
	//this.subscribe("projects");
	this.subscribe("domains");

	this.subscribe("onlyLoggedIn");
	this.subscribe("liveUpdates")
	this.subscribe("upEventsIDCategories",Session.get("liupTourID"));
	this.prizeEventId = new ReactiveVar(0);
	//not used
	this.venueLatitude = new ReactiveVar(0);
	this.venueLongitude = new ReactiveVar(0);

});

Template.liveUpdates.onDestroyed(function() {
	Session.set("eventId", null);
	Session.set("eventId", undefined);
	Session.set("liupTourID",null);
	Session.set("liupTourID",undefined);
	$("#liveUpEventName").select2("close");
	$("#liveUpEventName2").select2("close");
	$("#drawConfiguration").select2("close");
});

Template.liveUpEventName2Template.helpers({
	lEvents: function() {
		//var liveUpdat=liveUpdates.find({}).fetch();
		if(Session.get("liupTourID")!=undefined||Session.get("liupTourID")!=null){
			var lEvents = events.find({"tournamentId" : Session.get("liupTourID")}).fetch();
			if (lEvents.length!==0) {
				return lEvents;
			}

		}
		else{
			return false
		}
	},
});

Template.liveUpdates.helpers({

	lEvents2: function() {
		var lEvents = events.find({"tournamentEvent" : true}).fetch();
		//var liveUpdat=liveUpdates.find({}).fetch();
		if (lEvents.length!==0) {
			return lEvents;
		}
	},
	liveUpdates :function(){
		var eventId=Session.get("eventId")
		if(eventId!=undefined)
		var liveUpdat=liveUpdates.findOne({"eventId":eventId},{$sort:{"liveUpdateMessageTime.liveUpdateTime":-1}});
		if(liveUpdat!=undefined)
		return liveUpdat.liveUpdateMessageTime;
	}

});

Template.liveUpdates.onRendered(function() {
/*	function success(position) {
		alert(position.coords.latitude);
		alert(position.coords.longitude);
	}
	function error(err) {
    	alert(err.message);
  	};
  	  // geolocation options
	  var options = {
	    timeout: 50000,
	  };
  	navigator.geolocation.getCurrentPosition(success, error, options);*/
	/*
	 * initialize slim scroll for select main tags
	 * and select secondary tags
	 */

	$('.liveEventDescription').niceScroll({
		cursorborderradius: '0px', // Scroll cursor radius
		background: '#E5E9E7', // The scrollbar rail color
		cursorwidth: '4px', // Scroll cursor width
		cursorcolor: 'black' // Scroll cursor color
	});
	$('#liveDescriptionText').niceScroll({
		cursorborderradius: '0px', // Scroll cursor radius
		background: '#E5E9E7', // The scrollbar rail color
		cursorwidth: '4px', // Scroll cursor width
		cursorcolor: '#d0a0a0'
	});

	$('.viewLiveUpdate').niceScroll({
		cursorborderradius: '0px', // Scroll cursor radius
		background: '#E5E9E7', // The scrollbar rail color
		cursorwidth: '4px', // Scroll cursor width
		cursorcolor: 'black' // Scroll cursor color
	});
	$('.sendLive').hide();
	$(".viewLiveUpdate").hide();
	/*
	 * initialize select2 for projects and domains
	 */

	$('#liveUpEventName').select2({
		width: '100%',
		color:"#fff"
	});
	$(".select2-selection__rendered").removeAttr('title');
	$('#liveUpEventName2').select2({
		width: '100%',
		color:"#fff"
	});
	$(".select2-selection__rendered").removeAttr('title');
	$('b[role="presentation"]').hide();


	$('#drawConfiguration').select2({
		width: '100%',
		color:"#fff"
	});

});

Template.liveUpdates.events({
	"change #liveUpEventName2": function(e) {
		e.preventDefault();
		Session.set("liupTourID",undefined);
		Session.set("liupTourID",null);
		$("#liveUpEventName").empty();
		$('#liveUpEventName + .select2-container--default .select2-selection--single .select2-selection__rendered').text("Select Event");
		var thisIds = $("#liveUpEventName2").val();
		Session.set("liupTourID",thisIds)
		//var instance = UI.renderWithData(Template.liveUpEventName2Template, { });
       // UI.insert(instance, $("#liveUpEventName")[0]);
      	Blaze.render(Template.liveUpEventName2Template, $("#liveUpEventName")[0]);
        Session.set("eventId",undefined);
        Session.set("eventId",null)
        $(".sendLive").hide();
		$(".viewLiveUpdate").hide();
	},
	"change #liveUpEventName": function(e) {
		e.preventDefault();
		$("#liveDescriptionText").val("");
		$(".sendLive").hide();
		$(".viewLiveUpdate").hide();
		var thisId = $("#liveUpEventName").val();
		Session.set("eventId",thisId)

		var lEvents = events.findOne({"eventSubId":thisId});
		var userIds = Meteor.users.findOne({"_id":Meteor.userId()})

		var d = ""
		var userId = Meteor.users.findOne({"_id":Meteor.userId()})
		if(lEvents!==undefined){
			//if(lEvents.eventOrganizer.toString()===userId.userId.toString()){
				   // no $.get("http://api.timezonedb.com/?lat="+lEvents.timezoneIdEventLat+"&lng="+lEvents.timezoneIdEventLng+"&format=json&key=MR22FNA90DU3", function(data1, status){
            			//d = moment.utc(data1.timestamp*1000);
            			//alert(new ISODate(lEvents.eventStartDate1))
            			//alert(moment.utc(data1.timestamp*1000))
            		// no	var dateT = (new Date(lEvents.eventStartDate1)).getTime()/1000;
            		// no	var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
            			//alert(moment.utc(dateT*1000).zone(lEvents.offset))
            			//alert(moment.utc(dateT*1000))
            			//alert(moment.utc(dateT*1000).zone(lEvents.offset).format("YYYY-DD-MMM hh:mm a"));
            			//alert(moment.utc(data1.timestamp*1000).format("YYYY-DD-MMM hh:mm a"));
            			//alert(typeof moment.utc(data1.timestamp*1000).format("YYYY-DD-MMM hh:mm a"))
            			//alert(TimezonePicker.detectedZone())
            			//var da = new Date()

						//var n = da.getTimezoneOffset();
						//alert(moment(lEvents.eventStartDate.toString()))
						//alert(new Date(lEvents.eventStartDate).toUTCString())
						//alert(new Date(moment.utc(lEvents.eventStartDate.toString()).zone(lEvents.offset).format()).toUTCString())
						// no var uf = moment.utc(data1.timestamp*1000).format("YYYY/DD/MMM");
						// no var uf1 = new Date(uf).getTime()/1000
						//alert( "cur"+moment.utc(data1.timestamp*1000).format("YYYY-DD-MMM hh:mm a"))
						//alert(moment(uf1*1000))
						// no var uf2 = moment.utc(dateT*1000).zone(lEvents.offset).format("YYYY/DD/MMM");
						// no var uf3 = new Date(uf2).getTime()/1000
						//alert("star"+moment.utc(dateT*1000).zone(lEvents.offset).format("YYYY-DD-MMM hh:mm a"));
						//alert(moment(uf3*1000))
						// no var uf4 = moment.utc(dateT2*1000).zone(lEvents.offset).format("YYYY/DD/MMM");
						// no var uf5 = new Date(uf4).getTime()/1000
						//alert("end"+moment.utc(dateT2*1000).zone(lEvents.offset).format("YYYY-DD-MMM hh:mm a"));
						//alert(moment(uf5*1000))
            			// no var eve = moment(lEvents.eventStartDate).format("YYYY-DD-MMM");
            			// no if(moment(uf3*1000).startOf('day')<=moment(uf1*1000).startOf('day')&&moment(uf5*1000).startOf('day')>=moment(uf1*1000).startOf('day')){
							$(".sendLive").show();
							$(".viewLiveUpdate").show();
							$(".viewLiveUpdate").css("height","9em")
            			// no }
            			// no else{
							// no $(".sendLive").hide();
							// no $(".viewLiveUpdate").show();
							// no $(".viewLiveUpdate").css("height","13em")
						// no}
            			////alert(moment.utc(lEvents.eventStartDate1).tz("America/New_York"))
            			//alert(moment(lEvents.eventStartDate).format("YYYY-DD-MMM hh:mm a"));
            			// alert(new Date(lEvents.eventStartDate.toString()).getTime()/1000)
            			//alert(new Date((new Date(lEvents.eventStartDate.toString()).getTime()/1000)*1000).toUTCString())
            			//if()
            			/*if(moment.utc(lEvents.eventStartDate1).tz("America/New_York")>=d){
            				if(moment.utc(lEvents.eventEndDate1).tz("America/New_York")>=d)
            				alert("here")
            			}*/
            			//alert( moment.utc(data1.timestamp*1000).tz("America/New_York").toISOString())
            				/*	var kl = events.findOne({$and: [{eventEndDate: {
                    //lesser than new date or current date and time
                    $gte: d}
                },{"eventOrganizer":userId.userId.toString()},{"_id":thisId},{eventStartDate: {
                    //lesser than new date or current date and time
                    $lte:d}}]});*/
					//var kl = events.findOne({eventEndDate1: {
                    //lesser than new date or current date and time
                   // $gte: new Date(data1.timestamp*1000)}})
				//alert(kl)
				/*if(kl!=undefined){
					//alert("eventOrganizer")
					$(".sendLive").show();
					$(".viewLiveUpdate").show();
					$(".viewLiveUpdate").css("height","9em")
				}
				else{
					//alert("now eventsViewer")
					$(".sendLive").hide();
					$(".viewLiveUpdate").show();
					$(".viewLiveUpdate").css("height","13em")
				}*/
            		// no})


			}
			//else{
				//alert("eventsViewer")
				//$(".sendLive").hide();
				//$(".viewLiveUpdate").show();
				//$(".viewLiveUpdate").css("height","13em")
				//$(".textLiveEventOrg2").show();

			//}
		//}

	},

	"submit form":function(e){
		e.preventDefault();

	},

	"click #cancel": function() {
		Session.set("eventId", null);
		Session.set("eventId", undefined);
		if (Session.get("previousLocationPath") !== undefined) {
			var previousPath = Session.get("previousLocationPath");
			Session.set("previousLocationPath", undefined);
			Session.set("previousLocationPath", null);
			Router.go(previousPath);
		} else {
			Router.go("/myEvents");
		}

	},

	"click #sendLiveButton":function(e){
		e.preventDefault()
		$('#sendLiveButton').prop("disabled", true);
		if($("#liveDescriptionText").val().trim().length!=0)
			$('#sendLiveButton').val("wait..")
		setTimeout(function(){
		    $('#sendLiveButton').prop("disabled", false);
		    $('#sendLiveButton').val("send")
		}, 300);
		if($("#liveDescriptionText").val()!==""&&$("#liveDescriptionText").val().trim().length!=0){
		var thisId = $("#liveUpEventName").val()
		var userId = Meteor.users.findOne({"_id":Meteor.userId()})
		var lEvents = events.findOne({"eventSubId":thisId})//{$and: [{"eventOrganizer":userId.userId.toString()},{"eventSubId":thisId}]});
		/*if(kl==undefined){
			$(".sendLive").hide();
			$(".viewLiveUpdate").show();
			$(".viewLiveUpdate").css("height","13em")
		}
		else{
		var xData = {
			eventId : $("#liveUpEventName").val(),
			liveUpdateMessage : $("#liveDescriptionText").val()
		}

		Meteor.call("insertLiveUpdates",xData,function(e,response){
			if(response){
				$("#liveDescriptionText").val("");
				Session.set("eventId",xData.eventId)


			}
		})
		}*/
		//if(lEvents.eventOrganizer.toString()===userId.userId.toString()){
				    //$.get("http://api.timezonedb.com/?lat="+lEvents.timezoneIdEventLat+"&lng="+lEvents.timezoneIdEventLng+"&format=json&key=MR22FNA90DU3", function(data1, status){
            			//d = moment.utc(data1.timestamp*1000);
            			//alert(new ISODate(lEvents.eventStartDate1))
            			//alert(moment.utc(data1.timestamp*1000))
            			// no var dateT = (new Date(lEvents.eventStartDate1)).getTime()/1000;
            			// no var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
            			//alert(moment.utc(dateT*1000).zone(lEvents.offset))
            			//alert(moment.utc(dateT*1000))
            			//alert(moment.utc(dateT*1000).zone(lEvents.offset).format("YYYY-DD-MMM hh:mm a"));
            			//alert(moment.utc(data1.timestamp*1000).format("h:mm A DD-MM-YYYY"));
            			//alert(typeof moment.utc(data1.timestamp*1000).format("YYYY-DD-MMM hh:mm a"))
            			//alert(TimezonePicker.detectedZone())
            			//var da = new Date()

						//var n = da.getTimezoneOffset();
						//alert(moment(lEvents.eventStartDate.toString()))
						//alert(new Date(lEvents.eventStartDate).toUTCString())
						//alert(new Date(moment.utc(lEvents.eventStartDate.toString()).zone(lEvents.offset).format()).toUTCString())
						// no var uf = moment.utc(data1.timestamp*1000).format("YYYY/DD/MMM hh:mm a");
						// no var uf1 = new Date(uf).getTime()/1000
						//alert(moment(uf1*1000))
						// no var uf2 = moment.utc(dateT*1000).zone(lEvents.offset).format("YYYY/DD/MMM");
						// no var uf3 = new Date(uf2).getTime()/1000
						//alert(moment(uf3*1000))
						// no var uf4 = moment.utc(dateT2*1000).zone(lEvents.offset).format("YYYY/DD/MMM");
						// no var uf5 = new Date(uf4).getTime()/1000
            			// no var eve = moment(lEvents.eventStartDate).format("YYYY-DD-MMM");
            			// no if(moment(uf3*1000).startOf('day')<=moment(uf1*1000).startOf('day')&&moment(uf5*1000).startOf('day')>=moment(uf1*1000).startOf('day')){
            				if($("#liveDescriptionText").val().trim().length!==0){
            				var userName=Meteor.users.findOne({"_id":Meteor.userId()});
            				if(userName.userName==undefined||userName.userName==null){userName.userName="others"}
            				var tzs = moment.tz.guess();
							var xData = {
								tournamentId :$("#liveUpEventName2").val(),
								eventId : $("#liveUpEventName").val(),
								liveUpdateMessage : $("#liveDescriptionText").val(),
								liveUpdateTime:userName.userName+":"+moment().format("h:mm A")+" "+moment.tz.zone(tzs.toString()).abbr(new Date())+" "+moment.utc(new Date()).format("DD-MM-YYYY")
							}

							Meteor.call("insertLiveUpdates",xData,function(e,response){
								if(response){
									$("#liveDescriptionText").val("");
									Session.set("eventId",xData.eventId)


								}
							})
						}
            			// no }
            			// no else{
							//alert("now eventsViewer")
							// no $(".sendLive").hide();
							// no $(".viewLiveUpdate").show();
							// no $(".viewLiveUpdate").css("height","13em")
						// no }
            			////alert(moment.utc(lEvents.eventStartDate1).tz("America/New_York"))
            			//alert(moment(lEvents.eventStartDate).format("YYYY-DD-MMM hh:mm a"));
            			// alert(new Date(lEvents.eventStartDate.toString()).getTime()/1000)
            			//alert(new Date((new Date(lEvents.eventStartDate.toString()).getTime()/1000)*1000).toUTCString())
            			//if()
            			/*if(moment.utc(lEvents.eventStartDate1).tz("America/New_York")>=d){
            				if(moment.utc(lEvents.eventEndDate1).tz("America/New_York")>=d)
            				alert("here")
            			}*/
            			//alert( moment.utc(data1.timestamp*1000).tz("America/New_York").toISOString())
            				/*	var kl = events.findOne({$and: [{eventEndDate: {
                    //lesser than new date or current date and time
                    $gte: d}
                },{"eventOrganizer":userId.userId.toString()},{"_id":thisId},{eventStartDate: {
                    //lesser than new date or current date and time
                    $lte:d}}]});*/
					//var kl = events.findOne({eventEndDate1: {
                    //lesser than new date or current date and time
                   // $gte: new Date(data1.timestamp*1000)}})
				//alert(kl)
				/*if(kl!=undefined){
					//alert("eventOrganizer")
					$(".sendLive").show();
					$(".viewLiveUpdate").show();
					$(".viewLiveUpdate").css("height","9em")
				}
				else{
					$(".sendLive").hide();
					$(".viewLiveUpdate").show();
					$(".viewLiveUpdate").css("height","13em")
				}*/
            		//})


			//}
		}
	},
	
	"blur #liveUpEventName + .select2-container ": function() {
        var lExist = {};
        $('select > option').each(function() {
            if (lExist[$(this).val()])
                $(this).remove();
            else
                lExist[$(this).val()] = true;
        });
    },
    
    /*
     * set the select html attribute #domainName
     * to remove duplicate domainNames as option
     *
     */
    "mouseover #liveUpEventName + .select2-container ": function() {
        var lExist = {};
        $('select > option').each(function() {
            if (lExist[$(this).val()])
                $(this).remove();
            else
                lExist[$(this).val()] = true;
        });
    },
    
    "click #liveUpdatesScoresOpen":function(e){
    	e.preventDefault()
    	var thisId = $("#liveUpEventName2").val();
    	var drawConfiguration = $("#drawConfiguration").val();

		var lEvents = events.findOne({"_id":thisId});
		var eventType = "new";
		if(lEvents){
			if($("#liveUpEventName").val()!==null){
				Session.setPersistent("selectedSportFromLive",$("#liveUpEventName :selected").html());
			}
			else{
				Session.setPersistent("selectedSportFromLive",0);
			}

			//var details = events.findOne({"_id":Router.current().params._PostId});
			if(lEvents._id!=undefined && drawConfiguration == "Knock Out")
			{
				window.open(Router.url("eventTournamentDraws", {_id:thisId,_eventType:eventType}));

			}
			if(lEvents._id!=undefined && drawConfiguration == "Round Robin")
			{
				window.open(Router.url("roundRobinDraws", {_id:thisId,_eventType:eventType}));
			}


		}
    }

});
