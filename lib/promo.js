
promo = new Meteor.Collection('promo');
var promoSchema  =  new SimpleSchema({
	"promo":{
		type:String,
		label:"promo code"
	},
	"status":{
		type:String,
		label:"status",
		defaultValue:"active"
	},
	"type":{
		type:String,
		label:"promo type",
		optional:true
	},
	"offer":{
		type:Number,
		label:"offer price",
		optional:true
	}

});
promo.attachSchema(promoSchema);