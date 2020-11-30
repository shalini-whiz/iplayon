var BOTTOM = 0;
var TOP = 1;
var algArr = [];
var mergedArr = [];


export const getIndexOf = function(gPlayerVec, lRank) {
    for (var i = 0; i < gPlayerVec.length; i++) {
        if (gPlayerVec[i].mRank == lRank) {
            return i;
        }
    }
    return -1;
}


export const splitVec = function(lPlayerVec) {
    var gPlayerVec = lPlayerVec;
    if (gPlayerVec.length == 0) {
        var p = {}; // {mRank: 1, mAt: TOP};
        p.mRank = 1;
        p.mAt = TOP;
        gPlayerVec.push(p);
        return gPlayerVec;
    } // set 'gPlayerVec' vector

    var LOOP_COUNT = gPlayerVec.length;
    // loop 'gPlayerVec'
    for (var i = 0, counter = 0; counter < LOOP_COUNT; i += 2, counter++) {
        if (i >= gPlayerVec.length) break;
        // if(gPlayerVec[i].mAt==TOP) insert at 'i+1' else at 'i-1'
        var p = {};
        p.mRank = 0;
        if (gPlayerVec[i].mAt == TOP) {
            p.mAt = BOTTOM;
            gPlayerVec.splice(i + 1, 0, p);
        } else {
            p.mAt = TOP;
            gPlayerVec.splice(i, 0, p);
        }
    }
    return gPlayerVec;
}

export const insert = function(lPlayerVec, playerCount) {
    var gPlayerVec = lPlayerVec;
    var curMax = 0;
    if (gPlayerVec.length % 2 == 0) {
        curMax = gPlayerVec.length / 2;
    } else {
        curMax = (gPlayerVec.length - 1) / 2;
    }
    var curMax_i = getIndexOf(gPlayerVec, curMax);
    if (curMax_i == -1) {
        return gPlayerVec;
    }

    // initialise 'next' variables
    var next = 0;
    next = curMax;
    var next_i = 0;

    // repeat for every new entries
    while (next < playerCount) {
        var nextPos = (gPlayerVec[curMax_i].mAt == TOP) ? BOTTOM : TOP;
        next = next + 1; // next Rank
        next_i = (nextPos == TOP) ? (curMax_i - 1) : (curMax_i + 1);

        gPlayerVec[next_i].mRank = next;
        gPlayerVec[next_i].mAt = nextPos; // set rank & position

        curMax--;
        curMax_i = getIndexOf(gPlayerVec, curMax);
        if (curMax_i == -1) {
            return gPlayerVec;
        }
    }
    return gPlayerVec;
}
export const computeBrackets = function(numPlayers) {
    var gPlayerVec = [];
    while (gPlayerVec.length < numPlayers) {
        var lPlayerVec = splitVec(gPlayerVec);
        gPlayerVec = insert(lPlayerVec, numPlayers);
    }
    return gPlayerVec;
}

export const show = function(gPlayerVec) {
    for (var i = 0; i < gPlayerVec.length; i++) {
        algArr.push({
            "position": i + 1,
            "rank": gPlayerVec[i].mRank
        })
    }
}

export const ret_show = function(gPlayerVec) {
    for (var i = 0; i < gPlayerVec.length; i++) {
        algArr.push({
            "position": i + 1,
            "rank": gPlayerVec[i].mRank
        })
    }
    return algArr;
}

export const emptyDraws_show = function(gPlayerVec) {
	var arrayToDown = []
	for(var i=0; i<gPlayerVec.length; i++) {
		var data = {
			"Rank":gPlayerVec[i].mRank
		}
		arrayToDown.push(data)
	}
	return arrayToDown;
	if(arrayToDown.length!=0){
		//JSONToCSVConvertor_Download_Empty(arrayToDown, "", true,"Empty_Draws")
	}
}

