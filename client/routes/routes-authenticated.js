/*
* Routes: Authenticated
* Routes that are only visible to authenticated users.
*/

Router.route('index', {
  path: '/',
  loadingTemplate: '',
  template: 'upcomingEvents'
});

Router.route('apiKey', {
  path: '/apiKey',
  template: 'getListofPlayers'
});

Router.route('userLandingPage', {
    path: '/userLandingPage',
    template: 'userLandingPage'
});

Router.route('userProfileSettings', {
    path: '/userProfileSettings',
    template: 'userProfileSettings',
      loadingTemplate: '',

      waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('onlyLoggedIn');
      },
         onBeforeAction: function(){
    Session.set('currentRoute', 'createEvents');
    this.next();
  }
});
/*
Router.route('createEvents', {
  path: '/98*create71Events34Z*',
  template: 'createEvents',
  onBeforeAction: function(){
    Session.set('currentRoute', 'createEvents');
    GoogleMaps.load({
      libraries: 'places'
    });
    this.next();
  }
});*/

Router.route('liveUpdates', {
  path: '/liveUpdates',
  template: 'liveUpdates',
  onBeforeAction: function(){
    Session.set('currentRoute', 'liveUpdates');
    this.next();
  }
});

Router.route('pastUpdates', {
  path: '/pastUpdates',
  template: 'pastUpdates',
  onBeforeAction: function(){
    Session.set('currentRoute', 'pastUpdates');
    this.next();
  }
});

Router.route('createTeams', {
    path: '/createTeams',
    template: 'teamCreation',
    onBeforeAction: function(){
      Session.set('currentRoute', 'createTeams');
      this.next();
    }
});


Router.route('myEvents', {
    path: '/myEvents',
    template: 'myEvents',
     // loadingTemplate: '',

     // waitOn: function () {
        // return one handle, a function, or an array
        //return Meteor.subscribe('onlyLoggedIn');
     // },
         onBeforeAction: function(){
    Session.set('currentRoute', 'myEvents');
    this.next();
  }

});

Router.route('myEventsPast', {
    path: '/myEventsPast',
    template: 'myEventsPast',
     // loadingTemplate: '',

     // waitOn: function () {
        // return one handle, a function, or an array
       //return Meteor.subscribe('onlyLoggedIn');
     // },
         onBeforeAction: function(){
    Session.set('currentRoute', 'myEventsPast');
    this.next();
  }

});

Router.route('pastEvents', {
    path: '/pastEvents',
    template: 'pastEvents',
   // loadingTemplate: '',
    //waitOn: function () {
        // return one handle, a function, or an array
   //     return Meteor.subscribe('onlyLoggedIn');
     // },
     onBeforeAction: function(){
    Session.set('currentRoute', 'pastEvents');
    this.next();
  }
});

Router.route('upcomingEvents', {
    path: '/upcomingEvents',
    template: 'upcomingEvents',
    //loadingTemplate: '',
     //waitOn:function(){
     // return [Meteor.subscribe("onlyLoggedIn"),Meteor.subscribe("onlyLoggedInALLRoles")]
  //}//,
       onBeforeAction: function(){
    Session.set('currentRoute', 'upcomingEvents');
    this.next();
  }  
});

Router.route('subscribersList',{
  path:'/subscribersList/:_PostId',
  template:'subscribersList',
    data: function() {          
       return this.params._PostId; 
    }
})


Router.route('editEvents',{
  path:'/editEvents/:_PostId',
  template:'editEvents',
      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('onlyLoggedIn');
      },
    data: function() {          
       return this.params._PostId; 
    },*/
    onBeforeAction: function(){
      GoogleMaps.load({ v: '3', key: 'AIzaSyAEBfrkNy9K0WEE5E0iUuZb7-53s6j5QRo', libraries: 'places' });
      this.next();
    }
})




Router.route('eventTournamentDraws',{
  path:'/eventTournamentDraws/:_id/:_eventType',
  template:'eventTournamentDraws',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/
    data: function() {          
       return this.params._PostId; 
    },
 onBeforeAction: function(){
    Session.set('currentRoute', 'eventTournamentDraws');
    this.next();
  }
});

Router.route('testTTFIAPI',{
  path:'/testTTFIAPI',
  template:'testTTFIAPI',
  loadingTemplate: '',
  onBeforeAction: function(){
    Session.set('currentRoute', 'testTTFIAPI');
    this.next();
  }
});

Router.route('testAPI',{
  path:'/testAPI',
  template:'testAPI',
  loadingTemplate: '',
  onBeforeAction: function(){
    Session.set('currentRoute', 'testAPI');
    this.next();
  }
});



