//
export const gcm = require('node-gcm');
export const sender = new gcm.Sender('AAAAjdrIfDQ:APA91bFa7zLdwBWBYg5Dr8zoMDAJDNC-sg6W3FCVMCh9-I_4TCV94h_P1WaAL4jWflgvHZPj1oJWYEIwHvhPgh2D6s74ZmJv3MVoZaX6S4S4JUVoHG1usgaWK1xEixT-I0hb-2lhmY-a');

Meteor.methods({
    'sendNotification': function(xData, data2, topictype) {
        try {
            var message = new gcm.Message({
                data: {
                    key1: xData.categoryIdentifier,
                    key2: data2
                },
                "notification": //ios specific
                {
                    "title": xData.title,
                    "body": xData.body,
                    "sound": xData.sound,
                    "badge": xData.badge,
                }
            });
            var sendOrNot = customCollection.findOne({
                "key": "Notification"
            })

            var send = false
            if (sendOrNot && sendOrNot.send) {
                send = sendOrNot.send
            }

            if (topictype == 1) {

                // Actually send the message
                if (xData.topic == "BroadcastMessages") {
                    var topicID = " '" + xData.topic + "' in topics ";
                    topicID += " && !('" + data2.senderId + "' in topics) ";
                    if (send){
                        sender.send(message, {
                            "condition": topicID
                        }, function(err, response) {

                        });
                    }


                } else {
                    if (send){
                        if(xData.topic == "MatchCollection"){
                            message = new gcm.Message({
                                data: {
                                    key1: xData.categoryIdentifier,
                                    key2: data2
                                },
                                "notification": //ios specific
                                {
                                    "title": xData.title,
                                    "body": xData.body,
                                    "sound": xData.sound,
                                    "badge": xData.badge,
                                }
                            });
                        }

                        sender.send(message, {
                            "topic": "/topics/" + xData.topic
                        }, function(err, response) {
                        });
                    }
                }

            } else if (topictype == 2) {

                if (send){
                    sender.send(message, {
                        "condition": xData.topic
                    }, function(err, response) {

                    });
                }
            } else if (topictype == 3) {

                var count = 0
                var s11 = ""

                for (i = 0; i < xData.topic.length; i++) {
                    if (i == parseInt(count + 3)) {
                        count = i
                    } else {
                        s11 = " '" + xData.topic[i] + "' in topics "
                        if (xData.topic[i + 1] != undefined) {
                            s11 = s11 + "|| '" + xData.topic[i + 1] + "' in topics "
                        }
                        if (xData.topic[i + 2] != undefined) {
                            s11 = s11 + "|| '" + xData.topic[i + 2] + "' in topics "
                        }
                        i = i + 2
                        count = i
                        if (send){
                            sender.send(message, {
                                "condition": s11
                            }, function(err, response) {

                            });
                        }
                    }
                }
            }
        } catch (e) {}
    },


})


/*Meteor.methods({
    "checkDevice":function(){
        try{
        var MetaWear = require('metawear');
        //require('../index')
        // If you know the MAC address, you can uncomment this line
        //MetaWear.discoverByAddress('DD:D1:31:AC:F8:41', function(device) {
        MetaWear.discover(function (device) {

          device.connectAndSetUp(function (error) {
            var pattern = new MetaWear.LedPattern();
            MetaWear.mbl_mw_led_load_preset_pattern(pattern.ref(), MetaWear.LedPreset.BLINK);
            MetaWear.mbl_mw_led_write_pattern(device.board, pattern.ref(), MetaWear.LedColor.GREEN);
            MetaWear.mbl_mw_led_play(device.board);
            // After 5 seconds we reset the board to clear the LED, when we receive
            // a disconnect notice we know the reset is complete, so exit the program
            setTimeout(function () {
              device.on('disconnect', function () {
                process.exit(0);
              });
              MetaWear.mbl_mw_debug_reset(device.board);
            }, 5000);
          });

          // you can be notified of disconnects
          device.on('disconnect', function () {
            console.log('we got disconnected! :( ');
          });
          // you'll need to call connect and set up
          device.connectAndSetUp(function (error) {
            console.log('were connected!');
            setTimeout(function () {
              device.disconnect(function (error) {
                console.log('disconnect call finished');
              });
            }, 1000);
          });
        });
        }catch(e){
            console.log(e)
        }
    }
})*/