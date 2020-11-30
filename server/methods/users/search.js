/**
 * Meteor Method to delete an event for the given id
 *
 * @CollectionName: events call meteor check function to check reference value
 *                  is String
 */
Meteor.methods({
    'search' : function(re) {
       try{
        check(re, String)
      }
        catch(e){

        }
        if(re=="")
        {
            return null;
        }
        else
        {
          // Find myteams(teams I am a member of)
          //var myTeams=teams.find( { teamMembers: { $elemMatch:  {$eq: Meteor.userId() }  } } ).fetch();
       
          var reg="/^"+re+"/i";
          var reObj = new RegExp(re, 'i');
       
          var searchUser = Meteor.users.find({ userName: {$regex: reObj}},{ limit: 6 }).fetch();
       


          return searchUser;
        }

    }
})

Meteor.methods({
    'searchForAcademies' : function(re) {
       try{
        check(re, String)
      }
        catch(e){

        }
        if(re=="")
        {
            return null;
        }
        else
        {
          // Find myteams(teams I am a member of)
          //var myTeams=teams.find( { teamMembers: { $elemMatch:  {$eq: Meteor.userId() }  } } ).fetch();
       
          var reg="/^"+re+"/i";
          var reObj = new RegExp(re, 'i');
       
          var searchUser = Meteor.users.find({ clubName: {$regex: reObj},role:"Academy",associationId:"other"},{ limit: 6 }).fetch();
         return searchUser;
        }

    }
})