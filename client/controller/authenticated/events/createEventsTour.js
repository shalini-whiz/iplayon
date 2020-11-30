//Template helpers, events for template createEvents.html
/**
 * @Author Vinayashree
 */
/**
 * client side subscription to the server side publications
 * @SubscribeName: projects(used to subscribe to projects)
 *                 to get the list of projects.
 * @SubscribeName: eventUploads (used to subscribe to eventUploads)
 *                  to get the eventUploads list
 * @SubscribeName: subDomain1 (used to subscribe to subDomain1)
 *                  to get the subDomain1 list
 * @SubscribeName: subDomain2 (used to subscribe to subDomain1)
 *                  to get the subDomain2 list
 * @SubscribeName: users (used to subscribe to users)
 *                 to get the list of users.
 * @SubscribeName: domains (used to subscribe to domains)
 *                 to get the list of domains.
 *
 */
Template.createEventsTour.onCreated(function() {
	//this.subscribe("projects");
	this.subscribe("domains");
	this.subscribe("subDomain1");
	this.subscribe("subDomain2");
	this.subscribe("onlyLoggedIn");
	this.subscribe("eventUploads");
	this.subscribe("allEvents");
	this.prizeEventId = new ReactiveVar(0);
	//not used
	this.venueLatitude = new ReactiveVar(0);
	this.venueLongitude = new ReactiveVar(0);

});
Template.createEventsTour.onDestroyed(function(){
		Session.set("markLatSess",undefined);
		Session.set("markLongSess",undefined);
		Session.set("pacinputSess",undefined);
		Session.set("markLatSess",null);
		Session.set("markLongSess",null);
		Session.set("pacinputSess",null);
		Session.set("markLatSess1",undefined);
		Session.set("markLongSess1",undefined);
		Session.set("pacinputSess1",undefined);
		Session.set("markLatSess1",null);
		Session.set("markLongSess1",null);
		Session.set("pacinputSess1",null);
})
	var venLat = 0, venLong = 0, selectVenLat = 0, selectVenLong = 0;
	var timezoneIdEventLat=0 ,timezoneIdEventLng=0,tournLong=0,tournLat=0,tournAddress="",tournDomainName="",tourDomainId="";
/**
 *  Onrendered  of template createEvents.html
 *  initialize css bootstrap datetimepicker,
 *  select2,nicescroll
 *
 */
Template.createEventsTour.onRendered(function() {
//$.get("https://maps.googleapis.com/maps/api/timezone/json?location=37.77492950,-122.41941550&timestamp=1331161200", function(data, status){
    //    });


  //Meteor.call("getDateAndTimeOfServer",function(e,response){
  //})

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
	$('#selectMainTag').slimScroll({
		height: '8em',
		color: 'black',
		size: '3px',
		width: '100%'
	});

	$('#selectSecTag').slimScroll({
		height: '8em',
		color: 'black',
		size: '3px',
		width: '100%'
	});
	$('#sponImg').hide();
	/*
	 * initialize select2 for projects and domains
	 */
	$('#projectName').select2({
		width: 116,
	});

	$('#tournamentName').select2({
		width: 393,
	});
	$('#domainNameTour').select2({
		width: 330
	});
	$('b[role="presentation"]').hide();
	//$('.select2-selection__arrow').append('<i class="fa fa-angle-down"></i>');
	/*
	 * initialize bootstrap datetimepicker for #closureDate,#endDate and #startDate
	 */
	$('#closureDate').datetimepicker({
		toolbarPlacement: 'bottom',
		showClear: true,
		showClose: true,
		widgetPositioning: {
			vertical: 'top',
			horizontal: 'right',
		},
		useCurrent: false,
		//defaultDate: new Date(),
		//minDate: moment(new Date()),
		//disabledDates: [moment(new Date()).add(-1, 'days').startOf('day')],
	});
	$('#startDate').datetimepicker({
		toolbarPlacement: 'bottom',
		showClear: true,
		showClose: true,
		widgetPositioning: {
			vertical: 'top',
			horizontal: 'right',
		},
		useCurrent: false,
		//defaultDate: new Date(),
		//minDate: moment(new Date())
		//disabledDates: [moment(new Date()).add(-1, 'days').startOf('day')],
	});
	$('#endDate').datetimepicker({
		toolbarPlacement: 'bottom',
		showClear: true,
		showClose: true,
		widgetPositioning: {
			vertical: 'top',
			horizontal: 'right',
		},
		useCurrent: false,
		//defaultDate: new Date(),
		//minDate: moment(new Date())//.add(-1, 'days').startOf('day'),
		//disabledDates: [moment(new Date()).add(-1, 'days').startOf('day')],
	});
	//clear date pickers
	$("#closureDate").val("");
	$("#startDate").val("");
	$("#endDate").val("");
	//call validation function for create events fields
	createEventValidate();
	Session.set("sponsorLogoDisp", null);
	Session.set("sponsorLogoDisp", undefined);
	Session.set("showtemp2",false)
		Session.set("showtemp2", null);
	Session.set("showtemp2", undefined);
});

/**
 * template helpers which connects selectSubDomains.html(pop up on click of star).
 * @methodName : lSubDomain1Name is a function to find subDomain1,
 * @methodName : SubDomain2Name is a function to find subDomain2
 */
Template.selectSubDomains.helpers({
	lSubDomain1Name: function() {
		var lSubDomain1Names = subDomain1.find().fetch();
		if (lSubDomain1Names) {
			return lSubDomain1Names;
		}
	},
	lSubDomain2Name: function() {
		var lSubDomain2Names = subDomain2.find().fetch();
		if (lSubDomain2Names) {
			return lSubDomain2Names;
		}
	},

});

/**
 * template helpers which connects createEvents.html.
 * @methodName : lProjectName is a function to fetch projectNames,
 * @methodName :  lDomainName is a function to fetch domainNames
 */
Template.createEventsTour.helpers({
	lEvents:function(){
		var userId=Meteor.users.findOne({"_id":Meteor.userId()});
		var lEvents = events.find({"eventOrganizer":userId.userId.toString(),"tournamentEvent":true})
		return lEvents;
	},

	lProjectName: function() {
		var lProjectNames = projects.find().fetch();

		if (lProjectNames) {
			return lProjectNames;
		}
	},

	lDomainName: function() {
		var lDomainNames = domains.find().fetch();

		if (lDomainNames) {
			return lDomainNames;
		}
	},
	
	/*not used*/
	lSponsorLogo: function() {
		var lData = Session.get("sponsorLogoDisp");
		/*if (lData) {
			for (var i = 0, l = lData.length; i < l; i++) {
				var s = eventUploads.find({
					"_id": lData[i]._id
				}).fetch();
				return s;
			}
		}*/

		return lData.toString();
	},
	 showtemp2: function(){ 
     return Session.get("showtemp2");
   },
 destroy: function() {
    this.dom.remove();
  }
});

/**
 * Events handler for the template createEvents.html
 */
