/****manage district association****/
Template.manageDistrictAssocBystate.onRendered(function(){
  this.subscribe("onlyLoggedIn")
});

Template.manageDistrictAssocBystate.onCreated(function(){
  this.callTemplateNameDA = new ReactiveVar(false)
});

Template.manageDistrictAssocBystate.onDestroyed(function(){
  this.callTemplateNameDA = new ReactiveVar(false)
});

Template.manageDistrictAssocBystate.helpers({
  whichTemplateDA:function(){
    //if(Meteor.userId()&&Meteor.user().role=="Association"&&Meteor.user().associationType=="State/Province/County"){
      return Template.instance().callTemplateNameDA.get();
    //}
  }
});

Template.manageDistrictAssocBystate.events({
  "click #addDAButton":function(e,template){
    if(Meteor.userId()&&Meteor.user().role=="Association"&&Meteor.user().associationType=="State/Province/County"){
      template.callTemplateNameDA.set("addDAManage");
    }
  },
  'click #viewDeleteDAButton':function(e,template){
    if(Meteor.userId()&&Meteor.user().role=="Association"&&Meteor.user().associationType=="State/Province/County"){
      template.callTemplateNameDA.set("viewDeleteDAManage");
      Router.go("manageDistrictAssocBystate",{page:1})
    }
  }
});

//--add district association--///
var addDAArray_DA=[],addDAIdArray_DA=[],DAs_DA=[],arr2_DA=[];
var arrayToAdd_DA=[], arrayToDelete_DA=[];
Template.addDAManage.onCreated(function(){
  this.subscribe("associationDetails_OTHER");
  this.subscribe("timeZone");
  this.searchForDA = new ReactiveVar(undefined);
  this.searchResults_DA = new ReactiveVar(undefined);
  this.selectDistrictAssoc = new ReactiveVar(undefined);
  this.selectDistrictAssocId = new ReactiveVar(undefined);
  this.addDAArrayIdSess_DA = new ReactiveVar(undefined);
  this.deleteSelectedClub_DA  = new ReactiveVar(undefined)
});

Template.addDAManage.onRendered(function(){
  addDAArray_DA=[];
  DAs_DA=[],arr2_DA=[];
  addDAIdArray_DA=[];
  var arrayToAdd_DA=[];arrayToDelete_DA=[];
  $('#viewDeleteDAButton').removeClass("ip_button_White");
  $('#viewDeleteDAButton').addClass("ip_button_DarkGrey");
  $('#addDAButton').removeClass("ip_button_DarkGrey");
  $('#addDAButton').addClass("ip_button_White");
});

Template.addDAManage.onDestroyed(function(){
  
});

Template.addDAManage.helpers({
  searchResultsOfMNM_DA: function() {
    try{
      var searchValue = Template.instance().searchForDA.get();
      if(searchValue!=undefined&&searchValue.length!=0){
        var reObj = new RegExp(searchValue, 'i');
        var search="";
        search = associationDetails.find({ associationName: {$regex:reObj},affiliatedTo:"other","associationType" : "District/City"}).fetch();
        if(search.length!=0){
          Template.instance().searchResults_DA.set(search)
          return search;
        }
        else if(searchValue&&search.length==0){
          var x=[];
          data={
            _id:0,
            associationName:"No Results"
          }
          x.push(data)
          if(Meteor.userId()&&Meteor.user().role=="Association"&&Meteor.user().associationType=="State/Province/County")
            return x
        }
      }
    }catch(e){
    }
  },
  addedDAArray_DA:function(){
    if(Template.instance().selectDistrictAssoc.get()){
      if(Template.instance().selectDistrictAssoc.get()){
        return Template.instance().selectDistrictAssoc.get()
      }
    }
  },
  "deleteSelectedClub_DA":function(){
    if(Template.instance().deleteSelectedClub_DA.get()){
      return Template.instance().deleteSelectedClub_DA.get()
    }
  }
});

