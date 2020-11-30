import {
    emailRegex
}
from '../dbRequiredRole.js'

import {
    playerDBFind
}
from '../dbRequiredRole.js'
Meteor.methods({
    updateInterestedProjectName: function(tableName) {
        var res = {}
        try {
            /*tournamentEvents.insert({
                "_id": "QvHXDftiwsnc8gyfJ",
                "projectMainName": "Table Tennis",
                "categoryOrder": [
                    "MCB",
                    "MCG",
                    "CB",
                    "CG",
                    "SJB",
                    "SJG",
                    "JB",
                    "JG",
                    "SB",
                    "SG",
                    "YB",
                    "YG",
                    "M",
                    "W",
                    "NMS",
                    "NMD",
                    "OS",
                    "OD",
                    "O",
                    "U14B",
                    "U14G",
                    "U17B",
                    "U17G",
                    "U19B",
                    "U19G",
                    "11Even Junior Boy's Team",
                    "11Even Junior Girl's Team",
                    "11Even Senior Boy's Team",
                    "11Even Senior Girl's Team",
                    "5s",
                    "Executive Cup",
                    "Team Events",
                    "Sub Junior Girls Team",
                    "Sub Junior Boy's Doubles",
                    "Sub Junior Boys Team",
                    "Cadet Boys Team",
                    "Cadet Girls Team",
                    "Sub Junior Girl's Doubles",
                    "Men's Doubles",
                    "Women's Doubles",
                    "Junior Girl's Doubles",
                    "Junior Boy's Doubles",
                    "Junior Mixed Double's",
                    "Junior Boy's Team",
                    "Junior Girl's Team",
                    "Youth Girl's Doubles",
                    "Youth Boy's Doubles",
                    "Youth Boy's Team",
                    "Youth Girl's Team",
                    "Davis Cup",
                    "Mix Corporate Men's Team",
                    "Corporate Men's Singles",
                    "MEN’S TEAM",
                    "WOMEN’S TEAM",
                    "MIXED DOUBLES",
                    "Swaythling Cup",
                    "JAYALAKSHMI CUP",
                    "BARNA-BELLACK CUP",
                    "Inter Corporate Team Events",
                    "Cadet Boy's Doubles",
                    "Cadet Girl's Doubles",
                    "U21 Men's Singles",
                    "U21 Women's Singles",
                    "Corbillon Cup",
                    "Msl",
                    "11PG",
                    "11PB",
                    "11CG",
                    "11CB"
                ],
                "projectSubName": [{
                    "_id": "kslkebduo27N2uux7",
                    "projectName": "Mini Cadet Boy's Singles",
                    "abbName": "MCB",
                    "projectType": "1",
                    "gender": "Male",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "kscge09m1u7N2uux7",
                    "projectName": "Mini Cadet Girl's Singles",
                    "abbName": "MCG",
                    "projectType": "1",
                    "gender": "Female",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "ksHHDWReSe7N2uux7",
                    "projectName": "Cadet Boy's Singles",
                    "abbName": "CB",
                    "projectType": "1",
                    "gender": "Male",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "AJ5LtgFtStmL6KgsD",
                    "projectName": "Cadet Girl's Singles",
                    "abbName": "CG",
                    "projectType": "1",
                    "gender": "Female",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "H8NKgBHk6JYrycCvf",
                    "projectName": "Sub-junior Boy's Singles",
                    "abbName": "SJB",
                    "projectType": "1",
                    "gender": "Male",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "tXpQ4DwgrAfFGR4oj",
                    "projectName": "Sub-junior Girl's Singles",
                    "abbName": "SJG",
                    "projectType": "1",
                    "gender": "Female",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "nPnrTCix3yAD3TmAz",
                    "projectName": "Junior Boy's Singles",
                    "abbName": "JB",
                    "projectType": "1",
                    "gender": "Male",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "arGJsShtr9sjRXwyT",
                    "projectName": "Junior Girl's Singles",
                    "abbName": "JG",
                    "projectType": "1",
                    "gender": "Female",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "nPnrTCix3yAD3TmAzz",
                    "projectName": "Senior Boy's Singles",
                    "abbName": "SB",
                    "projectType": "1",
                    "gender": "Male",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "arGJsShtr9sjRXwyTz",
                    "projectName": "Senior Girl's Singles",
                    "abbName": "SG",
                    "projectType": "1",
                    "gender": "Female",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "2XMzYon6GbE9TxmGN",
                    "projectName": "Youth Girl's Singles",
                    "abbName": "YG",
                    "projectType": "1",
                    "gender": "Female",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "5ioxxYpoPuox8huWC",
                    "projectName": "Youth Boy's Singles",
                    "abbName": "YB",
                    "projectType": "1",
                    "gender": "Male",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "Bn9emodsjqgWEi2pK",
                    "projectName": "Men's Singles",
                    "abbName": "M",
                    "projectType": "1",
                    "gender": "Male",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "giR4SJEhDJ6mtNGW7",
                    "projectName": "Women's Singles",
                    "abbName": "W",
                    "projectType": "1",
                    "gender": "Female",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "Sv6rNBU8IaiAozRXE",
                    "projectName": "NMS",
                    "abbName": "NMS",
                    "projectType": "1",
                    "gender": "All",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "Sv6rQkgf8pH87NbYZ",
                    "projectName": "NMD",
                    "abbName": "NMD",
                    "projectType": "1",
                    "gender": "All",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "Sv6rQkgf8FiAozRXE",
                    "projectName": "Open Singles",
                    "abbName": "OS",
                    "projectType": "1",
                    "gender": "All",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "pC8uK9wv9KycDEBpE",
                    "projectName": "Open Doubles",
                    "abbName": "OD",
                    "projectType": "1",
                    "gender": "All",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "oC8uK9wv9KycDEBkE",
                    "projectName": "Others",
                    "abbName": "O",
                    "projectType": "1",
                    "gender": "All",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "HGBGRYdFoQHvg4EBN",
                    "projectName": "Under 14 Boy's Singles",
                    "abbName": "U14B",
                    "projectType": "1",
                    "gender": "Male",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "3fuFFDFMpDbzcBuFR",
                    "projectName": "Under 14 Girl's Singles",
                    "abbName": "U14G",
                    "projectType": "1",
                    "gender": "Female",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "fPo2YbiTY6Zhhfzqd",
                    "projectName": "Under 17 Boy's Singles",
                    "abbName": "U17B",
                    "projectType": "1",
                    "gender": "Male",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "7xvzq4SdzJQGwyTfL",
                    "projectName": "Under 17 Girl's Singles",
                    "abbName": "U17G",
                    "projectType": "1",
                    "gender": "Female",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "Gjc2vFKyPZ9KdyLxt",
                    "projectName": "Under 19 Boy's Singles",
                    "abbName": "U19B",
                    "projectType": "1",
                    "gender": "Male",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "NdummtT4kfAXb5QGd",
                    "projectName": "Under 19 Girl's Singles",
                    "abbName": "U19G",
                    "projectType": "1",
                    "gender": "Female",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "mb86CTD5HStbcM3wx",
                    "projectName": "5s",
                    "abbName": "5s",
                    "projectType": "2",
                    "gender": "NA",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "PHxz45Yhd7LX4iynG",
                    "projectName": "11Even Junior Boy's Team",
                    "abbName": "11Even Junior Boy's Team",
                    "projectType": "2",
                    "gender": "NA",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "3HJs3eXdRaf7aNt5p",
                    "projectName": "11Even Junior Girl's Team",
                    "abbName": "11Even Junior Girl's Team",
                    "projectType": "2",
                    "gender": "NA",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "zbeGzHksJ5oTf56wf",
                    "projectName": "11Even Senior Boy's Team",
                    "abbName": "11Even Senior Boy's Team",
                    "projectType": "2",
                    "gender": "NA",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "rgjM56p5f9ckAfYs5",
                    "projectName": "11Even Senior Girl's Team",
                    "abbName": "11Even Senior Girl's Team",
                    "projectType": "2",
                    "gender": "NA",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "u5Pjh9kaZ62uoqTxn",
                    "projectName": "Executive Cup",
                    "abbName": "Executive Cup",
                    "projectType": "2",
                    "gender": "NA",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "tqqphDyKxWAM4ADiX",
                    "projectName": "Team Events",
                    "abbName": "Team Events",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Team Events"
                }, {
                    "_id": "Ge33Y3NBhkzMaeg6z",
                    "projectName": "Sub Junior Boys Team",
                    "abbName": "Sub Junior Boys Team",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Sub Junior Boys Team"
                }, {
                    "_id": "v8ayRS6GDoepiLCMs",
                    "projectName": "Sub Junior Girls Team",
                    "abbName": "Sub Junior Girls Team",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Sub Junior Girls Team"
                }, {
                    "_id": "fm9c6G6csc3jNnHCJ",
                    "projectName": "Cadet Boys Team",
                    "abbName": "Cadet Boys Team",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Cadet Boys Team"
                }, {
                    "_id": "NcFRr3ceqwAy4HrjW",
                    "projectName": "Cadet Girls Team",
                    "abbName": "Cadet Girls Team",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Cadet Girls Team"
                }, {
                    "_id": "x6tZ8hrzoDcoaxK86",
                    "projectName": "Sub Junior Boy's Doubles",
                    "abbName": "Sub Junior Boy's Doubles",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Sub Junior Boy's Doubles"
                }, {
                    "_id": "sK8Mc9k4HWQFxc5g3",
                    "projectName": "Sub Junior Girl's Doubles",
                    "abbName": "Sub Junior Girl's Doubles",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Sub Junior Girl's Doubles"
                }, {
                    "_id": "ik3ckN39ATwMQcAW9",
                    "projectName": "Men's Doubles",
                    "abbName": "Men's Doubles",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Men's Doubles"
                }, {
                    "_id": "FFfWMYzmyiiq2B7Dq",
                    "projectName": "Women's Doubles",
                    "abbName": "Women's Doubles",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Women's Doubles"
                }, {
                    "_id": "HZmiA3GLHK3HFoHPv",
                    "projectName": "Junior Girl's Doubles",
                    "abbName": "Junior Girl's Doubles",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Junior Girl's Doubles"
                }, {
                    "_id": "aCeuT3FzNbcW4aior",
                    "projectName": "Junior Boy's Doubles",
                    "abbName": "Junior Boy's Doubles",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Junior Boy's Doubles"
                }, {
                    "_id": "xLfPMyDSGK7BoiHKK",
                    "projectName": "Junior Mixed Double's",
                    "abbName": "Junior Mixed Double's",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Junior Mixed Double's"
                }, {
                    "_id": "SgwPeJ6c2fWbQu7zq",
                    "projectName": "Junior Boy's Team",
                    "abbName": "Junior Boy's Team",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Junior Boy's Team"
                }, {
                    "_id": "5pMFtotvsi2S7q3sg",
                    "projectName": "Junior Girl's Team",
                    "abbName": "Junior Girl's Team",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Junior Girl's Team"
                }, {
                    "_id": "KDb3egsKiM4Aq3zbC",
                    "projectName": "Youth Boy's Doubles",
                    "abbName": "Youth Boy's Doubles",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Youth Boy's Doubles"
                }, {
                    "_id": "MP49Q2JtNLzzkwzB9",
                    "projectName": "Youth Girl's Doubles",
                    "abbName": "Youth Girl's Doubles",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Youth Girl's Doubles"
                }, {
                    "_id": "LQWq6EfJoyLiNdSW2",
                    "projectName": "Youth Boy's Team",
                    "abbName": "Youth Boy's Team",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Youth Boy's Team"
                }, {
                    "_id": "a8G9tdbqKwz4RKSLD",
                    "projectName": "Youth Girl's Team",
                    "abbName": "Youth Girl's Team",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Youth Girl's Team"
                }, {
                    "_id": "fxbKknvgFPsve7Laa",
                    "projectName": "Davis Cup",
                    "abbName": "Davis Cup",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Davis Cup"
                }, {
                    "_id": "gPNwQpzbYXwZNMBvn",
                    "projectName": "Mix Corporate Men's Team",
                    "abbName": "Mix Corporate Men's Team",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Mix Corporate Men's Team"
                }, {
                    "_id": "S9gBjd7NwxvXBczKJ",
                    "projectName": "Corporate Men's Singles",
                    "abbName": "Corporate Men's Singles",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Corporate Men's Singles"
                }, {
                    "_id": "ozGpsHqn4mdgLow5K",
                    "projectName": "MEN’S TEAM",
                    "abbName": "MEN’S TEAM",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "MEN’S TEAM"
                }, {
                    "_id": "DsfyWFqndJArjJEsk",
                    "projectName": "WOMEN’S TEAM",
                    "abbName": "WOMEN’S TEAM",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "WOMEN’S TEAM"
                }, {
                    "_id": "ka8MzunBPJBwKmnib",
                    "projectName": "MIXED DOUBLES",
                    "abbName": "MIXED DOUBLES",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "MIXED DOUBLES"
                }, {
                    "_id": "vC2pHeEjsk3xpNoau",
                    "projectName": "Swaythling Cup",
                    "abbName": "Swaythling Cup",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Swaythling Cup"
                }, {
                    "_id": "GLHb8dqK2iZNwxbQu",
                    "projectName": "BARNA-BELLACK CUP",
                    "abbName": "BARNA-BELLACK CUP",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "BARNA-BELLACK CUP"
                }, {
                    "_id": "p2EqFK5NqbYDETR4E",
                    "projectName": "JAYALAKSHMI CUP",
                    "abbName": "JAYALAKSHMI CUP",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "JAYALAKSHMI CUP"
                }, {
                    "_id": "H7A22HaRQ5LWuyeFX",
                    "projectName": "Inter Corporate Team Events",
                    "abbName": "Inter Corporate Team Events",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Inter Corporate Team Events"
                }, {
                    "_id": "SMyBe8HaJbG3HTwoe",
                    "projectName": "Cadet Boy's Doubles",
                    "abbName": "Cadet Boy's Doubles",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Cadet Boy's Doubles"
                }, {
                    "_id": "exWmKSWWppfg5cokN",
                    "projectName": "Cadet Girl's Doubles",
                    "abbName": "Cadet Girl's Doubles",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Cadet Girl's Doubles"
                }, {
                    "_id": "F2yFdRtXZeP47nNkY",
                    "projectName": "U21 Men's Singles",
                    "abbName": "U21 Men's Singles",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "U21 Men's Singles"
                }, {
                    "_id": "7qdAf5M99vjG5Q6ny",
                    "projectName": "U21 Women's Singles",
                    "abbName": "U21 Women's Singles",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "U21 Women's Singles"
                }, {
                    "_id": "KjeP9y6qiAfyqXhbL",
                    "projectName": "Corbillon Cup",
                    "abbName": "Corbillon Cup",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Corbillon Cup"
                }, {
                    "_id": "vQHytvRNfiiEYJBnP",
                    "projectName": "Msl",
                    "abbName": "Msl",
                    "projectType": "2",
                    "gender": "NA",
                    "dobType": "NA",
                    "teamType": "Msl"
                }, {
                    "_id": "MgcpTdLWAsLige4hq",
                    "projectName": "11Even Primary Girls",
                    "abbName": "11PG",
                    "projectType": "1",
                    "gender": "Female",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "R5cemAaHCbtkvJSuY",
                    "projectName": "11Even Primary Boys",
                    "abbName": "11PB",
                    "projectType": "1",
                    "gender": "Male",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "dYbMRmhmfkq3YTPsM",
                    "projectName": "11Even College Girls",
                    "abbName": "11CG",
                    "projectType": "1",
                    "gender": "Female",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }, {
                    "_id": "p6gF9RQqG3x9CwLAw",
                    "projectName": "11Even College Boys",
                    "abbName": "11CB",
                    "projectType": "1",
                    "gender": "Male",
                    "dob": new Date("1992-10-08"),
                    "dobType": "A"
                }],
                "singleEventsOrder": [
                    "MCB",
                    "MCG",
                    "CB",
                    "CG",
                    "SJB",
                    "SJG",
                    "JB",
                    "JG",
                    "SB",
                    "SG",
                    "YB",
                    "YG",
                    "M",
                    "W",
                    "NMS",
                    "NMD",
                    "OS",
                    "OD",
                    "O",
                    "11Even Junior Boy's Team",
                    "11Even Junior Girl's Team",
                    "11Even Senior Boy's Team",
                    "11Even Senior Girl's Team",
                    "5s",
                    "Executive Cup",
                    "U14B",
                    "U14G",
                    "U17B",
                    "U17G",
                    "U19B",
                    "U19G",
                    "11PG",
                    "11PB",
                    "11CG",
                    "11CB"
                ],
                "teamEventsOrder": [
                    "11Even Junior Boy's Team",
                    "11Even Junior Girl's Team",
                    "11Even Senior Boy's Team",
                    "11Even Senior Girl's Team",
                    "5s",
                    "Executive Cup",
                    "Team Events",
                    "Sub Junior Girls Team",
                    "Sub Junior Boy's Doubles",
                    "Sub Junior Boys Team",
                    "Cadet Boys Team",
                    "Cadet Girls Team",
                    "Sub Junior Girl's Doubles",
                    "Men's Doubles",
                    "Women's Doubles",
                    "Junior Girl's Doubles",
                    "Junior Boy's Doubles",
                    "Junior Mixed Double's",
                    "Junior Boy's Team",
                    "Junior Girl's Team",
                    "Youth Girl's Doubles",
                    "Youth Boy's Doubles",
                    "Youth Boy's Team",
                    "Youth Girl's Team",
                    "Davis Cup",
                    "Mix Corporate Men's Team",
                    "Corporate Men's Singles",
                    "MEN’S TEAM",
                    "WOMEN’S TEAM",
                    "MIXED DOUBLES",
                    "Swaythling Cup",
                    "JAYALAKSHMI CUP",
                    "BARNA-BELLACK CUP",
                    "Inter Corporate Team Events",
                    "Cadet Boy's Doubles",
                    "Cadet Girl's Doubles",
                    "U21 Men's Singles",
                    "U21 Women's Singles",
                    "Corbillon Cup",
                    "Msl"
                ]
            })*/

            /*var coun = global[tableName].update({

            },{
                $set:{
                    "interestedProjectName":["QvHXDftiwsnc8gyfJ"]
                }
            },{
                multi:true
            })*/

            return 0
        } catch (e) {}
    }
})

