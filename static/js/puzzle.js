document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const gridSize = document.getElementById('gridSize');
    const generatePuzzleBtn = document.getElementById('generatePuzzle');
    const puzzleGrid = document.getElementById('puzzleGrid');
    const checkSolutionBtn = document.getElementById('checkSolution');
    const resultModal = document.getElementById('resultModal');
    const resultMessage = document.getElementById('resultMessage');
    const closeModal = document.querySelector('.close');

    let currentTiles = [];
    let dragSrcIndex = null;
    let tileWidth = 100;
    let tileHeight = 100;
    let grid = 3;

    // Event Listeners
    generatePuzzleBtn.addEventListener('click', generatePuzzle);
    checkSolutionBtn.addEventListener('click', checkSolution);
    closeModal.addEventListener('click', () => resultModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === resultModal) {
            resultModal.style.display = 'none';
        }
    });

    async function generatePuzzle() {
        const file = imageInput.files[0];
        if (!file) {
            alert('Please select an image first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('grid_size', gridSize.value);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.error) {
                alert(data.error);
                return;
            }
            tileWidth = data.tile_width;
            tileHeight = data.tile_height;
            grid = data.grid_size;
            currentTiles = data.tiles;
            renderGrid();
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while generating the puzzle.');
        }
    }

    function renderGrid() {
        puzzleGrid.innerHTML = '';
        puzzleGrid.style.gridTemplateColumns = `repeat(${grid}, ${tileWidth}px)`;
        puzzleGrid.style.gridTemplateRows = `repeat(${grid}, ${tileHeight}px)`;
        currentTiles.forEach((tile, index) => {
            const tileElement = document.createElement('div');
            tileElement.className = 'puzzle-tile';
            tileElement.draggable = true;
            tileElement.dataset.index = index;
            tileElement.dataset.position = tile.position;
            tileElement.style.width = tileWidth + 'px';
            tileElement.style.height = tileHeight + 'px';

            const img = document.createElement('img');
            img.src = tile.path;
            img.width = tileWidth;
            img.height = tileHeight;
            img.draggable = false;

            tileElement.appendChild(img);
            puzzleGrid.appendChild(tileElement);

            tileElement.addEventListener('dragstart', handleDragStart);
            tileElement.addEventListener('dragover', handleDragOver);
            tileElement.addEventListener('drop', handleDrop);
            tileElement.addEventListener('dragend', handleDragEnd);
        });
        checkSolutionBtn.style.display = 'block';
    }

    function handleDragStart(e) {
        dragSrcIndex = Number(this.dataset.index);
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(e) {
        e.preventDefault();
        const dragTargetIndex = Number(this.dataset.index);
        if (dragSrcIndex !== null && dragSrcIndex !== dragTargetIndex) {
            // Swap tiles in array
            const temp = currentTiles[dragSrcIndex];
            currentTiles[dragSrcIndex] = currentTiles[dragTargetIndex];
            currentTiles[dragTargetIndex] = temp;
            // Re-render grid
            renderGrid();
        }
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
        dragSrcIndex = null;
    }

    async function checkSolution() {
        // Now currentTiles order is the visual order
        const positions = currentTiles.map(tile => parseInt(tile.position));
        try {
            const response = await fetch('/check_solution', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ positions })
            });
            const data = await response.json();
            showResult(data.correct);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while checking the solution.');
        }
    }

    function showResult(isCorrect) {
        resultMessage.textContent = isCorrect 
            ? '🎉 Selamat! Puzzle tersusun dengan benar!' 
            : 'Oops! Susunan belum tepat, coba lagi.';
        resultModal.style.display = 'block';
        const playAgainBtn = document.getElementById('playAgainBtn');
        const giveUpBtn = document.getElementById('giveUpBtn');
        if (isCorrect) {
            playAgainBtn.style.display = 'inline-block';
            giveUpBtn.style.display = 'none';
        } else {
            playAgainBtn.style.display = 'none';
            giveUpBtn.style.display = 'inline-block';
        }
    }

    // Play Again button event
    document.getElementById('playAgainBtn').onclick = function() {
        window.location.href = '/game';
    };
    // Give Up button event
    document.getElementById('giveUpBtn').onclick = function() {
        window.location.href = '/game';
    };
}); 