Template.PermissionsSettings.onCreated(function(){
	this.subscribe("associationPermissions");
	this.subscribe("associations");
	this.subscribe('onlyLoggedIn');
});

Template.PermissionsSettings.onRendered(function(){
	Session.set("playerEntryV",undefined);
	Session.set("playerEditSetV",undefined);
	Session.set("playerPassV",undefined);
	Session.set("disAEntryV",undefined);
	Session.set("disAEditSetV",undefined);
	Session.set("disAPassV",undefined);
	Session.set("academyEntryV",undefined);
	Session.set("academyEditSetV",undefined);
	Session.set("academyPassV",undefined);
});

Template.PermissionsSettings.helpers({
	"SetEntryVal":function(){
		var data =["yes","no","other"];
		return data;
	},
	"SetEntryVal1":function(){
		var data =["yes","no"];
		return data;
	},
	"SetEntry1":function(){
		var assId = Meteor.users.findOne({"_id":Meteor.userId()});
		if(assId!=undefined&&assId.userId!=undefined){
			var assSet = associationPermissions.findOne({"associationId":assId.userId});
			if(assSet!=undefined){
				if(assSet.playerEntry==this){
					Session.set("playerEntryV",this);
					return "selected"
				}
				else{
					return ""
				}
			}
		}
	},
	"SetEntry2":function(){
		var assId = Meteor.users.findOne({"_id":Meteor.userId()});
		if(assId!=undefined&&assId.userId!=undefined){
			var assSet = associationPermissions.findOne({"associationId":assId.userId});
			if(assSet!=undefined){
				if(assSet.playerEditSet==this){
					Session.set("playerEditSetV",this);
					return "selected"
				}
				else{
					return ""
				}
			}
		}
	},
	"SetEntry3":function(){
		var assId = Meteor.users.findOne({"_id":Meteor.userId()});
		if(assId!=undefined&&assId.userId!=undefined){
			var assSet = associationPermissions.findOne({"associationId":assId.userId});
			if(assSet!=undefined){
				if(assSet.playerChangePass==this){
					Session.set("playerPassV",this);
					return "selected"
				}
				else{
					return ""
				}
			}
		}
	},
	"SetEntry4":function(){
		var assId = Meteor.users.findOne({"_id":Meteor.userId()});
		if(assId!=undefined&&assId.userId!=undefined){
			var assSet = associationPermissions.findOne({"associationId":assId.userId});
			if(assSet!=undefined){
				if(assSet.districtAssocEntry==this){
					Session.set("disAEntryV",this);
					return "selected"
				}
				else{
					return ""
				}
			}
		}
	},
	"SetEntry5":function(){
		var assId = Meteor.users.findOne({"_id":Meteor.userId()});
		if(assId!=undefined&&assId.userId!=undefined){
			var assSet = associationPermissions.findOne({"associationId":assId.userId});
			if(assSet!=undefined){
				if(assSet.districtAssocEditSet==this){
					Session.set("disAEditSetV",this);
					return "selected"
				}
				else{
					return ""
				}
			}
		}
	},
	"SetEntry6":function(){
		var assId = Meteor.users.findOne({"_id":Meteor.userId()});
		if(assId!=undefined&&assId.userId!=undefined){
			var assSet = associationPermissions.findOne({"associationId":assId.userId});
			if(assSet!=undefined){
				if(assSet.districtAssocChangePass==this){
					Session.set("disAPassV",this);
					return "selected"
				}
				else{
					return ""
				}
			}
		}
	},
	"SetEntry7":function(){
		var assId = Meteor.users.findOne({"_id":Meteor.userId()});
		if(assId!=undefined&&assId.userId!=undefined){
			var assSet = associationPermissions.findOne({"associationId":assId.userId});
			if(assSet!=undefined){
				if(assSet.academyEntry==this){
					Session.set("academyEntryV",this);
					return "selected"
				}
				else{
					return ""
				}
			}
		}
	},
	"SetEntry8":function(){
		var assId = Meteor.users.findOne({"_id":Meteor.userId()});
		if(assId!=undefined&&assId.userId!=undefined){
			var assSet = associationPermissions.findOne({"associationId":assId.userId});
			if(assSet!=undefined){
				if(assSet.academyEditSet==this){
					Session.set("academyEditSetV",this);
					return "selected"
				}
				else{
					return ""
				}
			}
		}	
	},
	"SetEntry9":function(){
		var assId = Meteor.users.findOne({"_id":Meteor.userId()});
		if(assId!=undefined&&assId.userId!=undefined){
			var assSet = associationPermissions.findOne({"associationId":assId.userId});
			if(assSet!=undefined){
				if(assSet.academyChangePass==this){
					Session.set("academyPassV",this)
					return "selected"
				}
				else{
					return ""
				}
			}
		}	
	},
});

Template.PermissionsSettings.events({
	"change #playerEntrySelect":function(e){
		e.preventDefault();
		Session.set("playerEntryV",$("#playerEntrySelect").val());
	},
	"change #playerEditSelect":function(e){
		e.preventDefault();
		Session.set("playerEditSetV",$("#playerEditSelect").val());
	},
	"change #playerPassSelect":function(e){
		e.preventDefault();
		Session.set("playerPassV",$("#playerPassSelect").val());
	},
	"change #disAEntrySelect":function(e){
		e.preventDefault();
		Session.set("disAEntryV",$("#disAEntrySelect").val());
	},
	"change #disAEditSelect":function(e){
		e.preventDefault();
		Session.set("disAEditSetV",$("#disAEditSelect").val());
	},
	"change #disAPassSelect":function(e){
		e.preventDefault();
		Session.set("disAPassV",$("#disAPassSelect").val());
	},
	"change #acaEntrySelect":function(e){
		e.preventDefault();
		Session.set("academyEntryV",$("#acaEntrySelect").val());
	},
	"change #acaEditSelect":function(e){
		e.preventDefault();
		Session.set("academyEditSetV",$("#acaEditSelect").val());
	},
	"change #acaPassSelect":function(e){
		e.preventDefault();
		Session.set("academyPassV",$("#acaPassSelect").val());
	},
	"click #saveSetPerMissions":function(e){
		e.preventDefault();
		try{
			var data={
				associationId:Meteor.user().userId.toString(),
				playerEntry:Session.get("playerEntryV"),
				playerEditSet:Session.get("playerEditSetV"),
				playerChangePass:Session.get("playerPassV"),
				districtAssocEntry:Session.get("disAEntryV"),
				districtAssocEditSet:Session.get("disAEditSetV"),
				districtAssocChangePass:Session.get("disAPassV"),
				academyEntry:Session.get("academyEntryV"),
				academyEditSet:Session.get("academyEditSetV"),
				academyChangePass:Session.get("academyPassV")
			}
			Meteor.call("updateAssociationPermissions",data,function(e,r){
				$("#PermissionsSettings").modal('hide');
			});
		}catch(e){
		}
	}
});

