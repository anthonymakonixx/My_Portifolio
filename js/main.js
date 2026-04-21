document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animation Setup
    function reveal() {
        var reveals = document.querySelectorAll('.reveal');
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }
    
    window.addEventListener('scroll', reveal);
    reveal();

    // Navbar hide/show logic on scroll
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            if (lastScrollY < window.scrollY) {
                navbar.classList.add('scroll-down');
                navbar.classList.remove('scroll-up');
            } else {
                navbar.classList.add('scroll-up');
                navbar.classList.remove('scroll-down');
            }
        } else {
            navbar.classList.remove('scroll-up');
            navbar.classList.remove('scroll-down');
        }
        lastScrollY = window.scrollY;
    });

    // Custom Antigravity-Style Particle Engine for Name Text
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        let particles = [];
        
        // Mouse tracking for repulsion effect
        const mouse = { x: -9999, y: -9999, radius: 60 };
        
        const interactor = document.querySelector('.canvas-interactor');
        if (interactor) {
            interactor.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });
            interactor.addEventListener('mouseleave', () => {
                mouse.x = -9999;
                mouse.y = -9999;
            });
        }

        class Particle {
            constructor(x, y) {
                this.x = Math.random() * width; // start random
                this.y = Math.random() * height; // start random
                this.baseX = x;
                this.baseY = y;
                this.density = (Math.random() * 20) + 5;
                this.size = Math.random() * 1.5 + 0.5; // pixel size dots
                this.color = '#ffffff'; // white to match reference text
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
            
            update() {
                // Interactive distance calculating
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                
                let maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;
                
                // If mouse within range, repulse
                if (distance < mouse.radius) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    // Else, gently float back to base X/Y position
                    if (this.x !== this.baseX) {
                        let dxBase = this.x - this.baseX;
                        this.x -= dxBase / 15;
                    }
                    if (this.y !== this.baseY) {
                        let dyBase = this.y - this.baseY;
                        this.y -= dyBase / 15;
                    }
                }
            }
        }
        
        function initParticles() {
            particles = [];
            let offCanvas = document.createElement('canvas');
            let offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
            offCanvas.width = width;
            offCanvas.height = height;
            
            offCtx.fillStyle = 'white';
            offCtx.textBaseline = 'middle';
            offCtx.textAlign = 'center';
            
            // Scalable Font based on window size
            let fontSize = width > 768 ? Math.min(width / 12, 110) : 45; 
            if(width <= 480) fontSize = 35;
            
            // Draw "Hi, I'm" in normal weight - smaller and lighter
            offCtx.font = `300 ${fontSize * 0.45}px Inter, sans-serif`;
            let hiText = "Hi, I'm";
            offCtx.fillText(hiText, width / 2, height / 2 - fontSize * 0.6);
            
            // Draw "ANTHONY" in bold and brighter - larger
            offCtx.font = `700 ${fontSize}px Inter, sans-serif`;
            offCtx.fillText("ANTHONY", width / 2, height / 2 + fontSize * 0.3);
            
            const imageData = offCtx.getImageData(0, 0, width, height);
            const data = imageData.data;
            
            // Read every 4th/5th pixel for particle density depending on screen
            const step = width < 768 ? 3 : 4;
            
            for (let y = 0; y < height; y += step) {
                for (let x = 0; x < width; x += step) {
                    const index = (y * width + x) * 4;
                    // Check alpha to see if pixel exists
                    if (data[index + 3] > 128) {
                        particles.push(new Particle(x, y));
                    }
                }
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].draw();
                particles[i].update();
            }
            requestAnimationFrame(animate);
        }
        
        initParticles();
        animate();
        
        // Handle precise resize adjustments
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
                initParticles();
            }, 200);
        });
    }
});


// Timeline scroll animation
function revealTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const windowHeight = window.innerHeight;
    
    timelineItems.forEach(item => {
        const elementTop = item.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            item.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealTimeline);
revealTimeline(); // Initial check on page load
