/**
 * Meteor Method to send email
 * 
 *
 */

Meteor.methods({
    'sendEmail' : function(xData) {
    
        
     try
     {
        // Check the input
        check(xData, Object);   
         // Giving the TO and FROM address
           
            var dataToret = customCollection.findOne({
                "key" : "mail"
            })
            if(dataToret && dataToret.mail){
                var from  = dataToret.mail

                Email.send({
                  to: xData.emailId,
                  from: from,
                  subject: "Your OTP",
                  text: "Your OTP is "+xData.verificationCode
                });
                return true;
            }

          
          return false;
          
    }
    catch(e)
    {
        return false
    }

  }
});

Meteor.methods({
  sendShareEmail:function(options){
    // you should probably validate options using check before actually
    // sending email
    check(options, Object);
    try{
        this.unblock();
        var dataToret = customCollection.findOne({
            "key" : "mail"
        })
        if(dataToret && dataToret.mail)
        {
            options.from = dataToret.mail
            Email.send(options);
            return true;
        }
        return false;
    }catch(e){
      console.log(e)
        return e
    }
  }
});

Meteor.methods({
  sendShareEmail2:function(options){
    // you should probably validate options using check before actually
    // sending email
    check(options, Object);
         try
     {
        this.unblock();
        var dataToret = customCollection.findOne({
            "key" : "mail"
        })
        if(dataToret && dataToret.mail){
            options.from = dataToret.mail
            Email.send(options,url,function(e,re){
                if(e)
                return e;
                else
                    return re
            });
        }
        return false;
}catch(e){
    return e}
  }
});

Meteor.methods({
  sendShareEmailReport:function(options){
    // you should probably validate options using check before actually
    // sending email

    check(options, Object);
    try{
        this.unblock();
        Email.send(options);
        return true;
    
    }catch(e){
        return e
    }
  }
});