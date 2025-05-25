# Puzzle Generator from Image

A web-based interactive puzzle game where users can upload images and solve them as puzzles.

## Features

- Upload any image to create a puzzle
- Choose grid size (3x3, 4x4, or 5x5)
- Drag and drop puzzle pieces to solve
- Check solution functionality
- Responsive design
- Interactive feedback

## Requirements

- Python 3.7+
- Flask
- Pillow
- Modern web browser with JavaScript enabled

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd puzzle-generator
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Start the Flask server:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

## How to Use

1. Click "Choose File" to select an image
2. Select desired grid size from the dropdown
3. Click "Generate Puzzle" to create the puzzle
4. Drag and drop pieces to solve the puzzle
5. Click "Check Solution" when finished
6. View the result in the popup

## Project Structure

```
puzzle-generator/
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css  # Styles
│   ├── js/
│   │   └── puzzle.js  # Frontend logic
│   └── uploads/       # Uploaded images and tiles
└── templates/
    └── index.html     # Main page template
```

## Technologies Used

- Backend:
  - Flask (Python web framework)
  - Pillow (Image processing)
  
- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Drag and Drop API

## License

MIT License 