Meteor.methods({
    updateInterestedProjectNameMeteor: function() {
        var res = {}
        try {
            /*var coun = Meteor.users.update({

             },{
                 $set:{
                     "interestedProjectName":["QvHXDftiwsnc8gyfJ"]
                 }
             },{
                 multi:true
             })*/

            return 0
        } catch (e) {}
    }
})

Meteor.methods({
    addTournamentsProject: function(projectMainName) {
        try {
            var res = {}
            var fetchExistingTourn = tournamentEvents.find({}).fetch()
            if (fetchExistingTourn && fetchExistingTourn.length != 0) {
                for (var i = 0; i < fetchExistingTourn.length; i++) {
                    if (fetchExistingTourn[i]._id && fetchExistingTourn[i].projectMainName) {
                        var proj = mainProjects.findOne({
                            "_id": fetchExistingTourn[i]._id
                        })
                        if (proj == undefined || proj == null) {
                            mainProjects.insert({
                                "_id": fetchExistingTourn[i]._id,
                                "projectMainName": fetchExistingTourn[i].projectMainName.trim().replace(/\s+/g, ' ')
                            })
                        }
                    }
                }
            }

            if (projectMainName) {
                var proj = mainProjects.findOne({
                    "projectMainName": emailRegex(projectMainName.trim().replace(/\s+/g, ' '))
                })
                if (proj) {
                    res["status"] = 0
                    res["message"] = "Project Exists"
                } else {
                    var proj1 = mainProjects.insert({
                        "projectMainName": projectMainName.trim().replace(/\s+/g, ' ')
                    })
                    if (proj1) {
                        if (MasterMatchCollections.findOne({
                                "projectId": proj1
                            }) == undefined) {
                            var mastrCol = MasterMatchCollections.insert({
                                "projectId": proj1,
                                "projectMainName": projectMainName.trim().replace(/\s+/g, ' '),
                                "noofSets": "3",
                                "minScores": "21",
                                "minDifference": "2",
                                "points": "0"
                            })
                            if (mastrCol) {
                                res["status"] = 1
                                res["message"] = "Project Inserted"
                            } else {
                                res["status"] = 0
                                res["message"] = "cannot insert into  MasterMatchCollections"
                            }
                        } else {
                            res["status"] = 1
                            res["message"] = "Project Inserted, MasterMatchCollections exists"
                        }
                    } else {
                        res["status"] = 0
                        res["message"] = "cannot insert "
                    }
                }
            }

            return res
        } catch (e) {}
    }
})

