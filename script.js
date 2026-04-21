// script.js - Brittany Chiang V1 Flow

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Navbar Hide/Show Logic ---
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    const delta = 5;
    const navbarHeight = navbar.offsetHeight;

    window.addEventListener('scroll', () => {
        let st = window.scrollY;
        
        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - st) <= delta) return;
        
        // If they scrolled down and are past the navbar, hide it
        if (st > lastScrollTop && st > navbarHeight) {
            navbar.classList.remove('nav-scroll-up');
            navbar.classList.add('nav-scroll-down');
        } else {
            // Scroll Up
            if (st + window.innerHeight < document.body.scrollHeight) {
                navbar.classList.remove('nav-scroll-down');
                navbar.classList.add('nav-scroll-up');
                
                if (st < 50) {
                    navbar.style.boxShadow = 'none';
                    navbar.classList.remove('bg-navy/85', 'backdrop-blur-sm');
                    navbar.classList.add('bg-transparent');
                } else {
                    navbar.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.7)';
                    navbar.classList.add('bg-navy/85', 'backdrop-blur-sm');
                    navbar.classList.remove('bg-transparent');
                }
            }
        }
        lastScrollTop = st;
    });

    // --- GSAP ScrollTrigger Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Initial Load Animation (Hero & Nav & Fixed elements)
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Stagger in nav links
    tl.fromTo(".nav-logo", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.2 })
      .fromTo(".nav-links a", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, "-=0.3")
      // Stagger in hero items
      .fromTo(".hero-item", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.15 }, "-=0.2")
      // Fade in fixed social and email lines
      .fromTo(".flex-fixed-social", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, "-=0.4")
      .fromTo(".flex-fixed-email", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, "-=0.8");

    // Standard Reveal Elements (Fade/Slide Up)
    gsap.utils.toArray('.gs-reveal').forEach(function(elem) {
        ScrollTrigger.create({
            trigger: elem,
            start: "top 85%", // Trigger when top of element hits 85% down viewport
            onEnter: function() {
                gsap.fromTo(elem, 
                    { y: 50, autoAlpha: 0 }, 
                    { duration: 0.8, y: 0, autoAlpha: 1, ease: "cubic-bezier(0.645, 0.045, 0.355, 1)", overwrite: "auto" }
                );
            },
            once: true 
        });
    });

    // Mobile Menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            window.scrollTo(0,0);
        });
    }
});