Router.route('rankPoints',{
  path:'/rankPoints',
  template:'rankPoints',
  loadingTemplate: '',
  onBeforeAction: function(){
    Session.set('currentRoute', 'rankPoints');
    this.next();
  }
});





Router.route('roundRobinDraws',{
  path:'/roundRobinDraws/:_id/:_eventType',
  template:'roundRobinDraws',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/
    data: function() {          
       return this.params._PostId; 
    },
 onBeforeAction: function(){
    Session.set('currentRoute', 'roundRobinDraws');
    this.next();
  }
});



Router.route('Analytics',{
  path:'/Analytics/:_id',
  template:'Analytics',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/
    data: function() {          
       return this.params._PostId; 
    },
 onBeforeAction: function(){
    Session.set('currentRoute', 'Analytics');
    this.next();
  }
});

Router.route('RankingAnalytics',{
  path:'/RankingAnalytics/:_id',
  template:'RankingAnalytics',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/
    data: function() {          
       return this.params._PostId; 
    },
 onBeforeAction: function(){
    Session.set('currentRoute', 'RankingAnalytics');
    this.next();
  }
});


Router.route('viewEvents',{
  path:'/viewEvents/:_PostId',
  template:'viewEvents',
 // loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('onlyLoggedIn');
      },*/
    data: function() {          
       return this.params._PostId; 
    },
    onBeforeAction: function(){
      Session.set('currentRoute', 'viewEvents');
      GoogleMaps.load({ v: '3', key: 'AIzaSyAEBfrkNy9K0WEE5E0iUuZb7-53s6j5QRo', libraries: 'places' });
      this.next();
    },

});

Router.route('changeLoginId',{
  path:'/changeLoginId/:_PostId',
  template:'changeLoginId',
    data: function() {          
       return this.params._PostId; 
    }
});

Router.route('viewPastEvents',{
  path:'/viewPastEvents/:_PostId',
  template:'viewPastEvents',
  //loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('onlyLoggedIn');
      },*/
    data: function() {          
       return this.params._PostId; 
    },
    onBeforeAction: function(){
      Session.set('currentRoute', 'viewPastEvents');
      GoogleMaps.load({ v: '3', key: 'AIzaSyAEBfrkNy9K0WEE5E0iUuZb7-53s6j5QRo', libraries: 'places' });
      this.next();
    },
});

Router.route('myTeams', {
    path: '/myTeams',
    template: 'myTeams',
    loadingTemplate: '',

      waitOn: function () {
        // return one handle, a function, or an array
        //return Meteor.subscribe('users');
      },
         onBeforeAction: function(){
    Session.set('currentRoute', 'myTeams');
    this.next();
  }
});

Router.route('editTeams',{
  path:'/editTeams/:_PostId',
  template:'teamEdit',
    data: function() {          
       return this.params._PostId; 
    }
});

Router.route('myEntries', {
    path: '/myEntries',
    template: 'myEntries',
    loadingTemplate: '',

      waitOn: function () {
        // return one handle, a function, or an array
        // teams
        //return [Meteor.subscribe('users'),Meteor.subscribe('teams')];
    },
         onBeforeAction: function(){
    Session.set('currentRoute', 'myEntries');
    this.next();
  }
});

Router.route('myEntriesPAst', {
    path: '/myEntriesPAst',
    template: 'myEntriesPAst',
    loadingTemplate: '',

      waitOn: function () {
        // return one handle, a function, or an array
        // teams
        //return [Meteor.subscribe('users'),Meteor.subscribe('teams')];
    },
         onBeforeAction: function(){
    Session.set('currentRoute', 'myEntriesPAst');
    this.next();
  }
});

Router.route('viewTeam',{

    loadingTemplate: '',

      waitOn: function () {
        // return one handle, a function, or an array
        //return Meteor.subscribe('users');
    },
    path:'/viewTeam/:_PostId',
    template:'viewTeam',
      data: function() {          
         return this.params._PostId; 
      }
  });

Router.route('gmap', {
    path: '/gmap',
    template: 'gmap',
         onBeforeAction: function(){
    Session.set('currentRoute', 'gmap');
    this.next();
  }
});


Router.route('createMenu', {
  path: '/createEvents98',
  template: 'createMenu',
  onBeforeAction: function(){
    Session.set('currentRoute', 'createEvents');
     this.next();
  }
});

Router.route('insertPlayers', {
  path: '/insertPlayers98',
  template: 'insertPlayers',
  onBeforeAction: function(){
    Session.set('insertPlayers', 'insertPlayers');
     this.next();
  }
});

