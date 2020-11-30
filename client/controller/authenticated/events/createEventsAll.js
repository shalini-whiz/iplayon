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
Template.createEventsAll.onCreated(function() {
	this.subscribe("tournamentEvents");
	this.subscribe("domains");
	this.subscribe("subDomain1");
	this.subscribe("subDomain2");
	this.subscribe("onlyLoggedIn");
	this.subscribe("eventUploads");

	this.prizeEventId = new ReactiveVar(0);
	//not used
	this.venueLatitude = new ReactiveVar(0);
	this.venueLongitude = new ReactiveVar(0);
});
Template.createEventsAll.onDestroyed(function(){
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
		Session.set("tournIdForEvAdd",null);
		Session.set("tournIdForEvAdd",undefined);
		Session.set("addEventArray",undefined);
		Session.set("addEventArray",null);
		Session.set("dateChanged1",null);
		Session.set("dateChanged1",undefined);
		Session.set("dateChanged0",null);
		Session.set("dateChanged0",undefined);
		Session.set("addedEventsProp",undefined);
		Session.set("addedEventsProp",null);
		Session.set("projectChange",null);
		Session.set("projectChange",undefined);
		Session.set("checkchangeaftercancel",undefined);
		Session.set("checkchangeaftercancel",null);
		Session.set("clickOKaddEvents",undefined);
		Session.set("clickOKaddEvents",null);
		Session.set("subscriptionTypeDirect",undefined)
		Session.set("subscriptionTypeHyper",undefined);
		Session.set("hyperLinkValue",undefined)
		Session.set("subscriptionTypeMail",undefined)
		Session.set("susbcriptionRest",undefined)
		Session.set("LdataToSaveFromDOB",undefined)
})
	var venLat = 0, venLong = 0, selectVenLat = 0, selectVenLong = 0;
	var timezoneIdEventLat=0 ,timezoneIdEventLng=0,clickOKaddEvents=0;
/**
 *  Onrendered  of template createEvents.html
 *  initialize css bootstrap datetimepicker,
 *  select2,nicescroll
 *
 */