Meteor.methods({
    updateTournamentProjects: function() {
        try {
            var count = 0
            var res = {}
            var fetchExistingTourn = tournamentEvents.find({}).fetch()
                /*if (fetchExistingTourn && fetchExistingTourn.length != 0) {
                    for (var i = 0; i < fetchExistingTourn.length; i++) {
                        if (fetchExistingTourn[i]._id && fetchExistingTourn[i].projectMainName) {
                            var proj = mainProjects.findOne({
                                "_id": fetchExistingTourn[i]._id
                            })
                            if (proj == undefined || proj == null) {
                                var s = mainProjects.insert({
                                    "_id": fetchExistingTourn[i]._id,
                                    "projectMainName": fetchExistingTourn[i].projectMainName.trim().replace(/\s+/g, ' ')
                                })
                                if (s) {
                                    count = i + 1
                                }
                            }
                        }
                    }
                }*/
            res["status"] = 1
            res["message"] = "Project Inserted, count is " + count
            return res
        } catch (e) {}
    }
});


Meteor.methods({
    updateMeteorUsers: function() {
        try {
            var count = 0
            var res = {}
                /*var s = Meteor.users.find({
                    "emails.0.address": {
                        $in: [null, ""]
                    },
                    "emails": {
                        $nin: [null, ""]
                    },
                    "verifiedBy": {
                        $in: [null, ""]
                    }
                }, {
                    "emails": 1
                }).fetch()

                if (s) {
                    var update = Meteor.users.update({
                        "emails.0.address": {
                            $in: [null, "", undefined]
                        },
                        "emails": {
                            $nin: [null, "", undefined]
                        },
                        "verifiedBy": {
                            $in: [null, "", undefined]
                        }
                    }, {
                        $set: {
                            verifiedBy: ["email"],
                            registerType: "individual",
                            userStatus: "Active"
                        }
                    }, {
                        multi: true
                    })
                    if (update) {
                        count = update
                    }
                }*/

            res["status"] = 1
            res["message"] = "Users updated, count is " + count
            return res
        } catch (e) {}
    }
});