Router.route('createEvents', {
  path: '/createEvents/te',
  template: 'createEventsTour',
  onBeforeAction: function(){
    Session.set('currentRoute', 'createEventsTour');
    try{
      GoogleMaps.load({ v: '3', key: 'AIzaSyAEBfrkNy9K0WEE5E0iUuZb7-53s6j5QRo', libraries: 'places' });
    }catch(e){}
    this.next();
  }
});


Router.route('createEventsAll',{
  path:'/createEvents/t/:_PostId',
  template:'createEventsAll',
    data: function() {          
       return this.params._PostId; 
    },
    onBeforeAction: function(){
      GoogleMaps.load({ v: '3', key: 'AIzaSyAEBfrkNy9K0WEE5E0iUuZb7-53s6j5QRo', libraries: 'places' });
      this.next();
    }
});

Router.route('Activate',{
  path:'/Activate/:_id1/:_id2/:_id3/:_id4',
  template:'Activate',
    data: function() {          
       return this.params._PostId; 
    },
    onBeforeAction: function(){

    }
});


Router.route('en/terms/index.html',{
  path:'/en/terms/index.html',
  template:'pdf',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/


});

Router.route('subscribeToTournamemnt',{
  path:'/subscribeToTournamemnt/:_PostId',
  template:'subscribeToTournamemnt',
      loadingTemplate: '',

      waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('onlyLoggedIn');
      },
    data: function() {          
       return this.params._PostId; 
    },
    onBeforeAction: function(){
      Session.set('currentRoute', 'subscribeToTournamemnt');
      this.next();
    },

});

Router.route('entryFromAcademy',{
  path:'/entryFromAcademy/:_PostId/:page?',
  template:'entryFromAcademy',
     // loadingTemplate: '',

     // waitOn: function () {
       // return Meteor.subscribe('users');
        // return one handle, a function, or an array
      //},
    data: function() {          
       return this.params._PostId; 
    },
    onBeforeAction: function(){
      Session.set('currentRoute', 'entryFromAcademy');
      this.next();
    },

});


Router.route('feeList',{
  path:'/feeList/:_id/:page?',
  template:'feeListHeader',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/
    data: function() {          
       return this.params._PostId; 
    },
 onBeforeAction: function(){
    Session.set('currentRoute', 'feeList');
    this.next();
  }
});

Router.route('statistics',{
  path:'/statistics/:_id',
  template:'statistics',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/

 onBeforeAction: function(){
    Session.set('currentRoute', 'statistics');
    this.next();
  }
});

Router.route('adminUpload',{
  path:'/adminUploadPlayers',
  template:'adminUpload',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/

 onBeforeAction: function(){
    Session.set('currentRoute', 'adminUploadPlayers');
    this.next();
  }
});

Router.route('adminUploadPlayersAssociation',{
  path:'/adminUploadPlayersAssociation',
  template:'adminUploadPlayersAssociation',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/

 onBeforeAction: function(){
    Session.set('currentRoute', 'adminUploadPlayersAssociation');
    this.next();
  }
});


Router.route('adminMenu',{
  path:'/adminMenu',
  template:'adminMenu',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/

 onBeforeAction: function(){
    Session.set('currentRoute', 'adminMenu');
    this.next();
  }
});

Router.route('adminUploadPoints',{
  path:'/adminUploadPoints',
  template:'adminUploadPoints',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/

 onBeforeAction: function(){
    Session.set('currentRoute', 'adminUploadPoints');
    this.next()
  }
});



Router.route('adminManagePlayers',{
  path:'/adminManagePlayers',
  template:'adminManagePlayers',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/

 onBeforeAction: function(){
    Session.set('currentRoute', 'adminManagePlayers');
    this.next()
  }
});



Router.route('layoutTestPDF',{
  path:'/layoutTestPDF',
  template:'layoutTestPDF',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/

 onBeforeAction: function(){
    Session.set('currentRoute', 'layoutTestPDF');
    this.next()
  }
});

Router.route('statisticsList',{
  path:'/statisticsList/:_id/:page?',
  template:'statisticsList',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/

 onBeforeAction: function(){
    Session.set('currentRoute', 'statisticsList');
    this.next();
  }
});

Router.route('managePlayersAssocAcad',{
  path:'/managePlayersAssocAcad/:page?',
  template:'managePlayersAssocAcad',
  onBeforeAction: function(){
    Session.set('currentRoute', 'managePlayersAssocAcad');
    this.next();
  }
});