Template.createEventsAll.onRendered(function() {

	/*
	 * initialize slim scroll for select main tags
	 * and select secondary tags
	 */
	$('#selectEventstoAdd').slimScroll({
		height: '8em',
		color: 'black',
		size: '3px',
		width: '100%'
	});
	$('#selectMainTag').niceScroll({
		cursorborderradius: '0px', // Scroll cursor radius
		background: '#E5E9E7', // The scrollbar rail color
		cursorwidth: '4px', // Scroll cursor width
		cursorcolor: '#999999' // Scroll cursor color
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
		width:285,
		selectOnClose: true
	});
 $(".select2-selection__rendered").removeAttr('title');

	

	$('#domainName').select2({
		width: "100%",
		selectOnClose: true
	})
	$(".select2-selection__rendered").removeAttr('title');
	$('b[role="presentation"]').hide();
	//$('.select2-selection__arrow').append('<i class="fa fa-angle-down"></i>');
	/*
	 * initialize bootstrap datetimepicker for #closureDate,#endDate and #startDate
	 */
	$('#closureDate').datetimepicker({
		toolbarPlacement: 'bottom',
		showClose: true,
		widgetPositioning: {
			vertical: 'bottom',
			horizontal: 'left',
		},
		useCurrent: false,
		format:"YYYY MMM DD",
		focusOnShow:false
		//defaultDate: new Date(),
		//minDate: new Date(new Date()),
		//disabledDates: [new Date(new Date()).add(-1, 'days').startOf('day')],
	});
	
	$('#startDate').datetimepicker({
		toolbarPlacement: 'bottom',
		showClose: true,
		widgetPositioning: {
			vertical: 'bottom',
			horizontal: 'left',
		},
		useCurrent: false,
		format:"YYYY MMM DD",
		focusOnShow:false
		//defaultDate: new Date(),
		//minDate: new Date(new Date())
		//disabledDates: [new Date(new Date()).add(-1, 'days').startOf('day')],
	});

	$('#endDate').datetimepicker({
		toolbarPlacement: 'bottom',
		showClose: true,
		widgetPositioning: {
			vertical: 'bottom',
			horizontal: 'left',
		},
		useCurrent: false,
		format:"YYYY MMM DD",
		focusOnShow:false
		//defaultDate: new Date(),
		//minDate: new Date(new Date())//.add(-1, 'days').startOf('day'),
		//disabledDates: [new Date(new Date()).add(-1, 'days').startOf('day')],
	});
	$("#closureDate").keypress(function(event) {event.preventDefault();});
	$("#startDate").keypress(function(event) {event.preventDefault();});
	$("#endDate").keypress(function(event) {event.preventDefault();});
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
	Session.set("susbcriptionRest",undefined)
	Session.set("LdataToSaveFromDOB",undefined)
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
Template.createEventsAll.helpers({
	lProjectName: function() {
		var lProjectNames = tournamentEvents.find().fetch();

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
Template.createEventsAll.events({
	/*"click #noOfSubscribersSPAN":function(e){
		e.preventDefault();
		$("#renderHowMAny").empty();
        Blaze.render(Template.noOfSubscribers, $("#renderHowMAny")[0]);
        $("#noOfSubscribers").modal({
            backdrop: 'static'
        });
	},*/
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
		try{
		if($("#projectName").valid()){
	        $('#startDate').datetimepicker().on('dp.show dp.update', function () {
	            $(".datepicker-years .picker-switch").removeAttr('title')
	                .css('cursor', 'default')
	                .css('background', 'inherit')
	                .on('click', function (e) {
	                    e.stopPropagation();
	                });
	        });
		    if($('#closureDate').val()==""){
	             $('#startDate').data("DateTimePicker").minDate(false);
	        }
	        else if($('#closureDate').val()!==""){
	             $('#startDate').data("DateTimePicker").minDate(new Date($('#closureDate').val()));
	        }
	        if($('#endDate').val()==""){
	             $('#startDate').data("DateTimePicker").maxDate(false);
	        }
	        else if($('#endDate').val()!==""){
	             $('#startDate').data("DateTimePicker").maxDate(new Date($('#endDate').val()));
	        }
	        if($('#closureDate').val()===$('#endDate').val()&&$('#closureDate').val()!=""&&$('#endDate').val()!=""){
	                $('#startDate').data("DateTimePicker").date(new Date($('#closureDate').val()))
	                if($("#startDate").val()!=="" && clickOKaddEvents==1){
		                $("#alreadySubscribed").modal({
		                        backdrop: 'static',keyboard: false
		                });
		                $("#alreadySubscribedText").text("This changes date of event list also");
		                addEveStartSet=0;
		                changeAddeveDate(1);
	            	}
	                		
							Session.set("dateChanged0",1)
							Session.set("addedEventsProp",undefined);
							Session.set("addedEventsProp",null);

	        }
	        $("#startDate").on("dp.change", function(e) {
	        	try{
	            if($("#startDate").val()!==""){
	                $("#closureDate").data("DateTimePicker").maxDate(new Date($("#startDate").val()));
	                $("#endDate").data("DateTimePicker").minDate(new Date($("#startDate").val()));
	                if($("#closureDate").val()==""){
                   		$("#closureDate").data("DateTimePicker").date(new Date($("#startDate").val()))
                    //$("#closureDate").val($("#startDate").val())
               		 }
	                changeAddeveDate(1);
	            }  
	            	
					Session.set("dateChanged0",1)
					Session.set("addedEventsProp",undefined);
					Session.set("addedEventsProp",null);
					if($("#startDate").val()!=="" && clickOKaddEvents==1){
						$("#startDate").on("dp.change", function(e) {
							if(e.date!=e.oldDate){
								$("#alreadySubscribed").modal({
					                        backdrop: 'static',keyboard: false
					            });
					            $("#alreadySubscribedText").text("This changes date of event list also");
					            addEveStartSet=0;
							}
						});
					}
				}catch(e){}
            });

		}else{
			$("#alreadySubscribed").modal({
                        backdrop: 'static',keyboard: false
            });
            $("#alreadySubscribedText").text("Please select sports");
		}
		}catch(e){}
	},

	'focus .datesParent2':function(e){
		e.preventDefault();

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
		try{
		if($("#projectName").valid()){
			$('#closureDate').datetimepicker().on('dp.show dp.update', function () {
	            $(".datepicker-years .picker-switch").removeAttr('title')
	                .css('cursor', 'default')
	                .css('background', 'inherit')
	                .on('click', function (e) {
	                    e.stopPropagation();
	                });
	        });
	        if($('#startDate').val()==""){
	            if($('#endDate').val()!=="")
	             $('#closureDate').data("DateTimePicker").maxDate(new Date($('#endDate').val()));
	         else
	            $('#closureDate').data("DateTimePicker").maxDate(false);
	        }
	        else if($('#endDate').val()==""){
	            if($('#startDate').val()!="")
	             $('#closureDate').data("DateTimePicker").maxDate(new Date($('#startDate').val()));
	            else
	             $('#closureDate').data("DateTimePicker").minDate(false);
	        }
	        $("#closureDate").on("dp.change", function(e) {
	        	try{
			         if($('#startDate').val()==""){
			            if($('#endDate').val()!=="")
			             $('#closureDate').data("DateTimePicker").maxDate(new Date($('#endDate').val()));
			         else
			            $('#closureDate').data("DateTimePicker").maxDate(false);
			        }
			        else if($('#endDate').val()==""){
			            if($('#startDate').val()!="")
			             $('#closureDate').data("DateTimePicker").maxDate(new Date($('#startDate').val()));
			            else
			             $('#closureDate').data("DateTimePicker").minDate(false);
			        }
	            	$("#startDate").data("DateTimePicker").minDate(new Date($("#closureDate").val()));
	            	$("#endDate").data("DateTimePicker").minDate(new Date($("#closureDate").val()));
	        	}catch(e){}

	        });
		}else{
			$("#alreadySubscribed").modal({
                        backdrop: 'static',keyboard: false
            });
            $("#alreadySubscribedText").text("Please select sports");
		}
		}catch(e){}

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
			try{
		if($("#projectName").valid()){
	        $('#endDate').datetimepicker().on('dp.show dp.update', function () {
	            $(".datepicker-years .picker-switch").removeAttr('title')
	                .css('cursor', 'default')
	                .css('background', 'inherit')
	                .on('click', function (e) {
	                    e.stopPropagation();
	                });
	        });

	        if($('#closureDate').val()==""){
	            if($('#startDate').val()!="")
	             $('#endDate').data("DateTimePicker").minDate(new Date($('#startDate').val()));
	            else
	             $('#endDate').data("DateTimePicker").minDate(false);
	        }
	        else if($('#startDate').val()==""){
	            if($('#closureDate').val()!="")
	             $('#endDate').data("DateTimePicker").minDate(new Date($('#closureDate').val()));
	            else
	             $('#endDate').data("DateTimePicker").minDate(false);
	        }
	        $("#endDate").on("dp.change", function(e) {
	        	try{
	        	if($("#endDate").val()!=="")
	            $("#startDate").data("DateTimePicker").maxDate(new Date($("#endDate").val()));
	            changeAddeveDate(2);
				Session.set("dateChanged1",1);
				Session.set("addedEventsProp",undefined);
				Session.set("addedEventsProp",null);

				if($("#endDate").val()!=="" && clickOKaddEvents==1){
					$("#endDate").on("dp.change", function(e) {
						if(e.date!=e.oldDate){
						$("#alreadySubscribed").modal({
			                        backdrop: 'static',keyboard: false
			            });
		            	$("#alreadySubscribedText").text("This changes date of event list also");
		           		endEveStartSet=0;
						}
	        		});
	        	}
	        	}catch(e){}
	        });

			}else{
				$("#alreadySubscribed").modal({
	                        backdrop: 'static',keyboard: false
	            });
	            $("#alreadySubscribedText").text("Please select sports");
			}
		}catch(e){}
		},

	'click #aYesButton': function(e) {
		e.preventDefault();
		$("#alreadySubscribed").modal('hide');
	},
	
	'click .games':function(e){
		e.preventDefault();
		if($('#projectName :selected').val()!==""){
			Session.set("projectChange",1)
			clickOKaddEvents=0
		}
	},
	/*
	 * onClick of star icon open select subDomain pop up
	 */
	'click #selectSubDomainsStar': function(e) {
		e.preventDefault();
		$("#selectSubDomainsPopUp").modal({
			backdrop: 'static',keyboard: false //this disallow background pointer events
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
			backdrop: 'static',keyboard: false //this disallow background pointer events
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
			backdrop: 'static',keyboard: false
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
		//$('#sponsorLogo').valid();
		//$('#sponsorPdf').valid();
		//$('#sponsorMailId').valid();
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
		Session.set("sponsorLogoDisp", null);
		Session.set("sponsorLogoDisp", undefined);
		Router.go("/createEvents98");
		/*if (Session.get("previousLocationPath") !== undefined) {
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

	"click #clearClosureDate":function(e){
		e.preventDefault();
		try{
		$("#closureDate").val("");
		$("#closureDate").data("DateTimePicker").date(null);
		}catch(e){}

	},
	"click #clearStartDate":function(e){
		e.preventDefault();
		try{
		$("#startDate").val("");
		$("#startDate").data("DateTimePicker").date(null);
		}catch(e){}
	},
	"click #clearEndDate":function(e){
		e.preventDefault();
		try{
		$("#endDate").val("");
		$("#endDate").data("DateTimePicker").date(null);
		}catch(e){}
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
		$(".select2-selection__rendered").removeAttr('title');
		try{
		if (!$("#projectName").valid()) {
			$('#projectName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
		} else {
			clickOKaddEvents=0
			Session.set("tournIdForEvAdd",$('#projectName :selected').val())
			//var instance = UI.renderWithData(Template.addEventsPopup, { });
          //  UI.insert(instance, $("#content1")[0]);
			$('#projectName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', '#fff');
		}
	}catch(e){}
	},

	/*
	 * onChange of domain name
	 * check if its valid change color to white, and add instance of
	 * template googleDetailsVenue
	 * else change to red
	 */
	"change #domainName": function(e) {
		e.preventDefault();
		$(".select2-selection__rendered").removeAttr('title');
		if (!$("#domainName").valid()) {
			$('#domainName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
		} else {
			$('#domainName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', '#fff');
			$('#googlePopup').css("cursor","pointer");
			$("#content").empty();
			var dgeocoder = new google.maps.Geocoder();
			var setTimeZoneLatLong=0;
			
			 dgeocoder.geocode({
       			'address': $("#domainName").find(":selected").text()
     		 }, function(results, status) {
	     		//setTimeZoneLatLong = results[0].geometry.location.lat()+","+results[0].geometry.location.lng()
				/*var url = 'https://maps.googleapis.com/maps/api/timezone/json?location='+setTimeZoneLatLong;
				$.get("https://maps.googleapis.com/maps/api/timezone/json?location="+setTimeZoneLatLong+"&timestamp=1331766000", function(data, status){
					timezoneIdEvent = data.timeZoneId;
            		$.get("http://api.timezonedb.com/?lat="+results[0].geometry.location.lat()+"&lng="+results[0].geometry.location.lng()+"&format=json&key=MR22FNA90DU3", function(data1, status){
            			var d = new Date.utc(data1.timestamp*1000);
            		})
        		});
        		//http://api.timezonedb.com/?zone=America/Toronto&format=json&key=MR22FNA90DU3
        		//http://api.timezonedb.com/?lat=53.7833&lng=-1.75&key=MR22FNA90DU3*/
        		timezoneIdEventLat = results[0].geometry.location.lat();
        		timezoneIdEventLng = results[0].geometry.location.lng();

     		});

			//var instance = UI.renderWithData(Template.googleDetailsVenue, { });//depricated
           // UI.insert(instance, $("#content")[0]);
            Blaze.render(Template.googleDetailsVenue, $("#content")[0]);

		}
	},

	/*
	 * onclick of google map image 
	 * check if domain name is valid, open popup of google map 
	 */
	'click #googlePopup':function(e){
		e.preventDefault();
		if($("#domainName").valid())
		{				
			//this disallow background pointer events
			$("#googleDetailsVenue").modal({
				backdrop: 'static',keyboard: false
			})
		}
	},

	'click #addEventsForTourn':function(e){
		e.preventDefault();
		
		if($("#projectName").val()!==""&&$("#startDate").val()!==""&&$("#endDate").val()!==""&&$("#closureDate").val()!==""){
			$('#addEvB').css('color',"white");
			var eveArr = Session.get("addEventArray");
			if(Session.get("projectChange")==1){
				changeAddeveDate(1);
				changeAddeveDate(2);
				$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]').each(function(){
					$("#" + $(this).attr("id")).prop('checked', true);
				});
				Session.set("projectChange",null);
				Session.set("projectChange",undefined);
			}
		/*	if(eveArr===undefined||eveArr==null){
			$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]').each(function(){
					$("#" + $(this).attr("id")).prop('checked', false);

					$(this).next().next().next().children().val("");//start
					$(this).next().next().next().next().children().val("");//end

					$(this).next().next().next().next().next().prop('disabled', false);
	
					$("#" + $(this).attr("id")).prop('checked', true);
					$(this).next().next().next().next().next().prop('disabled', false);
					$(this).next().next().next().children().remove();//start
					$(this).next().next().next().next().children().remove();//end
					var divId = $(this).next().next().next().attr("id");
					$(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
					$(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
					$(this).next().next().next().children().val($("#startDate").val());
					$(this).next().next().next().next().children().val($("#endDate").val());
					});
				}
			else if(eveArr!==undefined||eveArr!==null){
				$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
					$("#" + $(this).attr("id")).prop('checked', false);

					$(this).next().next().next().children().val("");//start
					$(this).next().next().next().next().children().val("");//end

					$(this).next().next().next().next().next().prop('disabled', false);
	
					$("#" + $(this).attr("id")).prop('checked', true);
					$(this).next().next().next().next().next().prop('disabled', false);
					$(this).next().next().next().children().remove();//start
					$(this).next().next().next().next().children().remove();//end
					var divId = $(this).next().next().next().attr("id");
					$(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
					$(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
					$(this).next().next().next().children().val($("#startDate").val());
					$(this).next().next().next().next().children().val($("#endDate").val());
					});
				$('.eventAddTourCheckBoxDiv').find('input:checkbox:not(:checked)').each(function(){
					$("#" + $(this).attr("id")).prop('checked', false);

					$(this).next().next().next().children().val("");//start
					$(this).next().next().next().next().children().val("");//end

					$(this).next().next().next().next().next().prop('disabled', false);
	
					$("#" + $(this).attr("id")).prop('checked', true);
					$(this).next().next().next().next().next().prop('disabled', false);
					$(this).next().next().next().children().remove();//start
					$(this).next().next().next().next().children().remove();//end
					var divId = $(this).next().next().next().attr("id");
					$(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
					$(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
					$(this).next().next().next().children().val($("#startDate").val());
					$(this).next().next().next().next().children().val($("#endDate").val());
					$("#" + $(this).attr("id")).prop('checked', false);
					});

			}*/
			$("#addEventsPopup").modal({
					backdrop: 'static',keyboard: false
			})
		}
	},
	"click #savebyewalkover":function(e){
		e.preventDefault()
		if($('#application-mailOrHyperLinkOnSubscribe').valid()){
			$("#httpSettingsPopupError").html("")
			$('#mailOrHyperLinkOnSubscribe').modal('hide');
			//Session.set("SubscribeWithPlayersAFFId",0)
			var checked1 = $("#setAnysetDirect").prop("checked");
			var checked2 = $("#setAnysetHyper").prop("checked")
			var checked3 = $("#setAnysetmail").prop("checked")
			//var checked4 = $("#setSubscribeWithPlayersAFFId").prop("checked")
			if(checked1){
				Session.set("subscriptionTypeDirect",1);
				Session.set("subscriptionTypeHyper",0);
				Session.set("hyperLinkValue",0)
				Session.set("subscriptionTypeMail",0);
				Session.set("subscriptionTypeMailValue",0)
			}
			if(checked2){
				Session.set("subscriptionTypeHyper",1);
				Session.set("hyperLinkValue",$("#Httpcheck").val());
				Session.set("subscriptionTypeDirect",0);
				Session.set("subscriptionTypeMail",0);
				Session.set("subscriptionTypeMailValue",0)
			}
			if(checked3){
				Session.set("subscriptionTypeMail",1);
				Session.set("hyperLinkValue",0);
				Session.set("subscriptionTypeHyper",0)
				Session.set("subscriptionTypeDirect",0);
				Session.set("subscriptionTypeMailValue",Meteor.user().emails[0].address)
			}
			if(checked1&&checked2){
				Session.set("subscriptionTypeHyper",1);
				Session.set("hyperLinkValue",$("#Httpcheck").val());
				Session.set("subscriptionTypeDirect",1);
				Session.set("subscriptionTypeMail",0);
				Session.set("subscriptionTypeMailValue",0)
			}
			if(checked1&&checked3){
				Session.set("subscriptionTypeHyper",0);
				Session.set("hyperLinkValue",0);
				Session.set("subscriptionTypeDirect",1);
				Session.set("subscriptionTypeMail",1);
				Session.set("subscriptionTypeMailValue",Meteor.user().emails[0].address)
			}
			if(checked2&&checked3){
				Session.set("subscriptionTypeHyper",1);
				Session.set("hyperLinkValue",$("#Httpcheck").val());
				Session.set("subscriptionTypeDirect",0);
				Session.set("subscriptionTypeMail",1);
				Session.set("subscriptionTypeMailValue",Meteor.user().emails[0].address)
			}
			if(checked1&&checked2&&checked3){
				Session.set("subscriptionTypeHyper",1);
				Session.set("hyperLinkValue",$("#Httpcheck").val());
				Session.set("subscriptionTypeDirect",1);
				Session.set("subscriptionTypeMail",1);
				Session.set("subscriptionTypeMailValue",Meteor.user().emails[0].address)
			}
			/*if(checked4){
				Session.set("SubscribeWithPlayersAFFId",1)
			}*/
			createEvent(e);
		}
	},
	"click #backSubRest":function(e){
		e.preventDefault();
		$('#mailOrHyperLinkOnSubscribe').modal('hide');
		$('#subscriptionDOB_createEvents').modal({
			backdrop: 'static',keyboard: false
		})
	},
	"click #cancelbyewalkover":function(e){
		e.preventDefault();
		$("#httpSettingsPopupError").html("");
		$("#Httpcheck").val("")
		$('#mailOrHyperLinkOnSubscribe').modal('hide');
		$('#subscriptionDOB_createEvents').modal({
			backdrop: 'static',keyboard: false
		})
		//Session.set("LdataToSaveFromDOB",undefined);
		//$("#dobFilterRender").empty();
		var checked1 = $("#setAnysetDirect").prop("checked",false);
		var checked2 = $("#setAnysetHyper").prop("checked",false)
		var checked3 = $("#setAnysetmail").prop("checked",false)
		//var checked4 = $("#setSubscribeWithPlayersAFFId").prop("checked",false)
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
	var subsRest = Session.get("susbcriptionRest");
	var dobRest = Session.get("LdataToSaveFromDOB");
	var tweetAutoChecked = $("#checkAcceptboxTweett").prop("checked")

	$("#savingDataPopupNew").modal({
        backdrop: 'static',
        keyboard: false
    });
	$("#alreadySubscribedText_NEW").html("Saving Details..")

	Meteor.call('insertEvents', xData,subsRest,dobRest,
		function(error, response) {
			if (response) {

				Meteor.call('testOnLogin')
				Meteor.call('tournamentCreateAutoTweet',tweetAutoChecked,xData,function(e,res){
					if(e){
					}
				})
				if (Session.get("previousLocationPath") !== undefined) {
					var previousPath = Session.get("previousLocationPath");
					Session.set("previousLocationPath", undefined);
					Session.set("previousLocationPath", null);
					
					$("#savingDataPopupNew").modal('hide')
					$(".modal-backdrop").remove();

					Router.go(previousPath);
				} else {
					$("#savingDataPopupNew").modal('hide')
					$(".modal-backdrop").remove();
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

	var paymentEntry = "no"
	if($("#radioButtonNone").is(":checked") == true){
		paymentEntry = "no"
	}
	else if($("#radioButtonOptional").is(":checked") == true){
		paymentEntry = "optional"
	}
	else if($("#radioButtonMandatory").is(":checked") == true){
		paymentEntry = "yes"
	}

		/*$.get("https://maps.googleapis.com/maps/api/timezone/json?location=37.77492950,-122.41941550&timestamp=1331161200", function(data, status){
        });*/
	var tournamentEvent=false;
	if(Router.current().params._PostId==1){
		tournamentEvent=true;
	}
	else{
		tournamentEvent=false;
	}
	var cancLat = 0;
	var cancLng = 0;
	var cacPacNa = "";
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
		var lDomainName = $('#domainName').children(":selected").attr("id");
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
		lDomainId.push($('#domainName :selected').val().toString());
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
	{ "_id" : "ZgQ4zvCAmbWCdd7gm", "paymentEntry" : "yes" }
{ "_id" : "EoHdkXeWawEYhCcLM", "paymentEntry" : "no" }
{ "_id" : "oymdF5MNwXzMNHn29", "paymentEntry" : "optional" }*/

						/*
						 * set all the values as object
						 */
						var lData = {
							eventName: lEventName.charAt(0).toUpperCase() + lEventName.slice(1),
							projectId: lProjectId,
							eventStartDate: lEventStartDate,
							eventEndDate: lEventEndDate,
							eventSubscriptionLastDate: lEventSubscriptionLastDate,
							domainId: lDomainId,
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
							domainName: lDomainName,
							venueLatitude: cancLat,
							venueLongitude: cancLng,
							venueAddress:cacPacNa,
							timezoneIdEventLat:timezoneIdEventLat,
							timezoneIdEventLng:timezoneIdEventLng,
							tournamentEvent:tournamentEvent,
							subEvents:Session.get("addEventArray"),
							subscriptionTypeDirect:Session.get("subscriptionTypeDirect"),
							subscriptionTypeHyper:Session.get("subscriptionTypeHyper"),
							hyperLinkValue:Session.get("hyperLinkValue"),
							subscriptionTypeMail:Session.get("subscriptionTypeMail"),
							subscriptionTypeMailValue:Session.get("subscriptionTypeMailValue"),
							paymentEntry:paymentEntry
							//subscriptionWithAffId:Session.get("SubscribeWithPlayersAFFId")
						};
						if(Session.get("schoolTypeSelected")){
							lData["schoolType"] = Session.get("schoolTypeSelected")
						}
						/*
						 * then call insetEvents function
						 */
						insertEvents(lData);
					});
				});
			});
		});
	}
var  changeAddeveDate = function(idofDate){
	var eveArr = Session.get("addEventArray");
			if(eveArr===undefined||eveArr==null){
			$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]').each(function(){
					//if(idofDate)
					$("#" + $(this).attr("id")).prop('checked', false);

					$(this).next().next().next().children().val("");//start
					$(this).next().next().next().next().children().val("");//end

					$(this).next().next().next().next().next().prop('disabled', false);
	
					//$("#" + $(this).attr("id")).prop('checked', true);
					$(this).next().next().next().next().next().prop('disabled', false);
					$(this).next().next().next().children().remove();//start
					$(this).next().next().next().next().children().remove();//end
					var divId = $(this).next().next().next().attr("id");
					$(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
					$(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
					$(this).next().next().next().children().val($("#startDate").val());
					$(this).next().next().next().next().children().val($("#endDate").val());
					});
				}
			else if(eveArr!==undefined||eveArr!==null){
				$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
					if(idofDate==1){
						$(this).next().next().next().children().val("");//start
						$(this).next().next().next().children().remove();//start
						var divId = $(this).next().next().next().attr("id");
						$(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
						$(this).next().next().next().children().val($("#startDate").val());
						var endDateValue = moment(new Date($(this).next().next().next().next().children().val())).format("YYYY-MM-DD");
						if(endDateValue<moment(new Date($("#startDate").val())).format("YYYY-MM-DD")){
                            $(this).next().next().next().next().children().val($("#startDate").val())
                        }
                        if($("#startDate").val()==""){
                        }

					}
					else if(idofDate==2){
						$(this).next().next().next().next().children().val("");//end
						$(this).next().next().next().next().children().remove();//end
						var divId = $(this).next().next().next().attr("id");
						$(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
						$(this).next().next().next().next().children().val($("#endDate").val());
					}
					$("#" + $(this).attr("id")).prop('checked', false);

					//$(this).next().next().next().children().val("");//start
					//$(this).next().next().next().next().children().val("");//end

					$(this).next().next().next().next().next().prop('disabled', false);
	
					$("#" + $(this).attr("id")).prop('checked', true);
					$(this).next().next().next().next().next().prop('disabled', false);
					//$(this).next().next().next().children().remove();//start
					//$(this).next().next().next().next().children().remove();//end
					//var divId = $(this).next().next().next().attr("id");
					//$(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
					//$(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
					//$(this).next().next().next().children().val($("#startDate").val());
					//$(this).next().next().next().next().children().val($("#endDate").val());
					});
				$('.eventAddTourCheckBoxDiv').find('input:checkbox:not(:checked)').each(function(){
					$("#" + $(this).attr("id")).prop('checked', false);
					if(idofDate==1){
						$(this).next().next().next().children().val("");//start
						$(this).next().next().next().children().remove();//start
						var divId = $(this).next().next().next().attr("id");
						$(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
						$(this).next().next().next().children().val($("#startDate").val());

					}
					else if(idofDate==2){
						$(this).next().next().next().next().children().val("");//end
						$(this).next().next().next().next().children().remove();//end
						var divId = $(this).next().next().next().attr("id");
						$(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
						$(this).next().next().next().next().children().val($("#endDate").val());
					}
					//$(this).next().next().next().children().val("");//start
					//$(this).next().next().next().next().children().val("");//end

					$(this).next().next().next().next().next().prop('disabled', false);
	
					$("#" + $(this).attr("id")).prop('checked', true);
					$(this).next().next().next().next().next().prop('disabled', false);
					//$(this).next().next().next().children().remove();//start
					//$(this).next().next().next().next().children().remove();//end
					//var divId = $(this).next().next().next().attr("id");
					//$(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
					//$(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
					//$(this).next().next().next().children().val($("#startDate").val());
					//$(this).next().next().next().next().children().val($("#endDate").val());
					$("#" + $(this).attr("id")).prop('checked', false);
					});
					

			}
			setSessAddAgain();
}
var setSessAddAgain = function(){
	var addEvent = [];
		$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
			var data={
				"eventId":$(this).attr("id"),
				"projectType":$(this).next().children().attr("id"),
				"eventName":$(this).next().children().text(),
				"eventStartDate":$(this).next().next().next().children().val(),
				"eventEndDate":$(this).next().next().next().next().children().val(),
				"prize":$(this).next().next().next().next().next().children().val()
			}
			addEvent.push(data);
		});
		Session.set("addEventArray",addEvent);
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

	/*
	{ "_id" : "ZgQ4zvCAmbWCdd7gm", "paymentEntry" : "yes" }
{ "_id" : "EoHdkXeWawEYhCcLM", "paymentEntry" : "no" }
{ "_id" : "oymdF5MNwXzMNHn29", "paymentEntry" : "optional" }*/
	var s = $('#eventCreation').validate({

		rules: {
			eventName: {
				required: true,
				minlength:2,
				maxlength: 100,
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
			domainName: {
				required: true
			},
			addEventProvideDetails:{
				fillallchecked2: true,
				
			},
			checkAcceptbox:{
				acceptTermscond:true
			},
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
				minlength: "The Event name should contain atleast 2 characters",
				maxlength: "The Event name should be within 100 characters",
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
			domainName: {
				required: "Please select the venue",
			},
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
				validText2: "Events description is not valid",

			},
			sponsor: {
				/*sponsorFiles: "Please upload  all the sponsor details",*/
				sponsorPdfSize: "Sponsor Pdf size should be less than 1MB",
				sponsorLogoSize: "Sponsor logo size should be less than 4kb"
			},
			addEventProvideDetails:{
				fillallchecked2: "Please add events"
			},
			checkAcceptbox:{
				acceptTermscond:"Please accept terms & conditions"
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
				backdrop: 'static',keyboard: false
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
					$('#domainName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
				}
				if (q.name === 'prize') {
					$('#prizeUpload').css('color', 'red');
				}
				if(q.name === "addEventProvideDetails"){
					$('#addEvB').css('color',"red");
				}
			}

		},
		submitHandler: function(event) {

			var totalAmt = 0; 
			_.each(Session.get("addEventArray"), function(e) { totalAmt = parseInt(totalAmt + parseInt(e.prize)) });
			
			var paymentEntry = "no"
			if($("#radioButtonNone").is(":checked") == true){
				paymentEntry = "no"
			}
			else if($("#radioButtonOptional").is(":checked") == true){
				paymentEntry = "optional"
			}
			else if($("#radioButtonMandatory").is(":checked") == true){
				paymentEntry = "yes"
			}

			if(totalAmt == 0){
				if(paymentEntry != "no"){
					alert("Payment type should be none, as all categories prize is zero")
					return false
				}
			}


			//on success of validation call create event function
			if(Session.get("subscriptionTypeDirect")==undefined&&
				Session.set("subscriptionTypeHyper")==undefined&&
				Session.set("subscriptionTypeMail")==undefined){
				if(Meteor.user().role=="Association"||Meteor.user().role=="Academy"||Meteor.user().role=="Organiser"){
					$('#whoConSubscribe').modal({
				 		backdrop: 'static',keyboard: false
					})
				}
				else{
					Blaze.render(Template.subscriptionDOB_createEvents, $("#dobFilterRender")[0]);
					$("#subscriptionDOB_createEvents").modal({
						backdrop: 'static',
						keyboard:false
					});
				}
			}
			else{
				if(Meteor.user().role=="Association"||Meteor.user().role=="Academy"||Meteor.user().role=="Organiser"){
					$('#whoConSubscribe').modal({
				 		backdrop: 'static',keyboard: false
					})
				}
				else{
					Blaze.render(Template.subscriptionDOB_createEvents, $("#dobFilterRender")[0]);
					$("#subscriptionDOB_createEvents").modal({
						backdrop: 'static',
						keyboard:false
					});
				}
				//createEvent(event);
			}
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
	"acceptTermscond",
	function(value, element, regexp) {
		var s  = $("#checkAcceptbox").prop("checked")
		if(s==false){
			return false;
		}
		else return true;
	}

);

$.validator.addMethod(
	"checkadded",
	function(value, element, regexp) {
		var check = Session.get("addedEventsProp");
		if(check!=1){
			return false
		}
		else{
			return true
		}
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
	try{
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
				/*required: true**/
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
	}catch(e){}
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
Template.googleDetailsVenue.onRendered(function() {
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
    			
    		//initialize geocoder, to find address from lat and long, viceversa
			var geocoder = new google.maps.Geocoder();
			/*load geocomplete map for input box pac-input-view1-view1*/
      		$("#pac-input-view1").geocomplete({
  				map: '#map',
  				mapOptions: {
    				scrollwheel:true,//zoom on mouse scroll wheel
          			panControl: true,//zoom on + and - buttons
            		zoomControl: true,
  				},
  				markerOptions: {
    				draggable: true,//marker draggable
				},
  				location:$("#domainName").find(":selected").text(),//set location
			});
      		$("#pac-input").val($("#domainName").find(":selected").text());
      		//convert domain name to formatted address and set the input box value
      		//set markLat and markLong to zero
            geocoder.geocode({
      		 //address is taken from html #domainName
     		  'address': $("#domainName").find(":selected").text()
     		}, function(response, status) {
     			try{
      				$("#pac-input").val(response[0].formatted_address);
      			}catch(e){}
   				//markLat=0;
   				//markLong =0
     		});

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
     					try{
      						$("#pac-input").val(response[0].formatted_address);
      					}catch(e){}
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
Template.googleDetailsVenue.helpers({  
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
Template.googleDetailsVenue.onDestroyed(function() {  
		Session.set("markLatSess",undefined);
		Session.set("markLongSess",undefined);
		Session.set("pacinputSess",undefined);
		Session.set("markLatSess",null);
		Session.set("markLongSess",null);
		Session.set("pacinputSess",null);
		Session.set("addEventArray",null);
		Session.set("addEventArray",undefined);
});

Template.googleDetailsVenue.events({
	/*
	 * onclick of ok button of google map popup window
	 * hide the popup googleDetailsVenue, save dragged google 
	 * lattiutde and longitude
	 */
	'click #googleVenueYes':function(e,template){
		e.preventDefault();
		venLat = markLat
		venLong = markLong;
		Session.set("markLatSess",undefined);
		Session.set("markLongSess",undefined);
		Session.set("pacinputSess",undefined);
		Session.set("markLatSess",null);
		Session.set("markLongSess",null);
		Session.set("pacinputSess",null);
		Session.set("markLatSess",venLat);
		Session.set("markLongSess",venLong);
		Session.set("pacinputSess",$("#pac-input").val());
		$("#googleDetailsVenue").modal('hide');
	},

	/*
	 * onclick of cancel button of google map popup window
	 * hide the popup googleDetailsVenue
	 */
	'click #googleVenueCanceled':function(e, t){
		 e.preventDefault();
		 var cgeocoder = new google.maps.Geocoder();
		 $("#pac-input").val(Session.get("pacinputSess"));
		 //$("#pac-input-view1").geocomplete("find",Session.get("markLatSess")+","+Session.get("markLongSess"));
		 cgeocoder.geocode({
       		'latLng': new google.maps.LatLng(Session.get("markLatSess"),Session.get("markLongSess")) 
     	 }, function(response, status) {
     		//set formatted address to pac-input-view1 box value
      		//$("#pac-input").val(response[0].formatted_address);
      		//split result on comma and remove brackets
      		try{
	     		$("#pac-input-view1").geocomplete("find",response[0].formatted_address);
	     	}catch(e){}
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

Template.addEventsPopup.onCreated(function(){
	this.subscribe("tournamentEvents");
});

Template.addEventsPopup.onRendered(function(){
	addEveStartSet=0, endEveStartSet=0;
$("#addEventsPopup").on('show.bs.modal', function() {
	$('#selectEventstoAdd').slimScroll({
		height: '16em',
		color: 'black',
		size: '3px',
		width: '100%'
	});


});
   //$('.datepicker').pickadate();

	$('#selectEventstoAdd').slimScroll({
		height: '16em',
		color: 'black',
		size: '3px',
		width: '100%'
	});

	//eventsAddValidatePop();
	
});
var addEveStartSet=0, endEveStartSet=0;
Template.addEventsPopup.events({
	'click #closeAddEve':function(e){
		e.preventDefault()
		$("#addEventsPopup").modal('hide');
	},

	'focus #startDateAddEve':function(e){
		e.preventDefault();
		var check = $(e.target).parent().prev().prev().prev().prop("checked")
		if(check==undefined){
			check= $(e.target).parent().prev().prev().prev().prev().prop("checked")
		}
		if(check){
			Session.set("dateChanged1",0)
			Session.set("dateChanged0",0)
			Session.set("validchange2",1);
			$(e.target).css("cursor","pointer")
			var startDateValue = moment(new Date($(e.target).val())).format("YYYY-MM-DD");
			var endDateValue = moment(new Date($(e.target).parent().next().children().val())).format("YYYY-MM-DD");
			var sy = moment.utc(new Date(startDateValue)).format("YYYY");
			var sm  =moment.utc(new Date(startDateValue)).format("M");
			var sd = moment.utc(new Date(startDateValue)).format("D");
			var ey = moment.utc(new Date(endDateValue)).format("YYYY");
			var em = moment.utc(new Date(endDateValue)).format("M");
			var ed = moment.utc(new Date(endDateValue)).format("D");
			var em1=parseInt(em)-1
			var sm1=parseInt(sm)-1
			var ed1 = parseInt(ed)-1
			var sd1 = parseInt(sd)-1
			var input2 = $(e.target).pickadate({
				format:'yyyy mmm dd',
				selectYears: true,
				selectMonths: true,
				clear:'',
				min:[parseInt(sy),parseInt(sm1),parseInt(sd)],
				max:[parseInt(ey),parseInt(em1),parseInt(ed)],
				onSet: function(context) {
    				addEveStartSet = new Date(context.select);
    				endD = moment(new Date($(e.target).parent().next().children().val())).format("YYYY-MM-DD");
    				startD =  moment(new Date(addEveStartSet)).format("YYYY-MM-DD");
    				if(moment.utc(new Date(endD))<moment.utc(new Date(startD))){
    					$(e.target).parent().next().children().val(moment(new Date(startD)).format("YYYY MMM DD"))
    				}
    				endEveStartSet = 0;
  				},
  				onClose: function() {
  						if(addEveStartSet==0||isNaN(new Date(addEveStartSet).getTime())){
  							addEveStartSet=$(e.target).val()
  						}
  				}
			});
			var picker2 = input2.pickadate('picker');
			if(endEveStartSet!==0){
				var startDateValue = moment(new Date(endEveStartSet)).format("YYYY-MM-DD");
				var endDateValue = moment(new Date($("#startDate").val())).format("YYYY-MM-DD");
				var csy = moment.utc(new Date(startDateValue)).format("YYYY");
				var csm  =moment.utc(new Date(startDateValue)).format("M");
				var csd = moment.utc(new Date(startDateValue)).format("D");
				var cey = moment.utc(new Date(endDateValue)).format("YYYY");
				var cem = moment.utc(new Date(endDateValue)).format("M");
				var ced = moment.utc(new Date(endDateValue)).format("D");
				var cem1 = parseInt(cem)-1
				var csm1=parseInt(csm)-1;
				picker2.set('max',[parseInt(csy),parseInt(csm1),parseInt(csd)])
			}
			else if(endEveStartSet==0){
				var endDateValue = moment(new Date($(e.target).parent().next().children().val())).format("YYYY-MM-DD");
				var ey = moment.utc(new Date(endDateValue)).format("YYYY");
				var em = moment.utc(new Date(endDateValue)).format("M");
				var ed = moment.utc(new Date(endDateValue)).format("D");
				var em1=parseInt(em)-1
				var sm1=parseInt(sm)-1
				var ed1 = parseInt(ed)-1
				var sd1 = parseInt(sd)-1
				picker2.set('max',[parseInt(ey),parseInt(em1),parseInt(ed)])

			}
		}

	},
	'focus #startEndAddEve':function(e){
		e.preventDefault();
		var check = $(e.target).parent().prev().prev().prev().prop("checked")

		if(check==undefined){
			check= $(e.target).parent().prev().prev().prev().prev().prop("checked")
		}
		if(check){
			Session.set("validchange1",1);
			Session.set("dateChanged1",0)
			Session.set("dateChanged0",0)
			$(e.target).css("cursor","pointer")
			var startDateValue = moment(new Date($(e.target).parent().prev().children().val())).format("YYYY-MM-DD");
			var endDateValue = moment(new Date($(e.target).val())).format("YYYY-MM-DD");
			var sy = moment.utc(new Date(startDateValue)).format("YYYY");
			var sm  =moment.utc(new Date(startDateValue)).format("M");
			var sd = moment.utc(new Date(startDateValue)).format("D");
			var ey = moment.utc(new Date(endDateValue)).format("YYYY");
			var em = moment.utc(new Date(endDateValue)).format("M");
			var ed = moment.utc(new Date(endDateValue)).format("D");
			var em1=parseInt(em)-1
			var sm1=parseInt(sm)-1
			var ed1 = parseInt(ed)-1
			var sd1 = parseInt(sd1)-1
			var input = $(e.target).pickadate({
					format:'yyyy mmm dd',
					selectYears: true,
					selectMonths: true,
					clear:'',
					min:[parseInt(sy),parseInt(sm1),parseInt(sd)],
					max:[parseInt(ey),parseInt(em1),parseInt(ed)],
					onSet: function(context) {
    				 addEveStartSet = 0;
    				 endEveStartSet = new Date(context.select);
  					},
  					onClose: function() {
  						if(endEveStartSet==0||isNaN(new Date(endEveStartSet).getTime())){
  							endEveStartSet=$(e.target).val()
  						}
  					}
				});
			var picker = input.pickadate('picker');
			if(addEveStartSet!==0){
				var startDateValue = moment(new Date(addEveStartSet)).format("YYYY-MM-DD");
				var endDateValue = moment(new Date($("#endDate").val())).format("YYYY-MM-DD");
				var csy = moment.utc(new Date(startDateValue)).format("YYYY");
				var csm  =moment.utc(new Date(startDateValue)).format("M");
				var csd = moment.utc(new Date(startDateValue)).format("D");
				var cey = moment.utc(new Date(endDateValue)).format("YYYY");
				var cem = moment.utc(new Date(endDateValue)).format("M");
				var ced = moment.utc(new Date(endDateValue)).format("D");
				var cem1 = parseInt(cem)-1
				var csm1=parseInt(csm)-1;
				picker.set('min',[parseInt(csy),parseInt(csm1),parseInt(csd)])

			}
			else if(addEveStartSet==0){
					var startDateValue = moment(new Date($(e.target).parent().prev().children().val())).format("YYYY-MM-DD");
					var endDateValue = moment(new Date($(e.target).val())).format("YYYY-MM-DD");
					var sy = moment.utc(new Date(startDateValue)).format("YYYY");
					var sm  =moment.utc(new Date(startDateValue)).format("M");
					var sd = moment.utc(new Date(startDateValue)).format("D");
					var ey = moment.utc(new Date(endDateValue)).format("YYYY");
					var em = moment.utc(new Date(endDateValue)).format("M");
					var ed = moment.utc(new Date(endDateValue)).format("D");
					var em1=parseInt(em)-1
					var sm1=parseInt(sm)-1
					var ed1 = parseInt(ed)-1
					var sd1 = parseInt(sd1)-1
					picker.set('min',[parseInt(sy),parseInt(sm1),parseInt(sd)])

				/*var Ppicker = $(e.target).pickadate({
					format:'yyyy mmm dd',
					selectYears: true,
					selectMonths: true,
					clear:'',
					min:[parseInt(sy),parseInt(sm1),parseInt(sd)],
					max:[parseInt(ey),parseInt(em1),parseInt(ed)]
				});*/
			}
			//picker.set('max', new Date($("#endDate").val()));

			//picker.set('min', [sy,sm,sd]);
			//picker.set('max',new Date(j));

		}

	},
	//set datepicker only if check box is checked
	'change .checkboxevents':function(e){
		e.preventDefault()
		try{
		$("#eveDomProvideDetails").val("")
		Session.set("dateChanged1",0)
		Session.set("dateChanged0",0)
		Session.set("checkchangeaftercancel",1);
		Session.set("validchange",1);
		if($(e.target).prop('checked')==true){
			$(e.target).next().next().next().children().css("cursor","pointer")
			$(e.target).next().next().next().next().children().css("cursor","pointer")
			$(e.target).next().next().next().children().prop('disabled', false);
			$(e.target).next().next().next().next().children().prop('disabled', false);
			$(e.target).next().next().next().next().next().children().prop('readonly', false);
		}
		else{
			$(e.target).next().next().next().children().prop('disabled', true);
			$(e.target).next().next().next().children().css("cursor","default")
			$(e.target).next().next().next().next().children().css("cursor","default")
			$(e.target).next().next().next().next().children().prop('disabled', true);
			$(e.target).next().next().next().next().next().children().prop('readonly', true);
			//$(e.target).next().next().next().next().children().class("cursor","pointer")
		}
		}catch(e){}
	},
	//click of ok get the data as json
	'click #yesAddEvents':function(e){
		e.preventDefault();
		var setFlag=[];
        var cc= []
		//Session.set("clickOKaddEvents",1);
		clickOKaddEvents=1
        var s = $("input[name=mainTag]:checked").map(
                function() {
                    cc.push(this.value)
                    return this.value;
                });
		if((cc.indexOf("None")==0&&s.length!==1)||(cc.indexOf("None")==-1&&s.length!==0)){
			//validation here
		$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(t,i){
				var patt = new RegExp(/^[0-9]*$/);
    			var res = patt.test($(this).next().next().next().next().next().children().val());

    			var prizeWithoutZero = $(this).next().next().next().next().next().children().val()

			if($(this).next().next().next().next().next().children().val()==""){
				$(this).next().next().next().next().next().children().css("color","red");
				//setFlag=0;
				$("#eveDomProvideDetails").val("Provide Entry Fee").css("color","red");
				$("#eveDomProvideDetails").val("Provide Entry Fee").css("font-size","10px");
			}
			if($(this).next().next().next().next().next().children().val()!==""&&res===false){
				$(this).next().next().next().next().next().children().css("color","red");
				$("#eveDomProvideDetails").val("Entry Fee is not valid").css("color","red");
				$("#eveDomProvideDetails").val("Entry Fee is not valid").css("font-size","10px");
			}
			if($(this).next().next().next().next().next().children().val()!==""&&res==true){
				//$(this).next().next().next().next().next().children().css("color","red");
				setFlag.push(i);
			}
		});
		/*$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
			if($(this).next().next().next().next().next().children().val()!==""){
				$(this).next().next().next().next().next().children().css("color","red");
				setFlag=1;
			}
		});*/
		if(setFlag.length===$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').length){
		var addEvent = [];
		$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
			var data={
				"eventId":$(this).attr("id"),
				"projectType":$(this).next().children().attr("id"),
				"eventName":$(this).next().children().text(),
				"eventStartDate":$(this).next().next().next().children().val(),
				"eventEndDate":$(this).next().next().next().next().children().val(),
				"prize":$(this).next().next().next().next().next().children().val()
			}
			addEvent.push(data);
		});
		Session.set("addEventArray",addEvent);
		$("#addEventsPopup").modal('hide');}
		}else{
			$("#eveDomProvideDetails").val("Please select one event").css("color","red");
			$("#eveDomProvideDetails").css("font-size","10px");
		}
	},
		"click #noAddEvents":function(e){
		e.preventDefault();
			$("#eveDomProvideDetails").val("")
			var eveArr = Session.get("addEventArray");
			if(eveArr==undefined){$("#addEventsPopup").modal('hide');}
			if(Session.get("dateChanged1")==1||Session.get("dateChanged0")==1){$("#addEventsPopup").modal('hide');}
			else{
			$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
					$("#" + $(this).attr("id")).prop('checked', false);
					if(Session.get("checkchangeaftercancel")===undefined||Session.get("checkchangeaftercancel")===null){
						$("#" + $(this).attr("id")).prop('checked', true);
					}
					$(this).next().next().next().children().prop('disabled', true);
					$(this).next().next().next().children().css("cursor","default");
					$(this).next().next().next().children().val($("#startDate").val());//start
					$(this).next().next().next().next().children().val($("#endDate").val());//end
					$(this).next().next().next().next().children().prop('disabled', true);
					$(this).next().next().next().next().children().css("cursor","default");
					//$(this).next().next().next().next().next().children().val("")//fee
					//$(this).next().next().next().next().next().prop('disabled', true);
					$(this).next().next().next().next().next().css("cursor","default");
			});
			if(eveArr!==null||eveArr!==undefined){
			for(var i=0;i<eveArr.length;i++){
				$("#" + eveArr[i].eventId.toString()).prop('checked', true);
				$("#" + eveArr[i].eventId.toString()).next().next().next().children().val(eveArr[i].eventStartDate);//start
				$("#" + eveArr[i].eventId.toString()).next().next().next().children().prop('disabled', false);
				$("#" + eveArr[i].eventId.toString()).next().next().next().children().css("cursor","pointer");
				$("#" + eveArr[i].eventId.toString()).next().next().next().next().children().val(eveArr[i].eventEndDate);//end
				$("#" + eveArr[i].eventId.toString()).next().next().next().next().children().prop('disabled', false);
				$("#" + eveArr[i].eventId.toString()).next().next().next().next().children().css("cursor","pointer");
				$("#" + eveArr[i].eventId.toString()).next().next().next().next().next().children().val(eveArr[i].prize)//fee
				$("#" + eveArr[i].eventId.toString()).next().next().next().next().next().prop('disabled', false);
				$("#" + eveArr[i].eventId.toString()).next().next().next().next().next().css("cursor","pointer");	
			}
		}
			$("#addEventsPopup").modal('hide');
		}
	},
	"keyup #addEentryFee":function(event){
		   var key = window.event ? event.keyCode : event.which;

		    if (event.keyCode === 8 || event.keyCode === 46
		        || event.keyCode === 37 || event.keyCode === 39) {
		        return true;
		    }
		    else if ( key < 48 || key > 57 ) {
		        return false;
		    }
		    else return true;
	},

	"focus #addEentryFee":function(e){
		$(e.target).css("color","black");
		$("#eveDomProvideDetails").val("")
	}

});

Template.addEventsPopup.helpers({
	"lEventsUnderTourn":function(){
		try{
		if(Session.get("tournIdForEvAdd")){
			var r = tournamentEvents.findOne({"_id":$('#projectName :selected').val().toString()});
			if(r!=undefined)
			return r.projectSubName;
		}
		}catch(e){}
	
	}
});


var eventsAddValidatePop = function() {
	var eventsAddValidatedd = $('#addEventsPopupFormIDs').validate({
		rules: {
			eveDomProvideDetails: {
				fillallchecked: true
			},
			/*addEentryFee:{
				required:true
			}*/
		},
		messages: {
			eveDomProvideDetails: {
				fillallchecked: "Please Provide Entry Fee"
			},
			/*addEentryFee:{
				required:"true"
			}*/
		},

		errorElement: 'div',

		invalidHandler: function(form, validator, element) {
			var errors = validator.numberOfInvalids();
			if (errors) {
				if (validator.errorList.length > 0) {
					for (x = 0; x < validator.errorList.length; x++) {
						var q = validator.errorList[x].element;
						//(q)
						var elementName = [];
						//$("#" + q.name + "Name").text("");
						$("#eveDomProvideDetails" + q.name ).val(validator.errorList[x].message)
							.css("color", "#cc3300");
					}
				}
			}
			validator.focusInvalid();
		},
		submitHandler: function(event) {
			var addEvent = [];
		$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
			var data={
				"eventId":$(this).attr("id"),
				"projectType":$(this).next().children().attr("id"),
				"eventName":$(this).next().children().text(),
				"eventStartDate":$(this).next().next().next().children().val(),
				"eventEndDate":$(this).next().next().next().next().children().val(),
				"prize":$(this).next().next().next().next().next().children().val()
			}
			addEvent.push(data);
		});
		Session.set("addEventArray",addEvent);
		Session.set("addedEventsProp",1);
		$("#addEventsPopup").modal('hide');
		}
	});
}

$.validator.addMethod(
	"fillallchecked",
	function(value, element, regexp) {
		$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
			if($(this).next().next().next().next().next().children().val()==""){
				$(this).next().next().next().next().next().children().css("color","red");
				return false;
			}
			else{  return true};
		});
	}

);
$.validator.addMethod(
	"fillallchecked2",
	function(value, element, regexp) {
		var rr;
		$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
			if($(this).next().next().next().next().next().children().val()==""){
				//$(this).next().next().next().next().next().children().css("color","red");
				rr =1
				return false;
			}
			else{  rr=0; return true};
		});
		if(rr==1){
			return false
		}
		else if(rr==0){
			return true
		}

	}

);


var arrayToAdd_selectedIds = [];
Template.whoConSubscribe.onCreated(function(){
	this.subscribe("associationOrAcademies");
	this.PickAssocsSelected  = new ReactiveVar(undefined)
	this.selected_id_acasoc = new ReactiveVar(undefined)
});

Template.whoConSubscribe.onRendered(function(){
	arrayToAdd_selectedIds = [];
	Session.set("schoolTypesSet",false)
	Session.set("schoolTypeSelected",false)
});

Template.whoConSubscribe.helpers({
	"associationNameOrAcademyName":function(){
		try{
			if(Meteor.user().role=="Association"&&Meteor.user().associationType=="District/City"){
				var associtionDetailsFind = associationDetails.find({}).fetch();
				if(associtionDetailsFind){
					return associtionDetailsFind
				}
			}
			else if(Meteor.user().role=="Academy"){
				var associtionDetailsFind = academyDetails.find({}).fetch();
				if(associtionDetailsFind){
					return associtionDetailsFind
				}
			}
		}catch(e){

		}
	},
	getrolename:function(){
		try{
			if(Meteor.user().role=="Association"){
				return "associations";
			}
			if(Meteor.user().role=="Academy"){
				return "academies";
			}
		}catch(e){

		}
	},
	PickAssocs:function(){
		try{
			if(Template.instance().PickAssocsSelected.get()==1){
				return true
			}
		}catch(e){

		}
	},
	thisDaOrAcaCheck:function(){
		try{
			if(this.userId==Meteor.user().userId){
				return true;
			}
		}catch(e){

		}
	},
	thisDaOrAcaRead:function(){
		try{
			if(this.userId==Meteor.user().userId){
				return "readonly";
			}
		}catch(e){

		}
	},
	thisDaOrAcaDis:function(){
		try{
			if(this.userId==Meteor.user().userId){
				return "disabled";
			}
		}catch(e){

		}
	},
	roleWhoValid:function(){
		try{
			if(Meteor.user().role=="Association"&&Meteor.user().associationType=="State/Province/County"){
				return false;
			}
			else if(Meteor.user().role=="Organiser"){
				return false
			}
			else return true
		}catch(e){

		}
	},
	checkNotOrganizer:function(){
		try{
			if(Meteor.user().role=="Organiser"){
				return false;
			}
			else return true
		}catch(e){

		}
	},
	selectSchoolType:function(){
		try{
			if(Session.get("schoolTypesSet")==true){
				return true
			}
			else{
				return false
			}
		}catch(e){

		}
	},
	fetchSchoolTypes:function(){
		try{
			if(Session.get("schoolTypesSet")==true){
				var s = ReactiveMethod.call("getTournamentTypesCall")
				if(s && s.length){
					return s
				}
			}
		}catch(e){

		}
	}
});

Template.whoConSubscribe.events({
	"change #schoolTypeSelection":function(){
		try{
			var value = $("#schoolTypeSelection").val()
			if(value){
				Session.set("schoolTypeSelected",value)
			}
		}catch(e){

		}
	},
	"change input[name=selectSubcriptionType]":function(e,template){
		e.preventDefault();
		Session.set("schoolTypesSet",false)
		Session.set("schoolTypeSelected",false)
		if ($(e.target).is(":checked")) {
			if($(e.target).attr("id")=="pickASSAC"){
				Session.set("schoolTypesSet",false)
				template.PickAssocsSelected.set(1)
				$("#changeHeightOfModal").css("min-height","225px")
			}
			else{
				if($(e.target).attr("id")=="schoolOnly"){
					Session.set("schoolTypesSet",true)
				}
				template.PickAssocsSelected.set(undefined)
				$("#changeHeightOfModal").css("min-height","110px")
			}
		}
	},
	"change input[name=selectedNamesAssocAcad]":function(e,template){
		e.preventDefault();
		arrayToAdd_selectedIds = []

		var userId = this.userId
		if(Meteor.user().userId==userId){
			return false;
		}
		if ($(e.target).is(":checked")&&$('input[name=selectSubcriptionType]:checked').attr("id")=="pickASSAC") {
			var id = this.userId;
			
			if(Template.instance().selected_id_acasoc.get())
				arrayToAdd_selectedIds = Template.instance().selected_id_acasoc.get();

			if(arrayToAdd_selectedIds!=undefined){
				if (_.findWhere(arrayToAdd_selectedIds, userId) == null) {
		    		arrayToAdd_selectedIds.push(userId);
				}
			}
			else{
				arrayToAdd_selectedIds.push(userId);	
			}
					
		}
		else{
			var id = this.userId;
			if(Template.instance().selected_id_acasoc.get())
				arrayToAdd_selectedIds = Template.instance().selected_id_acasoc.get();

			if(_.indexOf(arrayToAdd_selectedIds,userId)>=0){
				arrayToAdd_selectedIds = _.without(arrayToAdd_selectedIds,userId);
			}
		}

		template.selected_id_acasoc.set(arrayToAdd_selectedIds);

	},
	"click #SaveSubRest":function(e,template){
		try{
			e.preventDefault();
			var selectionType = $('input[name=selectSubcriptionType]:checked').attr("id");
			var tournamentId;
			var eventOrganizerId;
			var role;
			var selectedIds;
			if(selectionType=="pickASSAC"){
				selectedIds = Template.instance().selected_id_acasoc.get();
				if(selectedIds && selectedIds.length){
					var data = {
						selectionType:selectionType,
						selectedIds:selectedIds
					}
					Session.set("susbcriptionRest",data)
					$("#whoConSubscribe").modal('hide')
					Blaze.render(Template.subscriptionDOB_createEvents, $("#dobFilterRender")[0]);
					$("#subscriptionDOB_createEvents").modal({
						backdrop: 'static',
						keyboard:false
					});
				}
				else{
					if(Meteor.user().role=="Association"){
						alert("Please pick any association or any other options")
					}
					if(Meteor.user().role=="Academy"){
						alert("Please pick any academy or any other options")
					}
					
				}
			}
			else{
				var data = {
					selectionType:selectionType,
					selectedIds:selectedIds
				}
				if(selectionType=="schoolOnly"){
					if(Session.get("schoolTypeSelected") && 
						Session.get("schoolTypeSelected")!="1"){
						Session.set("susbcriptionRest",data)
						$("#whoConSubscribe").modal('hide')
						Blaze.render(Template.subscriptionDOB_createEvents, $("#dobFilterRender")[0]);
						$("#subscriptionDOB_createEvents").modal({
							backdrop: 'static',
							keyboard:false
						});
					}
					else{
						alert("Please select tournament type")
					}
				}
				else{
					Session.set("susbcriptionRest",data)
					$("#whoConSubscribe").modal('hide')
					Blaze.render(Template.subscriptionDOB_createEvents, $("#dobFilterRender")[0]);
					$("#subscriptionDOB_createEvents").modal({
						backdrop: 'static',
						keyboard:false
					});
				}
			}
		}catch(e){
			
		}
	},
	"click #CancelSubRest":function(e,template){
		e.preventDefault();
		$('#whoConSubscribe').modal('hide');
		$("#dobFilterRender").empty()
		Session.set("susbcriptionRest",undefined);
		var checked1 = $("#selfOnly").prop("checked",true);
		var checked2 = $("#selectedNamesAssocAcad").prop("checked",false);
		template.PickAssocsSelected.set(undefined);
		template.selected_id_acasoc.set(undefined);
		$("#changeHeightOfModal").css("min-height","110px")
		$("#httpSettingsPopupError").html("");
		$("#Httpcheck").val("")
		var checked1 = $("#setAnysetDirect").prop("checked",false);
		var checked2 = $("#setAnysetHyper").prop("checked",false)
		var checked3 = $("#setAnysetmail").prop("checked",false)
		//var checked4 = $("#setSubscribeWithPlayersAFFId").prop("checked",false)
	},
	"click #cancelFromDob":function(e){
		e.preventDefault();
		$("#subscriptionDOB").modal('hide')
		$("#dobFilterRender").empty()
		$('#whoConSubscribe').modal({
		 	backdrop: 'static',keyboard: false
		});
		Session.set("LdataToSaveFromDOB",undefined)
	}
});

Template.subscriptionDOB_createEvents.onCreated(function(){
	this.subscribe("tournamentEvents");
	this.subscribe("dobFilterSubscribe")
});

Template.selectedEventsCategories_createEvents.onCreated(function(){
	this.subscribe("tournamentEvents");
	this.subscribe("dobFilterSubscribe")
});

Template.subscriptionDOB_createEvents.onRendered(function(){
	Session.set("getEventListForSelectedTorun",undefined);
	Session.set("errorsValid",undefined);
});

Template.selectedEventsCategories_createEvents.onRendered(function(){
	subscriptionDOBValidate()
});

var subscriptionDOBValidate = function(){

	$("#subscriptionDOBForm_NEW").validate({
		onkeyup: false,
		ignore:[],
		invalidHandler: function(form, validator) {
	        $("#subscriptionDOBForm_NEW").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        var errors = validator.numberOfInvalids();
	        for(var i = 0; i < validator.errorList.length; i++){
	        	var q = validator.errorList[i].element;
	        	$("#"+q.name).css("color","red");
	        	$("#eveDomProvideDetails_NEW").html("<span class='glyphicon glyphicon-remove-sign red'></span>&nbsp;"+validator.errorList[i].message);	     
	        } 
	    },
	    errorPlacement: function(error, element) {},
	    submitHandler:function(){
	    	try{
    		var arrayToSave = [];
	    	mainProjectId = "";
	    	var gender = "";
	    	var projectTypeTest;
	    	Session.set("LdataToSaveFromDOB",undefined)
	    	$("#eveDomProvideDetails_NEW").html("");
	    	$("#tableSetDOB > tbody  > tr").each(function(i,j) {
	    		mainProjectId = $(this).attr("id")
				$(this).find("[name^=dateOfBirthForEvent]").each(function() {
					var genderDetails = tournamentEvents.findOne({"_id":mainProjectId});
					if(genderDetails.projectSubName){
						for(var m=0;m<genderDetails.projectSubName.length;m++){
							var find = genderDetails.projectSubName[m];
							var projectTypeFind = genderDetails.projectSubName[m].projectType;
							if(find._id==$(this).attr("id")){
								gender = find.gender;
								if(parseInt(projectTypeFind)==1){
									projectTypeTest = true
								}
								else{
									projectTypeTest = false
								}
							}
						}
					}
					var dateOfBirthVal = "NA";
					if($(this).val().length > 0)			
						dateOfBirthVal = $(this).val();
					if(projectTypeTest == false){
						dateOfBirthVal = "NA"
					}

					var data={
		   				"eventId":$(this).attr("id"),
		   				"dateOfBirth":dateOfBirthVal,
		   				"gender":gender,
		   				"ranking":$(this).parent().next().children().val().trim().toLowerCase()
	   				}
					
	   				
	   				if(data.eventId.trim().length!=0&&data.dateOfBirth.trim().length!=0&&data.gender.trim().length!=0&&data.ranking.trim().length!=0)
	   					arrayToSave.push(data)
	   			});
			});
			var lData = {
				eventOrganizer:Meteor.user()._id,
				mainProjectId:mainProjectId,
				arrayToSave:arrayToSave
			}
			arrayToSave = []
			Session.set("LdataToSaveFromDOB",lData)
			$("#subscriptionDOB_createEvents").modal('hide')
			

			$('#mailOrHyperLinkOnSubscribe').modal({
			 	backdrop: 'static',keyboard: false
			})

			/*$('#noOfSubscribers').modal({
				backdrop: 'static',keyboard: false
			})*/
			/*Meteor.call("saveFilterDateOfBirth", Meteor.user()._id,mainProjectId,arrayToSave,function(e,r){
				if(e){
				}
				else{
					$("#subscriptionDOB").modal('hide')
				}
			});*/
			
			}catch(e){
			}
	    },
	});
	$("#tableSetDOB > tbody  > tr").each(function(i,j) {
		try{
		$(this).find("[name^=dateOfBirthForEvent]").each(function() {
	   		$(this).rules("add", {
                dateOfBirthForEventValid:true,
            });
	   	});
	   	$(this).find("[name^=rankingForEvent]").each(function() {
	   		$(this).rules("add", {
                rankingForEventAllow:true,
            });
	   	});
	    }catch(e){
	    }
	});
}

$.validator.addMethod("dateOfBirthForEventValid", function (value, element,regexp) {

	var dataType = $("[name="+element.name+"]").attr("dataType");
	if(dataType.trim() == "NA")
		return true;
	else
	{
		var text = value.trim();
		if(text.length==0){
			$("#eveDomProvideDetails_NEW").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"date of birth invalid");
			return false
		}
		else{
			var text = value.trim();
			var comp = text.split(" ");
			if(comp[1]!=undefined&&comp[0]!=undefined&&comp[2]!==undefined&&comp.length===3&&comp[0].trim().length==2&&comp[1].trim().length==3&&moment(new Date(text)).isValid()){
				var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
				var comp2 = comp[1].toLowerCase();
				var monthNum = parseInt(months.indexOf(comp2)+1);
				var d = parseInt(comp[0], 10);
				var m = parseInt(monthNum,10);
				var y = parseInt(comp[2], 10);
				var date = new Date(y,m-1,d);
				if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
					return true
				}
				else{
					var name = element.name;
					$("[name="+name+"]").css("color","red")
					$("#eveDomProvideDetails_NEW").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"date of birth invalid");
					return false
				}
			}
			else{
				var name = element.name;
				$("[name="+name+"]").css("color","red")
				$("#eveDomProvideDetails_NEW").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"date of birth invalid");
				return false
			}
		}
	}
},"date of birth invalid");

$.validator.addMethod("rankingForEventAllow", function (value, element,regexp) {
	var text = value.trim();
	if(text.length==0){
		$("#eveDomProvideDetails_NEW").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"allow ranking is invalid");
		return false
	}
	else{
		var text = value.trim();
		if(text.toLowerCase()=="yes"||text.toLowerCase()=="no"){
			return true
		}
		else {
			var name = element.name;
			$("[name="+name+"]").css("color","red")
			$("#eveDomProvideDetails_NEW").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"allow ranking is invalid");
		}

	}
},"allow ranking is invalid");


