// Espera o DOM carregar para rodar os scripts
document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    // Precisamos do elemento .crt para mudar o fundo
    const crt = document.querySelector('.crt');

    // ============================================
    // TRANSIÇÃO FLUIDA DE PÁGINA
    // ============================================
    const pageTransitionLinks = document.querySelectorAll('.nav-link:not([target="_blank"])');
    
    pageTransitionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); 
            const destination = this.href;
            body.classList.add('fade-out'); 
            
            setTimeout(() => {
                window.location.href = destination;
            }, 500);
        });
    });

    // ============================================
    // VHS Timestamp
    // ============================================
    function updateTimestamp() {
        const timestampEl = document.querySelector('.vhs-timestamp');
        if (!timestampEl) return; 

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        
        timestampEl.textContent = 
            `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateTimestamp, 1000);
    updateTimestamp(); // Roda uma vez imediatamente

    // ============================================
    // NOVO: LÓGICA DE HOVER PARA MUDAR O FUNDO
    // ============================================
    const creditCards = document.querySelectorAll('.credit-card');

    if (crt && creditCards.length > 0) {
        
        creditCards.forEach(card => {
            // Evento para QUANDO O MOUSE ENTRA no card
            card.addEventListener('mouseenter', () => {
                const themeName = card.dataset.pokemon; // "oshawott", "greninja", etc.
                if (themeName) {
                    crt.classList.add(themeName + '-theme');
                }
            });

            // Evento para QUANDO O MOUSE SAI do card
            card.addEventListener('mouseleave', () => {
                const themeName = card.dataset.pokemon;
                if (themeName) {
                    crt.classList.remove(themeName + '-theme');
                }
            });
        });

        console.log("✓ Sistema de temas de fundo (Pokémon) ativado.");
    }

    // ============================================
    // Theme Toggle (Lógica antiga, mantida)
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('alt-theme');
        });
    }

    console.log("✓ Scripts da página de créditos carregados. Efeito CRT/VHS ativado via CSS.");
});