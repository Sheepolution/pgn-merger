class Chess {

    constructor() {
        this.visualizer = new Visualizer();

        this.games = [];
        this.move = -1

        for (const game of CHESS_DATA) {
            this.games.push(new Game(game))
        }

        this.done = false;
    }

    async Update() {
        if (this.done) {
            return;
        }

        this.move++;
        var aliveGames = 0;
        for (const game of this.games) {
            if (game.NextMove()) {
                aliveGames++;
            }
        }

        if (aliveGames == 0) {
            this.done = true;
            return;
        }

        const data = [
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}]
        ];

        for (const game of this.games) {
            if (game.ended) { continue; }
            for (const playerName in game.board) {
                for (const pieceName in game.board[playerName]) {
                    const name = playerName + pieceName;
                    for (const piece of game.board[playerName][pieceName]) {
                        const dataPart = data[piece[1]][piece[0]];
                        if (dataPart[name] == null) {
                            dataPart[name] = 0;
                        }

                        dataPart[name]++;
                    }
                }
            }
        }

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            for (let j = 0; j < row.length; j++) {
                const dataPart = row[j];
                var max = 0, name = null;
                for (const pieceName in dataPart) {
                    if (!['BP', 'WP'].includes(pieceName)) {
                        if (dataPart[pieceName] > max) {
                            name = pieceName;
                            max = dataPart[pieceName];
                        }
                    }
                }

                data[i][j] = name;
            }
        }

        this.visualizer.move = Math.floor(this.move / 2);
        this.visualizer.turn = this.move % 2 == 1;
        this.visualizer.board = data;
    }

    async Draw() {
        this.visualizer.Draw();
    }
}