Template.subscriptionDOB_createEvents.helpers({
	lTourns: function() {
		var lProjectNames = tournamentEvents.find().fetch();
		if (lProjectNames) {
			return lProjectNames;
		}
	},
	asdad:function(){
		try{
		if(Session.get("tournIdForEvAdd")){
			var r = tournamentEvents.findOne({"_id":$('#projectName :selected').val().toString()});
			if(r!=undefined)
			return r.projectSubName;
		}
		}catch(e){}
	}
});

Template.selectedEventsCategories_createEvents.helpers({
	lTourns_Sports:function(){
		try{
		if(Session.get("tournIdForEvAdd")){
			var r = tournamentEvents.find({"_id":Session.get("tournIdForEvAdd").toString()}).fetch();
			if(r!=undefined)
			return r;
		}
		}catch(e){}
	},
	checkROLESub:function(){
		if(Meteor.user().role=="Academy"||Meteor.user().role=="Association"||Meteor.user().role=="Organiser"){
			return true
		}
		else{
			return false;
		}
	},
	checkWithinSelectedEvents:function(){
		try{
			if(Session.get("addEventArray")){
				var arrayAdded = Session.get("addEventArray");
				var thiseventId = this._id;
				for(var i=0;i<arrayAdded.length;i++){
					if(arrayAdded[i].eventId==thiseventId){
						return true
					}
				}
			}
		}catch(e){
		}
	}
});

