document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       1. EFECTO DE INCLINACIÓN 3D (3D Tilt)
       ========================================== */
    const tiltElements = document.querySelectorAll('.servicio-card, .portafolio-item');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // Calcula la posición del cursor respecto al centro de la tarjeta
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Intensidad de la inclinación (10 grados máximo)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            el.style.transition = 'none'; // Quita la transición durante el movimiento
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            // Devuelve la tarjeta a su posición original suavemente
            el.style.transition = 'transform 0.5s ease';
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    /* ==========================================
       2. SCROLL REVEAL (Aparición progresiva)
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Deja de observar una vez que aparece
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Se activa cuando el 15% del elemento es visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================
       3. PARTÍCULAS NEÓN FLOTANTES (Canvas)
       ========================================== */
    const canvas = document.getElementById('neonCanvas');
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const particlesArray = [];
    const numberOfParticles = 40; // Cantidad de destellos de luz

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5; // Tamaño del destello
            this.speedY = Math.random() * -0.5 - 0.2; // Velocidad de subida
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            this.y += this.speedY;
            // Si la partícula sube más allá de la pantalla, reaparece abajo
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Color verde neón basado en tu variable --accent-color (#10B981)
            ctx.fillStyle = `rgba(16, 185, 129, ${this.opacity})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#10B981';
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
});