//send otp for registration
Meteor.methods({
    PsendRegOtpWithValidations: async function(caller, apiKey, data) {
        //console.log("sdfklj !!!")
        //console.log(caller)
        //console.log(apiKey)
        //console.log(data)
        var res = {
            data: 0,
            message: SEND_OTP_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            //console.log("1sdfklj !!!")
            if (typeof JSON.stringify(data) == "string") {
                //console.log("2sdfklj !!!")
                data = data.replace("\\", "");
                data = JSON.parse(data);
            }
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                //console.log("3sdfklj !!!")
                if (apiUsersData && apiUsersData.apiUser) {
                    //console.log("4sdfklj !!!")
                    data.source = apiUsersData.apiUser
                } else {
                    return res
                }
                //console.log("5sdfklj !!!")
                data.validationType = ["emailOrPhoneValue", "emailIdOrPhone"]
                var resValid = await Meteor.call("validationForEmailPhoneRole", data)
                if (resValid && resValid.status == SUCCESS_STATUS) {
                    //console.log("6sdfklj !!!")
                    var listsRequired = [
                        "countryList",
                        "sportList",
                        "domainList"
                    ]
                    return (Meteor.call("registerOtpGeneralized", data.emailOrPhoneValue, data.emailIdOrPhone, listsRequired));
                } else if (resValid && resValid.status == FAIL_STATUS) {
                    //console.log("7sdfklj !!!")
                    return resValid
                } else {
                    //console.log("8sdfklj !!!")
                    return res
                }

            } else {
                //console.log("9sdfklj !!!")
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//Register TTFI Admin
Meteor.methods({
    PregisterTTFIAdmin: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: REGISTER_FAIL_MSG + "Organiser",
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof JSON.stringify(data) == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }

                return (Meteor.call("registerTTFIAdminAPI", data));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})

//Login TTFI Admin
Meteor.methods({
    PloginUserWithValidations: async function(caller, apiKey, data) {
        try {
            var res = {
                data: 0,
                message:LOGIN_FAIL_MSG,
                status: FAIL_STATUS,
                response: ""
            }
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if (typeof JSON.stringify(data) == "string") {
                    data = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                } else {
                    return res
                }
                data.validationType = ["emailOrPhoneValue", "emailIdOrPhone", "password"]
                
                var resValid = await Meteor.call("validationForEmailPhoneRole", data)
                if (resValid && resValid.status == SUCCESS_STATUS) {
                    var lData = {
                        emailIdOrPhone: data.emailIdOrPhone,
                        userId: data.emailOrPhoneValue,
                        password: data.password
                    }

                    //console.log("ldata to change pass")
    
                    var resPasw = await Meteor.call("PuserValidation", data.emailOrPhoneValue, 
                        data.password, data.emailIdOrPhone,false,true);

                    //console.log("pass ch")
                    //console.log(resPasw)
                    //console.log(typeof resPasw)
                    if (resPasw && typeof resPasw == "string") {
                        res.message = resPasw
                        return res
                    }
                    else if(resPasw && typeof resPasw == "object" &&
                        resPasw.verify != undefined && resPasw.verify != null
                        && resPasw.verify == true && resPasw.type && 
                        resPasw.userId){
                        res.message = "verify your "+resPasw.type+" before login"
                        res["verify"] = true
                        res["type"] = resPasw.type
                        res["userId"] = resPasw.userId
                        return res
                    }
                    else if(resPasw && typeof resPasw == "object"){
                        var dataToRet = []
                        var datares = await Meteor.call("getMeteorUserDetailsForEmailOrPhone", lData);
                        if (datares && resPasw.dataFetchedFrom) {
                            var dataToRet1 = {
                                "collectionName": "Meteor.users",
                                "data": datares
                            }
                            dataToRet.push(dataToRet1)
                            var dataToRet2 = {
                                "collectionName": resPasw.dataFetchedFrom,
                                "data": resPasw
                            }
                            dataToRet.push(dataToRet2)
                            var ress = {
                                data: dataToRet,
                                status: SUCCESS_STATUS,
                                message: LOGIN_SUCCESS_MSG
                            }
                            return ress
                        }
                        else {
                            var ress = {
                                status: FAIL_STATUS,
                                message: LOGIN_SUCCESS_FAIL_MSG
                            }
                            return ress
                        }
                    }
                    else {
                        return res
                    }
                } else if (resValid && resValid.status == FAIL_STATUS) {
                    return resValid
                } else {
                    return res
                }

            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//send otp for change or forgot password
Meteor.methods({
    PsendNewPasswordOtpWithValidations: async function(caller, apiKey, data, method) {
        try {
            var res = {
                data: 0,
                message: SEND_OTP_FAIL_MSG,
                status: FAIL_STATUS,
                response: ""
            }
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if (typeof JSON.stringify(data) == "string") {
                    data = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                } else {
                    return res
                }
                data.validationType = ["emailOrPhoneValue", "emailIdOrPhone", "role"]
                var resValid = await Meteor.call("validationForEmailPhoneRole", data)
                if (resValid && resValid.status == SUCCESS_STATUS) {
                    return (Meteor.call("otpForgotPassword", data.emailOrPhoneValue, data.emailIdOrPhone, data.role));
                } else if (resValid && resValid.status == FAIL_STATUS) {
                    return resValid
                } else {
                    return res
                }

            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})

//Change Password
Meteor.methods({
    PsetNewPasswordWithValidations: async function(caller, apiKey, data) {
        try {
            var res = {
                data: 0,
                message:PASSWORD_SET_FAIL_MSG,
                status: FAIL_STATUS,
                response: ""
            }
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if (typeof JSON.stringify(data) == "string") {
                    data = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                } else {
                    return res
                }
                data.validationType = ["emailOrPhoneValue", "emailIdOrPhone", "password"]
                var resValid = await Meteor.call("validationForEmailPhoneRole", data)
                if (resValid && resValid.status == SUCCESS_STATUS) {

                    var lData = {
                        emailIdOrPhone: data.emailIdOrPhone,
                        userId: data.emailOrPhoneValue,
                        password: data.password
                    }
                    //console.log("ldata to change pass")
                    //console.log(lData)

                    var resPasw = await Meteor.call("resetPasswordAfterVerification", lData);
                    //console.log("pass ch")
                    //console.log(resPasw)
                    if (resPasw) {
                        var datares = await Meteor.call("getMeteorUserDetailsForEmailOrPhone", lData);
                        if (datares) {
                            var dataToRet = {
                                "collectionName": "Meteor.users",
                                "data": datares
                            }
                            var ress = {
                                data: dataToRet,
                                status: SUCCESS_STATUS,
                                message: PASSWORD_SET_SUCCESS_MSG
                            }
                            return ress
                        } else {
                            var ress = {
                                status: FAIL_STATUS,
                                message: PASSWORD_SUCCESS_FAIL_MSG
                            }
                            return ress
                        }
                    } else {
                        var ress = {
                            status: FAIL_STATUS,
                            message: PASSWORD_SET_FAIL_MSG
                        }
                        return ress
                    }
                } else if (resValid && resValid.status == FAIL_STATUS) {
                    return resValid
                } else {
                    return res
                }

            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get details country and state
Meteor.methods({
    PgetDetailsOfCountryState: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_COU_STATE_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {

                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }

                return (Meteor.call("getDetailsOfCountryState", data));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})

//get state details for given country
Meteor.methods({
    PgetDetailsOfCountryForGivenCountryName: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_COU_STATE_FOR_COU_DET_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {

                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                var dbDetails = false
                if(data.dbDetails){
                    dbDetails = data.dbDetails
                }

                return (Meteor.call("getDetailsOfCountryForGivenCountryName", data,dbDetails));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})

//Register a state association
Meteor.methods({
    PregisterTTFIStateAssocAPI: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: REGISTER_FAIL_MSG+"State association",
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof JSON.stringify(data) == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }

                return (Meteor.call("registerTTFIStateDistAssocAPI", data,"State/Province/County"));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})

//Register a district association
Meteor.methods({
    PregisterTTFIDistAssocAPI: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: REGISTER_FAIL_MSG+"District association",
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof JSON.stringify(data) == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }

                return (Meteor.call("registerTTFIStateDistAssocAPI", data, "District/City"));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})

//Register an academy 
Meteor.methods({
    PregisterTTFIAcademyAPI: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: REGISTER_FAIL_MSG+"Academy",
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof JSON.stringify(data) == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }

                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("registerTTFIAcademyAPI", data,true));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//Affiliate da under sa
Meteor.methods({
    PaffiliateDAToSA: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: CANNOT_AFFIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof JSON.stringify(data) == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }

                return (Meteor.call("affiliateDAOrAcademyAPI", data,1));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})

//Affiliate academy under da
Meteor.methods({
    PaffiliateAcademyToDA: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: CANNOT_AFFIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof JSON.stringify(data) == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }

                return (Meteor.call("affiliateDAOrAcademyAPI", data,2));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})

//Affiliate academy under sa
Meteor.methods({
    PaffiliateAcademyToSA: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message:CANNOT_AFFIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof JSON.stringify(data) == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }

                return (Meteor.call("affiliateDAOrAcademyAPI", data,3));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})

//fetch state association
Meteor.methods({
    PgetListOfStateAssociations: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_ASSOC_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getListOfStateDistAssociations", data,"State/Province/County"));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//fetch district association
Meteor.methods({
    PgetListOfDistAssociations: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_ASSOC_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getListOfStateDistAssociations", data,"District/City"));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//fetch academies
Meteor.methods({
    PgetListOfAcademiesAPI: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_ACAD_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getListOfAcademiesAPI", data));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get list of district assoc under state
Meteor.methods({
    PgetAffiliatedDistAssociationsForState: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_ASSOC_LIST_AFIL_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getAffiliated_NonDistAssociations", data,"District/City",true,true));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get list of academies under sa
Meteor.methods({
    PgetAffiliatedStateAcademiesForState: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_ACAD_LIST_AFIL_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getAffiliated_NonAcademies", data,"stateAssociation",true));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get list of academies under da
Meteor.methods({
    PgetAffiliatedDistAcademiesForDistrict: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_ACAD_LIST_AFIL_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getAffiliated_NonAcademies", data,"districtAssociation",true));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get profile of sa
Meteor.methods({
    PgetDetailsOfGivenStateAssoc: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_DET_FOR_ASS_STATE_ID_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getDetailsOfGivenStateId", data,"State/Province/County",true));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get profile of da
Meteor.methods({
    PgetDetailsOfGivenDistAssoc: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_DET_FOR_ASS_DIST_ID_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getDetailsOfGivenStateId", data,"District/City",true));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get profile of academy
Meteor.methods({
    PgetDetailsOfGivenAcademyId: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_DET_FOR_ACAD_ID_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getDetailsOfGivenAcademyId", data,true));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//enable state assoc or enable d assoc or enable academy or disable state assoc
//or disable d assoc or disable academy
Meteor.methods({
    "PenableUsersAPI":function(caller,apiKey,data){
        var res = {
            data: 0,
            message: ENABLE_DISABLE_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof JSON.stringify(data) == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                return (Meteor.call("enableUsersAPI", data));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})


//update profile of sa
Meteor.methods({
    PupdateProfileOfSAAPI: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: UPDATE_PROFILE_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("updateProfileOfSAAPI", data,1));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//update profile of da
Meteor.methods({
    PupdateProfileOfDAAPI: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: UPDATE_PROFILE_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("updateProfileOfSAAPI", data,2));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//update profile of academy
Meteor.methods({
    PupdateProfileOfAcademyAPI: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message:UPDATE_PROFILE_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("updateProfileOfSAAPI", data,3));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//change email address or phone
Meteor.methods({
    PupdatePhoneOrEmailAddress: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message:UPDATE_PHONE_EMAIL_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("updatePhoneOrEmailAddress", data,true));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
});

//remove multiple da from sa
Meteor.methods({
    PremoveAffiliatedDAFromSA: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: REMOVE_AFFIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("removeAffiliatedUsers", data,1));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//remove multiple academy from da
Meteor.methods({
    PremoveAffiliatedAcadFromDA: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: REMOVE_AFFIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("removeAffiliatedUsers", data,2));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//remove multiple academy from sa
Meteor.methods({
    PremoveAffiliatedAcadFromSA: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: REMOVE_AFFIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("removeAffiliatedUsers", data,3));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get affiliated academies to state
Meteor.methods({
    PgetAffiliatedStateAcademies: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_ACAD_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getAffiliated_NonAcademies", data,"stateAssociation"));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get affiliated academies to district
Meteor.methods({
    PgetAffiliatedDistAcademies: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_ACAD_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getAffiliated_NonAcademies", data,"districtAssociation"));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get list of UnAffiliated Academies
Meteor.methods({
    PgetUnAffiliatedAcademies: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_ACAD_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getAffiliated_NonAcademies", data,false));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get list of affiliated da
Meteor.methods({
    PgetAffiliatedDistAssociations: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_DIST_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getAffiliated_NonDistAssociations", data,"District/City",true));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get list of unaffiliated da
Meteor.methods({
    PgetUnAffiliatedDistAssociations: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_DIST_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getAffiliated_NonDistAssociations", data,"District/City",false));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get list of enabled academies
Meteor.methods({
    PgetListOfActiveAcademiesAPI: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_ACAD_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getListOfAcademiesAPI", data,"Active"));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get list of enabled state associations
Meteor.methods({
    PgetListOfActiveStateAssociations: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_STATE_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getListOfStateDistAssociations", data,"State/Province/County","Active"));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get list of enabled district associations
Meteor.methods({
    PgetListOfActiveDistAssociations: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_ACAD_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getListOfStateDistAssociations", data,"District/City","Active"));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get list of disabled academies
Meteor.methods({
    PgetListOfInActiveAcademiesAPI: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_ACAD_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getListOfAcademiesAPI", data,"InActive"));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get list of disabled state associations
Meteor.methods({
    PgetListOfInActiveStateAssociations: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_STATE_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getListOfStateDistAssociations", data,"State/Province/County","InActive"));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//get list of disabled district associations
Meteor.methods({
    PgetListOfInActiveDistAssociations: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: GET_DIST_LIST_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("getListOfStateDistAssociations", data,"District/City","InActive"));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//register and add da to sa
Meteor.methods({
    PregisterAndAffiliateDistToSa :function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: REG_AFFILIATE_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("registerAndAffiliateDistAcad", data,1));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//register and add academy to sa
Meteor.methods({
    PregisterAndAffiliateAcadToSA:function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: REG_AFFILIATE_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("registerAndAffiliateDistAcad", data,3));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//register and add academy to da
Meteor.methods({
    PregisterAndAffiliateAcadToDA:function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: REG_AFFILIATE_FAIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof data == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
        
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //console.log("At first ..")
                //console.log(JSON.stringify(data))
                return (Meteor.call("registerAndAffiliateDistAcad", data,2));
            } else {
                return res
            }

        } catch (e) {
            //console.log(e)
            res.message = e
            return res
        }
    }
})

//Affiliate Player to sa
Meteor.methods({
    PaffiliatePlayerToSA: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: CANNOT_AFFIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof JSON.stringify(data) == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }

                return (Meteor.call("affiliateDAOrAcademyAPI", data,4));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})

//Affiliate Player to da
Meteor.methods({
    PaffiliatePlayerToDistrict: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: CANNOT_AFFIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof JSON.stringify(data) == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }

                return (Meteor.call("affiliateDAOrAcademyAPI", data,5));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})


//Affiliate Player to academy of sa
Meteor.methods({
    PaffiliatePlayerToAcademyOfSA: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: CANNOT_AFFIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof JSON.stringify(data) == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }

                return (Meteor.call("affiliateDAOrAcademyAPI", data,6));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})



//Affiliate Player to academy of da
Meteor.methods({
    PaffiliatePlayerToAcademyOfDA: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: CANNOT_AFFIL_MSG,
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof JSON.stringify(data) == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }
                //return (Meteor.call("affiliateDAOrAcademyAPI", data,6));
                return (Meteor.call("affiliateDAOrAcademyAPI", data,7));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})






//Register TTFI Admin
Meteor.methods({
    PregisterSchoolExtAPI: function(caller, apiKey, data) {
        var res = {
            data: 0,
            message: REGISTER_FAIL_MSG + "School",
            status: FAIL_STATUS,
            response: ""
        }
        try {
            var apiUsersData = apiUsers.findOne({
                "apiUser": caller
            })
            if (apiUsersData && apiUsersData.apiKey == apiKey) {
                if(typeof JSON.stringify(data) == "string"){
                    var xData = data.replace("\\", "");
                    data = JSON.parse(data);
                }
                if (apiUsersData && apiUsersData.apiUser) {
                    data.source = apiUsersData.apiUser
                }

                return (Meteor.call("registerSchoolExtAPI", data));
            } else {
                return res
            }

        } catch (e) {
            res.message = e
            return res
        }
    }
})





