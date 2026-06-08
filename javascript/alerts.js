/* ==========================================================================
   SAMI ALERTS CENTRALIZADOS (MODULO EXPORTÁVEL)
   ========================================================================== */

export function samiAlert(message) {
    // 1. Cria o elemento dinamicamente
    const toast = document.createElement('div');
    toast.className = 'sami-toast';
    toast.innerText = message;
    
    // 2. Injeta no ecrã
    document.body.appendChild(toast);
    
    // 3. Animação de entrada
    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 50);
    
    // 4. Remove automaticamente após 3.5 segundos
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

/* Adiciona isto no fundo do teu javascript/alerts.js */

export function samiConfirm(message) {
    return new Promise((resolve) => {
        // 1. Cria a estrutura do overlay e da caixa de diálogo
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
        
        // Ativa a animação de entrada
        setTimeout(() => overlay.classList.add('modal-show'), 10);
        
        // 2. Escuta os cliques nos botões customizados
        const okBtn = overlay.querySelector('#sami-modal-ok');
        const cancelBtn = overlay.querySelector('#sami-modal-cancel');
        
        okBtn.addEventListener('click', () => {
            closeModal();
            resolve(true); // Devolve TRUE como o confirm() antigo
        });
        
        cancelBtn.addEventListener('click', () => {
            closeModal();
            resolve(false); // Devolve FALSE como o confirm() antigo
        });
        
        function closeModal() {
            overlay.classList.remove('modal-show');
            setTimeout(() => overlay.remove(), 300);
        }
    });
}