Template.selectedEventsCategories_createEvents.events({
	'submit form': function(e) {
		e.preventDefault();
	},
	"keyup .setDOB_Input":function(e){
		e.preventDefault();
		$(e.target).css("color","black");
		Session.set("errorsValid",0)
	},
	"click #noAddEvents":function(e){
		$("#subscriptionDOB").modal('hide')
	}
});

Template.subscriptionDOB_createEvents.events({
	'click #changeOfTourn': function(e) {
		e.preventDefault();
        $('#changeOfTourn').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
                var eventName = obj.val();
                $("#eveDomProvideDetails_NEW").html("")
				Session.set("getEventListForSelectedTorun",eventName);
				$("#renderselectedEventsCategories").empty()
				Blaze.render(Template.selectedEventsCategories, $("#renderselectedEventsCategories")[0]);
            }, 0);
        });
    },
	'submit form': function(e) {
		e.preventDefault();
	},
	"click #cancelFromDob":function(e){
		$("#subscriptionDOB_createEvents").modal('hide')
		if(Meteor.user().role=="Association"||Meteor.user().role=="Academy"){
			$('#whoConSubscribe').modal({
		 		backdrop: 'static',keyboard: false
			})
		}
		Session.set("LdataToSaveFromDOB",undefined)
	},
	"click #prevFromDOB":function(e){
		e.preventDefault();
		$("#subscriptionDOB_createEvents").modal('hide')
		$('#whoConSubscribe').modal({
		 	backdrop: 'static',keyboard: false
		})
	},

});

