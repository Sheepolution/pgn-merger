window.addEventListener('load', async () => {
    var chess = new Chess();
    await chess.visualizer.LoadImages();
    chess.Draw();
    while (true) {
        await Sleep(1);
        await chess.Update();
        await chess.Draw();
    }
});
