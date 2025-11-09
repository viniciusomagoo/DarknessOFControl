// Espera o DOM carregar para rodar os scripts
document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const crt = document.querySelector('.crt'); // Elemento para mudar o fundo

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
    // Theme Toggle (Troca entre temas)
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('alt-theme');
        });
    }

    // ============================================
    // LÓGICA DE HOVER PARA MUDAR O FUNDO (DESCRIÇÃO)
    // ============================================
    const descriptionCards = document.querySelectorAll('.description-card');

    if (crt && descriptionCards.length > 0) {
        
        descriptionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const themeName = card.dataset.theme;
                if (themeName) {
                    crt.classList.add(themeName);
                }
            });

            card.addEventListener('mouseleave', () => {
                const themeName = card.dataset.theme;
                if (themeName) {
                    crt.classList.remove(themeName);
                }
            });
        });

        console.log("✓ Sistema de temas de fundo (Descrição) ativado.");
    }

    // ============================================
    // NOVO: Geração de Shooting Stars Dinâmicas (CORRIGIDO)
    // ============================================
    const starfield = document.querySelector('.starfield');
    
    // CORREÇÃO: Cria nossa própria tag <style> para injetar as regras.
    // Isso evita o SecurityError com o Google Fonts.
    let styleSheet = null;
    try {
        const styleEl = document.createElement('style');
        styleEl.id = 'dynamic-shooting-star-keyframes';
        document.head.appendChild(styleEl);
        styleSheet = styleEl.sheet; // Pega a folha de estilo que acabamos de criar

        const shootingStarKeyframes = `
            @keyframes shoot {
                0% { 
                    transform: translate(var(--startX), var(--startY)) rotate(-45deg);
                    opacity: 0;
                    width: 2px;
                    height: 2px;
                    filter: blur(0);
                }
                10% { opacity: 1; }
                50% { 
                    opacity: 1;
                    width: 30px; /* Cauda mais longa */
                    height: 3px;
                    filter: blur(1px);
                }
                90% { opacity: 0.8; }
                100% { 
                    transform: translate(var(--endX), var(--endY)) rotate(-45deg);
                    opacity: 0;
                    width: 2px;
                    height: 2px;
                    filter: blur(0);
                }
            }
        `;
        // Adiciona a regra à nossa própria folha de estilo
        if(styleSheet) {
            styleSheet.insertRule(shootingStarKeyframes, styleSheet.cssRules.length);
        }
    } catch (e) {
        console.error("Falha ao criar keyframes dinâmicos:", e);
    }


    function createShootingStar() {
        if (!starfield) return;

        const star = document.createElement('div');
        star.classList.add('shooting-star');
        starfield.appendChild(star);

        const startX = Math.random() * window.innerWidth * 1.5 - window.innerWidth * 0.5;
        const startY = Math.random() * window.innerHeight * 0.5 - window.innerHeight * 0.2;
        const endX = startX - Math.random() * window.innerWidth * 0.8 - 200;
        const endY = startY + Math.random() * window.innerHeight * 0.8 + 200;
        const duration = Math.random() * 3 + 1;
        const delay = Math.random() * 5;

        star.style.setProperty('--startX', `${startX}px`);
        star.style.setProperty('--startY', `${startY}px`);
        star.style.setProperty('--endX', `${endX}px`);
        star.style.setProperty('--endY', `${endY}px`);

        star.style.animation = `shoot ${duration}s linear ${delay}s forwards`;

        star.addEventListener('animationend', () => {
            star.remove();
            createShootingStar(); 
        });
    }
    
    // Cria as estrelas cadentes iniciais
    const numShootingStars = 5;
    for (let i = 0; i < numShootingStars; i++) {
        createShootingStar();
    }
    console.log("✓ Estrelas cadentes dinâmicas ativadas.");


    // ============================================
    // CORREÇÃO DE LAG (Glitch Interativo)
    // ============================================
    const interactiveElements = document.querySelectorAll(
        '.description-card, .external-link, .credits-button, .theme-toggle, .about-section'
    );

    if (crt) {
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                crt.classList.add('is-glitching');
            });
            el.addEventListener('mouseleave', () => {
                crt.classList.remove('is-glitching');
            });
        });
        console.log("✓ Sistema de glitch interativo ativado.");
    }

    console.log("✓ Scripts da página principal carregados. Efeito CRT/VHS ativado via CSS.");
});