taxDetails = new Meteor.Collection('taxDetails');

var taxSchema  =  new SimpleSchema({
	taxRate:{
		type:String,
		label:"tax value",
		optional:true
	},
	cgst:{
		type:String,
		label:"cgst value",
		optional:true
	},
	sgst:{
		type:String,
		label:"sgst value",
		optional:true
	},
	createdDate : {
		type : Date,
		autoValue : function() {
			if (this.isInsert) {
			return new Date();
			} else if (this.isUpsert) {
				return {
					$setOnInsert : new Date()
				};
			} else {
				this.unset();
			}
		}
	}
});

taxDetails.attachSchema(taxSchema);