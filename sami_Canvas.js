const canvas = document.getElementById('samiCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawGlow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 'screen' blending makes colors overlap like photographic light
    ctx.globalCompositeOperation = 'screen'; 

    // --- LAYER 1: The Massive Deep Blue Mist (#281697) ---
    // (Color, LineWidth, ShadowBlur, Opacity)
    drawBlurryPath('#281697', 350, 180, 0.3);

    // --- LAYER 2: The Mid-Blue Radiance (#383ABD) ---
    drawBlurryPath('#383ABD', 300, 100, 0.4);

    // --- LAYER 3: The Vibrant Cyan (#6DD4BE) ---
    drawBlurryPath('#6DD4BE', 200, 50, 0.5);

    // --- LAYER 4: The Light Teal Accent (#86B9F5) ---
    drawBlurryPath('#86B9F5', 100, 30, 0.6);

    drawBlurryPath('#F0EFEF', 50, 30, 0.8);

    // --- LAYER 5: The Hot White Core (#F0EFEF) ---
    // We keep this on-screen to act as the "light source"
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
    
    // THE SECRET: We draw the line far OFF-SCREEN (y - 2000) 
    // but drop the SHADOW back onto the screen. 
    // This removes the "solid line" entirely, leaving ONLY the blur.
    ctx.strokeStyle = `rgba(0,0,0,${opacity})`; 
    ctx.lineWidth = width;

    ctx.save();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2000; // Drop the shadow down
    ctx.translate(0, -2000);   // Move the actual line up off-screen
    drawPath();
    ctx.restore();
}

function drawPath() {

    // Start drawing the path
    ctx.beginPath();
    
    // Starting point (Bottom Left-ish)
    ctx.moveTo(-300, canvas.height * 0.95);

    // Create the "S" curve using Bezier points
    // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
 ctx.bezierCurveTo(
        canvas.width * 0.8, canvas.height * 1.0, // CP1: Pulls the curve way to the right
        canvas.width * 1, canvas.height * 0.7, // CP2: High and right to create vertical space
        canvas.width * 0.6, canvas.height * 0.5  // Midpoint: Moved to 60% width to shift S right
    );

    // 3. The Top Curve
    // This part now stays more toward the center/middle of the screen
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