Template.addDAManage.events({
  'keyup #searchUserManage_DA, change #searchUserManage_DA,input #searchUserManage_DA,keydown #searchUserManage_DA ': function(e,template){
    e.preventDefault();
      template.searchForDA.set(e.target.value);
      $("#searchUserManage_DA").text("")
  },
  'focus #searchUserManage_DA':function(){
     $("#searchUserManage_DA").text("")
  },
  'click div[name=addAcademyMNM_DA]':function(e,template){
    e.preventDefault()
    $("#searchUserManage_DA").text("")
    if(e.target.id!=0){
      addDAArray_DA=[]
      var data = {
        userId:this.userId,
        _id:this.userId,
        contactPerson:this.contactPerson,
        address:this.address,
        associationName:this.associationName,
        state:this.state,
        pinCode:this.pinCode,
        city:this.city,
        phoneNumber:this.phoneNumber,
        emailAddress:this.emailAddress,
      }
      if (_.findWhere(addDAArray_DA, data) == null) {
          addDAArray_DA.push(data);
      }
      else{
      }
      if (_.findWhere(addDAIdArray_DA, data.userId) == null) {
          addDAIdArray_DA.push(data.userId);
      }
      template.selectDistrictAssoc.set(addDAArray_DA)
      template.selectDistrictAssocId.set(addDAIdArray_DA)
      template.searchForDA.set(undefined)
      $("#searchUserManage_DA").val("");
    }
  },
  'mouseover p[name=daName]':function(e){
    $("#searchUserManage_DA").text("")
    if(e.target.id!=0)
    $("#"+e.target.id).css("color", "green");
  },
  'mouseout p[name=daName]':function(e){
    $("#searchUserManage_DA").text("")
    if(e.target.id!=0)
    $("#"+e.target.id).css("color", "rgb(56,56,56)");
    },
    "click #addSearchedDA":function(e,template){
      e.preventDefault()
      if(Template.instance().searchResults_DA.get()){
        $("#searchUserManage_DA").val("");     
        template.searchForDA.set(undefined);
        template.selectDistrictAssoc.set(Template.instance().searchResults_DA.get())
      }
    },
    "change #checkedDAs":function(e,template){
    var num = $('#checkedDAs:checked').size();
    if($(e.target).is(":checked")){
      var id = this.userId
      if (_.findWhere(arrayToAdd_DA, id) == null) {
          arrayToAdd_DA.push(id);
      }
      template.selectDistrictAssocId.set(arrayToAdd_DA);
      if(num!=0)
        template.deleteSelectedClub_DA.set(num);
      else
        template.deleteSelectedClub_DA.set(undefined);
    } 
    else if(!$(e.target).is(":checked")){
      var id=this.userId;
      arrayToAdd_DA =  _.reject(arrayToAdd_DA, function(item) {
            return item === id; 
        });
      template.selectDistrictAssocId.set(arrayToAdd_DA);
      if(num!=0)
        template.deleteSelectedClub_DA.set(num);
      else
        template.deleteSelectedClub_DA.set(num);
    }
  },
  'click #saveDeleteAc1_DA':function(e,template){
      e.preventDefault();
      try{
        var lData = {
          userId:Template.instance().selectDistrictAssocId.get(),
        }
        Meteor.call("affiliateDABYSA",lData,function(e,res){
          template.searchForDA.set(undefined);
          template.searchResults_DA.set(undefined);
          template.selectDistrictAssoc.set(undefined);
          template.selectDistrictAssocId.set(undefined);
          template.deleteSelectedClub_DA.set(undefined);
          arrayToAdd_DA=[];
        })
      }catch(e){
      }
    },
    'click #registerNewDA':function(e){
      e.preventDefault();
      $("#registerNewDARen").empty()
      Blaze.render(Template.registerNewDAssoc,$("#registerNewDARen")[0]);
      $("#registerNewDAssoc").modal({
        backdrop: 'static',
        keyboard: false
      })
    },
});

Template.registerHelper('getPlayerState',function(data){
  if(data){
    var getName="";
    var getStateName =timeZone.findOne({"countryName":"India"});
    if(getStateName!=undefined&&getStateName.state){
      for(var i=0;i<getStateName.state.length;i++){
        if(getStateName.state[i].stateId==data){
          getName=getStateName.state[i].stateName;
          break;
        }
      }
    }
    return getName
  }
});