Meteor.methods({
    updateMeteorUsersStatus: function() {
        try {
            //userDetailsTTUsed
            var count = 0
            var count2 = 0
            var res = {}
                /*var s = userDetailsTT.find({
                    userStatus: null
                }).fetch()

                if (s) {
                    var update2 = Meteor.users.update({
                        userStatus: null
                    }, {
                        $set: {
                            userStatus: "Active"
                        }
                    }, {
                        multi: true
                    })

                    var update = userDetailsTT.update({
                        userStatus: null
                    }, {
                        $set: {
                            userStatus: "Active"
                        }
                    }, {
                        multi: true
                    })
                    if (update) {
                        count = update
                    }
                    if (update2) {
                        count2 = update2
                    }
                }*/

            res["status"] = 1
            res["message"] = "Users updated, count is " + count + " Meteor users count is " + count2
            return res
        } catch (e) {}
    }
});

Meteor.publish('mainProjects', function() {
    try {
        var lData = mainProjects.find({});
        return lData
    } catch (e) {}
});

Meteor.methods({
    addCategoriesToProject: function(xData) {
        var res = {}
        try {
            if (xData && xData._id && xData._id.trim().length != 0) {
                var projectDet = tournamentEvents.findOne({
                    "_id": xData._id
                })
                if (projectDet) {
                    if (xData && xData.projectName && xData.projectName.trim().length != 0) {
                        var projectDet = tournamentEvents.findOne({
                            "_id": xData._id,
                            "projectSubName.projectName": emailRegex(xData.projectName.trim().replace(/\s+/g, ' '))
                        })
                        if (projectDet) {
                            res["status"] = 0
                            res["message"] = "projectName exists"
                        } else {
                            if (xData && xData.abbName && xData.abbName.trim().length != 0) {
                                var projectDet = tournamentEvents.findOne({
                                    "_id": xData._id,
                                    "projectSubName.abbName": emailRegex(xData.abbName.trim().replace(/\s+/g, ""))
                                })
                                if (projectDet) {
                                    res["status"] = 0
                                    res["message"] = "abbName exists"
                                } else {
                                    if (xData && xData.dob && xData.dob.trim().length != 0) {
                                        var dValid = moment(xData.dob, "YYYY MMM DD", true).isValid()
                                        if (dValid) {
                                            if (xData && xData.gender && xData.gender.trim().length != 0) {
                                                if (xData.gender == "Male" || xData.gender == "Female" || xData.gender == "All") {
                                                    var dataProjec = {
                                                        "_id": Random.id(),
                                                        "projectName": xData.projectName.trim(),
                                                        "abbName": xData.abbName.trim().replace(/\s+/g, ""),
                                                        "projectType": "1",
                                                        "gender": xData.gender.trim(),
                                                        "dob": moment(new Date(xData.dob)).format("YYYY-MM-DD"),
                                                        "dobType": "A"
                                                    }
                                                    var sup = tournamentEvents.update({
                                                        "_id": xData._id
                                                    }, {
                                                        $addToSet: {
                                                            projectSubName: dataProjec,
                                                            categoryOrder: xData.abbName.trim().replace(/\s+/g, ''),
                                                            singleEventsOrder: xData.abbName.trim().replace(/\s+/g, '')
                                                        }
                                                    })
                                                    if (sup) {
                                                        res["status"] = 1
                                                        res["message"] = "saved"
                                                    }
                                                } else {
                                                    res["status"] = 0
                                                    res["message"] = "invalid gender"
                                                }
                                            } else {
                                                res["status"] = 0
                                                res["message"] = "invalid gender"
                                            }
                                        } else {
                                            res["status"] = 0
                                            res["message"] = "invalid dob"
                                        }
                                    } else {
                                        res["status"] = 0
                                        res["message"] = "invalid dob"
                                    }
                                }
                            } else {
                                res["status"] = 0
                                res["message"] = "invalid abbName"
                            }
                        }
                    } else {
                        res["status"] = 0
                        res["message"] = "invalid projectName"
                    }
                }
                //if not inserted 
                else {
                    var proj = mainProjects.findOne({
                        "_id": xData._id
                    })
                    if (proj) {
                        var t = tournamentEvents.insert({
                            "_id": proj._id,
                            "projectMainName": proj.projectMainName.trim().replace(/\s+/g, ' ')
                        })
                        if (t) {
                            if (xData && xData.projectName && xData.projectName.trim().length != 0) {
                                var projectDet = tournamentEvents.findOne({
                                    "_id": xData._id,
                                    "projectSubName.projectName": emailRegex(xData.projectName.trim().replace(/\s+/g, ' '))
                                })
                                if (projectDet) {
                                    res["status"] = 0
                                    res["message"] = "projectName exists"
                                } else {
                                    if (xData && xData.abbName && xData.abbName.trim().length != 0) {
                                        var projectDet = tournamentEvents.findOne({
                                            "_id": xData._id,
                                            "projectSubName.abbName": emailRegex(xData.abbName.trim().replace(/\s+/g, ""))
                                        })
                                        if (projectDet) {
                                            res["status"] = 0
                                            res["message"] = "abbName exists"
                                        } else {
                                            if (xData && xData.dob && xData.dob.trim().length != 0) {
                                                var dValid = moment(xData.dob, "YYYY MMM DD", true).isValid()
                                                if (dValid) {
                                                    if (xData && xData.gender && xData.gender.trim().length != 0) {
                                                        if (xData.gender == "Male" || xData.gender == "Female" || xData.gender == "All") {
                                                            var dataProjec = {
                                                                "_id": Random.id(),
                                                                "projectName": xData.projectName.trim().replace(/\s+/g, ' '),
                                                                "abbName": xData.abbName.trim().replace(/\s+/g, ''),
                                                                "projectType": "1",
                                                                "gender": xData.gender.trim().replace(/\s+/g, ' '),
                                                                "dob": moment(new Date(xData.dob)).format("YYYY-MM-DD"),
                                                                "dobType": "A"
                                                            }
                                                            var sup = tournamentEvents.update({
                                                                "_id": xData._id
                                                            }, {
                                                                $addToSet: {
                                                                    projectSubName: dataProjec,
                                                                    categoryOrder: xData.abbName.trim().replace(/\s+/g, ''),
                                                                    singleEventsOrder: xData.abbName.trim().replace(/\s+/g, '')
                                                                }
                                                            })
                                                            if (sup) {
                                                                res["status"] = 1
                                                                res["message"] = "saved"
                                                            }
                                                        } else {
                                                            res["status"] = 0
                                                            res["message"] = "invalid gender"
                                                        }
                                                    } else {
                                                        res["status"] = 0
                                                        res["message"] = "invalid gender"
                                                    }
                                                } else {
                                                    res["status"] = 0
                                                    res["message"] = "invalid dob"
                                                }
                                            } else {
                                                res["status"] = 0
                                                res["message"] = "invalid dob"
                                            }
                                        }
                                    } else {
                                        res["status"] = 0
                                        res["message"] = "invalid abbName"
                                    }
                                }
                            } else {
                                res["status"] = 0
                                res["message"] = "invalid projectName"
                            }
                        } else {
                            res["status"] = 0
                            res["message"] = "invalid project selection"
                        }
                    } else {
                        res["status"] = 0
                        res["message"] = "invalid project selection"
                    }
                }
            } else {
                res["status"] = 0
                res["message"] = "invalid project selection"
            }
            return res
        } catch (e) {
            res["status"] = 0
            res["message"] = e
            return res
        }
    }
})


