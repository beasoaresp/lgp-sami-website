

export function samiAlert(message) {
    // 1. Cria o elemento dinamicamente
    const toast = document.createElement('div');
    toast.className = 'sami-toast';
    toast.innerText = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 50);
    
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

export function samiConfirm(message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'sami-modal-overlay';
        
        overlay.innerHTML = `
            <div class="sami-modal-box">
                <div class="sami-modal-text">${message}</div>
                <div class="sami-modal-buttons">
                    <button class="sami-btn-cancel" id="sami-modal-cancel">Cancel</button>
                    <button class="sami-btn-confirm" id="sami-modal-ok">Yes, Sure</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => overlay.classList.add('modal-show'), 10);
        
        const okBtn = overlay.querySelector('#sami-modal-ok');
        const cancelBtn = overlay.querySelector('#sami-modal-cancel');
        
        okBtn.addEventListener('click', () => {
            closeModal();
            resolve(true);
        });
        
        cancelBtn.addEventListener('click', () => {
            closeModal();
            resolve(false);
        });
        
        function closeModal() {
            overlay.classList.remove('modal-show');
            setTimeout(() => overlay.remove(), 300);
        }
    });
}