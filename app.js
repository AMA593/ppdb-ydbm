/*
 * PPDB Darussalam Bermi Mijen - app.js
 * Versi: 1.0
 * Deskripsi: Interaksi, Animasi, Validasi Form Multi-Step, dan LocalStorage.
 * Menggunakan Vanilla JS (ES6 Modules).
 */

document.addEventListener('DOMContentLoaded', () => {
    // =====================================
    // 1. HEADER & NAVIGATION
    // =====================================
    const header = document.getElementById('main-header');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav.querySelectorAll('main nav a');

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // =====================================
    // 2. SCROLL REVEAL ANIMATION (Intersection Observer)
    // =====================================
    const revealElements = document.querySelectorAll('.reveal-item');
    
    // Periksa reduced-motion
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Mulai tampil saat 10% elemen terlihat
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Hanya tampil sekali
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Jika reduced motion aktif, pastikan semua elemen terlihat
        revealElements.forEach(el => el.classList.add('visible'));
    }


    // =====================================
    // 3. HERO CARD PARALLAX (Parallax Ringan)
    // =====================================
    const heroSection = document.getElementById('hero');
    const heroCard = document.getElementById('hero-card-parallax');

    if (heroSection && heroCard && !reducedMotion) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width; // 0 to 1
            const y = (e.clientY - rect.top) / rect.height; // 0 to 1

            // Map (0 to 1) to (-15 to 15) for rotation and (-5 to 5) for translation
            const xRot = (y - 0.5) * 30; // Tilt based on Y mouse pos
            const yRot = (x - 0.5) * -30; // Tilt based on X mouse pos
            const xTrans = (x - 0.5) * 10;
            const yTrans = (y - 0.5) * 10;

            // Gunakan transform: translate3d untuk memanfaatkan hardware acceleration
            heroCard.style.transform = `
                perspective(1000px)
                rotateX(${xRot}deg)
                rotateY(${yRot}deg)
                translate3d(${xTrans}px, ${yTrans}px, 0)
            `;
        });

        // Reset transformasi saat mouse keluar
        heroSection.addEventListener('mouseleave', () => {
            heroCard.style.transform = `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                translate3d(0, 0, 0)
            `;
        });
    }

    // =====================================
    // 4. PROGRAM TABS
    // =====================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Hapus 'active' dari semua tombol dan konten
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Tambahkan 'active' ke tombol yang diklik
            button.classList.add('active');

            // Tampilkan konten yang sesuai
            const activeContent = document.querySelector(`.tab-content[data-tab-content="${targetTab}"]`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // =====================================
    // 5. FORM MULTI-STEP & LOCAL STORAGE
    // =====================================
   const form = document.getElementById("pendaftaranForm");
const statusText = document.getElementById("status");


// GANTI URL DI BAWAH DENGAN URL DEPLOY GOOGLE APPS SCRIPT
const scriptURL = "https://script.google.com/macros/s/AKfycbwvvbfP69ui5bFJLXC5yeI-DuoVCyh1WnQxxZCBdCKFGru6TWG5Cz2UCS0WqryPAYHl/exec";


form.addEventListener("submit", e => {
e.preventDefault();


const formData = new FormData(form);


fetch(scriptURL, {
method: "POST",
body: formData
})
.then(response => {
statusText.textContent = "Pendaftaran berhasil dikirim!";
statusText.style.color = "green";
form.reset();

const modal = document.getElementById('submit-modal');
                modal.style.display = 'block';

})
.catch(error => {
                console.error('Simulasi Gagal Kirim:', error);
                alert('Pendaftaran Gagal. Silakan coba lagi.');
            });
});

    // =====================================
    // 6. MODAL & ACCORDION
    // =====================================
    const modal = document.getElementById('submit-modal');
    const closeButtons = modal.querySelectorAll('.close-btn, .close-modal-btn');

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    // Tutup modal jika klik di luar
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const body = document.getElementById(header.getAttribute('aria-controls'));

            // Tutup semua accordion body
            document.querySelectorAll('.accordion-body').forEach(b => {
                if (b !== body) {
                    b.style.maxHeight = 0;
                    b.previousElementSibling.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle accordion yang diklik
            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
                body.style.maxHeight = body.scrollHeight + "px";
            } else {
                header.setAttribute('aria-expanded', 'false');
                body.style.maxHeight = 0;
            }
        });
    });

    // =====================================
    // 7. CAROUSEL (TESTIMONI)
    // =====================================
    const carousel = document.getElementById('testimoni-carousel');
    const nextBtn = document.querySelector('.carousel-nav .next');
    const prevBtn = document.querySelector('.carousel-nav .prev');

    if (carousel) {
        let currentSlide = 0;
        const totalSlides = carousel.children.length;
        // Tentukan jumlah item yang terlihat (3 untuk desktop, 1 untuk mobile)
        const getVisibleItems = () => window.innerWidth <= 768 ? 1 : (window.innerWidth <= 992 ? 2 : 3);
        
        const updateCarousel = () => {
            const visibleItems = getVisibleItems();
            const slideWidth = carousel.children[0].offsetWidth; // Dapatkan lebar satu slide/card
            
            // Batasi currentSlide agar tidak melebihi batas
            if (currentSlide > totalSlides - visibleItems) {
                currentSlide = totalSlides - visibleItems;
            }
            if (currentSlide < 0) {
                currentSlide = 0;
            }
            
            
            // Hitung nilai transform X
            const transformValue = -currentSlide * slideWidth;
            carousel.style.transform = `translateX(${transformValue}px)`;

            // Sembunyikan/Tampilkan tombol navigasi
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide >= totalSlides - visibleItems;
        };

        nextBtn.addEventListener('click', () => {
            const visibleItems = getVisibleItems();
            if (currentSlide < totalSlides - visibleItems) {
                currentSlide++;
                updateCarousel();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        });

        // Update saat window di-resize
        window.addEventListener('resize', () => {
            // Reset ke slide 0 saat resize untuk menghindari masalah lebar transform
            currentSlide = 0;
            updateCarousel(); 
        });

        // Inisialisasi awal
        updateCarousel();
    }
});