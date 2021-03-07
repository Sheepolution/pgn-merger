class Visualizer {

    constructor() {
        const canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.ctx.font = "20px Arial";
        this.tileSize = 60;

        this.move = 0;
        this.turn = 0;
        this.player = '';

        this.board = [
            ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR']
        ];
    }

    async LoadImages() {
        this.boardImage = await this.LoadImage('images/board.png');
        this.pieces = {
            WP: await this.LoadImage('images/pieces/WP.png'),
            WK: await this.LoadImage('images/pieces/WK.png'),
            WQ: await this.LoadImage('images/pieces/WQ.png'),
            WN: await this.LoadImage('images/pieces/WN.png'),
            WB: await this.LoadImage('images/pieces/WB.png'),
            WR: await this.LoadImage('images/pieces/WR.png'),
            BP: await this.LoadImage('images/pieces/BP.png'),
            BK: await this.LoadImage('images/pieces/BK.png'),
            BQ: await this.LoadImage('images/pieces/BQ.png'),
            BN: await this.LoadImage('images/pieces/BN.png'),
            BB: await this.LoadImage('images/pieces/BB.png'),
            BR: await this.LoadImage('images/pieces/BR.png'),
        }
    }

    async LoadImage(src) {
        return new Promise((resolve, reject) => {
            let img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = src
        });
    }


    GetVisualBoardDataFromBoardData(board) {
        const data = [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
        ];

        for (const playerName in board) {
            for (const pieceName in board[playerName]) {
                for (const piece of board[playerName][pieceName]) {
                    data[piece[1]][piece[0]] = playerName + pieceName;
                }
            }
        }

        this.board = data;
    }

    Draw() {
        this.ctx.clearRect(0, 0, 480, 500);
        this.ctx.drawImage(this.boardImage, 0, 0);

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                const piece = this.pieces[this.board[i][j]];
                if (piece != null) {
                    this.ctx.drawImage(piece, j * this.tileSize, i * this.tileSize);
                }
            }
        }

        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillText(`Move: ${this.move + 1}`, 0, 500);
        this.ctx.fillText(this.turn == 0 ? "White" : "Black", 130, 500);
    }
}