export const merge = function(userDetail, algArr) 
{
    if (algArr.length > 0) 
    {
        for (var i = 0; i < algArr.length; i++) {
            var rank = algArr[i].rank;
            if (rank == 0) {
                mergedArr.push({
                    "slNo": algArr[i].position,
                    "Name": "",
                    "Affiliation ID": "",
                    "Academy Name": ""
                })
            } else {
                for (var x = 0; x < userDetail.length; x++) {
                    if (rank == userDetail[x].rank) {
                        if (userDetail[x].affiliationID == undefined)
                            userDetail[x].affiliationID = " ";
                        mergedArr.push({
                            "slNo": algArr[i].position,
                            "Name": userDetail[x].playerName,
                            "Affiliation ID": userDetail[x].affiliationID,
                            "Academy Name": userDetail[x].Academy,
                            "Match Number": i
                        })
                    }
                }
            }
        }
    }
    return mergedArr;
}

export const winner_merge = function(userDetail, algArr) {
    if (algArr.length > 0) 
    {
        for (var i = 0; i < algArr.length; i++) {
            var rank = algArr[i].rank;
            if (rank == 0) {
                mergedArr.push({
                    "slNo": algArr[i].position,
                    "Name": "",
                    "Affiliation ID": "",
                    "Academy Name": ""
                })
            } else {
                for (var x = 0; x < userDetail.length; x++) {
                    if (rank == parseInt(x+1)) {

                        if (userDetail[x]["Affiliation ID"] == undefined)
                            userDetail[x].affiliationID = " ";
                        else
                            userDetail[x].affiliationID = userDetail[x]["Affiliation ID"];

                        mergedArr.push({
                            "slNo": algArr[i].position,
                            "Name": userDetail[x].Name,
                            "Affiliation ID": userDetail[x].affiliationID,
                            "Academy Name": userDetail[x].Academy,
                        })

                    }
                }
            }
        }
    }

    //console.log("winner_merge arr .. "+mergedArr.length);
    return mergedArr;
}

export function show_ForTeamPlayers(gPlayerVec) {
    var teamAlgArr = [];
    for (var i = 0; i < gPlayerVec.length; i++) {
        teamAlgArr.push({
            "position": i + 1,
            "rank": gPlayerVec[i].mRank
        })
    }
    return teamAlgArr;
}

export function mergeForTeamDraws(userDetail, try1) {
    try{
        var teamMerge = []
        if (try1.length > 0) {
            for (var i = 0; i < try1.length; i++) {
                var rank = try1[i].rank;
                if (rank == 0) {
                    teamMerge.push({
                        "slNo": try1[i].position,
                        "teamName": "",
                        "teamAffiliationId": "",
                        "managerAffiliationId":"",
                        "temporaryAffiliationId": ""
                    })
                } else {
                    for (var x = 0; x < userDetail.length; x++) {
                        if (rank == parseInt(x+1)) {
                            teamMerge.push({
                                "slNo": try1[i].position,
                                "teamName": userDetail[x].teamName,
                                "teamAffiliationId": userDetail[x].teamAffiliationId,
                                "managerAffiliationId": userDetail[x].managerAffiliationId,
                                "temporaryAffiliationId": userDetail[x].temporaryAffiliationId
                            })
                        }
                    }
                }
            }
            return teamMerge
        }
    }catch(e){
    }
}


