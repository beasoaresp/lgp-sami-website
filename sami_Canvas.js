const canvas = document.getElementById('samiCanvas');
const ctx = canvas.getContext('2d');



function drawGlow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const verticalOffset = 110;
    ctx.save(); 
    ctx.translate(0, verticalOffset);
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'screen'; 

    // --- LAYER 1: Deep Blue
    drawBlurryPath('#281697', 350, 180, 0.3);

    // --- LAYER 2: Mid-Blue
    drawBlurryPath('#383ABD', 300, 100, 0.4);

    // --- LAYER 3: Cyan
    drawBlurryPath('#6DD4BE', 200, 50, 0.5);

    // --- LAYER 4: Teal
    drawBlurryPath('#86B9F5', 100, 30, 0.6);

    drawBlurryPath('#F0EFEF', 50, 30, 0.8);

    ctx.restore(); // Added to match the ctx.save() at the top
    ctx.globalCompositeOperation = 'source-over';

    //canvas.style.backgroundImage = `url(${canvas.toDataURL()})`;
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
    ctx.beginPath();

    const h = window.innerHeight;

    ctx.moveTo(-300, h * 0.85);

    ctx.bezierCurveTo(
        canvas.width * 0.8, h * 0.95, 
        canvas.width * 1, h * 0.7, 
        canvas.width * 0.6, h * 0.5  
    );

    ctx.bezierCurveTo(
        canvas.width * 0.4, h * 0.4, 
        canvas.width * 0.3, h * 0.2, 
        canvas.width, h * 0.15 
    );

    ctx.stroke();
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight + 300; 
    drawGlow();
}

window.addEventListener('resize', resize);
resize(); 