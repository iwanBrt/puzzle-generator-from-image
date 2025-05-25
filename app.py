from flask import Flask, render_template, request, jsonify, redirect, url_for
from PIL import Image
import os
import random
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_puzzle(image_path, grid_size):
    img = Image.open(image_path)
    width, height = img.size
    
    # Calculate tile size
    tile_width = width // grid_size
    tile_height = height // grid_size
    
    # Create tiles
    tiles = []
    for i in range(grid_size):
        for j in range(grid_size):
            left = j * tile_width
            upper = i * tile_height
            right = left + tile_width
            lower = upper + tile_height
            
            tile = img.crop((left, upper, right, lower))
            tiles.append({
                'position': i * grid_size + j,
                'image': tile
            })
    
    return tiles, tile_width, tile_height

@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/game')
def game():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    grid_size = int(request.form.get('grid_size', 3))
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Create puzzle
        tiles, tile_width, tile_height = create_puzzle(filepath, grid_size)
        
        # Save tiles
        tile_paths = []
        for i, tile in enumerate(tiles):
            tile_filename = f'tile_{i}.png'
            tile_path = os.path.join(app.config['UPLOAD_FOLDER'], tile_filename)
            tile['image'].save(tile_path)
            tile_paths.append({
                'position': tile['position'],
                'path': f'/static/uploads/{tile_filename}'
            })
        
        # Shuffle tiles
        random.shuffle(tile_paths)
        
        return jsonify({
            'tiles': tile_paths,
            'grid_size': grid_size,
            'tile_width': tile_width,
            'tile_height': tile_height
        })
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/check_solution', methods=['POST'])
def check_solution():
    data = request.get_json()
    current_positions = data.get('positions', [])
    
    # Check if tiles are in correct order (0 to n-1)
    is_correct = all(i == pos for i, pos in enumerate(current_positions))
    
    return jsonify({
        'correct': is_correct
    })

if __name__ == '__main__':
    app.run(debug=True) 