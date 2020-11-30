paymentTransaction = new Meteor.Collection('paymentTransaction');

var paymentTransactionSchema  =  new SimpleSchema({
    "tournamentId":{
        type:String,
        label:"Tournament ID"
    },
    "playerId":{
        type:String,
        label:"Player ID",
    },
    "transactionId":{
        type:String,
        label:"Payment Log Transaction ID",
        defaultValue :"",
    },
    "transactionType":{
        type:String,
        label:"Transaction Type",
        defaultValue:"payment"
    },
    "transactionFee":{
        type:String,
        label:"Transaction Fee",
    },
    "subscribedEvents":{
        type:[String],
        label:"Subscribed Events",
    },
    "unSubscribedEvents":{
        type:[String],
        label:"Unsubscribed Events",
        optional:true
    },
    "transactionDate":{
        type:Date,
        defaultValue:new Date()
    }

    
});
paymentTransaction.attachSchema(paymentTransactionSchema);




entryTransaction = new Meteor.Collection('entryTransaction');

var entryTransactionSchema  =  new SimpleSchema({
    "tournamentId":{
        type:String,
        label:"Tournament ID"
    },
    "playerId":{
        type:String,
        label:"Player ID",
    },
    "transactionId":{
        type:String,
        label:"Entry Transaction ID",
        defaultValue :"",
    },
    "transactionType":{
        type:String,
        label:"Transaction Type",
        defaultValue:"payment"
    },
    "paid":{
        type:String,
        label:"Transaction Fee",
    },
    "refund":{
        type:String,
        label:"Transaction Fee",
    },
    "subscribedEvents":{
        type:[String],
        label:"Entry Subscribed Events",
    },
    "transactionDate":{
        type:Date,
        defaultValue:new Date()
    }
});
entryTransaction.attachSchema(entryTransactionSchema);








