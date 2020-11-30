Template.adminManageHashTags.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");
});


Template.adminManageHashTags.onRendered(function() {

});


Template.adminManageHashTags.helpers({
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
                        boolVal = true;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {}
    },
    "iplayonSports": function() {
        try {
            var sports = twitterHashTags.findOne({
                "iplayonKey": "#iplaonArra"
            });
            if (sports && sports.iplayonSport)
                return sports.iplayonSport.join(" ")
        } catch (e) {
            //alert(e)
        }
    },
    "iplayonYear": function() {
        try {
            var sports = twitterHashTags.findOne({
                "iplayonKey": "#iplaonArra"
            });
            if (sports && sports.iplayonYear)
                return sports.iplayonYear.join(" ")
        } catch (e) {
            //alert(e)
        }
    },
    "iplayonNation": function() {
        try {
            var sports = twitterHashTags.findOne({
                "iplayonKey": "#iplaonArra"
            });
            if (sports && sports.iplayonNation)
                return sports.iplayonNation.join(" ")
        } catch (e) {
            //alert(e)
        }
    },
    "iplayonStateAssoc": function() {
        try {
            var sports = twitterHashTags.findOne({
                "iplayonKey": "#iplaonArra"
            });
            if (sports && sports.iplayonStateAssoc)
                return sports.iplayonStateAssoc.join(" ")
        } catch (e) {
           // alert(e)
        }
    },
    "iplayonDistAssoc": function() {
        try {
            var sports = twitterHashTags.findOne({
                "iplayonKey": "#iplaonArra"
            });
            if (sports && sports.iplayonDistAssoc)
                return sports.iplayonDistAssoc.join(" ")
        } catch (e) {
           // alert(e)
        }
    },
    "iplayonSponsor": function() {
        try {
            var sports = twitterHashTags.findOne({
                "iplayonKey": "#iplaonArra"
            });
            if (sports && sports.iplaonSponsor)
                return sports.iplaonSponsor.join(" ")
        } catch (e) {
          //  alert(e)
        }
    },
    iplayonGlobal: function() {
        try {
            var sports = twitterHashTags.findOne({
                "iplayonKey": "#iplaonArra"
            });
            if (sports && sports.globalHashTags)
                return sports.globalHashTags.join(" ")
        } catch (e) {
           // alert(e)
        }
    },
});

Template.createNewHashTag.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");
    this.subscribe("tournamentEvents");
    this.subscribe("twitterHashTags")
    this.subscribe("domains");
    this.subscribe("allHashTags");
    
    var self = this;
    self.autorun(function () {
     self.subscribe("assocAcadOrgName", Session.get("searchingEntityName"),Session.get("selectedRole"));
    });
});

