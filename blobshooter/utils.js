function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function findPlayerIndex(id, gameState) {
	for (let i = 0; i<gameState.players.length; i++) {
		if (gameState.players[i].id == id) {
			return i
		}
	}
	return false
}


module.exports = {getRandomNumber, findPlayerIndex}
