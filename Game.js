class Game {

    constructor(game) {
        this.turn = -1;
        this.move = 0;
        this.ended = false
        this.game = game;

        this.board = {
            W: {
                P: [
                    [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6]
                ],
                N: [
                    [1, 7], [6, 7]
                ],
                B: [
                    [2, 7], [5, 7]
                ],
                R: [
                    [0, 7], [7, 7]
                ],
                Q: [
                    [3, 7]
                ],
                K: [
                    [4, 7],
                ]
            },
            B: {
                P: [
                    [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]
                ],
                N: [
                    [1, 0], [6, 0]
                ],
                B: [
                    [2, 0], [5, 0]
                ],
                R: [
                    [0, 0], [7, 0]
                ],
                Q: [
                    [3, 0]
                ],
                K: [
                    [4, 0],
                ]
            }
        }
    }

    NextMove() {
        if (this.ended) {
            return false;
        }

        if (this.turn == 1) {
            this.move++;
            this.turn = 0;
        } else {
            this.turn++;
        }

        if (this.move >= this.game.length || this.turn >= this.game[this.move].length) {
            this.ended = true;
            return false;
        }

        this.UpdateBoardFromMove(this.game[this.move][this.turn], this.turn == 0 ? 'W' : 'B');

        return true;
    }

    UpdateBoardFromMove(move, player) {
        const board = this.board;

        if (move == 'O-O') {
            const king = board[player].K[0];
            king[0] = 6;
            const rook = board[player].R.find(r => r[0] == 7 && r[1] == (player == 'W' ? 7 : 0));
            rook[0] = 5;
            return;
        } else if (move == 'O-O-O') {
            const king = board[player].K[0];
            king[0] = 2;
            const rook = board[player].R.find(r => r[0] == 0 && r[1] == (player == 'W' ? 7 : 0));
            rook[0] = 3;
            return;
        }

        const steps = move.split('');

        var promotion = null;

        if (move.includes('=')) {
            promotion = steps[steps.length - 1];
            steps.splice(-2);
        }

        var piece = steps[0];
        if (piece.toLowerCase() != piece) {
            steps.splice(0, 1);
        } else {
            piece = 'P';
        }

        var row = 8 - parseInt(steps[steps.length - 1]);
        var column = columns[steps[steps.length - 2]];
        steps.splice(-2);

        const take = steps[steps.length - 1] == 'x';
        if (take) {
            steps.splice(-1);
        }

        const fromOne = steps[0];
        const fromTwo = steps[1];

        var fromColumn = null;
        var fromRow = null;

        if (fromTwo) {
            fromColumn = columns[fromOne];
            fromRow = 8 - parseInt(fromTwo);
        } else {
            if (isNaN(parseInt(fromOne))) {
                fromColumn = columns[fromOne];
            } else {
                fromRow = 8 - parseInt(fromOne);
            }
        }

        var pieces = board[player][piece];
        var pieceToMove = null;

        if (fromColumn != null && fromRow != null) {
            pieces = pieces.filter(p => p[0] == fromColumn && p[1] == fromRow);
        } else if (fromColumn != null) {
            pieces = pieces.filter(p => p[0] == fromColumn);
        } else if (fromRow != null) {
            pieces = pieces.filter(p => p[1] == fromRow);
        }

        if (pieces.length == 1) {
            pieceToMove = pieces[0];
        } else {
            pieces = pieces.filter(p => this.IsValidMove(player, piece, p[0], p[1], column, row, take));
            if (pieces.length == 1) {
                pieceToMove = pieces[0];
            } else {
                pieceToMove = pieces.find(p => !this.IsPieceBeingBlockedFromDoingMove(p[0], p[1], column, row));
            }
        }

        if (promotion) {
            const index = board[player].P.findIndex(p => p == pieceToMove)
            board[player].P.splice(index, 1);
            board[player][promotion].push([column, row]);
        } else {
            pieceToMove[0] = column;
            pieceToMove[1] = row;
        }

        if (take) {
            if (!this.RemovePieceOnPosition(player == 'W' ? 'B' : 'W', column, row)) {
                if (piece == 'P') {
                    row += player == 'W' ? 1 : -1;
                    this.RemovePieceOnPosition(player == 'W' ? 'B' : 'W', column, row)
                }
            }
        }
    }

    IsValidMove(player, piece, fromColumn, fromRow, toColumn, toRow, take) {
        const realDiffX = fromColumn - toColumn;
        const realDiffY = fromRow - toRow;
        const diffX = Math.abs(realDiffX);
        const diffY = Math.abs(realDiffY);

        switch (piece) {
            case 'R':
                return diffX == 0 || diffY == 0;
            case 'N':
                return (diffX == 1 && diffY == 2) || (diffX == 2 && diffY == 1);
            case 'B':
                return diffX == diffY;
            case 'Q':
                return (diffX == diffY) || (diffX == 0 || diffY == 0);
            case 'P':
                if (take) {
                    return diffX == 1 && realDiffY == (player == 'W' ? 1 : -1);
                } else {
                    return diffX == 0 && (player == 'W' ? (realDiffY == 1 || realDiffY == 2) : (realDiffY == -1 || realDiffY == -2));
                }
        }
    }

    IsPieceBeingBlockedFromDoingMove(fromColumn, fromRow, toColumn, toRow) {
        while (fromColumn != toColumn || fromRow != toRow) {
            if (fromColumn != toColumn) {
                fromColumn += fromColumn > toColumn ? -1 : 1;
            }

            if (fromRow != toRow) {
                fromRow += fromRow > toRow ? -1 : 1;
            }

            if (fromColumn != toColumn || fromRow != toRow) {
                if (this.FindPieceOnPosition(fromColumn, fromRow)) {
                    return true;
                }
            }
        }

        return false;
    }

    RemovePieceOnPosition(player, column, row) {
        const board = this.board;
        for (const pieceName in board[player]) {
            for (let i = 0; i < board[player][pieceName].length; i++) {
                const piece = board[player][pieceName][i];
                if (piece[0] == column && piece[1] == row) {
                    board[player][pieceName].splice(i, 1);
                    return true;
                }
            }
        }

        return false;
    }

    FindPieceOnPosition(column, row) {
        const board = this.board;
        for (const playerName in board) {
            for (const pieceName in board[playerName]) {
                for (let i = 0; i < board[playerName][pieceName].length; i++) {
                    const piece = board[playerName][pieceName][i];
                    if (piece[0] == column && piece[1] == row) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}