var gSponsorLogo = "";
var gSponsorPdf = "";
var gSponsorUrl = "";
var gSponsorMailId = "";
var venue;
Template.createEventsTour.events({
	
	/* click of startDate text field,
	 * onChange of startDate,if  startDate is set, set endDate minDate to startDate, and if
	 * closureDate is set check startDate is less than closureDate
	 * set closureDate to startDate and minDate of closureDate to
	 * current date and closureDate maxDate
	 * to startDate value. else if startDate is empty set closureDate maxDate
	 * to false,minDate to current.
	 */
	'focus #startDate': function(e) {
		e.preventDefault();
		$('#startDate').datetimepicker().on('dp.show dp.update', function () {
    $(".datepicker-years .picker-switch").removeAttr('title')
        //.css('cursor', 'default')
        //.css('background', 'inherit')
        .on('click', function (e) {
            e.stopPropagation();
        });
});

		$("#startDate").on("dp.change", function(e) {
			var date1 = moment($('#startDate').val()).format("YYYY-MM-DD");
			var date2;
			if ($('#startDate').val() !== "") {
				$('#endDate').data("DateTimePicker").minDate(moment($("#startDate").val()));
				//$('#endDate').data("DateTimePicker").disabledDates([moment($("#startDate").val())/*.add(-1, 'days').startOf('day')*/]);
				if ($('#closureDate').val() != "") {
					date2 = moment($('#closureDate').val()).format("MM/DD/YYYY h:mm a");
					if (date1 < date2) {
						$('#closureDate').val(date1);
						$('#closureDate').data("DateTimePicker").minDate(new Date())
					}
				}
				$('#closureDate').data("DateTimePicker").maxDate(moment($("#startDate").val()));
			} else if ($('#startDate').val() == "") {
				$('#closureDate').data("DateTimePicker").maxDate(false);
				$('#endDate').data("DateTimePicker").minDate(moment(new Date())/*.add(-1, 'days').startOf('day')*/);
				//$('#endDate').data("DateTimePicker").disabledDates([moment(new Date()).add(-1, 'days').startOf('day')]);
			}
		});
	},

	/* click of closureDate text field,
	 * onChange of closureDate,if  closureDate is set,  and if
	 * startDate  is not set, set the endDate minDate to closureDate.
	 * and set startDate minDate to closureDate.
	 * else if closureDate is empty set, and if
	 * startDate  is not set endDate minDate
	 * to current date, startDate minDate to current date
	 */
	'focus #closureDate': function(e) {
		e.preventDefault();
		$("#closureDate").on("dp.change", function(e) {
			var date1 = moment($('#closureDate').val()).format("YYYY-MM-DD");
			if ($('#closureDate').val() !== "") {
				var date2 = moment($('#endDate').val()).format("YYYY-MM-DD");
				if ($('#startDate').val() == "") {
					$('#endDate').data("DateTimePicker").minDate(moment($("#closureDate").val()));
				//	$('#endDate').data("DateTimePicker").disabledDates([moment($("#closureDate").val())/*.add(-1, 'days').startOf('day')*/]);
				}
				$('#startDate').data("DateTimePicker").minDate(moment($("#closureDate").val()));
				//$('#startDate').data("DateTimePicker").disabledDates([moment($("#closureDate").val())/*.add(-1, 'days').startOf('day')*/]);
			} else if ($('#closureDate').val() == "") {
				if ($('#startDate').val() == "") {
					$('#endDate').data("DateTimePicker").minDate(moment(new Date())/*.add(-1, 'days').startOf('day')*/);
					//$('#endDate').data("DateTimePicker").disabledDates([moment(new Date())/*.add(-1, 'days').startOf('day')*/]);
				}
				$('#startDate').data("DateTimePicker").minDate(moment(new Date())/*.add(-1, 'days').startOf('day')*/);
				//$('#startDate').data("DateTimePicker").disabledDates([moment(new Date())/*.add(-1, 'days').startOf('day')*/]);
			}
		});
	},

	/* click of endDate text field,
	 * onChange of endDate,if  endDate is set,  and if
	 * closureDate  is  set, check endDate is less than closureDate
	 * set the closureDate and startDate to endDate and startDate, closureDate
	 * minDate to new date .
	 * and set startDate,closure date maxDate to endDate.
	 * else if endDate is empty set, and if
	 * set closureDate and startDate maxDate
	 * to false
	 */
	'focus #endDate': function(e) {
		e.preventDefault();
		$("#endDate").on("dp.change", function(e) {
			var date1 = moment($('#endDate').val()).format("MM/DD/YYYY h:mm a");
			var date2;
			if ($('#endDate').val() !== "") {
				if ($('#closureDate').val() != "") {
					date2 = moment($('#closureDate').val()).format("MM/DD/YYYY h:mm a");
					if (date1 < date2) {
						$('#closureDate').val(date1);
						$('#startDate').val(date1);
						$('#startDate').data("DateTimePicker").minDate(new Date())
						$('#closureDate').data("DateTimePicker").minDate(new Date())
					}
				}
				$('#startDate').data("DateTimePicker").maxDate(moment($("#endDate").val()));
				$('#closureDate').data("DateTimePicker").maxDate(moment($("#endDate").val()));
				//$('#awayFromDate').data("DateTimePicker").disabledDates([moment($("#awayToDate").val()).add(-1, 'days').startOf('day')]);
			} else if ($('#endDate').val() == "") {
				$('#closureDate').data("DateTimePicker").maxDate(false);
				$('#startDate').data("DateTimePicker").maxDate(false);
				//	$('#awayFromDate').data("DateTimePicker").minDate(new Date());
				//	$('#awayFromDate').data("DateTimePicker").disabledDates([moment(new Date()).add(-1, 'days').startOf('day')]);
			}
		});
	},

	/*
	 * onClick of star icon open select subDomain pop up
	 */
	'click #selectSubDomainsStar': function(e) {
		e.preventDefault();
		$("#selectSubDomainsPopUp").modal({
			backdrop: 'static' //this disallow background pointer events
		});
	},

	/*
	 * on select of subdomains and click
	 * of ok button if subDomaProvideDetails
	 * form is valid according to validation of subDomain pop up
	 * template, hide the popup
	 */
	'click #yesButtonSubDomains': function(e) {
		e.preventDefault();
		subDomainsSelectValidate();
		if ($("#subDomProvideDetails").valid())
			$("#selectSubDomainsPopUp").modal('hide');
	},

	/*
	 * on click of cancel, button hide.
	 * selectSubDomainsPopUp validation errors.
	 * then set subDomain radio buttons to none option.
	 */
	'click #noButtonSubDomains': function(e) {
		e.preventDefault();
		$("#subDomProvideDetails-error").hide();
		$("#selectSubDomainsPopUp").modal('hide');
		$("#noneSubDomain2").prop("checked", true);
		$("#noneSubDomain1").prop("checked", true);
	},

	/*
	 * onClick of prizeUpload open prizeUploadModal  pop up
	 */
	'click #prizeUpload': function(e) {
		e.preventDefault();
		$("#prizeUpload").css("color","#D9D9D9")
		$('#prizeUploadModal').modal({
			backdrop: 'static' //this disallow background pointer events
		});
	},

	/*
	 * onClick of prize upload modal ok button
	 * if prizeDetailsUploadFormID is valid
	 * hide the modal.
	 * and set prizePdf file name as value of prize.
	 * if prize title is not empty set value of prize to
	 * prize title
	 */
	"click #prizeUploadYes": function(e) {
		e.preventDefault();
		$("#prizeDetailsUploadFormID").valid();
		//if($("#prizePdf").valid()){}
		if ($("#prizeDetailsUploadFormID").valid()) {
			$("#prizeUploadModal").modal('hide');
			/*if ($('#prizePdf').val() != "") {
				if ($('#prizePdf').val().toString().length >= 45) {
					$("#prizeUpload").val($('#prizePdf').val().toString().substring(0, 45) + "...").css("color", "white");
				} else
					$("#prizeUpload").val($('#prizePdf').val().toString()).css("color", "white");
			} else */if ($('#prizeTitleIdName').val() != "") {
				if ($('#prizeTitleIdName').val().toString().length >= 45) {
					$("#prizeUpload").val($('#prizeTitleIdName').val().toString().substring(0, 45) + "...").css("color", "white");
				} else
					$("#prizeUpload").val($('#prizeTitleIdName').val().toString()).css("color", "white");

			}
		}
	},

	/*
	 * if there are validation errors hide it
	 */
	'click #prizeTitleIdName': function(e) {
		e.preventDefault();
		$("#providePrizeDetails-error").hide();
	},

	/*
	 * when prize pdf is changed, get the
	 * prize pdf name a to prize pdf file
	 */
	'change #prizePdf': function(e) {
		if($('#prizePdf').valid()){
			$('#prizePdfName').text($('#prizePdf').val());
			$("#providePrizeDetails-error").hide();
			//$('#prizePdfName').text("Prize Details PDF Filename");
			$('#prizePdfName').css('color', 'black');
		}
		else{
			$('#prizePdfName').text($('#prizePdf').val());
			$("#providePrizeDetails-error").hide();
			//$('#prizePdfName').text("Prize Details PDF Filename");
			$('#prizePdfName').css('color', '#cc3300');
		}
	},

	/*
	 * when prize pdf is changed, get the
	 * prize pdf name a to prize pdf file
	 */
	'change #prizeTitleIdName': function(e) {
		if($('#prizeTitleIdName').valid()){
			$('#prizeTitleIdName').text($('#prizeTitleIdName').val());
			$("#prizeTitleIdName-error").hide();
			//$('#prizePdfName').text("Prize Details PDF Filename");
			$('#prizeTitleIdName').css('color', 'black');
		}
		else{
			$('#prizeTitleIdName').text($('#prizeTitleIdName').val());
			$("#prizeTitleIdName-error").remove();
			//$('#prizePdfName').text("Prize Details PDF Filename");
			$('#prizeTitleIdName').css('color', '#cc3300');
		}
	},
	/*
	 * onClick of clear button of prize details pdf clear
	 * clear the value of file
	 */
	"click #clearPrizeTitle":function(e){
		e.preventDefault();
		if($("#prizeUpload").val()===$("#prizeTitleIdName").val()){
			$("#prizeUpload").val("Uplaod Prize Details");
			$("#prizeUpload").css("color","#d8d8d8");
		}
		$("#prizeTitleIdName").val("");


	},
	
	/*
	 * onClick of clear button of prize details pdf clear
	 * clear the value of file
	 */
	"click #clearPrizePdf":function(e){
		e.preventDefault();
			$("#prizePdf").val("");
			$("#prizePdfName").text("Prize Details PDF Filename");
			$("#prizePdfName").css("color","#808080");
			if($("#prizeUpload").val()!==$("#prizeTitleIdName").val()){
				$("#prizeUpload").val("Uplaod Prize Details");
				$("#prizeUpload").css("color","#d8d8d8");
			}
	},

	/*
	 * if prize pdf details is canceled
	 * set place holders and some css
	 */
	'click #prizeUploadCanceled': function(e) {
		//$("#providePrizeDetails-error").hide();
		$("#prizeUploadModal").modal('hide');
		if(!$("#prizePdf").valid()){//if sponsor pdf is not valid reset it
			//$("#prizePdf").val("");
			//$('#prizePdfName').text("Prize Details PDF Filename");
			//$('#prizePdfName').css('color',"#808080");
				//$("#prizeUpload").val("Uplaod Prize Details");
				//$("#prizeUpload").css("color","#d8d8d8");
		}
				//if(!$("#prizeTitleIdName").valid()){
			//$("#prizeTitleIdName").val("");
			//$('#prizePdfName').text("Prize Details PDF Filename");
			//$('#prizeTitleIdName').attr("placeholder","Entry Fee").css('color',"black");
			//	$("#prizeUpload").val("Uplaod Prize Details");
			//	$("#prizeUpload").css("color","#d8d8d8");
		//}
	/*	$("#prizeUpload").val("Uplaod Prize Details").css("color", "#d9d9d9");
		$('#prizePdf').val("");
		$('#prizePdfName').val("");
		$('#prizeTitleIdName').val("");
		$("#prizeUploadModal").modal('hide');
		$('#prizePdfName').css('color', 'black');
		$('#prizeTitleIdName').css('color', 'black');
		$('#prizeTitleIdName').attr('placeholder', "Prize Title");
		$('#prizePdfName').attr('placeholder', "Prize Details PDF Filename");*/

	},

	/*
	 * onClick of sponsor,show sponsor upload modal
	 */
	'click #sponsor': function(e) {
		e.preventDefault();
		$('#uploadModal').modal({
			backdrop: 'static'
		});
	},

	/*
	 * onClick of sponsor upload modal ok button
	 * of the form of sponsor upload modal is valid,
	 * hide the modal
	 */
	'click #sponsorUpload': function(e) {
		e.preventDefault();
		var lData, lData1, x;
		//gSponsorUrl = $('#sponsorUrl').val();
		//gSponsorMailId = $('#sponsorMailIdName').val();


		if ($('#sponsorDetails').valid()) {
			/*if (gSponsorLogo !== "") {
				eventUploads.remove({
					"_id": gSponsorLogo
				});
			}
			if (gSponsorPdf !== "") {
				eventUploads.remove({
					"_id": gSponsorPdf
				});
			}*/
			/*fileUpload($('#sponsorLogo').prop('files'), function(response) {
				gSponsorLogo = response;
				if (response) {
					$("#sponsor1").hide();
					$('#sponH').hide();
					$('#sponH1').hide();
					$('#sponH2').hide();
					
					$('#sponImg').show();
					Session.set("sponsorLogoDisp", $('#sponsorLogo').val());

				}
			});
			*/

			/*fileUpload($('#sponsorPdf').prop('files'), function(response) {
				gSponsorPdf = response;

				if (response !== false) {
					lData1 = eventUploads.find({
						"_id": response
					}).fetch();
				}
			});*/
			$('#uploadModal').modal('hide');
		}
		/*	if(!$('#uploadModal').hasClass('in')){
			sponsorValidate.resetForm();
		};*/

	},

	/*
	 * on change of sponsor logo, if sponsor logo file
	 * size is according to validation, get the prop of sponsor logo,
	 * then use new FileReader plugin to store the unicode of logo(image)
	 * then, the result of FileReader's result is set as src of image
	 * of #sponImg div.
	 * if its not valid set css ,and place holders
	 */
	'change #sponsorLogo': function(e) {
		//eventUploads.remove({"_id":gSponsorLogo});
		if ($("#sponsorLogo").valid()) {
			var fileInput = $('#sponsorLogo');
			var file = fileInput.prop('files')[0];
			if (fileInput.prop('files') && fileInput.prop('files')[0]) {
				var reader = new FileReader();

				reader.onload = function(e) {
					$('#sponImg').attr("src", e.target.result);
					$("#sponsor1").hide();
					$('#sponH').hide();
					$('#sponH1').hide();
					$('#sponH2').hide();
					$('#sponImg').show();
					//$('#blah').attr('src', e.target.result);
				}

				reader.readAsDataURL(fileInput.prop('files')[0]);
			}
			$('#sponsorLogoName').text("Sponsor's logo Filename");
			$('#sponsorLogoName').css('color', 'black');
			$("#provideDetails-error").hide();
			$('#sponsorLogoName').text($('#sponsorLogo').val());
		}
		else{
			$("#sponsorLogo").valid();
			$('#sponImg').attr("src", "");
			$("#sponsor1").show();
			$('#sponH').show();
			$('#sponH1').show();
			$('#sponH2').show();
			$('#sponImg').hide();
			/*$('#sponsorLogo-error').attr('style','display: block !important');
			$('#sponsorLogo-error').css('top','5px');
			$('#sponsorLogo-error').css('color',"maroon");
			$('#sponsorLogo-error').css('right',"31px");
			$('#sponsorLogo-error').css('font-size',"12px");
			//$('#sponsorLogo').val("");
			$('#sponsorLogoName').text("");
			$('#sponsorLogoName').css('color', 'black');
			//"#provideDetails-error").hide();
			//'#sponsorLogoName').text($('#sponsorLogo').val());*/
			$('#sponsorLogoName').text("Sponsor's logo Filename");
			$('#sponsorLogoName').css('color', '#cc3300');
			$("#provideDetails-error").hide();
			$('#sponsorLogoName').text($('#sponsorLogo').val());
		}

		
	},
	
	/*
	 * mouseover on sponImg show image alt
	 */
	'mouseover #sponImg': function(e) {
		e.preventDefault();
		$('.sponsorHoverText').css("visibility", "visible");
	},

	/*
	 * mouseout of sponImg
	 * hide the visibility of image alt
	 */
	'mouseout #sponImg': function(e) {
		e.preventDefault();
		$('.sponsorHoverText').css("visibility", "hidden");
	},

	/*
	 * onChange of sponsor pdf
	 *
	 */
	'change #sponsorPdf': function(e) {
		//eventUploads.remove({"_id":gSponsorPdf});
		if($('#sponsorPdf').valid()){
			$('#sponsorPdfName').text("Sponsor's PDF Filename");
			$('#sponsorPdfName').css('color', 'black');
			$('#sponsorPdfName').text($('#sponsorPdf').val());
			$("#provideDetails-error").hide();
		}
		else{
			$('#sponsorPdfName').text("Sponsor's PDF Filename");
			$('#sponsorPdfName').css('color', '#cc3300');
			$('#sponsorPdfName').text($('#sponsorPdf').val());
			$("#provideDetails-error").hide();
		}
		//$('#sponsorLogo').valid();
		//$('#sponsorPdf').valid();
	},

	/*
	 * onClick of sponsor url
	 *
	 */
	'click #sponsorUrl': function(e) {
		$('#sponsorLogo').valid();
		$('#sponsorPdf').valid();
		$('#sponsorUrl').valid();
	},

	/*
	 * onClick of sponsor sponsorMailId
	 *
	 */
	'click #sponsorMailIdName': function(e) {
		$('#sponsorMailIdName').css('color', 'black');
		$('#sponsorMailIdName').attr('placeholder', "Sponsor's URL");
		$("#provideDetails-error").hide();
		$('#sponsorLogo').valid();
		$('#sponsorPdf').valid();
		$('#sponsorMailId').valid();
	},

	/*
	 * on submit form of create events,
	 * preventDefault calls jquery validation
	 */
	'submit form': function(event) {
		event.preventDefault();
	},

	/*
	 * onClick of cancel button of create events
	 * if the response from meteor method is true,
	 * check the previous location path,
	 * if it is undefined go to myEvents
	 * else to previous path from where create events is called.
	 */
	"click #cancel": function() {
		gSponsorLogo = "";
		gSponsorPdf = "";
		Router.go("/createEvents");
		/*Session.set("sponsorLogoDisp", null);
		Session.set("sponsorLogoDisp", undefined);
		if (Session.get("previousLocationPath") !== undefined) {
			var previousPath = Session.get("previousLocationPath");
			Session.set("previousLocationPath", undefined);
			Session.set("previousLocationPath", null);
			Router.go(previousPath);
		} else {
			Router.go("/createEvents");
		}*/

	},

	/*
	 * onClick of error pop up close button
	 * hide the error popup
	 */
	'click #errorPopupClose': function(e) {
		e.preventDefault();
		$('#errorPopup').modal('hide');
	},

	/*
	 * onChange of rules and regulations pdf file
	 * check if its valid change color to white
	 * and if the filename string is more than 45 characters
	 * add ... to it.
	 */
	"change #rulesAndReg": function(event) {
		event.preventDefault();
		if ($('#rulesAndReg').valid()) {
			$('#rules').css('color', '#fff');
			var fileName = $("#rulesAndReg").val().toString();
			if ($("#rulesAndReg").val().toString().length >= 45) {
				fileName = $("#rulesAndReg").val().toString().substring(0, 50) + "...";
				$('#rules').text(fileName);
			} else
				$('#rules').text(fileName);
		} else {
			var fileName = $("#rulesAndReg").val().toString();
			if ($("#rulesAndReg").val().toString().length > 45) {
				fileName = $("#rulesAndReg").val().toString().substring(0, 50) + "...";
				$('#rules').text(fileName);
			} else
				$('#rules').text(fileName);
			$('#rules').css('color', 'red');
		}
	},

	/*
	 * onClick of clear button of prize details pdf clear
	 * clear the value of file
	 */
	"click #clearRulesPdf":function(e){
		e.preventDefault();
		$("#rulesAndReg").val("");
		$("#rules").text("Rules & Regulations");
		$("#rules").css("color","#d9d9d9");
	},

	/*
	 * onClick of clear button of sponsor logo
	 * check if its valid, clear sponsorLogo file, image display
	 * show other attributes
	 * and if its not valid clear sponsorLogo file 
	 */
	"click #clearSponsorLogo":function(e){
		e.preventDefault();
		if ($("#sponsorLogo").valid()) {
			$("#sponsorLogo").val("");
			$("#sponsorLogoName").text("Sponsor's Logo Filename");
			$("#sponsorLogoName").css("color","#808080");
			$('#sponImg').attr("src", "");
			$("#sponsor1").show();
			$('#sponH').show();
			$('#sponH1').show();
			$('#sponH2').show();
			$('#sponImg').hide();
		}
		else{
			$("#sponsorLogo").val("");
			$("#sponsorLogoName").text("Sponsor's Logo Filename");
			$("#sponsorLogoName").css("color","#808080");
		}
	},

	/*
	 * onClick of clear button of sponsor pdf
	 * clear sponsorPdf file and name
	 */
	"click #clearSponsorPdf":function(e){
		e.preventDefault();
			$("#sponsorPdf").val("");
			$("#sponsorPdfName").text("Sponsor's PDF Filename");
			$("#sponsorPdfName").css("color","#808080");
	},

	/*
	 * onClick of clear button of sponsor url
	 * clear sponsorMailIdName 
	 */
	"click #clearSponsorURL":function(e){
		e.preventDefault();
			$("#sponsorMailIdName").val("");
	},

	/*
	 * onChange of project name
	 * check if its valid change color to white
	 * else change to red
	 */
	"change #projectName": function(e) {
		e.preventDefault();
		if (!$("#projectName").valid()) {
			$('#projectName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
		} else {
			$('#projectName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', '#fff');
		}
	},

	"change #tournamentName":function(e){
		$('#tournamentName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', '#fff');
		var tournamentIdSelected =$('#tournamentName').children(":selected").attr("id");
		var eventsGet = events.findOne({"_id":tournamentIdSelected});
		$("#endDate").val(eventsGet.eventEndDate);
		$("#startDate").val(eventsGet.eventStartDate);
		$("#closureDate").val(eventsGet.eventSubscriptionLastDate);
		$('#domainNameTour + .select2-container--default .select2-selection--single .select2-selection__rendered').text(eventsGet.domainName.toString()).css('color', '#fff');
		$('#domainNameTour + .select2-container--default .select2-selection--single .select2-selection__rendered').val(eventsGet.domainId.toString());
		$("#content").empty();
		//$( "#subLat" ).attr("id",eventsGet.venueLatitude);
		//$("#subLong").attr("id",eventsGet.venueLongitude);
		tournLat=eventsGet.venueLatitude;
		tournLong=eventsGet.venueLongitude;
		tournAddress=eventsGet.venueAddress
		tournDomainName = eventsGet.domainName;
		tourDomainId=eventsGet.domainId;
		timezoneIdEventLat = eventsGet.timezoneIdEventLat;
		timezoneIdEventLng = eventsGet.timezoneIdEventLng;
		$('#googlePopup').css("cursor","pointer");

		var instance = UI.renderWithData(Template.googleDetailsVenuefortour, { });
        UI.insert(instance, $("#content")[0]);

	},
	/*
	 * onChange of domain name
	 * check if its valid change color to white, and add instance of
	 * template googleDetailsVenue
	 * else change to red
	 */
	"change #domainNameTour": function(e) {
		e.preventDefault();
		if (!$("#domainNameTour").valid()) {
			$('#domainNameTour + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
		} else {
			$('#domainNameTour + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', '#fff');
			$('#googlePopup').css("cursor","pointer");
			$("#content").empty();
			var dgeocoder = new google.maps.Geocoder();
			var setTimeZoneLatLong=0;
			tournLat=0;
			tournLong=0;
			 dgeocoder.geocode({
       			'address': $("#domainNameTour").find(":selected").text()
     		 }, function(results, status) {
	     		//setTimeZoneLatLong = results[0].geometry.location.lat()+","+results[0].geometry.location.lng()
				/*var url = 'https://maps.googleapis.com/maps/api/timezone/json?location='+setTimeZoneLatLong;
				$.get("https://maps.googleapis.com/maps/api/timezone/json?location="+setTimeZoneLatLong+"&timestamp=1331766000", function(data, status){
					timezoneIdEvent = data.timeZoneId;
            		$.get("http://api.timezonedb.com/?lat="+results[0].geometry.location.lat()+"&lng="+results[0].geometry.location.lng()+"&format=json&key=MR22FNA90DU3", function(data1, status){
            			var d = moment.utc(data1.timestamp*1000);
            		})
        		});
        		//http://api.timezonedb.com/?zone=America/Toronto&format=json&key=MR22FNA90DU3
        		//http://api.timezonedb.com/?lat=53.7833&lng=-1.75&key=MR22FNA90DU3*/
        		timezoneIdEventLat = results[0].geometry.location.lat();
        		timezoneIdEventLng = results[0].geometry.location.lng();

     		});

			var instance = UI.renderWithData(Template.googleDetailsVenuefortour, { });
            UI.insert(instance, $("#content")[0]);

		}
	},

	/*
	 * onclick of google map image 
	 * check if domain name is valid, open popup of google map 
	 */
	'click #googlePopup':function(e){
		//if($("#domainNameTour").valid())
		//{				
			//this disallow background pointer events
			$("#googleDetailsVenue").modal({
				backdrop: 'static'
			})
		//}
	},


});

/**
 * function to handle file upload
 * eventUploads is a collection which saves file to the
 * folder /public/eventUploads.
 * call eventUploads.insert function to save the data about file
 * fileObj is a reference variable which holds all the details of file
 * and save as fileObj_id as FileId.
 * then return the FileId to the called function
 */
var fileUpload = function(xData, xCallback) {
	if (xData.length != 0) {
		for (var i = 0, ln = xData.length; i < ln; i++) {
			theFile = new FS.File(xData[i]);
			eventUploads.insert(theFile, function(err, fileObj) {
				// Inserted new doc with ID fileObj._id, and kicked off the data
				// upload using HTTP
				FileId = fileObj._id;
				return xCallback(FileId);

			});
		}
	} else {
		return xCallback(false);
	}
};


/**
 * function to insert events,
 * call meteor method inserEvents with xData
 * as parameters.
 * if the response from meteor method is true,
 * check the previous location path,
 * if it is undefined go to myEvents
 * else to previous path from where create events is called.
 */
var insertEvents = function(xData) {
	Meteor.call('insertEvents', xData,
		function(error, response) {
			if (response) {
				if (Session.get("previousLocationPath") !== undefined) {
					var previousPath = Session.get("previousLocationPath");
					Session.set("previousLocationPath", undefined);
					Session.set("previousLocationPath", null);
					Router.go(previousPath);
				} else {
					Router.go("/myEvents");
				}
				gSponsorLogo = "";
				gSponsorPdf = "";
				Session.set("sponsorLogoDisp", null);
				Session.set("sponsorLogoDisp", undefined);
			} else {
			}
		});
}

/*not used*/
var confirmData = function(xCallback) {
	$("#confirmModal").show();
	$("#yesButton").click(function() {
		$("#confirmModal").hide();
		xCallback(true);
	});
	$("#noButton").click(function() {
		$("#confirmModal").hide();
		xCallback(false);
	})
}

/**
 * function to create an event called from submit handler
 * of create events form
 */
var createEvent = function(event) {
	/*$.get("https://maps.googleapis.com/maps/api/timezone/json?location=37.77492950,-122.41941550&timestamp=1331161200", function(data, status){
        });*/
	var cancLat = 0;
	var cancLng = 0;
	var cacPacNa = "";
	var tournamentId=0
	if($('#tournamentName').children(":selected").attr("id")!=0){
		tournamentId=$('#tournamentName').children(":selected").attr("id")
	}
	else{
		tournamentId=0
	}
	if(Session.get("markLatSess")==undefined||Session.get("markLatSess")==null){
		cancLat = Session.get("markLatSess1");
		cancLng = Session.get("markLongSess1");
		cacPacNa = Session.get("pacinputSess1");
	}
	else{
		cancLat = Session.get("markLatSess");
		cancLng = Session.get("markLongSess");
		cacPacNa = Session.get("pacinputSess");
	}
		/*
		 * variables to store projectId, domainId,
		 * subDomain1Name, subDomain2Name.
		 */
		var lProjectId = [],
			lDomainId = [],
			lSubDomain1Name = [],
			lSubDomain2Name = [];
		var selectSubDomain1 = "";

		/*
		 * set project name and domain name
		 */
		var lProjectName = $("#projectName").children(":selected").attr("id");
		var lDomainName = $('#domainNameTour').children(":selected").attr("id");
		var selectSubDomain2 = "";
		/*
		 * set eventName, projectId, eventStartDate, eventEndDate,
		 * event closureDate, domainId, prizeTitle, description,
		 * sponsor url, sponsor mail Id, rules and regulations and prize pdf files
		 */
		var lEventName = $('#eventName').val();
		lProjectId.push($('#projectName :selected').val().toString())
		var lEventStartDate = $('#startDate').val();
		var lEventEndDate = $('#endDate').val();
		var lEventSubscriptionLastDate = $('#closureDate').val();
		lDomainId.push($('#domainNameTour :selected').val().toString());
		var lPrize = $('#prizeTitleIdName').val();
		var lDescription = $('#description').val();
		var lSponsorPdf = ""; //$('#sponsorPdf').prop('files') ;
		var lSponsorLogo = "" //gSponsorLogo; // $('#sponsorLogo').prop('files');
		var lSponsorUrl = $('#sponsorMailIdName').val();; //$('#sponsorUrl').val();
		var lSponsorMailId = $('#sponsorMailIdName').val(); //gSponsorMailId; //$('#sponsorMailId').val();;
		var lRulesAndReg = $('#rulesAndReg').prop('files');
		var lPrizePdfFile = $('#prizePdf').prop('files');
		var lVenueAddress = "";
		lVenueAddress = $("#pac-input").val();
		var userId = Meteor.users.findOne({
			"_id": Meteor.userId()
		});

		/*
		 * set id of event organizer by fetching userId  from
		 * users db and current logged in meteor user id
		 */
		var lEventOrganizer = userId.userId;

		/*
		 * set selected sub domain1 and sub domain2
		 */
		//selectSubDomain1 = $('input[name="mainTag"]:checked').val().toString();
		//selectSubDomain2 = $('input[name="secondaryTag"]:checked').val().toString();

		/*
		 * if sub domain1 and 2 are not set, set those values to 0
		 */
		/*if (selectSubDomain1 == "None") {
			selectSubDomain1 = "0";
		}
		if (selectSubDomain2 == "None") {
			selectSubDomain2 = "0";
		}
		lSubDomain1Name.push(selectSubDomain1);
		lSubDomain2Name.push(selectSubDomain2);*/
		var rulesAndRegulations = "";
		var prizePdfId = "";

		/*
		 *call fileUpload function to upload rules and regulations
		 *and save fileId(response) as rulesAndRegulations
		 */
		fileUpload(lRulesAndReg, function(response) {
			if (response) {
				rulesAndRegulations = response;
			}
			/*
			 *call fileUpload function to upload prize pdf
			 *and save fileId(response) as prizePdfId
			 */
			fileUpload($('#prizePdf').prop('files'), function(response) {
				if (response) {
					prizePdfId = response;
				}
				/*
				 *call fileUpload function to sponsorLogo
				 *and save fileId(response) as lSponsorLogo
				 */
				fileUpload($('#sponsorLogo').prop('files'), function(response) {
					if (response) {
						lSponsorLogo = response;
					}
					/*
					 *call fileUpload function to sponsorPdf
					 *and save fileId(response) as lSponsorPdf
					 */
					fileUpload($('#sponsorPdf').prop('files'), function(response) {
						if (response) {
							lSponsorPdf = response;
						}

						/*
						 * set all the values as object
						 */
						var lData = {
							eventName: lEventName.charAt(0).toUpperCase() + lEventName.slice(1),
							projectId: lProjectId,
							eventStartDate: lEventStartDate,
							eventEndDate: lEventEndDate,
							eventSubscriptionLastDate: lEventSubscriptionLastDate,
							domainId: tourDomainId,
							//subDomain1Name: lSubDomain1Name,
							//subDomain2Name: lSubDomain2Name,
							prize: lPrize,
							description: lDescription,
							eventOrganizer: lEventOrganizer,
							sponsorPdf: lSponsorPdf,
							sponsorLogo: lSponsorLogo,
							sponsorUrl: lSponsorUrl,
							rulesAndRegulations: rulesAndRegulations,
							prizePdfId: prizePdfId,
							projectName: lProjectName,
							domainName: tournDomainName,
							venueLatitude: tournLat,
							venueLongitude: tournLong,
							venueAddress:tournAddress,
							timezoneIdEventLat:timezoneIdEventLat,
							timezoneIdEventLng:timezoneIdEventLng,
							tournamentId:tournamentId,
							tournamentEvent:false

						};
						/*
						 * then call insetEvents function
						 */
						insertEvents(lData);
					});
				});
			});
		});
	}

/**
 * function to validate create events
 *  @fieldName: eventName
 * 		@required : true
 * 		@minLength:5 characters
 * 		@maxLength:40 characters
 * 		@validText2:/^\w\/ (this is to validates if unwanted space) 
 * @fieldName: rulesAndReg
 * 		@fileSize : 1048576 (1MB of file size)
 * 		@accept : 'application/pdf' accepts only pdf files
 * @fieldName : domainName
 *		@required : true
 * @fieldName : projectName
 *		@required : true
 * @fieldName : closureDate
 *		@required : true
 * @fieldName : startDate
 *		@required : true
 * @fieldName : endDate
 *		@required : true
 * @fieldName : subDomain1Area, subDomain2Area
 * 		@maxLength :200 characters
 * 		@validText :regex to validate csv format
 * @fieldName : description
 * 		@required : true
 * 		@minLength:5 characters
 * 		@maxLength:100 characters
 * 		@validText2:/^\w\/ (this is to validates if unwanted space) 
 * @fieldName : sponsor
 *      @sponsorPdfSize : 1048576, (1MB of file size)
 *      @sponsorLogoSize: 100000 (less than 4kb of file size)
 */
var createEventValidate = function() {
	var s = $('#eventCreation').validate({

		rules: {
			eventName: {
				required: true,
				minlength: 5,
				maxlength: 40,
				whiteSpace : /\S/
			},
			prize: {
				eventFee: true,
				//minlength: 5
			},
			rulesAndReg: {
				/*required: function() {
					if ($('#rulesAndReg').val() == "") {
						return true;
					} else {
						return false;
					}
				},*/
				accept: 'application/pdf',
				filesize: 1048576

			},
			/*domainName: {
				required: true
			},*/
			projectName: {
				required: true
			},
			closureDate: {
				required: true,
			},
			startDate: {
				required: true
			},
			endDate: {
				required: true
			},
			description: {
				//required: true,
				validText2: /^\w/,
				minlength: 5,
				maxlength: 100
			},
			sponsor: {
				/*sponsorFiles: true,*/
				sponsorPdfSize: 1048576,
				sponsorLogoSize: 100000
			},
			/* sponsorPdf:{
			 	 	required:function(){
			    			if($('#sponsorPdf').val()=="")
			    				{return true;}
			    			else
			    				{return false;}
			    		},
			    	accept:'application/pdf',
			    	filesize:1048576
			 	 }*/
		},
		messages: {
			eventName: {
				required: "Please enter the event name.",
				minlength: "The Event name should contain atleast 5 characters",
				maxlength: "The Event name should be within 30 characters",
				whiteSpace: "Event Name is not valid",
			},
			prize: {
				eventFee: "Please provide entry fee",
				//minlength: 5
			},
			rulesAndReg: {
				required: "Please upload the rules and regulations pdf",
				accept: 'Please upload only pdf files',
				filesize: 'Rules and Regulations file size should be less than 1MB'
			},
			/*domainName: {
				required: "Please select the venue",
			},*/
			projectName: {
				required: "Please select the game"
			},
			closureDate: {
				required: "Please select the entry closure date and time"
			},
			startDate: {
				required: "Please select the event start date and time"
			},
			endDate: {
				required: "Please select the event end date and time"
			},
			description: {
				//required: "Please provide the event description",
				minlength: "Please provide the event description with minimum of 5 charactes",
				maxlength: "Please provide the event description within 60 charactes",
				validText2: "Events Description is not valid",

			},
			sponsor: {
				/*sponsorFiles: "Please upload  all the sponsor details",*/
				sponsorPdfSize: "Sponsor Pdf size should be less than 1MB",
				sponsorLogoSize: "Sponsor logo size should be less than 4kb"
			},
			/* sponsorPdf:{
			     	required:"Please upload sponsors pdf",
			     	filesize:'the file size should be less than 1MB'
			     }*/
		},
		/*
		 * setting error container and errorLabelConatiner to ul
		 * and wrap it inside li
		 */
		errorContainer: $('#errorContainer'),
		errorLabelContainer: $('#errorContainer ul'),
		wrapper: 'li',
		/*
		 * handles error 
		 */
		invalidHandler: function(form, validator, element) {
			var elem = $(element);//set error element
			var errors = s.numberOfInvalids();
			//if there are errors open errorPopup modal
			if (errors) $('#errorPopup').modal({
				backdrop: 'static'
			});
			//set colors, on error of rulesAndReg, projectName and domainName
			for (var i = 0; i < validator.errorList.length; i++) {
				var q = validator.errorList[i].element;
				if (q.name == 'rulesAndReg') {
					$('#rules').css('color', 'red')
				}
				if (q.name === 'projectName') {
					$('#projectName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
				}
				if (q.name === 'domainName') {
					$('#domainNameTour + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
				}
				if (q.name === 'prize') {
					$('#prizeUpload').css('color', 'red');
				}
			}

		},
		submitHandler: function(event) {
			//on success of validation call create event function
			createEvent(event);
		}
	});
}

/**
 * validation method to check no fields with invalid spaces
 */
$.validator.addMethod(
	"validText2",
	function(value, element, regexp) {
		var check = false;
		return this.optional(element) || regexp.test(value);
	}

);
	$.validator.addMethod(
	"eventFee",
	function(value, element, regexp) {
		if($("#prizeTitleIdName").val()==""){
			return false
		}
		else return true
	}

);
/**
 * validation method to check no filesize
 */
$.validator.addMethod('filesize', function(value, element, param) {
	return this.optional(element) || (element.files[0].size <= param)
});

/*not used*/
$.validator.addMethod('sponsorFiles', function(value, element) {
	if ($('#sponsorPdf').prop('files') === "" || $('#sponsorLogo').prop('files') === "" || $('#sponsorUrl').val() === "" || $('#sponsorMailId').val() === "") {
		return false;
	} else {
		return true
	}
});

/**
 * validation sponsor pdf file size based on parameter set in rules
 */
$.validator.addMethod('sponsorPdfSize', function(value, element, param) {
	if ($('#sponsorPdfName').val() !== "") {
		theFile = new FS.File($('#sponsorPdf').prop('files')[0]);
		if (theFile.original.size <= param) {
			return true;
		} else {
			return false;
		}
	} else return true;
});

/**
 * validation sponsor logo file size based on parameter set in rules
 */
$.validator.addMethod('sponsorLogoSize', function(value, element, param) {
	if ($('#sponsorLogo').val() !== "") {
		theFile = new FS.File($('#sponsorLogo').prop('files')[0]);
		if (theFile.original.size <= param) {
			return true;
		} else {
			return false;
		}
	} else return true;
});



var sponsorValidate = "";
/**
 * function to validate sponsor upload
 * @fieldName : provideDetails
 * 
 * @fieldName : sponsorMailId
 * 
 * @fieldName : sponsorUrl
 * 		@required : true
 * @fieldName : sponsorPdf
 *      @filesize : 1048576, (1MB of file size)
 * @fieldName : sponsorLogo
 *      @sponsorPdfSize : 1048576, (1MB of file size)
 *      @filesize : 100000 (less than 4kb of file size)
 */
var sponsorUploadValidate = function() {
	var s = sponsorValidate = $('#sponsorDetails').validate({
		rules: {
			sponsorLogo: {
				/*required: true,*/
				filesize: 10000
			},
			sponsorPdf: {
				/*required: true,*/
				filesize: 1048576
			},
			sponsorUrl: {
				required: true
			},
			sponsorMailId: {
				/*required: true*/
			},
			provideDetails: {
				/*
				 * invisible HTML field used to validate sponsor upload
				 * popup, if user clicks save without filling any of the fields,
				 * set the color to red
				 * */
				required: function(e) {
					if ($("#sponsorPdf").val() == "" &&
						$("#sponsorLogo").val() == "" &&
						$("#sponsorMailIdName").val() == "" &&
						$("#sponsorLogoName").css("color") != "rgb(204, 51, 0)" &&
						$("#sponsorPdfName").css("color") != "rgb(204, 51, 0)" &&
						$("#sponsorMailIdName").css("color") != "rgb(204, 51, 0)") {
						return true
					} else return false
				}
			}
		},
		messages: {
			sponsorLogo: {
				/*required: "please upload sponsors logo",*/
				filesize: "Sponsor's logo size should be less than 5 kilo bytes"
			},
			sponsorPdf: {
				/*required: "please upload sponsors Pdf file",*/
				filesize: "Sponsor's pdf file should be less than 1Mega Bytes"
			},
			sponsorUrl: {
				required: "Please provide sponsor Url"
			},
			sponsorMailId: {
				/*required: "please provide sponsor mail id"*/
			},
			provideDetails: {
				required: "Please provide atleast one field"
			}
		},
		/*
		 * set error element to div
		 */
		errorElement: 'div',
		/*
		 * handles error 
		 */
		invalidHandler: function(form, validator, element) {
			var errors = validator.numberOfInvalids();
			if (errors) {
				/*
				 * if there are errors change the color of corresponding fields
				 */
				if (validator.errorList.length > 0) {
					for (x = 0; x < validator.errorList.length; x++) {
						var q = validator.errorList[x].element;
						var elementName = [];
						$("#" + q.name + "Name").text("");
						$("#" + q.name + "Name").text(validator.errorList[x].message)
							.css("color", "#cc3300");
					}
				}
			}
			validator.focusInvalid();
		},
		submitHandler: function(event) {
		}
	});
}

/**
 * On rendered of sponsor up validate sponsor 
 * modal form
 */
Template.sponsorUpload.onRendered(function() {
	sponsorUploadValidate();
});

var sponsorValidate = "";
/**
 * template events which connects sponsorUpload pop up
 */
Template.sponsorUpload.events({
	
	/*
	 * click of submit form,
	 * e.preventDefault calls jquery validation
	 */
	'submit form': function(e) {
		e.preventDefault();
	},
	
	/*
	 * when sponsor pop up cancel button is clicked
	 */
	'click #sponsorCanceled': function(e) {
		e.preventDefault();
		$('#uploadModal').modal('hide');
		$("#provideDetails-error").hide();
		if(!$("#sponsorLogo").valid()){//if sponsor logo is not valid reset it
			$("#sponsorLogo").val("");
			$('#sponsorLogoName').text("Sponsor's Logo Filename");
			$('#sponsorLogoName').css('color',"#808080");
		}
		if(!$("#sponsorPdf").valid()){//if sponsor pdf is not valid reset it
			$("#sponsorPdf").val("");
			$('#sponsorPdfName').text("Sponsor's Pdf Filename");
			$('#sponsorPdfName').css('color',"#808080");
		}
		//$("#sponsor1").show();
		//$('#sponH').show();//show text
		//$('#sponH1').show();//show text 
		//$('#sponH2').show();//show text
		//$('#sponImg').hide();//hide the image
		//$('#sponsorLogoName').css('color', 'black');//change color if it has been changed to error
		//$('#sponsorPdfName').css('color', 'black');
		//$('#sponsorMailIdName').css('color', 'black');
		//$('#sponsorLogoName').attr('placeholder', "Sponsor's Logo Filename");//set place holders
		//$('#sponsorPdfName').attr('placeholder', "Sponsor's PDF Filename");
		//$('#sponsorMailIdName').attr('placeholder', "Sponsor's URL");
		//$('#sponsorUrl').val("");//clear all values
		//$('#sponsorPdf').val("");
		//$('#sponsorPdfName').val("");
		//$('#sponsorLogo').val("");
		//$('#sponsorLogoName').val("");
		//$('#sponsorMailIdName').val("");
	},
	
	/*
	 * close the popup of sponsor, not used
	 */
	'click #popupClose': function(e) {
		e.preventDefault();
		$('#uploadModal').modal('hide');
	},
});

var subDomainsValidate = "";

/**
 * function to validate select subDomains pop up
 * @fieldName : subDomProvideDetails
 * 		@CheckSubDomains1or2 : true (check whether sub domains are selected)
 */
var subDomainsSelectValidate = function() {
	var subDomainsValidate = $('#selectSubDomainsFormId').validate({
		rules: {
			subDomProvideDetails: {
				CheckSubDomains1or2: true
			},
		},
		messages: {
			subDomProvideDetails: {
				CheckSubDomains1or2: "Please select atleast one tag"
			}
		},
		/*
		 * set error element as div
		 */
		errorElement: 'div',
		submitHandler: function(event) {
		}
	});
}

/**
 * onRendered of selectSubDomains pop up call subDomainsSelectValidate function
 */
Template.selectSubDomains.onRendered(function() {
	subDomainsSelectValidate();
});

Template.selectSubDomains.events({
	'submit form': function(e) {
		e.preventDefault();
	},
});

/**
 * if atleast one project or sport is not selected return false,
 * else true
 */
$.validator.addMethod(
	"CheckSubDomains1or2",
	function(value, element, regexp) {
		if ($("input[name=secondaryTag]:checked").map(
				function() {
					return this.value;
				}).get() == "" && $("input[name=mainTag]:checked").map(
				function() {
					return this.value;
				}).get() == "") {
			return false
		} else return true
	}

);

/**
 * onRendered of prize pop up call prizeUploadsValidate function
 */
Template.prizeDetailstemp.onRendered(function() {
	prizeUploadsValidate();
});


/**
 * function to validate select subDomains pop up
 * @fieldName : prizePdf
 * 		@filesize : 1048576 (less than 1MB of file size)
 * @fieldName : providePrizeDetails
 * 		@checkPrizeDetails : true (check any of the fields is filled or not) 
 */
var prizeUploadsValidate = function() {
	$('#prizeDetailsUploadFormID').validate({
		rules: {
			prizePdf: {
				filesize: 1048576
			},
			providePrizeDetails: {
				checkPrizeDetailsCreate: true
			},
			prizeTitleId:{
				//required:true,
				regexpPrize:/^[0-9]*$/
			}
		},
		messages: {
			prizePdf: {
				filesize: "Prize details pdf file should be less than 1Mega Bytes"
			},
			providePrizeDetails: {
				checkPrizeDetailsCreate: "Entry fee is required"
			},
			prizeTitleId:{
				//required:"";
				regexpPrize:""
			}
		},
		/*
		 * set error element to div
		 */
		errorElement: 'div',
		//handles error
		invalidHandler: function(form, validator, element) {
			var errors = validator.numberOfInvalids();
			if (errors) {
				/*
				 * if there are errors change the color of corresponding fields
				 */
				if (validator.errorList.length > 0) {
					for (x = 0; x < validator.errorList.length; x++) {
						var q = validator.errorList[x].element;
						var elementName = [];
						$("#prizeTitleIdName-error").hide();
						$("#" + q.name + "Name").val("");
						$("#" + q.name + "Name").text(validator.errorList[x].message)
							.css("color", "#cc3300");
						if(q.name=="providePrizeDetails"){
							$("#prizeTitleIdName").css("color", "#cc3300");
						}
						if(q.name=="prizeTitleId"){
							$("#prizeTitleIdName-error").hide();
							$("#" + q.name + "Name").attr("placeholder", "Entry fee should be valid amount")
							$("#prizeTitleIdName").css("color", "#cc3300");
						}
					}
				}
			}
			validator.focusInvalid();
		},

		submitHandler: function(event) {
		}
	});
}

$.validator.addMethod(
	"regexpPrize",
	function(value, element, regexp) {
		var check = false;
		return this.optional(element) || regexp.test(value);
	}

);
/**
 * validation to check the prize details,
 * whether at least one field is filled
 */
$.validator.addMethod(
	"checkPrizeDetailsCreate",
	function(value, element, regexp) {
		if ($("#prizeTitleIdName").val() == "") {
			return false
		} else return true
	}

);

var geocoder,map,markLat=0,markLong=0,viewportSouth=0,viewportNorth=0,curLatLang=0;

/**
 * onRendered of google map pop up call initialize google map
 */
Template.googleDetailsVenuefortour.onRendered(function() {
		Session.set("markLatSess",undefined);
		Session.set("markLongSess",undefined);
		Session.set("pacinputSess",undefined);
		Session.set("markLatSess",null);
		Session.set("markLongSess",null);
		Session.set("pacinputSess",null);
		
	//set global variable map and geocoder
	//var geocoder,map,markLat=0,markLong=0;
	geocoder = new google.maps.Geocoder();
	this.autorun(function () {	
		/*if google map is loaded
		*/
    	if (GoogleMaps.loaded()) {
    			//curLatLang = Geolocation.latLng()
    			var geocoder = new google.maps.Geocoder();
    		//initialize geocoder, to find address from lat and long, viceversa
    		if(tournLat==0&&tournLong==0){
			
			/*load geocomplete map for input box pac-input-view1-view1*/
      		$("#pac-input-view1").geocomplete({
  				map: '#map',
  				mapOptions: {
    				scrollwheel:true,//zoom on mouse scroll wheel
          			panControl: true,//zoom on + and - buttons
            		zoomControl: true,
  				},
  				markerOptions: {
    				draggable: false,//marker draggable
				},
  				location:$("#domainNameTour").find(":selected").text(),//set location
			});
      		$("#pac-input").val($("#domainNameTour").find(":selected").text());
      		//convert domain name to formatted address and set the input box value
      		//set markLat and markLong to zero
            geocoder.geocode({
      		 //address is taken from html #domainName
     		  'address': $("#domainNameTour").find(":selected").text()
     		}, function(response, status) {
      			$("#pac-input").val(response[0].formatted_address);
   				//markLat=0;
   				//markLong =0
     		});
        	}
        	else{
/*load geocomplete map for input box pac-input-view1-view1*/
      		$("#pac-input-view1").geocomplete({
  				map: '#map',
  				mapOptions: {
    				scrollwheel:true,//zoom on mouse scroll wheel
          			panControl: true,//zoom on + and - buttons
            		zoomControl: true,
  				},
  				markerOptions: {
    				draggable: false,//marker draggable
				},
  				location:new google.maps.LatLng(tournLat,tournLong),//set location
			});
      		$("#pac-input").val(tournAddress);
      		Session.set("markLatSess",tournLat);
   			Session.set("markLongSess",tournLong);
      		//convert domain name to formatted address and set the input box value
      		//set markLat and markLong to zero
        /*    geocoder.geocode({
      		 //address is taken from html #domainName
     		  'address': $("#domainNameTour").find(":selected").text()
     		}, function(response, status) {
      			$("#pac-input").val(response[0].formatted_address);
   				//markLat=0;
   				//markLong =0
     		});*/
        	}
            //on drag of marker
         	$("#pac-input-view1")
  			.geocomplete()
  			.bind("geocode:dragged", function(event, result){
  				//set mapbounds to view port of domain name
   				/*var MapBounds = new google.maps.LatLngBounds(
 					new google.maps.LatLng(viewportSouth.lat(),viewportSouth.lng()),
 					new google.maps.LatLng(viewportNorth.lat(),viewportNorth.lng()));*/
  				//check dragged marker position is within view port
  				/*if (MapBounds.contains(result)){*/
  					//set latLng to dragged marker position
          			geocoder.geocode({
       					'latLng': result 
     				}, function(response, status) {
     					//set formatted address to pac-input-view1 box value
      					$("#pac-input").val(response[0].formatted_address);
      					//split result on comma and remove brackets
   						var j  = result.toString().replace(/["'()]/g,"");
   						var k = j.split(",");
   						//set markLat and markLong
   						markLat = k[0];
   						markLong = k[1];
     				});
      			/*}
      			else{//if marker pos is out of view port set the marker to domain name
					$("#pac-input-view1").geocomplete("find",$("#domainName").find(":selected").text());
			    }*/
  			});
			
			//set viewport s and markLat, markLong as result of geocomplete
  			$("#pac-input-view1")
  			.geocomplete()
  			.bind("geocode:result", function(event, result){
   					markLat = result.geometry.location.lat();
   					markLong = result.geometry.location.lng();
   					Session.set("markLatSess1",markLat);
   					Session.set("markLongSess1",markLong);
   					Session.set("pacinputSess1",$("#pac-input").val())
    				viewportSouth = result.geometry.viewport.getSouthWest();
    				viewportNorth = result.geometry.viewport.getNorthEast();
 			});
 			  			$("#pac-input-view1")
  			.geocomplete()
  			.bind("geocode:error", function(event, result){
  			});
   		}
  	});
});

/**
 * template helpers which connects googleDetailsVenue.html(pop up on click of google map).
 * @methodName : mapOptions is a function to set map with given lattitude and longitude
 */
Template.googleDetailsVenuefortour.helpers({  
  mapOptions: function() {
	   /* if (GoogleMaps.loaded()) {
	    	//venue = Session.get("googleDomainName")
			var loc =  new google.maps.LatLng(22.0427983,-50.3580818);
	          geocoder = new google.maps.Geocoder();
	        	 return {
	            	mapTypeId: google.maps.MapTypeId.ROADMAP,
	            	center: new google.maps.LatLng(22.0427983,-50.3580818),
	            	zoom: 25,
	            	mapTypeId: google.maps.MapTypeId.ROADMAP,
	          	}
	    	}    //return map;
		}*/
	}

});

/**
 * on created of pop up template  googleDetailsVenue.html(pop up on click of google map image).
 */
Template.googleDetailsVenuefortour.onDestroyed(function() {  
		Session.set("markLatSess",undefined);
		Session.set("markLongSess",undefined);
		Session.set("pacinputSess",undefined);
		Session.set("markLatSess",null);
		Session.set("markLongSess",null);
		Session.set("pacinputSess",null);

});

Template.googleDetailsVenuefortour.events({
	/*
	 * onclick of ok button of google map popup window
	 * hide the popup googleDetailsVenue, save dragged google 
	 * lattiutde and longitude
	 */
	'click #googleVenueYes':function(e,template){
		e.preventDefault();
		venLat = markLat
		venLong = markLong;
		//Session.set("markLatSess",undefined);
		//Session.set("markLongSess",undefined);
	//	Session.set("pacinputSess",undefined);
	//	Session.set("markLatSess",null);
	//	Session.set("markLongSess",null);
	//	Session.set("pacinputSess",null);
		//Session.set("markLatSess",venLat);
	//	Session.set("markLongSess",venLong);
	//	Session.set("pacinputSess",$("#pac-input").val());
		$("#googleDetailsVenue").modal('hide');
	},

	/*
	 * onclick of cancel button of google map popup window
	 * hide the popup googleDetailsVenue
	 */
	'click #googleVenueCanceled':function(e, t){
		 e.preventDefault();
		 var cgeocoder = new google.maps.Geocoder();
		if(Session.get("pacinputSess")==null){
			$("#pac-input").val(tournAddress);
			Session.set("markLatSess",tournLat);
   			Session.set("markLongSess",tournLong);
		}
		 else $("#pac-input").val(Session.get("pacinputSess"));
		 //$("#pac-input-view1").geocomplete("find",Session.get("markLatSess")+","+Session.get("markLongSess"));
		 cgeocoder.geocode({
       		'latLng': new google.maps.LatLng(Session.get("markLatSess"),Session.get("markLongSess")) 
     	 }, function(response, status) {
     		//set formatted address to pac-input-view1 box value
      		//$("#pac-input").val(response[0].formatted_address);
      		//split result on comma and remove brackets
	     	$("#pac-input-view1").geocomplete("find",response[0].formatted_address);
     	});
		 $("#googleDetailsVenue").modal('hide');

	},
	/*'keyup #pac-input':function(event){
		// if (!e) e = window.event;
		//  var keyCode = e.keyCode || e.which;
		//  if (event.keyCode == 13) {
			$("#pac-input-view1").geocomplete("find",$("#pac-input").val());
        //}

		
	},*/
	'click #clearGooSe':function(){
		$("#pac-input-view1").geocomplete("find",$("#pac-input").val());
	/*	$("#pac-input").trigger("geocode");
		$("#pac-input").trigger("geocode");
		function success(position) {
		var gmap = $("#pac-input").geocomplete('map');
		gmap.setCenter(new google.maps.LatLng(position.coords.latitude,position.coords.longitude))
		var marker = new google.maps.Marker({
		  position: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
		  map: gmap,
		  draggable:true
		});
		$("#pac-input-view1").geocomplete({"location":"mysore"});

	}
	function error(err) {
    	alert(err.message);
  	};

	   if (navigator.geolocation) {
  	navigator.geolocation.getCurrentPosition(success, error)
  }*/
	},

	/*'click #clearGooSes':function(){
		if (GoogleMaps.loaded()) {

				geocoder = new google.maps.Geocoder();

		}
	}*/
})

