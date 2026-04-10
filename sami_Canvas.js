const canvas = document.getElementById('samiCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawGlow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const verticalOffset = 100;
    ctx.save(); 
    ctx.translate(0, verticalOffset);
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'screen'; 

    // --- LAYER 1: Deep Blue
    // Color, LineWidth, ShadowBlur, Opacity
    drawBlurryPath('#281697', 350, 180, 0.3);

    // --- LAYER 2: Mid-Blue
    drawBlurryPath('#383ABD', 300, 100, 0.4);

    // --- LAYER 3: Cyan
    drawBlurryPath('#6DD4BE', 200, 50, 0.5);

    // --- LAYER 4: Teal
    drawBlurryPath('#86B9F5', 100, 30, 0.6);

    drawBlurryPath('#F0EFEF', 50, 30, 0.8);

    // --- LAYER 5:White Core
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FFFFFF';
    ctx.strokeStyle = 'rgba(240, 239, 239, 0.4)'; 
    ctx.lineWidth = 6; 
    renderSPath();

    ctx.globalCompositeOperation = 'source-over';
}

function drawBlurryPath(color, width, blur, opacity) {
    ctx.shadowBlur = blur;
    ctx.shadowColor = color;
    ctx.strokeStyle = `rgba(0,0,0,${opacity})`; 
    ctx.lineWidth = width;

    ctx.save();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2000;
    ctx.translate(0, -2000);
    drawPath();
    ctx.restore();
}

function drawPath() {

    // Start drawing the path
    ctx.beginPath();
    
    // Starting point
    ctx.moveTo(-300, canvas.height * 0.95);

    // Create the "S" 
    ctx.bezierCurveTo(
        canvas.width * 0.8, canvas.height * 1.0, // CP1: Pulls the curve way to the right
        canvas.width * 1, canvas.height * 0.7, // CP2: High and right to create vertical space
        canvas.width * 0.6, canvas.height * 0.5  // Midpoint: Moved to 60% width to shift S right
    );

    // Top Curve
    // center/middle of the screen
    ctx.bezierCurveTo(
        canvas.width * 0.4, canvas.height * 0.4, // CP1: Sweeps back toward the left-middle
        canvas.width * 0.3, canvas.height * 0.2, // CP2: Pulls up toward the top-middle
        canvas.width, canvas.height * 0.15 // End: Exits top right
    );

    ctx.stroke();
}

drawGlow();

// Redraw if window resizes
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawGlow();
});