Router.route('manageAcademiesAssoc',{
  path:'/manageAcademiesAssoc/:page?',
  template:'manageAcademiesAssoc',
  onBeforeAction: function(){
    Session.set('currentRoute', 'manageAcademiesAssoc');
    this.next();
  }
});

Router.route('manageDistrictAssocBystate',{
  path:'/manageDistrictAssocBystate/:page?',
  template:'manageDistrictAssocBystate',
  onBeforeAction: function(){
    Session.set('currentRoute', 'manageDistrictAssocBystate');
    this.next();
  }
});


Router.route('uploadPoints', {
  path: '/uploadPoints',
  template: 'adminUploadPoints',
  onBeforeAction: function(){
    Session.set('currentRoute', 'createEvents');
     this.next();
  }
});



Router.route('deletePoints',{
  path:'/deletePoints',
  template:'adminDeletePoints',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'adminDeletePoints');
    this.next()
  }
});

Router.route('adminTeamFormat',{
  path:'/adminTeamFormat',
  template:'adminTeamFormat',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'adminTeamFormat');
    this.next()
  }
});

Router.route('adminStrokes',{
  path:'/adminStrokes',
  template:'adminStrokes',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'adminStrokes');
    this.next()
  }
});

Router.route('playerAnalytics',{
  path:'/playerAnalytics/:page?',
  template:'playerAnalytics',
  onBeforeAction: function(){
    Session.set('currentRoute', 'playerAnalytics');
    this.next();
  }
});

Router.route('tweets',{
  path:'/tweets',
  template:'tweets',
  onBeforeAction: function(){
    Session.set('currentRoute', 'tweets');
    this.next();
  }
});


Router.route('adminManageHashTags',{
  path:'/adminManageHashTags',
  template:'adminManageHashTags',
  onBeforeAction: function(){
    Session.set('currentRoute', 'adminManageHashTags');
    this.next();
  }
});

Router.route('editHashTags',{
  path:'/editHashTags',
  template:'editHashTags',
  onBeforeAction: function(){
    Session.set('currentRoute', 'editHashTags');
    this.next();
  }
});

Router.route('playerSequenceMain',{
  path:'/playerSequenceMain',
  template:'playerSequenceMain',
  onBeforeAction: function(){
    Session.set('currentRoute', 'playerSequenceMain');
    this.next();
  }
});


/*Router.route('playerAnalyticsRectChart',{
  path:'/playerAnalyticsRectChart',
  template:'playerAnalyticsRectChart',
  onBeforeAction: function(){
    Session.set('currentRoute', 'playerAnalyticsRectChart');
    this.next();
  }
});*/

Router.route('playerAnalyticsRectChart',{
  path:'/playerAnalyticsRectChart/:page?',
  template:'playerAnalyticsRectChart',
  onBeforeAction: function(){
    Session.set('currentRoute', 'playerAnalyticsRectChart');
    this.next();
  }
});

Router.route('testCALENDER',{
  path:'/testCALENDER',
  template:'testCALENDER',
  onBeforeAction:function(){
    Session.set('currentRoute','testCALENDER')
    this.next()
  }
});

Router.route('iplayonProfile', {
  loadingTemplate: '',
  waitOn: function () {
        // return one handle, a function, or an array
       // return Meteor.subscribe('users');
    },
  path: '/iplayonProfile',
  template: 'iplayonProfile',

  onBeforeAction: function(){
    Session.set('currentRoute', 'iplayonProfile');
    this.next();
  }
});
Router.route('getaboutIplayOn',{
  path:'/getaboutIplayOn',
  template:'aboutIplayOn',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/


});


Router.route('adminManageTournament',{
  path:'/adminManageTournament',
  template:'adminManageTournament',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'adminManageTournament');
    this.next()
  }
});

Router.route('createAdminArticles',{
  path:'/createAdminArticles',
  template:'createAdminArticles',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'createAdminArticles');
    this.next()
  }
});

Router.route('articlesMainMenu',{
  path:'/articlesMainMenu',
  template:'articlesMainMenu',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'articlesMainMenu');
    this.next()
  }
});


Router.route('viewAdminArticles',{
  path:'/viewAdminArticles',
  template:'viewAdminArticles',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'viewAdminArticles');
    this.next()
  }
});

Router.route('approveArticles',{
  path:'/approveArticles',
  template:'approveArticles',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'approveArticles');
    this.next()
  }
});



Router.route('createInsertUpdatePacks',{
  path:'/createInsertUpdatePacks',
  template:'createInsertUpdatePacks',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'createInsertUpdatePacks');
    this.next()
  }
});

Router.route('removeInsertedPacks',{
  path:'/removeInsertedPacks',
  template:'removeInsertedPacks',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'removeInsertedPacks');
    this.next()
  }
});