//subscribers count
Template.selectedEventsSUB_Number.onCreated(function(){
	this.subscribe("tournamentEvents");
	this.subscribe("dobFilterSubscribe")
});

Template.selectedEventsSUB_Number.onRendered(function(){
	
});

Template.selectedEventsSUB_Number.helpers({
	lTourns_Sports_NUM:function(){
		try{
		if(Session.get("tournIdForEvAdd")){
			var r = tournamentEvents.find({"_id":Session.get("tournIdForEvAdd").toString()}).fetch();
			if(r!=undefined)
			return r;
		}
		}catch(e){}
	},

	checkWithinSelectedEvents_NUM:function(){
		try{
			if(Session.get("addEventArray")){
				var arrayAdded = Session.get("addEventArray");
				var thiseventId = this._id;
				for(var i=0;i<arrayAdded.length;i++){
					if(arrayAdded[i].eventId==thiseventId){
						return true
					}
				}
			}
		}catch(e){
		}
	}
});

Template.selectedEventsSUB_Number.events({
	'submit form': function(e) {
		subscriptionNUMValidate()
		e.preventDefault();
	},
	"keyup .setDOB_Input":function(e){
		e.preventDefault();
		$(e.target).css("color","black");
		Session.set("errorsValid",0)
	},
	"click #noAddEvents":function(e){
		$("#subscriptionDOB").modal('hide')
	}
});

