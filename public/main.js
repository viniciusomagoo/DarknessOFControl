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
    // NOVO: Geração de Shooting Stars Dinâmicas
    // ============================================
    const starfield = document.querySelector('.starfield');
    const numShootingStars = 5; // Quantidade de estrelas cadentes ativas simultaneamente

    function createShootingStar() {
        if (!starfield) return;

        const star = document.createElement('div');
        star.classList.add('shooting-star');
        starfield.appendChild(star);

        // Posição inicial aleatória (fora da tela)
        const startX = Math.random() * window.innerWidth * 1.5 - window.innerWidth * 0.5; // Mais para fora da tela
        const startY = Math.random() * window.innerHeight * 0.5 - window.innerHeight * 0.2; // Para cima
        
        // Posição final (cruzando a tela)
        const endX = startX - Math.random() * window.innerWidth * 0.8 - 200; // Desce para a esquerda
        const endY = startY + Math.random() * window.innerHeight * 0.8 + 200; // Desce
        
        const duration = Math.random() * 3 + 1; // Duração entre 1s e 4s
        const delay = Math.random() * 5; // Atraso para aparecer

        star.style.setProperty('--startX', `${startX}px`);
        star.style.setProperty('--startY', `${startY}px`);
        star.style.setProperty('--endX', `${endX}px`);
        star.style.setProperty('--endY', `${endY}px`);
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--delay', `${delay}s`);

        // Animação CSS inline para flexibilidade
        star.style.animation = `shoot ${duration}s linear ${delay}s forwards`;

        // Remover a estrela após a animação
        star.addEventListener('animationend', () => {
            star.remove();
            // Recriar para manter o ciclo
            createShootingStar(); 
        });
    }

    // Adiciona o keyframe da animação via JS para usar variáveis CSS
    const styleSheet = document.styleSheets[0];
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
    styleSheet.insertRule(shootingStarKeyframes, styleSheet.cssRules.length);


    // Cria as estrelas cadentes iniciais
    for (let i = 0; i < numShootingStars; i++) {
        createShootingStar();
    }
    console.log("✓ Estrelas cadentes dinâmicas ativadas.");

    console.log("✓ Scripts da página principal carregados. Efeito CRT/VHS ativado via CSS.");
});