Meteor.methods({
    "addAdminProjectSports": function(xData) {
        var res = {}
        try {
            if (xData) {
                if (xData.projectName && xData.projectName.trim().length != 0) {
                    xData.projectName = xData.projectName.trim().replace(/\s+/g, " ")
                    var proj = xData.projectName
                    if (xData.dbName && xData.dbName.trim().length != 0) {
                        xData.dbName = xData.dbName.trim().replace(/\s+/g, "")
                        var dbName = xData.dbName
                        var getMainProj = mainProjects.findOne({
                            "projectMainName": xData.projectName
                        })
                        if (getMainProj) {
                            var tourProj = tournamentEvents.findOne({
                                "projectMainName": xData.projectName
                            })

                            if (tourProj) {
                                var findAlready = adminSportsRoles.findOne({})
                                if (findAlready && findAlready.sports && findAlready.sports.length != 0 &&
                                    findAlready.playersDB && findAlready.playersDB.length != 0 &&
                                    findAlready.roles && findAlready.roles.length != 0 &&
                                    findAlready.indexToSkip && findAlready.indicesOfPlayers &&
                                    findAlready.indicesOfPlayers.length != 0 &&
                                    findAlready.lastInsertedInd != undefined &&
                                    findAlready.lastInsertedInd != null) {

                                    var dbNames = findAlready.dbNames
                                    var sportsAdded = findAlready.sports
                                    var lastInsertedInd = findAlready.lastInsertedInd
                                    var indicesOfPlayers = findAlready.indicesOfPlayers
                                    var indexToSkip = findAlready.indexToSkip
                                    var playersDB = findAlready.playersDB
                                    var roles = findAlready.roles

                                    if (_.contains(sportsAdded, proj) == false) {
                                        if (_.contains(playersDB, dbName) == false) {

                                            dbNames.insert(parseInt(lastInsertedInd + 1), dbName)
                                            sportsAdded.insert(parseInt(lastInsertedInd + 1), proj);
                                            playersDB.insert(parseInt(lastInsertedInd + 1), dbName);
                                            indicesOfPlayers.insert(parseInt(lastInsertedInd + 1), parseInt(lastInsertedInd + 1))
                                            indexToSkip = parseInt(indexToSkip + 1)
                                            roles.insert(parseInt(lastInsertedInd + 1), "player");

                                            var rem = adminSportsRoles.remove({})
                                            if (rem) {
                                                var ins = adminSportsRoles.insert({
                                                    dbNames: dbNames,
                                                    roles: roles,
                                                    sports: sportsAdded,
                                                    playersDB: playersDB,
                                                    indexToSkip: indexToSkip,
                                                    indicesOfPlayers: indicesOfPlayers,
                                                    lastInsertedInd: parseInt(lastInsertedInd + 1)
                                                })
                                                if (ins) {
                                                    res["status"] = 1
                                                    res["message"] = "saved"
                                                } else {
                                                    res["status"] = 0
                                                    res["message"] = "cannot save"
                                                }
                                            } else {
                                                res["status"] = 0
                                                res["message"] = "adminSportsRoles is not updated"
                                            }
                                        } else {
                                            res["status"] = 0
                                            res["message"] = "this dbName exists"
                                        }
                                    } else {
                                        res["status"] = 0
                                        res["message"] = "this sport exists"
                                    }
                                } else {
                                    res["status"] = 0
                                    res["message"] = "adminSportsRoles is not updated"
                                }
                            } else {
                                res["status"] = 0
                                res["message"] = "project is not added to tournamentEvents"
                            }

                        } else {
                            res["status"] = 0
                            res["message"] = "project is not added to mainProjects"
                        }

                    } else {
                        res["status"] = 0
                        res["message"] = "invalid dbName"
                    }
                } else {
                    res["status"] = 0
                    res["message"] = "invalid projectName"
                }
            } else {
                res["status"] = 0
                res["message"] = "invalid data"
            }
            return res
        } catch (e) {
            res["status"] = 0
            res["message"] = e
            return res
        }
    }
})

Meteor.methods({
    "insertAdminProject": function() {
        var res = {}
        try {
            /*var checkInserted = adminSportsRoles.findOne({})
            if (checkInserted) {
                res["status"] = 0
                res["message"] = "aleready inserted"
            } else {
                var ins = adminSportsRoles.insert({
                    dbNames:[ "userDetailsTT", "associationDetails", "academyDetails", "schoolDetails", "schoolPlayers", "otherUsers" ],
                    roles: [ "player", "association", "academy", "school", "player", "coach", "reporter", "organiser", "umpire", "journalist", "reporter", "other" ],
                    sports:[ "Table Tennis"],
                    playersDB:[ "userDetailsTT"],
                    indexToSkip: 4,
                    indicesOfPlayers: [ 0, 5 ],
                    lastInsertedInd: 0
                })
                if (ins) {
                    res["status"] = 1
                    res["message"] = "saved"
                } else {
                    res["status"] = 0
                    res["message"] = "cannot save"
                }
            }*/
            return res
        } catch (e) {
            res["status"] = 0
            res["message"] = e
            return res
        }
    }
})

Array.prototype.insert = function(index, item) {
    this.splice(index, 0, item);
};