/********view or delete district association*****/
var sub_DistA = false
Template.viewDeleteDAManage.onCreated(function(){
  var template = this;
  this.searchName_DistA = new ReactiveVar(undefined)
  sub_DistA = true;
  var render_DistA;
    if (sub_DistA) {
        template.autorun(function() {
            var currentPage = parseInt(Router.current().params.page) || 1;
            var skipCount = parseInt(parseInt((currentPage - 1)) * 10);
          if(Template.instance().searchName_DistA.get()==undefined){
            if(render_DistA){
              render_DistA.stop();
              render_DistA = false;
            }
              render_DistA = template.subscribe('districtAssocsAffiliatedTo', skipCount);
            }
            else if(Template.instance().searchName_DistA.get()!=undefined){
              if(render_DistA){
              render_DistA.stop();
              render_DistA = false;
            }
              render_DistA = template.subscribe('daAffiliatedToSearch_da',Template.instance().searchName_DistA.get(),skipCount);
            }
        });
    }
    this.subscribe("timeZone");
    this.deleteSelectedDA_DA2 = new ReactiveVar(undefined);
    this.deleteDAsDB = new ReactiveVar(undefined);
    this.deleteSelectedDA_DA2 = new ReactiveVar(undefined);
});

Template.viewDeleteDAManage.onRendered(function(){
  $('#viewDeleteDAButton').removeClass("ip_button_DarkGrey");
  $('#viewDeleteDAButton').addClass("ip_button_White");
  $('#addDAButton').removeClass("ip_button_White");
  $('#addDAButton').addClass("ip_button_DarkGrey");
});

Template.viewDeleteDAManage.onDestroyed(function(){
  this.deleteSelectedDA_DA2 = new ReactiveVar(undefined)
});

Template.viewDeleteDAManage.helpers({
  listOfAffiliatedDAs:function(){
    if(Meteor.userId()&&Meteor.user().role=="Association"&&Meteor.user().associationType=="State/Province/County")
      return associationDetails.find({}).fetch();
  },
  "deleteSelected_Da":function(){
    if(Template.instance().deleteSelectedDA_DA2.get()){
      return Template.instance().deleteSelectedDA_DA2.get()
    }
    else
      return false
  },
  prevPage_da: function() {
        try {
            /*var currentPage = parseInt(Router.current().params.page) || 1;
            var previousPage = currentPage === 1 ? 1 : parseInt(currentPage - 1);
            return Router.routes.managePlayersAssocAcad.path({
                page: previousPage
            })*/

        } catch (e) {
        }
    },
    nextPage_da: function() {
        try {
            /*var currentPage = parseInt(Router.current().params.page) || 1;
            var nextPage = parseInt(currentPage + 1);
            return Router.routes.managePlayersAssocAcad.path({
                page: nextPage
            })*/
        } catch (e) {
        }
    },
    prevPageClass_da: function() {
        return currentPage_das() <= 1 ? "none" : "";
    },
    nextPageClass_da: function() {
        return hasMorePages_das() ? "" : "none";
    },
    nextPageClassPo_da:function(){
      return hasMorePages_das() ? "pointer" : "disabled";
    },
    prevPageClassPo_da:function() {
        return currentPage_das() ? "pointer" : "disabled";
    },
});

var currentPage_das = function() {
    return parseInt(Router.current().params.page) || 1;
}

var hasMorePages_das = function() {
    var totalPlayers = Counts.get('daDetailsTTCOunt');
    return currentPage_das() * parseInt(10) < totalPlayers;
}

