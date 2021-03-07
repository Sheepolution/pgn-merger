CHESS_DATA = [];

for (let i = 0; i < GAME_LIST.length; i++) {
	var game = GAME_LIST[i];
	const newGame = [];
	var match = game.match(/\d+\.\s([\S]+)\s(([\S]+)\s)?/);
	var j = 0;
	while (match != null) {
		const move = [match[1].replace(new RegExp(/[!?+#]/, 'g'), '')];
		if (match[3] != null) {
			move.push(match[3].replace(new RegExp(/[!?+#]/, 'g'), ''));
		}

		newGame.push(move);

		game = game.slice(match[0].length);
		match = game.match(/\d+\.\s([\S]+)\s(([\S]+)\s)?/);
	}

	CHESS_DATA.push(newGame);
}