Meteor.methods({
    "updateUserDetailsForGivenId": async function(xData) {
        var res = {}
        res = {
            status: "failure",
            data: 0,
            message: "cannot update user details"
        }
        try {
            if (xData) {
                var roles = [
                    "Player",
                    "Association"
                ]
                var dbNames = [
                    "userDetailsTT",
                    "associationDetails"
                ]

                var general = [
                    "userId"
                ]

                var fieldNamesPlayer = [
                    "userName",
                    "dateOfBirth",
                    "gender",
                    "address",
                    "city",
                    "pinCode",
                    "guardianName",
                    "emailAddress",
                    "phoneNumber",
                ]

                var eqfieldNamesPlayer = [
                    "userName",
                    "dateOfBirth",
                    "gender",
                    "address",
                    "city",
                    "pinCode",
                    "guardianName",
                    "emailAddress",
                    "phoneNumber"
                ]

                var fieldNamesDA = [
                    "phoneNumber",
                    "contactPerson",
                    "address",
                    "city",
                    "pinCode",
                    "associationName",
                    "emailAddress"
                ]

                var eqfieldNamesPlayer = [
                    "phoneNumber",
                    "contactPerson",
                    "address",
                    "city",
                    "pinCode",
                    "associationName",
                    "emailAddress"
                ]

                var validGeneralPlayer = false
                var validGeneralDA = false
                var validationClassObject = new validationClass();

                for (var i = 0; i < general.length; i++) {


                    if (xData[general[i]] != undefined && xData[general[i]] != null) {
                        if (general[i] == "userId") {
                            var s = validationClassObject.nullUndefinedEmpty(xData[general[i]])
                            if (s == 2) {
                                res.data = 0
                                res.message = general[i] + "cannot be null"
                                break
                            } else if (s == 3) {
                                res.data = 0
                                res.message = general[i] + "cannot be undefined"
                                break
                            } else if (s == 4) {
                                res.data = 0
                                res.message = general[i] + "cannot be empty"
                                break
                            } else if (s == 1) {
                                var checkUserId = Meteor.users.findOne({
                                    "userId": xData.userId
                                })
                                if (checkUserId && checkUserId.role) {
                                    var indOfRole = _.indexOf(roles, checkUserId.role)
                                    if (indOfRole >= 0) {
                                        var s = global[dbNames[indOfRole]].findOne({
                                            "userId": xData.userId
                                        })
                                        if (s) {
                                            if (s.role == "Player") {
                                                res.data = 0
                                                validGeneralPlayer = true
                                            } else if (s.role == "Association") {
                                                if (s.associationType && s.associationType == "District/City") {
                                                    res.data = 0
                                                    validGeneralDA = true
                                                }
                                            } else {
                                                res.data = 0
                                                res.message = "invalid player or assoc user details"
                                                break;
                                            }
                                        } else {
                                            res.data = 0
                                            res.message = "invalid user details"
                                            break;
                                        }
                                    } else {
                                        res.data = 0
                                        res.message = "Roles should be either " + roles.toString()
                                        break;
                                    }
                                } else {
                                    res.data = 0
                                    res.message = "Role is undefined"
                                    break;
                                }
                            }
                        }
                    } else {
                        res.data = 0
                        res.message = "invalid " + general[i]
                        break
                    }
                }


                if (validGeneralPlayer == true) {

                    for (var j = 0; j < fieldNamesPlayer.length; j++) {
                        var field = fieldNamesPlayer[j]

                        if (xData[field] != undefined && xData[field] != null) {
                            if (field == "userName") {
                                res.data = 0
                                var s = validationClassObject.nullUndefinedEmpty(xData[field])
                                if (s == 1) {
                                    res.data = 1
                                    continue;
                                } else {
                                    res.message = "invalid " + field
                                    break;
                                }
                            }

                            if (field == "dateOfBirth") {
                                res.data = 0
                                var s = validationClassObject.nullUndefinedEmpty(xData[field])
                                if (s == 1) {
                                    var d = validationClassObject.validateDate(xData[field])
                                    if (d) {
                                        res.data = 1
                                        continue;
                                    } else {
                                        res.message = "invalid dateOfBirth format or date"
                                        break;
                                    }
                                } else {
                                    res.message = "invalid " + field
                                    break;
                                }
                            }

                            if (field == "gender") {
                                res.data = 0
                                var s = validationClassObject.nullUndefinedEmpty(xData[field])
                                if (s == 1) {
                                    var d = validationClassObject.validateGenderMaleOrFemale(xData[field])
                                    if (d) {
                                        res.data = 1
                                        continue;
                                    } else {
                                        res.message = "invalid gender, should be Male or Female"
                                        break;
                                    }
                                } else {
                                    res.message = "invalid " + field
                                    break;
                                }
                            }

                            if (field == "address") {
                                res.data = 0
                                var n = validationClassObject.nullUndefined(xData[field])
                                if (n == 1) {
                                    res.data = 1
                                    continue;
                                } else {
                                    res.message = "invalid " + field
                                    break
                                }
                            }

                            if (field == "city") {
                                res.data = 0
                                var n = validationClassObject.nullUndefinedEmpty(xData[field])
                                if (n == 1) {
                                    res.data = 1
                                    continue;
                                } else {
                                    res.message = "invalid " + field
                                    break
                                }
                            }

                            if (field == "pinCode") {
                                res.data = 0
                                var p = validationClassObject.validatePinCodeGivenlimit(xData[field], 6)
                                if (p) {
                                    res.data = 1
                                    continue;
                                } else {
                                    res.message = "invalid " + field
                                    break;
                                }
                            }

                            if (field == "guardianName") {
                                res.data = 0
                                var s = validationClassObject.nullUndefinedEmpty(xData[field])
                                if (s == 1) {
                                    res.data = 1
                                    continue;
                                } else {
                                    res.message = "invalid " + field
                                    break;
                                }
                            }


                            if (field == "emailAddress") {
                                res.data = 0
                                var s = validationClassObject.nullUndefined(xData[field])
                                if (s == 1) {
                                    var s2 = validationClassObject.nullUndefinedEmpty(xData[field])
                                    if (s2 == 1) {
                                        // /registerValidationForUploadPlayers: function(xData,num,inds)
                                        var e = validationClassObject.validateEmail(xData[field])
                                        if (e) {
                                            res.data = 1
                                            continue;
                                        } else {
                                            res.message = "phoneNumber should be 10 digits"
                                            break;
                                        }
                                    } else {
                                        res.data = 1
                                        continue;
                                    }
                                } else {
                                    res.message = "invalid " + field
                                    break;
                                }
                            }


                            if (field == "phoneNumber") {
                                res.data = 0
                                var s = validationClassObject.nullUndefined(xData[field])
                                if (s == 1) {
                                    var s2 = validationClassObject.nullUndefinedEmpty(xData[field])
                                    if (s2 == 1) {
                                        // /registerValidationForUploadPlayers: function(xData,num,inds)
                                        var ph = validationClassObject.validateMobileNumWithGivenLimit(xData[field], 10)
                                        if (ph) {
                                            res.data = 1
                                            continue;
                                        } else {
                                            res.message = "phoneNumber should be 10 digits"
                                            break
                                        }
                                    } else {
                                        res.data = 1
                                        continue;
                                    }
                                } else {
                                    res.message = "invalid " + field
                                    break
                                }
                            }

                        } else {
                            res.data = 0
                            res.message = "invalid 1" + field
                            break;
                        }
                    }
                } else if (validGeneralDA == true) {
                    for (var k = 0; k < fieldNamesDA.length; k++) {
                        var field = fieldNamesDA[k]
                        if (xData[field] != undefined && xData[field] != null) {
                            if (field == "associationName") {
                                res.data = 0
                                var s = validationClassObject.nullUndefinedEmpty(xData[field])
                                if (s == 1) {
                                    xData.userName = xData.associationName
                                    res.data = 1
                                    continue;
                                } else {
                                    res.message = "invalid " + field
                                    break;
                                }
                            }

                            if (field == "contactPerson") {
                                res.data = 0
                                var s = validationClassObject.nullUndefinedEmpty(xData[field])
                                if (s == 1) {
                                    res.data = 1
                                    continue;
                                } else {
                                    res.message = "invalid " + field
                                    break;
                                }
                            }



                            if (field == "address") {
                                res.data = 0
                                var n = validationClassObject.nullUndefined(xData[field])
                                if (n == 1) {
                                    res.data = 1
                                    continue;
                                } else {
                                    res.message = "invalid " + field
                                    break
                                }
                            }

                            if (field == "city") {
                                res.data = 0
                                var n = validationClassObject.nullUndefinedEmpty(xData[field])
                                if (n == 1) {
                                    res.data = 1
                                    continue;
                                } else {
                                    res.message = "invalid " + field
                                    break
                                }
                            }

                            if (field == "pinCode") {
                                res.data = 0
                                var p = validationClassObject.validatePinCodeGivenlimit(xData[field], 6)
                                if (p) {
                                    res.data = 1
                                    continue;
                                } else {
                                    res.message = "invalid " + field
                                    break
                                }
                            }


                            if (field == "emailAddress") {
                                res.data = 0
                                var s = validationClassObject.nullUndefined(xData[field])
                                if (s == 1) {
                                    // /registerValidationForUploadPlayers: function(xData,num,inds)
                                    var e = validationClassObject.validateEmail(xData[field])
                                    if (e) {
                                        res.data = 1
                                        continue;
                                    } else {
                                        res.message = "emailAddress is not valid"
                                        break
                                    }
                                } else {
                                    res.message = "invalid " + field
                                    break
                                }
                            }


                            if (field == "phoneNumber") {
                                res.data = 0
                                var s = validationClassObject.nullUndefined(xData[field])
                                if (s == 1) {
                                    // /registerValidationForUploadPlayers: function(xData,num,inds)
                                    var ph = validationClassObject.validateMobileNumWithGivenLimit(xData[field], 10)
                                    if (ph) {
                                        res.data = 1
                                        continue;
                                    } else {
                                        res.message = "phoneNumber should be 10 digits"
                                        break
                                    }
                                } else {
                                    res.message = "invalid " + field
                                    break
                                }
                            }

                        } else {
                            res.data = 0
                            res.message = "invalid " + field
                            break;
                        }
                    }
                }

                if (validGeneralPlayer == true && res.data != 0) {
                    //update player
                    var up = await Meteor.call("updatePlayerDAAfterValidation", xData, 1)
                    try {
                        if (up && up.data == 1) {
                            res.status = "success"
                            res.data = 1
                            res.message = "Updated player details"
                        } else if (up && up.data == 0) {
                            res.data = 0
                            res.message = up.message
                        }
                        return res
                    } catch (e) {
                        res.data = 0
                        res.message = e
                        return res
                    }
                } else if (validGeneralDA == true && res.data != 0) {
                    //update da
                    var up = await Meteor.call("updatePlayerDAAfterValidation", xData, 2)
                    try {
                        if (up && up.data == 1) {
                            res.status = "success"
                            res.data = 1
                            res.message = "Updated da details"
                        } else if (up && up.data == 0) {
                            res.data = 0
                            res.message = up.message
                        }
                        return res
                    } catch (e) {
                        res.data = 0
                        res.message = e
                        return res
                    }
                } else {
                    return res
                }
            } else {
                res.message = "invalid data"
            }
        } catch (e) {
            res.message = e
            return res
        }
    }
})


