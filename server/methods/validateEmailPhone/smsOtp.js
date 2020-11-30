Meteor.methods({
    'sendSMSOTP': function(phone, code) {
        try {
            /*const result = HTTP.call('GET', 'http://193.105.74.159/api/v3/sendsms/plain?', {
                params: {
                    user: "anoopM",
                    password: "Kap@user!123",
                    sender: "KAPNFO",
                    GSM: "91"+phone,
                    type:"longsms",
                    SMSText:" jkfjksd jhdsfjkh jhfgjkdfg kdfhgjkdfhg jhghdfg dfhhjdfgh jhdfhgjkdfg hdfghdfg hkjhhjdf hfdjhhd jhdfghj kjdflkjgdf hsdjkjfjsdjkfjksd jhdsfjkh jhfgjkdfg kdfhgjkdfhg jhghdfg dfhhjdfgh jhdfhgjkdfg hdfghdfg hkjhhjdf hfdjhhd jhdfghj kjdflkjgdf hsdjkjfjsd 1 jkfjksd jhdsfjkh jhfgjkdfg kdfhgjkdfhg jhghdfg dfhhjdfgh jhdfhgjkdfg hdfghdfg hkjhhjdf hfdjhhd jhdfghj kjdflkjgdf hsdjkjfjsd 2 jkfjksd jhdsfjkh jhfgjkdfg kdfhgjkdfhg jhghdfg dfhhjdfgh jhdfhgjkdfg hdfghdfg hkjhhjdf hfdjhhd jhdfghj kjdflkjgdf hsdjkjfjsd 3 jkfjksd jhdsfjkh jhfgjkdfg kdfhgjkdfhg jhghdfg dfhhjdfgh jhdfhgjkdfg hdfghdfg hkjhhjdf hfdjhhd jhdfghj kjdflkjgdf hsdjkjfjsd 4 jkfjksd jhdsfjkh jhfgjkdfg kdfhgjkdfhg jhghdfg dfhhjdfgh jhdfhgjkdfg hdfghdfg hkjhhjdf hfdjhhd jhdfghj kjdflkjgdf hsdjkjfjsd"

                }


            });*/
            return true;
        } catch (e) {
            return false;
        }
    }
});
//http://193.105.74.159/api/v3/sendsms/plain%3Fuser=anoopM&password=Kap@user!123&sender=KAPNFO&SMSText=Manak&type=longsms&GSM=918884692807


//http://193.105.74.159/api/v3/sendsms/plain?user=anoopM&password=Kap@user!123&sender=KAPNFO&SMSText=Manak&type=longsms&GSM=918884692807