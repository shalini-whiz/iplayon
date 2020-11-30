/*
* Routes: Public
* Routes that are visible to all (public) users.
*/

Router.route('signup', {
  path: '/signup',
  template: 'signup',
  onBeforeAction: function(){
    Session.set('currentRoute', 'signup');
    this.next();
  }
});

Router.route('registerPage1', {
  path: '/registerPage1',
  template: 'registerPage1',
});

Router.route('loginForgotPassword',{
    path:'/loginForgotPassword/:_PostId',
    template:'loginForgotPassword',
      data: function() {          
         return this.params._PostId; 
      }
  });

Router.route('eventTournamentUpdates', {
    path: '/eventTournamentUpdates',
    template: 'eventTournamentUpdates',
    data: function() {        

    },
         onBeforeAction: function(){
    Session.set('currentRoute', 'eventTournamentUpdates');
    this.next();
  }
});

Router.route('registerPage2',{
    path:'/registerPage2/:_PostId',
    template:'registerPage2',
      /*onBeforeAction:function(){
        if(Meteor.userId()){
          Router.go("/iplayonProfile")
        }
        else{
          Session.set('currentRoute', 'registerPage2');
          this.next();
        }
      },*/
      data: function() {          
         return this.params._PostId; 
      }
  });

/*Router.route('login', {
  loadingTemplate: '',

      waitOn: function () {
        // return one handle, a function, or an array
       // return Meteor.subscribe('users');
    },

  path: '/login',
  template: 'login',
  onBeforeAction: function(){
    Session.set('currentRoute', 'login');
    this.next();
  }
});*/

/*Router.route('/', {
  path: '/login',
  template: 'login',
  onBeforeAction: function(){
    Session.set('currentRoute', 'login');
    this.next();
  }
});*/


Router.route('recover-password', {
  path: '/recover-password',
  template: 'recoverPassword',
  onBeforeAction: function(){
    Session.set('currentRoute', 'recover-password');
    this.next();
  }
});

Router.route('reset-password', {
  path: '/reset-password/:token',
  template: 'resetPassword',
  onBeforeAction: function() {
    Session.set('currentRoute', 'reset-password');
    Session.set('resetPasswordToken', this.params.token);
    this.next();
  }
});



Router.route('iplayonHome', {
  loadingTemplate: '',
  waitOn: function () {
        // return one handle, a function, or an array
       // return Meteor.subscribe('users');
    },
  path: '/iplayonHome',
  template: 'iplayonHome',

  onBeforeAction: function(){
    Session.set('currentRoute', 'iplayonHome');
    this.next();
  }
});





Router.route('eventTournamentDraws1', {
  loadingTemplate: '',
  template:'eventTournamentDraws1',
  path:'/eventTournamentDraws1/:_id',
  waitOn: function () {
    
  },
  onBeforeAction: function(){
    Session.set('currentRoute', 'eventTournamentDraws1');
    this.next();
  }
});

Router.route('homeResults', {
  loadingTemplate: '',
  template:'homeResults',
  path:'/homeResults',
  waitOn: function () {
    
  },
  onBeforeAction: function(){
    Session.set('currentRoute', 'homeResults');
    this.next();
  }
});
Router.route('aboutIplayOn',{
  path:'/aboutIplayOn',
  template:'aboutIplayOn',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/


});


Router.route('iPlayOnPolicy',{
  path:'/iPlayOnPolicy',
  template:'iPlayOnPolicy',
  loadingTemplate: '',

      /*waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('users');
      },*/


});