Meteor.methods({
    updatePlayerDAAfterValidation: async function(xData, type) {
        var res = {}
        res = {
            status: "failure",
            data: 0,
            message: "cannot update user details"
        }
        try {
            if (xData) {
                var em = xData.emailAddress.replace(/\s+/g, ' ').trim().length
                var ph = xData.phoneNumber.replace(/\s+/g, ' ').trim().length
                if (em != 0 || ph != 0) {
                    var num = 0
                    var checkDup = true
                    var query = {}
                    var query2 = {}
                    if (em != 0 && ph == 0) {
                        num = 1
                        query = {
                            "gender": xData.gender,
                            "pinCode": xData.pinCode,
                            "guardianName": xData.guardianName,
                            "address": xData.address,
                            "dateOfBirth": xData.dateOfBirth,
                            "city": xData.city,
                            "userName": xData.userName,
                            "emailAddress": xData.emailAddress,
                            "phoneNumber": ""

                        }
                        query2 = {
                            "emails": [{
                                "address": xData.emailAddress
                            }],
                            "userName": xData.userName,
                            "emailAddress": xData.emailAddress,
                            "phoneNumber": "",
                            "verifiedBy": []
                        }

                    } else if (em == 0 && ph !== 0) {
                        num = 2
                        query = {
                            "gender": xData.gender,
                            "pinCode": xData.pinCode,
                            "guardianName": xData.guardianName,
                            "address": xData.address,
                            "dateOfBirth": xData.dateOfBirth,
                            "city": xData.city,
                            "userName": xData.userName,
                            "emailAddress": "",
                            "phoneNumber": xData.phoneNumber

                        }
                        query2 = {
                            "userName": xData.userName,
                            "emailAddress": "",
                            "phoneNumber": xData.phoneNumber,
                            "verifiedBy": []
                        }
                    } else if (em != 0 && ph != 0) {
                        num = 3


                        query = {
                            "gender": xData.gender,
                            "pinCode": xData.pinCode,
                            "guardianName": xData.guardianName,
                            "address": xData.address,
                            "dateOfBirth": xData.dateOfBirth,
                            "city": xData.city,
                            "userName": xData.userName,
                            "emailAddress": xData.emailAddress,
                            "phoneNumber": xData.phoneNumber
                        }
                        query2 = {
                            "emails": [{
                                "address": xData.emailAddress
                            }],
                            "userName": xData.userName,
                            "emailAddress": xData.emailAddress,
                            "phoneNumber": xData.phoneNumber,
                            "verifiedBy": []
                        }

                    }

                    var checkDup = await Meteor.call("adminUpdateValidationForUploadPlayers", xData, num)
                    if (checkDup) {
                        res.data = 0
                        res.message = checkDup
                    } else {
                        var s;
                        if (type == 1) {
                            if (num == 2) {
                                s = Meteor.users.update({
                                    userId: xData.userId
                                }, {
                                    $set: query2
                                }, {
                                    $unset: {
                                        "emails": ""
                                    }
                                })
                            } else {
                                s = Meteor.users.update({
                                    userId: xData.userId
                                }, {
                                    $set: query2
                                })
                            }
                        }
                        if (type == 2) {
                            s = Meteor.users.update({
                                userId: xData.userId
                            }, {
                                $set: {
                                    "emails": [{
                                        "address": xData.emailAddress
                                    }],
                                    "userName": xData.userName,
                                    "emailAddress": xData.emailAddress,
                                    "phoneNumber": xData.phoneNumber
                                }
                            })
                        }
                        if (s && type == 1) {
                            var s1 = userDetailsTT.update({
                                "userId": xData.userId
                            }, {
                                $set: query
                            })
                            if (s1) {
                                res.data = 1
                            } else {
                                res.message = "cannot update player details"
                            }
                        } else if (s && type == 2) {
                            var s1 = associationDetails.update({
                                    "userId": xData.userId
                                }, {
                                    $set: {
                                        "pinCode": xData.pinCode,
                                        "associationName": xData.associationName,
                                        "address": xData.address,
                                        "city": xData.city,
                                        "contactPerson": xData.contactPerson,
                                        "emailAddress": xData.emailAddress,
                                        "phoneNumber": xData.phoneNumber
                                    }
                                })
                            if (s1) {
                                res.data = 1
                            } else {
                                res.message = "cannot update da details"
                            }
                        } else {
                            if (type == 1)
                                res.message = "cannot update player details"
                            else if (type == 2)
                                res.message = "cannot update da details"
                        }
                    }

                } else {
                    res.message = "either emailAddress or phoneNumber is required"
                }
            } else {
                res.message = "invalid emailAddress and phoneNumber"
            }
            return res
        } catch (e) {
            res.message = e
            return res
        }
    }
})

