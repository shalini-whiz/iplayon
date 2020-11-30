//checkClass
regexAlphaInCaseWithoutSpace = /^[a-zA-Z ]*$/;
regexAlphaInCase = /^[a-zA-Z]+$/
regexAlphaNumeric = /^(?=.*[a-zA-Z])(?=.*[0-9])/
regexAlphaCap = /^[A-Z]+$/;
regexAlphaSmall = /^[a-z]+$/;
regexNum = /^\d+$/;
regexAlphaNum = "";
regexWhiteSpace = /^.+\s.+$/g;
regexEmail = /[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/
minCharFieldName = 5
maxCharFieldName = 20
regexMobileNum10 = /^[0-9]{10}$/;
maxCountryCode = 3;
maxPinCode = 6
regexInt = /\\d+/
regexPostiveNegative = /^-?\d*\.{0,1}\d+$/

emailRegex = function(email) {
    var s = new RegExp('^' + email.replace(/\s+/g,' ').trim() + '$', "i")
    return s
}

getYearsQuery = function(year){
    var year = year
    var nextYear = parseInt(year) + 1
    var date1 = new Date(year + "-01-01")
    var date2 = new Date(nextYear + "-01-01")
    var queryYear = {
        "$gte": date1,
        "$lt": date2,
    }
    return queryYear
}

capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

replaceSpaceWhiteSpaces = function(value){
	try{
		return value.replace(/\s+/g,'');
	}catch(e){
	}
}

replaceExtraChar = function(value){
	return value.trim().replace(/\s+/g,' ')
}

replaceZeroAtFirst = function(value){
	return value.replace(/^0+(?!\.|$)/, '')
}

replaceZeroAtFirstWithNegative = function(value){
	return value.replace(/^(-?)0+(?!\.|$)/, '$1')
}


dateValidation = function(value){
	return moment(value, 'DD MMM YYYY', true).isValid()
}

categorySort = function(array,tournamentId) {
    try{
    	var subType = subscriptionRestrictions.findOne({"tournamentId":tournamentId});
    	if(subType && subType.selectionType && subType.selectionType !=  "schoolOnly")
    	{
    		var eventList = events.find({"tournamentId":tournamentId},{fields:{"eventName":1,"abbName":1}}).fetch();
    		if(eventList && eventList.length == 0)
    			eventList = pastEvents.find({"tournamentId":tournamentId},{fields:{"eventName":1,"abbName":1}}).fetch();

			var settingsInfo = eventFeeSettings.findOne({"tournamentId":tournamentId})
			if(settingsInfo && settingsInfo.events)
			{
				var eventSort = _.sortBy(eventList, function(item) {
  					return settingsInfo.events.indexOf(item.abbName);
				});

				var sortedCollection = [];
				_.map(eventSort, function(item) {
					var data = _.findWhere(array, {eventName: item.eventName});
					if(data != undefined && data != null)
						sortedCollection.push(data);

					
				});
				if(sortedCollection.length == array.length)
					return sortedCollection;
				else 
					return array

				

			}
			else 
				return array
    	}
    	else
    	{
    		return array
    	}
   
    }catch(e){
    	console.log(e)

       return array
    }
};

eventsmapOrder = function(array, order, key) {
    try{

    var sortedArray = []
    var orders = schoolEventsToFind.findOne({
        "key":"School"
    })

    if(orders && orders.sortOrderAbb && orders.sortOrderAbb.length)
    {
        order = orders.sortOrderAbb
        for(var i=0;i<array.length;i++){
            //if(array[i] && array[i].eventName!=undefined){
              var s = _.indexOf(order,array[i].eventName);
              sortedArray[s] = array[i]
            //}
        }
    }
    
    if(sortedArray.length != array){
    	sortedArray = array
    }

    return sortedArray

    }catch(e){
       return array
    }
};

//class for validations
export const ValidationClass = function()
{	
	//alphabets validation types
	//1
	this.validateAlphaInCaseSensitive = function(value){
		try{
			//console.log(value)
			if(value && regexAlphaInCaseWithoutSpace.test(value)){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	};
	//2
	this.validateAlphaCap = function(value){
		try{
			if(value && regexAlphaCap.test(value)){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	};
	//3
	this.validateAlphaSmall = function(value){
		try{
			if(value && regexAlphaSmall.test(value)){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	};

	//num types
	//4
	this.validateNum = function(value){
		try{
			if(value && regexNum.test(value)){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	};


	//alphabets with numbers
	//5
	this.validateAlphaNum = function(value){
		try{
			if(value && regexAlphaNum.test(value)){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	};

	//to check for white spaces
	//6
	this.validateWhiteSpace = function(value){
		try{
			if(value && regexWhiteSpace.test(value)){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	};

	//validate Email
	//7
	this.validateEmail = function(value){
		try{
			if(value && regexEmail.test(value)){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	};

	//validate if given min and max
	//8
	this.validateCharLenWithGivenMinMax = function(min,max,value){
		try{
			if(max && min && value.replace(/\s+/g,' ').trim().length > max || 
				value.replace(/\s+/g,' ').trim().length < min){
				return false
			}
			else{
				return true
			}
		}catch(e){
			return false
		}
	};

	//validate if min
	//9
	this.validateCharLenMin = function(value){
		try{
			if(value.replace(/\s+/g,' ').trim().length < minCharFieldName){
				return false
			}
			else{
				return true
			}
		}catch(e){
			return false
		}
	};

	//validate if max
	//10
	this.validateCharLenMax = function(value){
		try{
			if(value && 
				value.replace(/\s+/g,' ').trim().length && value.replace(/\s+/g,' ').trim().length > maxCharFieldName){
				return false
			}
			else{
				return true
			}
		}catch(e){
			return false
		}
	};

	//validate for both
	//11
	this.validateCharLenMaxMin = function(value){
		try{
			if(value.replace(/\s+/g,' ').trim().length > maxCharFieldName || 
				value.replace(/\s+/g,' ').trim().length < minCharFieldName){
				return false
			}
			else{
				return true
			}
		}catch(e){
			return false
		}
	};

	//for 10 dig mob
	//12
	this.validateMobileNum10 = function(value){
		try{
			//console.log("shfshd !!")
			//console.log(value)
			//console.log(regexNum.test(value))
			//console.log(regexMobileNum10.test(value))
			if(value && regexNum.test(value) && regexMobileNum10.test(value)){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	}

	//for 3 digits country code
	//13
	this.validateMaxCountryCode = function(value){
		try{
			if(value && regexNum.test(value) && value.replace(/\s+/g,' ').trim().length && value.replace(/\s+/g,' ').trim().length > maxCountryCode){
				return false
			}
			else{
				return true
			}
		}catch(e){
			return false
		}
	}

	//validate date DD MMM YYYY
	//14
	this.validateDate = function(value){
		try{
			if(value){
				return dateValidation(value)
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	}

	//validate mobile num for given limit
	//15
	this.validateMobileNumWithGivenLimit = function(value,num){
		try{
			if(value && num &&
				regexNum.test(value) && value.replace(/\s+/g,' ').trim().length == num){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	}

	//validate pincode for 6 digits
	//16
	this.validatePinCode = function(value){
		try{
			if(value && regexNum.test(value) && value.replace(/\s+/g,' ').trim().length == maxPinCode){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	}

	//validate pincode for given limit
	//17
	this.validatePinCodeGivenlimit = function(value,num){
		try{
			//console.log(value)
			//console.log(num)
			//console.log(value.replace(/\s+/g,' ').trim().length)
			if(value && num && regexNum.test(value) && parseInt(value.replace(/\s+/g,' ').trim().length) == parseInt(num)){
				//console.log("djf oo pin")
				return true
			}
			else{
				return false
			}
		}catch(e){
			//console.log(e)
			return false
		}
	}

	//18 validate char length with given min
	this.validateCharLenWithGivenMin = function(min,value){
		try{
			if( min &&
				value.trim().length < min){
				return false
			}
			else{
				return true
			}
		}catch(e){
			return false
		}
	};

	//19 validate char length with given max
	this.validateCharLenWithGivenMax = function(max,value){
		try{
			if(max && value.replace(/\s+/g,' ').trim().length && 
				value.trim().length > max){
				return false
			}
			else{
				return true
			}
		}catch(e){
			return false
		}
	};

	//20 
	//validate gender male or female
	this.validateGenderMaleOrFemale= function(value){
		try{
			if(value && (value.replace(/\s+/g,' ').trim() == "Male" ||
				value.replace(/\s+/g,' ').trim() == "Female")){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	};

	//21
	//validate gender male 
	this.validateGenderMale= function(value){
		try{
			if(value && value.replace(/\s+/g,' ').trim().toLowerCase() == "male"){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	};

	//22
	//validate gender female 
	this.validateGenderFemale= function(value){
		try{
			if(value && value.replace(/\s+/g,' ').trim().toLowerCase() == "female"){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	};

	//verify email
	//23

	//verify phone
	//24

	//verify existing field name
	//25 but for field names //not added in json
	this.uniqueFieldName = function(fieldName,collectionName){
		try{
			if(fieldName && fieldName.replace(/\s+/g,' ').trim().replace(/\s+/g,' ').length){
				//console.log("collectionName is !!")
				//console.log(collectionName)
				var field = global[collectionName].findOne({
					"fieldName": {
	                	'$regex':  '^'+fieldName+'$' ,
	                    '$options': 'i'
	                }
				})
				if(field){
					return 1
				}
				else{
					return 2
				}
			}else{
				return false
			}
		}catch(E){	
			return false
		}
	}

	//validation for given num is int
	//26 not added //not added in json
	this.integerFun = function(data,param){
		try{
			if(param==undefined||param==null){
				param = "num"
			}
			//console.log(data)
			var value = data[0].val
			if (value && regexNum.test(value)){
				if(value <= 0){
					return "Value of " + param + " is invalid, it should be more than 0"
				}
				else{
					return 1
				}
			}
			else{
				return "Value of " + param + " is invalid"
			}
		}catch(e){
			//console.log(e)
		}
	}

	//27
	//test for max and min
	this.maxMin = function(data){
		try{
			var value1 = data[0].val
			var value2 = data[1].val

			var k = []
			k.push(data[0])
			var c = this.integerFun(k,"min")
			if(c==1){
				var k = []
				k.push(data[1])
				var c2 = this.integerFun(k,"max")
				if(c2==1){
					if(parseInt(value1)>parseInt(value2)){
						return "Value of min should be less than max"
					}
					else{
						return 1
					}
				}
				else{
					return c2
				}
			}
			else{
				return c
			}
			
		}catch(e){

		}
	}

	this.validateRegexAlphaNumeric = function(data){
		try{
			if(data && regexAlphaNumeric.test(data)){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	}

	this.lesserThanGivenNum = function(oObj,nObj){
		try{
			if(oObj && nObj){
				if(oObj.params && nObj.params){
					if(oObj.params.length==nObj.params.length){
						oObj = oObj.params
						nObj = nObj.params
						if (parseInt(nObj[0].value) <= parseInt(oObj[0].value)){
							return 1
						}
						else{
							return "num should be lesser than or equal to " + oObj[0].value
						}
					}
					else{
						return "Params length is invalid"
					}
				}
				else{
					return "Require all params"
				}
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	}

	this.greaterThanGivenNum= function(oObj,nObj){
		try{
			if(oObj && nObj){
				if(oObj.params && nObj.params){
					if(oObj.params.length==nObj.params.length){
						oObj = oObj.params
						nObj = nObj.params
						if (parseInt(nObj[0].value) >= parseInt(oObj[0].value)){
							return 1
						}
						else{
							return "num should be greater than or equal to " + oObj[0].value
						}
					}
					else{
						return "Params length is invalid"
					}
				}
				else{
					return "Require all params"
				}
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	}

	this.btwMaxMin = function(oObj,nObj){
		try{
			if(oObj && nObj){
				if(oObj.params && nObj.params){
					if(oObj.params.length==nObj.params.length){
						oObj = oObj.params
						nObj = nObj.params
						if (parseInt(nObj[0].value) >= parseInt(oObj[0].value) && 
							parseInt(nObj[0].value) <= parseInt(oObj[1].value)){
							if (parseInt(nObj[1].value) >= parseInt(oObj[0].value) &&
							parseInt(nObj[1].value) <= parseInt(oObj[1].value)){
								return 1
							}
							else{
								return "max should be greater than or equal to " + oObj[0].value + " and lesser than or equal to " + oObj[1].value
							}
						}
						else{
							return "min should be greater than or equal to " + oObj[0].value + " and lesser than or equal to " + oObj[1].value
						}
					}
					else{
						return "Params length is invalid"
					}
				}
				else{
					return "Require all params"
				}
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	}

	this.equalsToGivenNum = function(oObj,nObj){
		try{
			if(oObj && nObj){
				if(oObj.params && nObj.params){
					if(oObj.params.length==nObj.params.length){
						oObj = oObj.params
						nObj = nObj.params
						if (parseInt(nObj[0].value) == parseInt(oObj[0].value)){
							return 1
						}
						else{
							return "num should be equal to " + oObj[0].value
						}
					}
					else{
						return "Params length is invalid"
					}
				}
				else{
					return "Require all params"
				}
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	}

	this.nullUndefinedEmpty = function(data){
		if(data==null){
			return 2
		}
		else if(data==undefined){
			return 3
		}
		else if(data.toString().replace(/\s+/g,' ').trim().length==0){
			return 4
		}
		else{
			return 1
		}
	}

	this.nullUndefined = function(data){
		if(data==null){
			return 2
		}
		else if(data==undefined){
			return 3
		}
		else{
			return 1
		}
	}

	//num types with neg and pos
	//
	this.validateNumPosNeg = function(value){
		try{
			if(value && regexPostiveNegative.test(value)){
				return true
			}
			else{
				return false
			}
		}catch(e){
			return false
		}
	};
}

const GeneratorClass = function()
{	
	this.randomString = function(len) {
	  var s = '';

	  while (s.length < len) {
	    s += Math.random().toString(36).substr(2);
	  }
	  	var k = Date.now()
		s = s.substr(0, len).toUpperCase().insertAt(6, k.toString().reverse().substring(0,5));
	  return s ;
	}
}

String.prototype.insertAt=function(index, string) { 
  return this.substr(0, index) + string + this.substr(index);
}

String.prototype.reverse = function() {
     return Array.prototype.slice.call(this)
          .reverse()
          .join()
          .replace(/,/g,'')
}

randomPassword_PlayerCSV = function(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}

generatorClass = GeneratorClass

validationClass = ValidationClass

