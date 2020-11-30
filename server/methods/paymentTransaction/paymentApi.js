var sha512 = require("js-sha512");


Meteor.methods({

	generatePaymentHash:function(data)
	{
		try{

            var param = data;
            var key =  param.key;
            var txnid =  param.txnid;
            var amount =  param.amount;
            var productinfo =  param.productinfo;

			var firstname =  param.firstname;
            var email =  param.email;
            var udf1 =  param.udf1;
            var udf2 =  param.udf2;
            var udf3 =  param.udf3;
            var udf4 =  param.udf4;
            var udf5 =  param.udf5;
            var udf6 = "";
            var udf7 = "";
            var udf8 = "";
            var udf9 = "";
            var udf10 = "";
            var salt =  param.salt;
            var emptyString = "";

			var hashSequence = key+"|"+txnid+"|"+amount+"|"+productinfo+"|"+
			firstname+"|"+email+"|"+udf1+"|"+udf2+"|"+udf3+"|"+udf4+"|"+udf5+"|"+
			udf6+"|"+udf7+"|"+udf8+"|"+udf9+"|"+udf10+"|"+salt;

        	var hash = sha512(hashSequence).toLowerCase();
 
			var resultJson = {};
            resultJson["status"] = "success";
            resultJson["payment_hash"] = hash;
            return resultJson;


		}catch(e){
		}
	},
      
});