Meteor.methods({
    'fetchForGivenEmailOrPhone': function(Id) {
        try {
            check(Id, String)
            if (Id) {
                var eveOrg;
                var toret = "userDetailsTT"
                var usersMet = Meteor.users.findOne({
                    $or: [{
                        emailAddress: Id
                    }, {
                        phoneNumber: Id
                    }]
                })

                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                    if (dbn) {
                        toret = dbn
                    }
                }


                eveOrg = global[toret].findOne({
                    $or: [{
                        emailAddress: Id
                    }, {
                        phoneNumber: Id
                    }]
                });
                if (eveOrg == undefined) {
                    eveOrg = academyDetails.findOne({
                        $or: [{
                            emailAddress: Id
                        }, {
                            phoneNumber: Id
                        }]
                    });
                    if (eveOrg == undefined) {
                        eveOrg = associationDetails.findOne({
                            $or: [{
                                emailAddress: Id
                            }, {
                                phoneNumber: Id
                            }]
                        })
                        if (eveOrg == undefined) {
                            eveOrg = otherUsers.findOne({
                                $or: [{
                                    emailAddress: Id
                                }, {
                                    phoneNumber: Id
                                }]
                            })
                        }
                    }
                }
                if (eveOrg != undefined)
                    return eveOrg;
                else return false
            }
        } catch (e) {
        }
    }
})


Meteor.methods({
    'changeStateProvince': function() {
        try{
            var s = Meteor.users.update({
                associationType:"State/Province/Country"
            },{
                $set:{
                    associationType:"State/Province/County"
                }
            },{
                multi:true
            })

            var t = associationDetails.update({
                associationType:"State/Province/Country"
            },{
                $set:{
                    associationType:"State/Province/County"
                }
            },{
                multi:true
            })

            var data = {
                meteor:s,
                assoc:t
            }

            return data
        }catch(e){

        }
    }
})

Meteor.methods({
    'checkstateprovinceMethod': function() {
        try{
            var s = Meteor.users.find({
                associationType:"State/Province/Country"
            }).fetch()

            var t = associationDetails.find({
                associationType:"State/Province/Country"
            }).fetch()

            if(s && s.length){
                return s
            }
            else if(t && t.length){
                return t
            }
            else{
                return false
            }

            return data
        }catch(e){

        }
    }
})

//for each role add userStatus to Active in usersDB
//for userDetailsTT remove userStatus field 

Meteor.methods({
    "setUserStatusForEachRoleUsers":function(){
        try{
            var s = Meteor.users.update({

            },{
                $set:{
                    userStatus:"Active"
                }
            },{
                multi:true
            })
            if(s){
                var s1 = Meteor.users.find({userStatus:{$ne:null}}).fetch()
                if(s1 && s1.length){
                    return s1.length
                }
                else{
                    return "0"
                }
            }
            else{
                return false
            }
        }catch(e){
            return false
        }
    }
})

Meteor.methods({
    "getUserStatusNull":function(){
        try{
             //console.log("Sdf 1")
            var s = Meteor.users.find({userStatus:{$eq:null}}).fetch()
             //console.log(s)
            if(s&&s.length){
                 //console.log("Sdf 2")
                return s.length
            }
        }catch(e){
            //console.log(e)
        }
    }
})

Meteor.methods({
    "unsetUserStatusNull":function(){
        try{
            var s = userDetailsTT.update({},{$unset:{userStatus:1}},{multi:true})
            if(s&&s.length){
                var s1 = userDetailsTT.find({userStatus:{$ne:null}}).fetch()
                if(s1 && s1.length){
                    return s1.length
                }
                else{
                    return false
                }
            }
            else{
                return false
            }
        }catch(e){
            return false
        }
    }
})

Meteor.methods({
    "getUserDetailsTTStatusNotNull":function(){
        try{
            var s = userDetailsTT.find({userStatus:{$ne:null}}).fetch()
            if(s && s.length){
                return s.length
            }
            else{
                return false
            }
        }catch(e){
            return false
        }
    }
})

//after deployment to run
Meteor.methods({
    "updateTournamentType11Sports":function(){
        try{
            var eveUpdate = events.update({
                eventOrganizer:"RCLSqzrDpFfsRwjY8"
            },{
                $set:{
                    "tournamentType":"NITTC-State-2018"
                }
            },{
                multi:true
            })

            var pastEveUpdate = pastEvents.update({
                eventOrganizer:"RCLSqzrDpFfsRwjY8"
            },{
                $set:{
                    "tournamentType":"NITTC-State-2018"
                }
            },{
                multi:true
            })

            var restUpdate = subscriptionRestrictions.update({
                "selectionType" : "schoolOnly"
            },{
                $set:{
                    "tournamentType":"NITTC-State-2018"
                }
            },{
                multi:true
            })
            if(eveUpdate && pastEveUpdate && restUpdate)
                return true
        }catch(e){
            return false
        }
    }
})

Meteor.methods({
    "updateSchoolDetailsAPI":function(){
        try{    
            var schoolDet = schoolTeams.find({}).fetch()
            var countOfSchool = 0
            for(var i=0;i<schoolDet.length;i++){
                if(schoolDet[i] && schoolDet[i].schoolId){
                    var getDomid = schoolDetails.findOne({
                        "userId":schoolDet[i].schoolId
                    })
                    if(getDomid && getDomid.state){
                        var findEve = events.findOne({
                            projectId:schoolDet[i].teamFormatId,
                            eventOrganizer:"RCLSqzrDpFfsRwjY8",
                            domainId:getDomid.state
                        })
                        if(findEve && findEve._id && findEve.tournamentId){
                            var sclUpdate = schoolTeams.update({
                                _id:schoolDet[i]._id
                            },{
                                $set:{
                                    tournamentId:findEve.tournamentId
                                }
                            })
                            if(sclUpdate){
                                countOfSchool = countOfSchool + 1 
                            }
                        } else{
                            var findEve = pastEvents.findOne({
                                projectId:schoolDet[i].teamFormatId,
                                eventOrganizer:"RCLSqzrDpFfsRwjY8",
                                domainId:getDomid.state
                            })

                            if(findEve && findEve._id && findEve.tournamentId){
                                var sclUpdate = schoolTeams.update({
                                    _id:schoolDet[i]._id
                                },{
                                    $set:{
                                        tournamentId:findEve.tournamentId
                                    }
                                })
                                if(sclUpdate){
                                    countOfSchool = countOfSchool + 1 
                                }
                            }
                        }
                    }
                }
            }
            return countOfSchool
        }catch(e){
            return false
        }
    }
})

//still apis for source
//unset statusOfUser in "associationDetails", "academyDetails", "schoolDetails", "schoolPlayers", "otherUsers"