Template.createNewHashTag.helpers({
    lDomainName: function() {
        var lProjectNames = domains.find().fetch();
        if (lProjectNames.length !== 0)
            return lProjectNames;
    },
    lTourns: function() {
        var lProjectNames = tournamentEvents.find().fetch();
        if (lProjectNames) {
            return lProjectNames;
        }
    },
    lDomainNameSavedHashTags:function(){
        try{
        //if(Session.get("createSelectSport")){
            var savedHashTagsArr = new Array();
            //var savedHashTags = twitterHashTags.find({"selectedSport":Session.get("createSelectSport").trim()},{fields:{hashTagList:1,iphashTag:1}}).fetch();
            var savedHashTags = twitterHashTags.find({},{fields:{hashTagList:1,iphashTag:1}}).fetch();
            if(savedHashTags.length!=0){
                for(var i=0;i<savedHashTags.length!=0;i++){
                    if(savedHashTags[i].hashTagList){
                        var tags = savedHashTags[i].hashTagList.toString();
                        var concatA = new Array()
                        concatA = tags.split(",")   
                        if(savedHashTags[i].iphashTag){
                            concatA.push(savedHashTags[i].iphashTag)
                        }                     
                        savedHashTagsArr.push.apply(savedHashTagsArr,concatA.filter(function(n){ return (n != undefined && n!=null && n.trim().length!=0)}));
                    }
                }
            }
            return savedHashTagsArr
        //}
        }catch(e){
           // alert(e)
        }
    },
    "lSavedHashTags":function(){
        try{
        if(Session.get("createSelectSport")){
            var allHashTagsFind = allHashTags.find({"selectedSport" :Session.get("createSelectSport").trim()}).fetch();
            if(allHashTagsFind.length!=0){
                return allHashTagsFind
            }
        }
        }catch(e){
            //alert(e)
        }
    },
    searchResultsForEntityName:function(){
        try{
        var searchValue = Session.get("searchingEntityName");
            if(searchValue!=undefined&&searchValue.length!=0){
                var search="";
                if(Session.get("selectedRole")!=undefined&&Session.get("selectedRole")!=null){
                    search = Meteor.users.find({role:Session.get("selectedRole")}).fetch();
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
                else if(searchValue!=undefined&&searchValue.length!=0&&Session.get("selectedRole")==undefined&&Session.get("selectedRole")==null){
                    var x=[];
                    data={
                        userId:0,
                        userName:"Select Role"
                    }
                    x.push(data)
                    return x
                }
            }
            else if(Session.set("keySearchEntity")==true&&Session.get("selectedRole")==undefined&&Session.get("selectedRole")==null){
                var x=[];
                data={
                    userId:0,
                    userName:"Select Role"
                }
                x.push(data)
                return x
            }
        }catch(e){
        }
    },
    selectedEntityNameSearch:function(){
        try{
            if(Session.get("selectedEntityNameSess")){
            var playerDet = Session.get("selectedEntityNameSess");
            var arr = [];
            arr.push(playerDet)
            return arr
            }
        }catch(e){
        }
    }
});

Template.createNewHashTag.onRendered(function() {
    adminManageHashTagsValidate();
    Session.set("createSelectSport",undefined);
    Session.set("selectedRole",undefined);
    Session.set("searchingEntityName",undefined)
    Session.set("searchCriteriaForPlayer",undefined)
    Session.set("selectedEntityNameSess",undefined)
    Session.set("keySearchEntity",false);
    Session.set("requiredWhenClickedSess",false)
    Session.set("selectedEntityID",undefined)
    Session.set("sessionForNewTAgs",undefined);
});

Template.createNewHashTag.events({
    'keyup #mainTag1': function(event) {
        var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
        var $rows = $("#selectTagod2").find("div");
        $rows.each(function() {
            var oLabel = $(this);
            if (oLabel.length > 0) {
                if (oLabel.attr("name").toLowerCase().indexOf(val.toLowerCase()) >= 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            }
        })
    },
    "change #checkAllPlaces": function(e) {
        //e.preventDefault();
        if ($("input[id=checkAllPlaces]:checkbox").prop('checked')) {
            $("input[name=checkDomainName]:checkbox").each(function() {
                if (!$(this).is(':disabled')) {
                    $(this).prop('checked', true);
                }
            });
        } else {
            $("input[name=checkDomainName]:checkbox").each(function() {
                if (!$(this).is(':disabled')) {
                    $(this).prop('checked', false);
                }
            });
        }
    },
    "change input[name=checkDomainName]": function(e) {
        //e.preventDefault();
        if ($("input[name=checkDomainName]:checked").length == $("input[name=checkDomainName]:checkbox").length) {
            $("input[id=checkAllPlaces]:checkbox").prop('checked', true);
        } else
            $("input[name=checkAllPlaces]:checkbox").prop('checked', false);
    },
    'submit form': function(e) {
        e.preventDefault();
    },
    'click #errorPopupClose': function(e) {
        e.preventDefault();
        $('#errorPopup').modal('hide');
    },
    "click #createNewHashtag": function() {
        $("#renderTempHashTag").empty();
        Blaze.render(Template.createNewHashTag, $("#renderTempHashTag")[0]);
    },
    "click #editNewHashTag": function() {
        $("#renderTempHashTag").empty();
        Blaze.render(Template.createNewHashTag, $("#renderTempHashTag")[0]);
    },
    "change #selectSport":function(){
        Session.set("createSelectSport",$("#selectSport").val());
    },
    "change #selectRole":function(e){
        e.preventDefault()
        Session.set("selectedEntityID",undefined)
        Session.set("searchingEntityName",undefined)
        Session.set("selectedEntityNameSess",undefined)
        Session.get("selectedEntityNameSess",undefined)
        Session.set("sessionForNewTAgs",undefined);
        Session.set("selectedRole",$("#selectRole").val());
    },    
    'keyup #mainTag1SavedHashTags': function(event) {
        var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
        var $rows = $("#selectTagod2SavedTAgs").find("div");
        $rows.each(function() {
            var oLabel = $(this);
            if (oLabel.length > 0) {
                if (oLabel.attr("name").toLowerCase().indexOf(val.toLowerCase()) >= 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            }
        })
    },
    "change #checkAllPlacesSavedHashTags": function(e) {
        //e.preventDefault();
        if ($("input[id=checkAllPlacesSavedHashTags]:checkbox").prop('checked')) {
            $("input[name=checkDomainNameSavedHashTags]:checkbox").each(function() {
                if (!$(this).is(':disabled')) {
                    $(this).prop('checked', true);
                }
            });
        } else {
            $("input[name=checkDomainNameSavedHashTags]:checkbox").each(function() {
                if (!$(this).is(':disabled')) {
                    $(this).prop('checked', false);
                }
            });
        }
    },
    "change input[name=checkDomainNameSavedHashTags]": function(e) {
        if(!$("input[name=checkDomainNameSavedHashTags]:checkbox").prop('checked')){
            if(Session.get("sessionForNewTAgs")){
                arr = [];
                arr = Session.get("sessionForNewTAgs")
                var index = arr.indexOf(e.target.value.trim());
                arr.splice(index, 1);
            }
        }
        if ($("input[name=checkDomainNameSavedHashTags]:checked").length == $("input[name=checkDomainNameSavedHashTags]:checkbox").length) {
            $("input[id=checkAllPlacesSavedHashTags]:checkbox").prop('checked', true);
        } else
            $("input[name=checkAllPlacesSavedHashTags]:checkbox").prop('checked', false);
    },
    'keyup #entityName, change #entityName,input #entityName,keydown #entityName ': function(e,template){
        try{
        e.preventDefault();
        if(Session.get("selectedRole")==undefined){
            alert("Please Select Role")
            e.target.value = "";
            return false;
        }
        if(e.target.value.trim().length>=3&&$("#selectRole").val()){
            var idOfSelec = this.userId;
            var nameOfSelc;
            Session.set("searchingEntityName",e.target.value)
        }
        if(e.target.value.trim().length<3&&(e.keyCode == 8 ||e.keyCode == 46)){
            Session.set("searchingEntityName",undefined)
        }
        }catch(e){
            //alert(e)
        }
    },
    'focus #entityName':function(){
         $("#searchUserForTeam").text("")
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
    'click div[name=addAcademyMNM_P]':function(e,template){
        try{
        e.preventDefault();
        if(this.userId!=undefined&&this.userId!=0){
            var data = {
                userId:this.userId,
                userName:this.userName
            }
            Session.set("searchingEntityName",undefined)
            Session.set("selectedEntityNameSess",data)
            Session.set("selectedEntityID",this.userId)
            Session.set("keySearchEntity",false)
        }
        }catch(e){
            //alert(e)
        }
    }
});

Template.adminManageHashTags.events({
    /*"click #iplayonTweetTags":function(e){
        e.preventDefault();
        var iplayonSport = [];
        var iplayonYear = [];
        var iplayonNation = [];
        var iplayonStateAssoc = [];
        var iplayonDistAssoc = [];
        var iplayonSponsor = [];
        var globalHashTags = [];
        if($("#iplaonSport").val().trim().length!=0){
            iplayonSport = $("#iplaonSport").val().trim().split(" ");
        }
        if($("#iplaonYear").val().trim().length!=0){
            iplayonYear = $("#iplaonYear").val().trim().split(" ");
        }
        if($("#iplaonNation").val().trim().length!=0){
            iplayonNation = $("#iplaonNation").val().trim().split(" ");
        }
        if($("#iplaonState").val().trim().length!=0){
            iplayonStateAssoc = $("#iplaonState").val().trim().split(" ");
        }
        if($("#iplaonDist").val().trim().length!=0){
            iplayonDistAssoc = $("#iplaonDist").val().trim().split(" ");
        }
        if($("#iplaonSponsor").val().trim().length!=0){
            iplayonSponsor = $("#iplaonSponsor").val().trim().split(" ");
        }
        if($("#iplayonGlobal").val().trim().length!=0){
            globalHashTags = $("#iplayonGlobal").val().trim().split(" ");
        }
        var xdata = {
            globalHashTags:globalHashTags,
            iplayonSport:iplayonSport,
            iplayonYear:iplayonYear,
            iplayonNation:iplayonNation,
            iplayonStateAssoc:iplayonStateAssoc,
            iplayonDistAssoc:iplayonDistAssoc,
            iplaonSponsor:iplayonSponsor,           
        }
        Meteor.call("twitterHashTagsINSERTUPDATE",xdata,function(e,res){
            if(e){
                alert(e.reason)
            }
            else{
                alert("Content Saved..")
            }
        })
    },*/
    "click #iplayonTweetTagscancel": function(e) {
        e.preventDefault();
        $("#renderTempHashTag").empty();
    },
    'keyup #mainTag1': function(event) {
        var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
        var $rows = $("#selectTagod2").find("div");
        $rows.each(function() {
            var oLabel = $(this);
            if (oLabel.length > 0) {
                if (oLabel.attr("name").toLowerCase().indexOf(val.toLowerCase()) >= 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            }
        })
    },
    "change #checkAllPlaces": function(e) {
        //e.preventDefault();
        if ($("input[id=checkAllPlaces]:checkbox").prop('checked')) {
            $("input[name=checkDomainName]:checkbox").each(function() {
                if (!$(this).is(':disabled')) {
                    $(this).prop('checked', true);
                }
            });
        } else {
            $("input[name=checkDomainName]:checkbox").each(function() {
                if (!$(this).is(':disabled')) {
                    $(this).prop('checked', false);
                }
            });
        }
    },
    "change input[name=checkDomainName]": function(e) {
        if ($("input[name=checkDomainName]:checked").length == $("input[name=checkDomainName]:checkbox").length) {
            $("input[id=checkAllPlaces]:checkbox").prop('checked', true);
        } else
            $("input[name=checkAllPlaces]:checkbox").prop('checked', false);
    },
    'click #iplayonTweetTags': function(e) {
        e.preventDefault();
        $('#iplayonSendToHashTags').rules("remove")
        $("#manageTwitterHasghTag").valid();
        if($("#manageTwitterHasghTag").valid()){
            var selectedSport = $("#selectSport").val().trim();
            var entityName = Session.get("selectedEntityID")
            var iphashTag = $("#iplayonHashtoken").val().trim();
            var regionSelected = $("input[name=checkDomainName]:checked").map(
                function() {
                    return this.value;
                }).get();
            var savedTags = $("input[name=checkDomainNameSavedHashTags]:checked").map(
                function() {
                    return this.value.trim();
                }).get();
            var hashTagList = [];
            var xdata = {
                selectedSport: selectedSport,
                entityName: entityName,
                iphashTag: iphashTag,
                hashTagList: hashTagList,
                regionSelected: regionSelected,
                savedTags:savedTags
            }
            Meteor.call("twitterHashTagsINSERT", xdata, function(e, res) {
                if (e) {
                    alert(e.reason)
                } else {
                    alert("Content saved..")
                    $("#selectSport").val("Select sport")
                    $("#selectRole").val("Select role")
                    $("#entityName").val("")
                    $("#iplayonHashtoken").val("")
                    $("#iplayonSendToHashTags").val("")
                    $("input[type=checkbox]").attr('checked', false);
                    Session.set("createSelectSport",undefined)
                    Session.set("selectedEntityID",undefined)
                    Session.set("searchingEntityName",undefined)
                    Session.set("selectedEntityNameSess",undefined)
                    Session.set("selectedEntityNameSess",undefined)
                    Session.set("sessionForNewTAgs",undefined);
                }
            })
        }
    },
    'click #errorPopupClose': function(e) {
        e.preventDefault();
        $('#errorPopup').modal('hide');
    },
    'click #errorPopupClose2': function(e) {
        e.preventDefault();
        $('#errorPopup2').modal('hide');
    },
    "click #createNewHashtag": function() {
        $("#renderTempHashTag").empty();
        Blaze.render(Template.createNewHashTag, $("#renderTempHashTag")[0]);
    },
    "click #editViewHashTag": function() {
        $("#renderTempHashTag").empty();
        Blaze.render(Template.editViewHashTags, $("#renderTempHashTag")[0]);
    },
    "click #addCustomHashTag":function(e){
        e.preventDefault()
        $('#checkDomain').rules("remove")        
        $('#iplayonSendToHashTags').rules("add", Date1);
        $("#manageTwitterHasghTag").valid();
        Session.set("requiredWhenClickedSess",true);   
        if($("#manageTwitterHasghTag").valid()){
            var selectedRole = $("#selectRole").val().trim();
            var selectedSport = $("#selectSport").val().trim();
            var entityName = Session.get("selectedEntityID")
            var savedTags = $("#iplayonSendToHashTags").val().trim();
            if(Session.get("sessionForNewTAgs")){
                var arr =[]
                arr = Session.get("sessionForNewTAgs");
                arr.push(savedTags);
                Session.set("sessionForNewTAgs",arr)
            }
            else{
                var arr = [];
                arr.push(savedTags)
                Session.set("sessionForNewTAgs",arr)
            }
            var customTAgData = {
                selectedRole:selectedRole,
                selectedSport:selectedSport,
                entityName:entityName,
                savedTags:savedTags
            }
            Meteor.call("insertCustomHashTAgs",customTAgData,function(e,res){
                if(e){
                    alert(e.reason)
                }
                else{
                    alert("Added New Custom Tag,Click Save To Save All Details");
                }
            })
        }
    },
});

var Date1= {
        requiredWhenClicked: true,
        messages: {
            requiredWhenClicked: 'Custom hashtag is required',
        }
    };
/*********** validations **********************/
var adminManageHashTagsValidate = function() {
    var s = $('#manageTwitterHasghTag').validate({
        rules: {
            selectSport: {
                required: true
            },
            entityName: {
                requiredNAME: true,
                whiteSpaceForHashtags: /\S/
            },
            iplayonHashtoken: {
                required: true,
                uniqueWithAlreadySavedIP_NEW:true,
                whiteSpaceForHashtags: /\S/,
                validText3ForHashtags: /^\#[a-zA-Z0-9]*$/
            },
            checkDomain: {
                CheckDomainForHashTags: true
            },
            iplayonSendToHashTags: {
                required: true,
                //maxlength: 200,
                uniqueHashTags:true,
                uniqueWithAlreadySaved_NEW:true,
                uniqueWithIplayonTag:true,
                validText2ForHashtags: /^\#[a-zA-Z0-9]+(,\#[a-zA-Z0-9]+)*$/
            },
        },
        messages: {
            selectSport: {
                required: "Sport is required",
            },
            entityName: {
                requiredNAME: "Entity name is required",
                whiteSpaceForHashtags: "Entity name is not valid"
            },
            iplayonHashtoken: {
                required: "iplayon hashtag is required",
                uniqueWithAlreadySavedIP_NEW:"iplayon hashtag contains a tag which is already in saved tags",
                whiteSpaceForHashtags: "iplayon hashtag is not valid",
                validText3ForHashtags: "iplayon hashtag is not valid (one hashtag),it starts with #"
            },
            checkDomain: {
                CheckDomainForHashTags: "Please select atleast one target hashtag"
            },
            iplayonSendToHashTags: {
                required:"custom hashtag is required",
                uniqueHashTags:"custom hashtag should be unique",
                uniqueWithIplayonTag:"custom hashtag should not be same as iplayon hashtag",
                uniqueWithAlreadySaved_NEW:"custom hashtag contains a tag which is already in list of target hashtags",
                validText2ForHashtags: "custom hashtag is not valid, should contain only alpha numeric characters and starts with #",
            },

        },

        errorContainer: $('#errorContainer'),
        errorLabelContainer: $('#errorContainer ul'),
        wrapper: 'li',
        invalidHandler: function(form, validator, element) {

            var elem = $(element);
            var errors = s.numberOfInvalids();

            if (errors) {
                $('#errorPopup').modal({
                    backdrop: 'static',
                    keyboard: false
                });
            }
        },
        submitHandler: function(event) {

        }
    });
}

$.validator.addMethod(
    "CheckDomainForHashTags",

    function(value, element, regexp) {
        if ($("input[name=checkDomainNameSavedHashTags]:checked").map(
                function() {
                    return this.value;
                }).get() == "") {
            return false
        } else return true
    }

);
$.validator.addMethod(
    "CheckDomainForHashTags2",

    function(value, element, regexp) {

        if ($("input[name=checkDomainNameEdit]:checked").map(
                function() {
                    return this.value;
                }).get() == "") {
            return false
        } else return true
    }

);
$.validator.addMethod(
    "whiteSpaceForHashtags",
    function(value, element, regexp) {
        try{
        var check = false;
        return this.optional(element) || regexp.test(value);
        }catch(e){
        }
    }

);

$.validator.addMethod(
    "validText2ForHashtags",
    function(value, element, regexp) {
        try{
        var check = false;
        return this.optional(element) || regexp.test(value.trim());
        }catch(e){
        }
    }

);

$.validator.addMethod(
    "validText3ForHashtags",
    function(value, element, regexp) {
        try{
        var check = false;
        return this.optional(element) || regexp.test(value.trim());
        }catch(e){
        }
    }

);

$.validator.addMethod(
    "uniqueWithIplayonTag",
    function(value,element,regexp){
        try{
        if(value.trim().length!=0){
            var hashTagList = value.trim().split(",");
            var s =_.contains(hashTagList, $("#iplayonHashtoken").val().trim());
            if(s==true){
                return false
            }
            else return true
        }   
        else return true
        }catch(e){
        }
    }
);    

$.validator.addMethod(
    "uniqueWithIplayonTagEdit",
    function(value,element,regexp){
        try{
        if(value.length!==0){
            var hashTagList = value.trim().split(",");
            var s =_.contains(hashTagList, $("#iplayonHashtoken").val().trim());

            if(s==false){
                return false
            }
        }
        else{
            return true
        }
        }catch(E){
        }
    }
);   
$.validator.addMethod(
    "uniqueHashTags",
    function(value,element,regexp){
        try{
        if(value.length!==0){
            var hashTagList = value.trim().split(",");
            return hashTagList.length == _.uniq(hashTagList).length;
        }
        else{
            return true
        }
        }catch(e){
        }
    }
);
$.validator.addMethod(
    "requiredWhenClicked",
    function(value,element,regexp){
        try{
        if(value.length!==0){
            return (value.trim().length!=0) 
        }
        }catch(e){
        }
    }
);

$.validator.addMethod(
    "requiredNAME",
    function(value,element,regexp){
        try{
        if(Session.get("selectedEntityID")==undefined){
            return false
        }
        else
            return true
        /*if($("#userNAmeSelected").attr("value")==undefined||$("#userNAmeSelected").attr("value")==null){
            return false
        }
        var hashTagList = $("#userNAmeSelected").attr("value").trim();
        if(hashTagList.length==0)
            return false
        else
            return true*/
        }catch(e){
        }
    }
);
$.validator.addMethod(
    "uniqueWithAlreadySaved_NEW",
    function(value, element, regexp){
        try{
            if(value.trim().length!=0){
                var hashtag = [];
                hashtag.push(value.trim());
                var savedHashTagsArr = new Array();
                var savedHashTags = allHashTags.find({"selectedSport":Session.get("createSelectSport")}).fetch();
                if(savedHashTags){
                    for(var i=0;i<savedHashTags.length!=0;i++){
                        if(savedHashTags[i].savedTags){
                            var tags = savedHashTags[i].savedTags.toString();
                            var concatA = new Array()
                            concatA = tags.split(",")                        
                            savedHashTagsArr.push.apply(savedHashTagsArr,concatA.filter(function(n){ return (n != undefined && n!=null && n.trim().length!=0)}));
                        }
                    }
                }
                return !_.intersection(savedHashTagsArr, hashtag).length;
            }            
            else{
                return true
            }
        }catch(e){
        }
    }
)

$.validator.addMethod(
    "uniqueWithAlreadySavedIP_NEW",
    function(value, element, regexp){
        try{

            if(value.trim().length!=0){
                var hashtag = [];
                hashtag.push(value.trim());
                var savedHashTagsArr = new Array();
                var savedHashTags = allHashTags.find({"selectedSport":Session.get("createSelectSport")}).fetch();
                if(savedHashTags){
                    for(var i=0;i<savedHashTags.length!=0;i++){
                        if(savedHashTags[i].savedTags){
                            var tags = savedHashTags[i].savedTags.toString();
                            var concatA = new Array()
                            concatA = tags.split(",")                        
                            savedHashTagsArr.push.apply(savedHashTagsArr,concatA.filter(function(n){ return (n != undefined && n!=null && n.trim().length!=0)}));
                        }
                    }
                }

                return !_.intersection(savedHashTagsArr, hashtag).length;
            }            
            else{
                return true
            }
        }catch(e){
        }
    }
)
$.validator.addMethod(
    "uniqueWithAlreadySaved",
    function(value, element, regexp){
        try{
        var hashTagList = value.trim().split(",");
        if(Session.get("createSelectSport")){
            var savedHashTagsArr = new Array();
            var savedHashTags = twitterHashTags.find({/*"selectedSport":Session.get("createSelectSport").trim()*/},{fields:{hashTagList:1,iphashTag:1}}).fetch();
            if(savedHashTags.length!=0){
                for(var i=0;i<savedHashTags.length!=0;i++){
                    if(savedHashTags[i].hashTagList){
                        var tags = savedHashTags[i].hashTagList.toString();
                        var concatA = new Array()
                        concatA = tags.split(",")   
                        if(savedHashTags[i].iphashTag){
                            concatA.push(savedHashTags[i].iphashTag)
                        }                     
                        savedHashTagsArr.push.apply(savedHashTagsArr,concatA.filter(function(n){ return (n != undefined && n!=null && n.trim().length!=0)}));
                    }
                }
            }
            return !_.intersection(savedHashTagsArr, hashTagList).length;
        }
        else{
            var savedHashTagsArr = new Array();
            var savedHashTags = twitterHashTags.find({},{fields:{hashTagList:1,iphashTag:1}}).fetch();
            if(savedHashTags.length!=0){
                for(var i=0;i<savedHashTags.length!=0;i++){
                    if(savedHashTags[i].hashTagList){
                        var tags = savedHashTags[i].hashTagList.toString();
                        var concatA = new Array()
                        concatA = tags.split(",")   
                        if(savedHashTags[i].iphashTag){
                            concatA.push(savedHashTags[i].iphashTag)
                        }                     
                        savedHashTagsArr.push.apply(savedHashTagsArr,concatA.filter(function(n){ return (n != undefined && n!=null && n.trim().length!=0)}));
                    }
                }
            }
            return !_.intersection(savedHashTagsArr, hashTagList).length;
        }
        }catch(e){
        }
    }
)

$.validator.addMethod(
    "uniqueWithAlreadySavedForEdit",
    function(value, element, regexp){
        try{
        var hashTagList = value.trim().split(",");
        if(Session.get("createSelectSport")){
            var savedHashTagsArr = new Array();
            var savedHashTags = twitterHashTags.find({"_id":{$ne:Session.get("selectedToEdit")}/*"selectedSport":Session.get("createSelectSport").trim()*/},{fields:{hashTagList:1,iphashTag:1}}).fetch();
            if(savedHashTags.length!=0){
                for(var i=0;i<savedHashTags.length!=0;i++){
                    if(savedHashTags[i].hashTagList){
                        var tags = savedHashTags[i].hashTagList.toString();
                        var concatA = new Array()
                        concatA = tags.split(",")   
                        if(savedHashTags[i].iphashTag){
                            concatA.push(savedHashTags[i].iphashTag)
                        }                     
                        savedHashTagsArr.push.apply(savedHashTagsArr,concatA.filter(function(n){ return (n != undefined && n!=null && n.trim().length!=0)}));
                    }
                }
            }
            return !_.intersection(savedHashTagsArr, hashTagList).length;
        }
        else{
            if(Session.get("selectedToEdit")){
                var savedHashTagsArr = new Array();
                var savedHashTags = twitterHashTags.find({"_id":{$ne:Session.get("selectedToEdit")}},{fields:{hashTagList:1,iphashTag:1}}).fetch();
                if(savedHashTags.length!=0){
                    for(var i=0;i<savedHashTags.length!=0;i++){
                        if(savedHashTags[i].hashTagList){
                            var tags = savedHashTags[i].hashTagList.toString();
                            var concatA = new Array()
                            concatA = tags.split(",")   
                            if(savedHashTags[i].iphashTag){
                                concatA.push(savedHashTags[i].iphashTag)
                            }                     
                            savedHashTagsArr.push.apply(savedHashTagsArr,concatA.filter(function(n){ return (n != undefined && n!=null && n.trim().length!=0)}));
                        }
                    }
                }
                return !_.intersection(savedHashTagsArr, hashTagList).length;
            }
        }
        }catch(e){
        }
    }
)

Template.editViewHashTags.onCreated(function() {
    this.subscribe("twitterHashTags");
    this.subscribe("tournamentEvents");
});

Template.editViewHashTags.onRendered(function() {
    Session.set("selectedToEdit", undefined)
});

Template.editViewHashTags.helpers({
    "hashTagList": function() {
        var list = twitterHashTags.find({}).fetch();
        return list;
    },
    "tournaName": function() {
        var touNa = tournamentEvents.findOne({
            '_id': this.selectedSport
        });
        if (touNa && touNa.projectMainName) {
            return touNa.projectMainName
        }
    }
});

Template.editViewHashTags.events({
    "click #editHASHTag": function(e) {
        e.preventDefault();
        Session.set("selectedToEdit", this._id)
        $("#renderTempHashTag").empty();
        Blaze.render(Template.editHashTags, $("#renderTempHashTag")[0]);
    },

});

Template.editHashTags.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");
    this.subscribe("domains");
    this.subscribe("tournamentEvents");
    this.subscribe("twitterHashTags")
});

Template.editHashTags.onRendered(function() {
    adminManageHashTagsValidateEdit();
});

Template.editHashTags.helpers({
    lDomainName: function() {
        var lProjectNames = domains.find().fetch();
        if (lProjectNames.length !== 0)
            return lProjectNames;
    },
    lTourns: function() {
        var lProjectNames = tournamentEvents.find().fetch();
        if (lProjectNames) {
            return lProjectNames;
        }
    },
    entityNameFetched: function() {
        try {
            if (Session.get("selectedToEdit")) {
                var eNAme = twitterHashTags.findOne({
                    "_id": Session.get("selectedToEdit")
                });
                if (eNAme && eNAme.entityName) {
                    return eNAme.entityName
                }
            }
        } catch (e) {
        }
    },
    iplayonHashTokenFetched: function() {
        try {
            if (Session.get("selectedToEdit")) {
                var eNAme = twitterHashTags.findOne({
                    "_id": Session.get("selectedToEdit")
                });
                if (eNAme && eNAme.iphashTag) {
                    return eNAme.iphashTag
                }
            }
        } catch (e) {
        }
    },
    hashTagList: function() {
        try {
            if (Session.get("selectedToEdit")) {
                var eNAme = twitterHashTags.findOne({
                    "_id": Session.get("selectedToEdit")
                });
                if (eNAme && eNAme.hashTagList) {
                    return eNAme.hashTagList
                }
            }
        } catch (e) {
        }
    },
    lHasTAgs: function() {
        try {
            if (Session.get("selectedToEdit")) {
                var eNAme = twitterHashTags.findOne({
                    "_id": Session.get("selectedToEdit")
                });
                if (eNAme) {
                    return eNAme
                }
            }
        } catch (e) {
        }
    },
    checkedHAshTags: function() {
        try {
            if (Session.get("selectedToEdit")) {
                var k = twitterHashTags.find({
                    "_id": Session.get("selectedToEdit"),
                    "regionSelected": this._id
                }).fetch();
                if (k.length != 0) {
                    return "checked";
                }
            }
        } catch (e) {
        }
    },
    lDomainNameSavedHashTagsEdit:function(){
        try{
        if(Session.get("selectedToEdit")){
            var savedHashTagsArr = new Array();
            //var savedHashTags = twitterHashTags.find({"selectedSport":Session.get("createSelectSport").trim()},{fields:{hashTagList:1,iphashTag:1}}).fetch();
            var savedHashTags = twitterHashTags.find({"_id":{$ne:Session.get("selectedToEdit")}},{fields:{hashTagList:1,iphashTag:1}}).fetch();
            if(savedHashTags.length!=0){
                for(var i=0;i<savedHashTags.length!=0;i++){
                    if(savedHashTags[i].hashTagList){
                        var tags = savedHashTags[i].hashTagList.toString();
                        var concatA = new Array()
                        concatA = tags.split(",")   
                        if(savedHashTags[i].iphashTag){
                            concatA.push(savedHashTags[i].iphashTag)
                        }                     
                        savedHashTagsArr.push.apply(savedHashTagsArr,concatA.filter(function(n){ return (n != undefined && n!=null && n.trim().length!=0)}));
                    }
                }
            }
            return savedHashTagsArr
        }
        }catch(e){
        }
    },
    "checkSavedTags":function(){
        try {
            var name = this;
            if (Session.get("selectedToEdit")) {
                var k = twitterHashTags.find({
                    "_id": Session.get("selectedToEdit"),
                    "savedTags":name.trim()
                }).fetch();
                if (k.length != 0) {
                    return "checked";
                }
            }
        } catch (e) {
        }
    }
});

Template.editHashTags.events({
    'keyup #mainTag1': function(event) {
        var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
        var $rows = $("#selectTagod2").find("div");
        $rows.each(function() {
            var oLabel = $(this);
            if (oLabel.length > 0) {
                if (oLabel.attr("name").toLowerCase().indexOf(val.toLowerCase()) >= 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            }
        })
    },
    "change #checkAllPlaces": function(e) {
        //e.preventDefault();
        if ($("input[id=checkAllPlaces]:checkbox").prop('checked')) {
            $("input[name=checkDomainNameEdit]:checkbox").each(function() {
                if (!$(this).is(':disabled')) {
                    $(this).prop('checked', true);
                }
            });
        } else {
            $("input[name=checkDomainNameEdit]:checkbox").each(function() {
                if (!$(this).is(':disabled')) {
                    $(this).prop('checked', false);
                }
            });
        }
    },
    "change input[name=checkDomainNameEdit]": function(e) {
        //e.preventDefault();
        if ($("input[name=checkDomainNameEdit]:checked").length == $("input[name=checkDomainNameEdit]:checkbox").length) {
            $("input[id=checkAllPlaces]:checkbox").prop('checked', true);
        } else
            $("input[name=checkAllPlaces]:checkbox").prop('checked', false);
    },
    'submit form': function(e) {
        e.preventDefault();
    },
    'click #errorPopupClose2': function(e) {
        e.preventDefault();
        $('#errorPopup2').modal('hide');
    },
    "click #createNewHashtag": function() {
        $("#renderTempHashTag").empty();
        Blaze.render(Template.createNewHashTag, $("#renderTempHashTag")[0]);
    },
    "click #editNewHashTag": function() {
        $("#renderTempHashTag").empty();
        Blaze.render(Template.createNewHashTag, $("#renderTempHashTag")[0]);
    },
    'keyup #mainTag1SavedHashTagsEdit': function(event) {
        var val = $.trim($(event.target).val()).replace(/ +/g, ' ').toLowerCase();
        var $rows = $("#selectTagod2SavedTAgsEdit").find("div");
        $rows.each(function() {
            var oLabel = $(this);
            if (oLabel.length > 0) {
                if (oLabel.attr("name").toLowerCase().indexOf(val.toLowerCase()) >= 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            }
        })
    },
    "change #checkAllSavedHashTagsEdit": function(e) {
        //e.preventDefault();
        if ($("input[id=checkAllSavedHashTagsEdit]:checkbox").prop('checked')) {
            $("input[name=checkSavedHashTagsEdit]:checkbox").each(function() {
                if (!$(this).is(':disabled')) {
                    $(this).prop('checked', true);
                }
            });
        } else {
            $("input[name=checkSavedHashTagsEdit]:checkbox").each(function() {
                if (!$(this).is(':disabled')) {
                    $(this).prop('checked', false);
                }
            });
        }
    },
    "change input[name=checkSavedHashTagsEdit]": function(e) {
        if ($("input[name=checkSavedHashTagsEdit]:checked").length == $("input[name=checkSavedHashTagsEdit]:checkbox").length) {
            $("input[id=checkAllSavedHashTagsEdit]:checkbox").prop('checked', true);
        } else
            $("input[name=checkAllSavedHashTagsEdit]:checkbox").prop('checked', false);
    },
});

Template.registerHelper("checkSportSelectedHAshtag", function(data) {
    if (data) {
        if (Session.get("selectedToEdit")) {
            var eNAme = twitterHashTags.findOne({
                "_id": Session.get("selectedToEdit")
            });
            if (data == eNAme.selectedSport) {
                return true
            }
        }
    }
});

Template.registerHelper('checkalldomainsHashTags', function(data) {
    try {
        var j = domains.find({}).fetch();
        if (j != undefined) {
            if (data.regionSelected.length === j.length)
                return true
        }
    } catch (e) {}
});

Template.registerHelper('checkalldomainsHashTags2', function(data) {
    try {
        var j = domains.find({}).fetch();
        if (j != undefined) {
            if (data.regionSelected.length === j.length)
                return true
        }
    } catch (e) {}
});

Template.registerHelper('getNAmeOFEntity', function(role,id) {
    try {
        var j = ReactiveMethod.call("getNAmeOFEntity",role,id)
        if (j != undefined) {
            return j;
        }
    } catch (e) {}
});

Template.registerHelper('showCheckForCustomTag', function(data) {
    try {
    if(Session.get("sessionForNewTAgs")){
        var j = Session.get("sessionForNewTAgs")
        if (j) {
            if(_.contains(j, data.trim())){
                return "checked"
            }
            else{
                return ""
            }
        }
    }
    } catch (e) {
    }
});

var adminManageHashTagsValidateEdit = function() {
    var s = $('#manageTwitterHasghTagEdit').validate({
        rules: {
            selectSportEdit: {
                required: true
            },
            entityNameEdit: {
                required: true,
                whiteSpaceForHashtags: /\S/
            },
            iplayonHashtokenEdit: {
                required: true,
                uniqueWithAlreadySavedForEdit:true,
                whiteSpaceForHashtags: /\S/,
                validText3ForHashtags: /^\#[a-zA-Z0-9]*$/
            },
            checkDomainNameEdit: {
                //CheckDomainForHashTags2: true
            },
            iplayonSendToHashTagsEdit: {
                //required: true,
                //maxlength: 200,
                uniqueHashTags:true,
                uniqueWithIplayonTagEdit:true,
                uniqueWithAlreadySavedForEdit:true,
                validText2ForHashtags: /^\#[a-zA-Z0-9]+(,\#[a-zA-Z0-9]+)*$/
            },
        },
        messages: {
            selectSportEdit: {
                required: "Sport is required",
            },
            entityNameEdit: {
                required: "Entity name is required",
                whiteSpaceForHashtags: "Entity name is not valid"
            },
            iplayonHashtokenEdit: {
                required: "iplayon hashtoken is required",
                uniqueWithAlreadySavedForEdit:"iplayon hashtags contains a tag which is already in saved tags",
                whiteSpaceForHashtags: "iplayon hashtag is not valid",
                validText3ForHashtags: "iplayon hashtag is not valid (one hashtag)"
            },
            checkDomainNameEdit: {
                CheckDomainForHashTags2: "Please select atleast one Place"
            },
            iplayonSendToHashTagsEdit: {
                required: "hashtags are required",
                uniqueHashTags:"hashtags should be unique",
                uniqueWithIplayonTag:"iplayon hashtag and list of hashtags should be unique",
                uniqueWithAlreadySavedForEdit:"hashtags contains tags which are already in saved tags",
                validTextForHAshTags: "hashtags are not valid comma separated list and should contain only alpha numeric characters and starts with #",
                //maxlength: "Event tag should contain less than 200 characters",
                validText2ForHashtags: "hashtags are not valid comma separated list and should contain only alpha numeric characters and starts with #"
            },

        },

        errorContainer: $('#errorContainer2'),
        errorLabelContainer: $('#errorContainer2 ul'),
        wrapper: 'li',
        invalidHandler: function(form, validator, element) {

            var elem = $(element);
            var errors = s.numberOfInvalids();

            if (errors) {
                $('#errorPopup2').modal({
                    backdrop: 'static',
                    keyboard: false
                });
            }
        },
        submitHandler: function(event) {
            var selectedSport = $("#selectSport").val().trim();
            var entityName = $("#entityName").val().trim();
            var iphashTag = $("#iplayonHashtoken").val().trim();
            var regionSelected = $("input[name=checkDomainNameEdit]:checked").map(
                function() {
                    return this.value;
                }).get();
            var hashTagList = $("#iplayonSendToHashTags").val().trim().split(",");
            var savedTags = $("input[name=checkSavedHashTagsEdit]:checked").map(
                function() {
                    return this.value;
                }).get();
            var xdata = {
                selectedSport: selectedSport,
                entityName: entityName,
                iphashTag: iphashTag,
                hashTagList: hashTagList,
                regionSelected: regionSelected,
                savedTags:savedTags
            }

            if (Session.get("selectedToEdit")) {
                Meteor.call("twitterHashTagsUPDATE", xdata, Session.get("selectedToEdit"), function(e, res) {
                    if (e) {
                        alert(e.reason)
                    } else {
                        alert("Content Saved..")
                    }
                })
            }
        }
    });
}