subscriptionNUMValidate  = function(){
	/*$("#tableSetNUM > tbody  > tr").each(function(i,j) {
		try{
		
	    }catch(e){
	    }
	});*/

	$("#selectedEventsSUB_NumberForm").validate({
		onkeyup: false,
		ignore:[],
		invalidHandler: function(form, validator) {
	        $("#selectedEventsSUB_NumberForm").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        var errors = validator.numberOfInvalids();
	        for(var i = 0; i < validator.errorList.length; i++){
	        	var q = validator.errorList[i].element;
	        	$("#"+q.name).css("color","red");
	        	$("#eveDomProvideDetails_SUBNUM").html("<span class='glyphicon glyphicon-remove-sign red'></span>&nbsp;"+validator.errorList[i].message);	     
	        } 
	    },
	    errorPlacement: function(error, element) {},
	    submitHandler:function(){
	    	try{
    		var arrayToSave = [];
	    	mainProjectId = "";
	    	var gender = "";
	    	var projectTypeTest;
	    	/*$("#eveDomProvideDetails_NEW").html("");
	    	$("#tableSetDOB > tbody  > tr").each(function(i,j) {
	    		mainProjectId = $(this).attr("id")
				$(this).find("[name^=dateOfBirthForEvent]").each(function() {
					var genderDetails = tournamentEvents.findOne({"_id":mainProjectId});
					if(genderDetails.projectSubName){
						for(var m=0;m<genderDetails.projectSubName.length;m++){
							var find = genderDetails.projectSubName[m];
							var projectTypeFind = genderDetails.projectSubName[m].projectType;
							if(find._id==$(this).attr("id")){
								gender = find.gender;
								if(parseInt(projectTypeFind)==1){
									projectTypeTest = true
								}
								else{
									projectTypeTest = false
								}
							}
						}
					}
					var dateOfBirthVal = "NA";
					if($(this).val().length > 0)			
						dateOfBirthVal = $(this).val();
					if(projectTypeTest == false){
						dateOfBirthVal = "NA"
					}

					var data={
		   				"eventId":$(this).attr("id"),
		   				"dateOfBirth":dateOfBirthVal,
		   				"gender":gender,
		   				"ranking":$(this).parent().next().children().val().trim().toLowerCase()
	   				}
					
	   				
	   				if(data.eventId.trim().length!=0&&data.dateOfBirth.trim().length!=0&&data.gender.trim().length!=0&&data.ranking.trim().length!=0)
	   					arrayToSave.push(data)
	   			});
			});
			var lData = {
				eventOrganizer:Meteor.user()._id,
				mainProjectId:mainProjectId,
				arrayToSave:arrayToSave
			}
			arrayToSave = []
			Session.set("LdataToSaveFromDOB",lData)
			$("#subscriptionDOB_createEvents").modal('hide')
			

			/*$('#mailOrHyperLinkOnSubscribe').modal({
			 	backdrop: 'static',keyboard: false
			})*/

			/*$('#noOfSubscribers').modal({
				backdrop: 'static',keyboard: false
			})*/
			/*Meteor.call("saveFilterDateOfBirth", Meteor.user()._id,mainProjectId,arrayToSave,function(e,r){
				if(e){
				}
				else{
					$("#subscriptionDOB").modal('hide')
				}
			});*/
			
			}catch(e){
				alert(e)
			}
	    },
	});
	$("#tableSetNUM > tbody  > tr").each(function(i,j) {
		try{
		$(this).find("[name^=subscriberNoForEvent]").each(function() {
	   		$(this).rules("add", {
                subscriberNoForEventAllow:true,
            });
	   	});
	   	
	    }catch(e){
	    	alert(e)
	    }
	});

}


$.validator.addMethod("subscriberNoForEventAllow", function (value, element,regexp) {
	try{
	var text = value.trim();

	/*if(text.length==0){
		$("#eveDomProvideDetails_SUBNUM").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"Number of subscribers is invalid");
		return false
	}
	else{
		var text = value.trim();
		var reg = /^\d+$/;
		if(text.toLowerCase()=="unlimited"){
			return true
		}
		else {
			if(reg.test(text)){
				return true
			}
			else{
				var name = element.name;
				$("[name="+name+"]").css("color","red")
				$("#eveDomProvideDetails_SUBNUM").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"Number of subscribers is invalid");
			}
		}*/

	//		}
}catch(e){
}
},"Number of subscribers is invalid");

Template.registerHelper('checkDOBType',function(data)
{
	try{
	if(data.trim() != "NA")
		return true;
	else return false;
}catch(e){}
});