Template.viewDeleteDAManage.events({
  "change #checkedDAsToDelete":function(e,template){
      var num = $('#checkedDAsToDelete:checked').size();
    if($(e.target).is(":checked")){
      var id = this.userId
      if (_.findWhere(arrayToDelete_DA, id) == null) {
          arrayToDelete_DA.push(id);
      }
      template.deleteDAsDB.set(arrayToDelete_DA);
      if(num!=0){
        template.deleteSelectedDA_DA2.set(num);
      }
      else
        template.deleteSelectedDA_DA2.set(undefined);
    } 
    else if(!$(e.target).is(":checked")){
      var id=this.userId;
      arrayToDelete_DA =  _.reject(arrayToDelete_DA, function(item) {
            return item === id; 
        });
      template.deleteDAsDB.set(arrayToDelete_DA);
      if(num!=0)
        template.deleteSelectedDA_DA2.set(num);
      else
        template.deleteSelectedDA_DA2.set(undefined);
    }
    },
    "click #searchPlayerNameDisp_DA":function(e,template){
      e.preventDefault()
      template.deleteSelectedDA_DA2.set(undefined)
      template.deleteDAsDB.set(undefined)
      arrayToDelete_DA=[];
      var searchValueName = $("#searchPlayerName_DA").val();
      if(searchValueName.trim().length!=0){
        template.searchName_DistA.set(searchValueName);
        Router.go("manageDistrictAssocBystate",{page:1})
      }
      else {
        template.searchName_DistA.set(undefined);
        Router.go("manageDistrictAssocBystate",{page:1})
      }
    },
    "keydown #searchPlayerName_DA":function(e,template){
      if(e.keyCode == 8 ||e.keyCode == 46){
        template.searchName_DistA.set(undefined);
      }
    },
    "click #clearInputField_daSearch":function(e,template){
      e.preventDefault();
      template.deleteSelectedDA_DA2.set(undefined)
      template.deleteDAsDB.set(undefined)
      arrayToDelete_DA=[];
      $("#searchPlayerName_DA").val("")
      var searchValueName = $("#searchPlayerName_DA").val();
      if(searchValueName.length==0){
        template.searchName_DistA.set(undefined);
        Router.go("manageDistrictAssocBystate",{page:1})
      }
    },
    "click #DAViewNext":function(e){
      e.preventDefault();
      try {
        if(Template.instance().deleteSelectedDA_DA2.get()!=undefined){
              $("#renderConfrimAndRouteDA").empty();
              Blaze.render(Template.confirmDeleteAndNEXTPrevDA, $("#renderConfrimAndRouteDA")[0]);
              $("#conFirmHeaderLog_da").html("Make sure you have deleted the selected district assoc., press ok to continue without deleteting..")
              $("#confirmDeleteAndNEXTPrevDA").modal({
                  backdrop: 'static',
                  keyboard: false
              });
          }
          else{
              var currentPage = parseInt(Router.current().params.page) || 1;
              var nextPage = parseInt(currentPage + 1);
              Router.go("manageDistrictAssocBystate",{page:nextPage})
          }
        } catch (e) {
        }
    },
    "click #DAViewPrevious":function(e){
      e.preventDefault();
      try {
        if(Template.instance().deleteSelectedDA_DA2.get()!=undefined){
              $("#renderConfrimAndRouteDA").empty();
              Blaze.render(Template.confirmDeleteAndPrevDA, $("#renderConfrimAndRouteDA")[0]);
              $("#conFirmHeaderLogPrev_da").html("Make sure you have deleted the selected district assoc., press ok to continue without deleteting..")
              $("#confirmDeleteAndPrevDA").modal({
                  backdrop: 'static',
                  keyboard: false
              });
          }
          else{
              var currentPage = parseInt(Router.current().params.page) || 1;
              var previousPage = currentPage === 1 ? 1 : parseInt(currentPage - 1);
              Router.go("manageDistrictAssocBystate",{page:previousPage})
          }
        } catch (e) {
        }
    },
    "click #yesButtonDeleteSelected_da":function(e,template){
        $("#confirmDeleteAndNEXTPrevDA").modal('hide');
        $( '.modal-backdrop' ).remove();
        var currentPage = parseInt(Router.current().params.page) || 1;
        var nextPage = parseInt(currentPage + 1);
        arrayToDelete_DA=[];
        template.deleteSelectedDA_DA2.set(undefined)
        template.deleteDAsDB.set(undefined)
        Router.go("manageDistrictAssocBystate",{page:nextPage})
    },
    "click #noButtonDeleteSelected_da":function(){
      $("#confirmDeleteAndNEXTPrevDA").modal('hide');
      $( '.modal-backdrop' ).remove();
    },
    "click #yesButtonDeleteSelectedPrev_da":function(e,template){
        $("#confirmDeleteAndPrevDA").modal('hide');
        $( '.modal-backdrop' ).remove();
        var currentPage = parseInt(Router.current().params.page) || 1;
        var previousPage = currentPage === 1 ? 1 : parseInt(currentPage - 1);
        arrayToDelete_DA=[];
        template.deleteSelectedDA_DA2.set(undefined)
        template.deleteDAsDB.set(undefined)
        Router.go("manageDistrictAssocBystate",{page:previousPage})
    },
    "click #noButtonDeleteSelectedPrev_da":function(){
      $("#confirmDeleteAndPrevDA").modal('hide');
      $( '.modal-backdrop' ).remove();
    },
    'click #deleteSelectedCLUB2_da':function(e,template){
      e.preventDefault()
      var lData = {
        userId:Template.instance().deleteDAsDB.get(),
      }

      $("#confirmDeleteAndPrevDA").modal('hide');
      $( '.modal-backdrop' ).remove();

      Meteor.call("updateDARemoveAffiliation",lData,function(err,res){
        if(res){
          template.deleteSelectedDA_DA2.set(undefined)
          template.deleteDAsDB.set(undefined)
          arrayToDelete_DA=[];
        }
      });
    },
});