Router.route('createInsertUpdateCategories',{
  path:'/createInsertUpdateCategories',
  template:'createInsertUpdateCategories',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'createInsertUpdateCategories');
    this.next()
  }
});

Router.route('removeInsertedCategories',{
  path:'/removeInsertedCategories',
  template:'removeInsertedCategories',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'removeInsertedCategories');
    this.next()
  }
});

Router.route('tournScheduler',{
  path:'/tournScheduler',
  template:'tournScheduler',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'tournScheduler');
    this.next()
  }
});

Router.route('tournSchedulerEdit',{
  path:'/tournSchedulerEdit',
  template:'tournSchedulerEdit',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'tournSchedulerEdit');
    this.next()
  }
});


/**************** pack feature route *******************/
Router.route('addPackFeature',{
  path:'/addPackFeature',
  template:'addPackFeature',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'addPackFeature');
    this.next()
  }
});

Router.route('removePackFeature',{
  path:'/removePackFeature',
  template:'removePackFeature',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'removePackFeature');
     this.next()
  }
});
Router.route('tournScheduleMainMenu',{
  path:'/tournScheduleMainMenu',
  template:'tournScheduleMainMenu',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'tournScheduleMainMenu');
    this.next()
  }
});

Router.route('tournSchedulerView',{
  path:'/tournSchedulerView',
  template:'tournSchedulerView',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'tournSchedulerView');
    this.next()
  }
});

Router.route('tournSchedulerPastEvents',{
  path:'/tournSchedulerPastEvents',
  template:'tournSchedulerPastEvents',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'tournSchedulerPastEvents');
    this.next()
  }
});

Router.route('tournSchedulerEditPast',{
  path:'/tournSchedulerEditPast',
  template:'tournSchedulerEditPast',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'tournSchedulerEditPast');
    this.next()
  }
});

Router.route('tournSchedulerPastEventsView',{
  path:'/tournSchedulerPastEventsView',
  template:'tournSchedulerPastEventsView',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'tournSchedulerPastEventsView');
    this.next()
  }
});


/*********************** finance admin ******************/
Router.route('adminFinance',{
  path:'/adminFinance',
  template:'adminFinance',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'adminFinance');
    this.next()
  }
});


Router.route('myFinance',{
  path:'/myFinance',
  template:'myFinance',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'myFinance');
    this.next()
  }
});

Router.route('adminCustomAPI',{
  path:'/adminCustomAPI',
  template:'adminCustomAPI',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'adminCustomAPI');
    this.next()
  }
});


Router.route('adminRoleAPI',{
  path:'/adminRoleAPI',
  template:'adminRoleAPI',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'adminRoleAPI');
    this.next()
  }
});

Router.route('adminAddCategories',{
  path:'/adminAddCategories',
  template:'adminAddCategories',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'adminAddCategories');
    this.next()
  }
});

Router.route('tournamentProjects',{
  path:'/tournamentProjects',
  template:'tournamentProjects',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'tournamentProjects');
    this.next()
  }
});

Router.route("adminChangeUserDetails",{
   path:'/adminChangeUserDetails',
  template:'adminChangeUserDetails',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'adminChangeUserDetails');
    this.next()
  }
})
Router.route("testTTFIAPITest",{
   path:'/testTTFIAPITest',
  template:'testTTFIAPITest',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'testTTFIAPITest');
    this.next()
  }
})

Router.route("getUserDetailsForGivenEmailOrPhone",{
   path:'/getUserDetailsForGivenEmailOrPhone',
  template:'getUserDetailsForGivenEmailOrPhone',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'getUserDetailsForGivenEmailOrPhone');
    this.next()
  }
})

Router.route("tournamentEventOrg_FANAPP",{
   path:'/tournamentEventOrg_FANAPP',
  template:'tournamentEventOrg_FANAPP',
  loadingTemplate: '',
 onBeforeAction: function(){
    Session.set('currentRoute', 'tournamentEventOrg_FANAPP');
    this.next()
  }
})

Router.route("schoolRegisterUpload",{
  path:'/schoolRegisterUpload',
  template:'schoolRegisterUpload',
  loadingTemplate: '',
   onBeforeAction: function(){
      Session.set('currentRoute', 'schoolRegisterUpload');
      this.next()
    }
})


Router.route("eventSchedule",{
  path:'/eventSchedule',
  template:'eventSchedule',
  loadingTemplate: '',
   onBeforeAction: function(){
      Session.set('currentRoute', 'eventSchedule');
      this.next()
    }
})