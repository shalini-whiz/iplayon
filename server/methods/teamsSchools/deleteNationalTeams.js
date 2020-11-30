// eventorganizer is required
//eventName is required
//tournamentId is required
//teamId is required



//for individual event
//check for team manager 
	/* if given player is team manager
		* update teamManager (function is teamManUpdate)
			* case 1_teamUpdate: responses from teamManagerUpdate, teamFormatId is 0
			  teamManager is 0 -- 
			  here no team players of that team
			  other than given playerId

			* case 2_teamUpdate: if loop of each team member  couldnt find player with teamEvent is true,
			  fetch schoolTeams for that teamId and
			  set teamManager of that team to 1 --
			  here response is teamFormatId contains valid id and teamManager will contain 1

			* case 3_teamUpdate: if there are teamMembers, loop through each team member, check teamEvent is true
			  for each player, when once the player with teamEvent is true found, set that
			  playerId as teamManager for that team -- 
			  here response is teamFormatId and teamManager will
			  contain valid ids

			* case 4_teamUpdate: from catch statement returns false
	*/

	/* using returned data from function teamManUpdate
		if it is case 1_teamUpdate:

			* 1st func : delete complete team (function is teamDelete)
				* case 1_teamDelete: if deleted return true
				* case 2_teamDelete: if not deleted return false
			* 2nd func : pull playerId from event participants (function is removeEveParts)
				* query is eventName and tournamentId
				* case 1_removeEveParts: if removed, returns true
				* case 2_removeEveParts: if not removed, returns false
			* 3rd func : delete that player entry (function is playerEntRemove)
				* case 1_playerEntRemove: if removed, returns true
				* case 2_playerEntRemove: if not removed, returns false

				if case 1_teamDelete is true then call removeEveParts
				if case 1_removeEveParts is true then call playerEntRemove
				if case 1_playerEntRemove is true then send success message

		if it is case 2_teamUpdate: 
			* 1st func : pull playerId from event participants (function is removeEveParts)
				* query is eventName and tournamentId
				* case 1_removeEveParts: if removed, returns true
				* case 2_removeEveParts: if not removed, returns false
			* 2nd func : delete that player entry (function is playerEntRemove)
				* case 1_playerEntRemove: if removed, returns true
				* case 2_playerEntRemove: if not removed, returns false
			* 3rd func : pull playerId from school teams(function is deleteFromTeam)
				* parameter is  data and type (where type is individualEvent, individualEvent 
				is true for that player pull from school teams)
				* case 1_deleteFromTeam: if pull is scuccess, returns true
				* case 2_deleteFromTeam: if pull is failed, returns false

		if it is case 3_teamUpdate:
			
	*/	