export const setJson = function(sets, minDifference, minScoresToWin, byeWalkoverSets) {
    try{
    var jsonObj = JSON.parse(JSON.stringify(sets));
    var aSet1 = 0, aSet2 = 0, aSet3 = 0, aSet4 = 0, aSet5 = 0, aSet6 = 0, aSet7 = 0;
    var bSet1 = 0, bSet2 = 0, bSet3 = 0, bSet4 = 0, bSet5 = 0, bSet6 = 0, bSet7 = 0;
    var data;
    if (byeWalkoverSets >= 3) 
    {
        var set1 = jsonObj.set1;
        var set2 = jsonObj.set2;
        var set3 = jsonObj.set3;

        var conditionScoreSet1 = Number(Math.abs(set1)) + Number(minDifference);
        var conditionScoreSet2 = Number(Math.abs(set2)) + Number(minDifference);
        var conditionScoreSet3 = Number(Math.abs(set3)) + Number(minDifference);

        if((typeof set1 == "string") && set1.length == 0)
        {
            aSet1 = 0;
            bSet1 = 0;
        }
        else if (set1 < 0) {
            aSet1 = Math.abs(set1);
            if (conditionScoreSet1 <= Number(minScoresToWin))
                bSet1 = Number(minScoresToWin);
            else
                bSet1 = Number(conditionScoreSet1);
        } else if (set1 > 0) {
            bSet1 = set1;
            if (conditionScoreSet1 <= Number(minScoresToWin))
                aSet1 = Number(minScoresToWin);
            else
                aSet1 = Number(conditionScoreSet1);
        } 
        else if(set1 === 0){

            bSet1 = set1;
            aSet1 = Number(minScoresToWin);
        }
        else if(set1 == -0 || set1 == "-0")
        {
            bSet1 = Number(minScoresToWin);
            aSet1 = Number(set1);
        }
        else {
            aSet1 = 0;
            bSet1 = 0;
        }

        if((typeof set2 == "string") && set2.length == 0)
        {
            aSet2 = 0;
            bSet2 = 0;
        }
        else if (set2 < 0) {
            aSet2 = Math.abs(set2);;
            if (conditionScoreSet2 <= Number(minScoresToWin))
                bSet2 = Number(minScoresToWin);
            else
                bSet2 = Number(conditionScoreSet2);
        } else if (set2 > 0) {
            bSet2 = set2;
            if (conditionScoreSet2 <= Number(minScoresToWin))
                aSet2 = Number(minScoresToWin);
            else
                aSet2 = Number(conditionScoreSet2);
        }
        else if(set2 === 0){
            bSet2 = set2;
            aSet2 = Number(minScoresToWin);
        }
        else if(set2 == -0 || set2 == "-0")
        {
            bSet2 = Number(minScoresToWin);
            aSet2 = Number(set2);
        }
         else {
            aSet2 = 0;
            bSet2 = 0;
        }

        if((typeof set3 == "string") && set3.length == 0)
        {
            aSet3 = 0;
            bSet3 = 0;
        }
        else if (set3 < 0) {
            aSet3 = Math.abs(set3);
            if (conditionScoreSet3 <= Number(minScoresToWin))
                bSet3 = Number(minScoresToWin);
            else
                bSet3 = Number(conditionScoreSet3);
        } else if (set3 > 0) {
            bSet3 = set3;
            if (conditionScoreSet3 <= Number(minScoresToWin))
                aSet3 = Number(minScoresToWin);
            else
                aSet3 = Number(conditionScoreSet3);
        }
        else if(set3 === 0){
            bSet3 = set3;
            aSet3 = Number(minScoresToWin);
        }
        else if(set3 == -0 || set3 == "-0")
        {
            bSet3 = Number(minScoresToWin);
            aSet3 = Number(set3);
        }
         else {
            aSet3 = 0;
            bSet3 = 0;
        }

        data = {
            scores: {
                "setScoresA": ["" + aSet1 + "", "" + aSet2 + "", "" + aSet3 + "", "0", "0", "0", "0"],
                "setScoresB": ["" + bSet1 + "", "" + bSet2 + "", "" + bSet3 + "", "0", "0", "0", "0"]
            }
        }

    }
    if (byeWalkoverSets >= 5) {
        var set4 = jsonObj.set4;
        var set5 = jsonObj.set5;

        var conditionScoreSet4 = Number(Math.abs(set4)) + Number(minDifference);
        var conditionScoreSet5 = Number(Math.abs(set5)) + Number(minDifference);

        if((typeof set4 == "string") && set4.length == 0)
        {
            aSet4 = 0;
            bSet4 = 0;
        }
        else if (set4 < 0) {
            aSet4 = Math.abs(set4);
            if (conditionScoreSet4 <= Number(minScoresToWin))
                bSet4 = Number(minScoresToWin);
            else
                bSet4 = Number(conditionScoreSet4);
        } else if (set4 > 0) {
            bSet4 = set4;
            if (conditionScoreSet4 <= Number(minScoresToWin))
                aSet4 = Number(minScoresToWin);
            else
                aSet4 = Number(conditionScoreSet4);
        } 
        else if(set4 === 0){
            bSet4 = set4;
            aSet4 = Number(minScoresToWin);
        }
        else if(set4 == -0 || set4 == "-0")
        {
            bSet4 = Number(minScoresToWin);
            aSet4 = Number(set4);
        }
        else {
            aSet4 = 0;
            bSet4 = 0;
        }

        if((typeof set5 == "string") && set5.length == 0)
        {
            aSet5 = 0;
            bSet5 = 0;
        }
        else if (set5 < 0) {
            aSet5 = Math.abs(set5);
            if (conditionScoreSet5 <= Number(minScoresToWin))
                bSet5 = Number(minScoresToWin);
            else
                bSet5 = Number(conditionScoreSet5);
        } else if (set5 > 0) {
            bSet5 = set5;
            if (conditionScoreSet5 <= Number(minScoresToWin))
                aSet5 = Number(minScoresToWin);
            else
                aSet5 = Number(conditionScoreSet5);
        }
        else if(set5 === 0){
            bSet5 = set5;
            aSet5 = Number(minScoresToWin);
        }
        else if(set5 == -0 || set5 == "-0")
        {
            bSet5 = Number(minScoresToWin);
            aSet5 = Number(set5);
        }
        else {
            aSet5 = 0;
            bSet5 = 0;
        }

        data = {
            scores: {
                "setScoresA": ["" + aSet1 + "", "" + aSet2 + "", "" + aSet3 + "", "" + aSet4 + "", "" + aSet5 + "", "0", "0"],
                "setScoresB": ["" + bSet1 + "", "" + bSet2 + "", "" + bSet3 + "", "" + bSet4 + "", "" + bSet5 + "", "0", "0"]
            }
        }

    }
    if (byeWalkoverSets == 7) {
        var set6 = jsonObj.set6;
        var set7 = jsonObj.set7;

        var conditionScoreSet6 = Number(Math.abs(set6)) + Number(minDifference);
        var conditionScoreSet7 = Number(Math.abs(set7)) + Number(minDifference);

        if((typeof set6 == "string") && set6.length == 0)
        {
            aSet6 = 0;
            bSet6 = 0;
        }
        else if (set6 < 0) {
            aSet6 = Math.abs(set6);
            if (conditionScoreSet6 <= Number(minScoresToWin))
                bSet6 = Number(minScoresToWin);
            else
                bSet6 = Number(conditionScoreSet6);
        } else if (set6 > 0) {
            bSet6 = set6;
            if (conditionScoreSet6 <= Number(minScoresToWin))
                aSet6 = Number(minScoresToWin);
            else
                aSet6 = Number(conditionScoreSet6);
        }
        else if(set6 === 0){
            bSet6 = set6;
            aSet6 = Number(minScoresToWin);
        }
        else if(set6 == -0 || set6 == "-0")
        {
            bSet6 = Number(minScoresToWin);
            aSet6 = Number(set6);
        }
         else {
            aSet6 = 0;
            bSet6 = 0;
        }


        if((typeof set7 == "string") && set7.length == 0)
        {
            aSet7 = 0;
            bSet7 = 0;
        }
        else if (set7 < 0) {
            aSet7 = Math.abs(set7);
            if (conditionScoreSet7 <= Number(minScoresToWin))
                bSet7 = Number(minScoresToWin);
            else
                bSet7 = Number(conditionScoreSet7);
        } else if (set7 > 0) {
            bSet7 = set7;
            if (conditionScoreSet7 <= Number(minScoresToWin))
                aSet7 = Number(minScoresToWin);
            else
                aSet7 = Number(conditionScoreSet7);
        }
        else if(set7 === 0){
            bSet7 = set7;
            aSet7 = Number(minScoresToWin);
        }
        else if(set7 == -0 || set7 == "-0")
        {
            bSet7 = Number(minScoresToWin);
            aSet7 = Number(set7);
        } else {
            aSet7 = 0;
            bSet7 = 0;
        }

        data = {
            scores: {
                "setScoresA": ["" + aSet1 + "", "" + aSet2 + "", "" + aSet3 + "", "" + aSet4 + "", "" + aSet5 + "", "" + aSet6 + "", "" + aSet7 + ""],
                "setScoresB": ["" + bSet1 + "", "" + bSet2 + "", "" + bSet3 + "", "" + bSet4 + "", "" + bSet5 + "", "" + bSet6 + "", "" + bSet7 + ""]
            }
        }

    }
    return data;
}catch(e){
}

}