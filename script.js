/**
 * SCRIPT.JS
 * Lógica interactiva para la Landing Page Premium
 * Incluye animación 3D de partículas Three.js en el Hero
 */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // 1. MENÚ MÓVIL
    // =====================================================
    const menuBtn    = document.getElementById("menu-btn");
    const closeBtn   = document.getElementById("close-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    const toggleMobileMenu = () => {
        const isHidden = mobileMenu.classList.contains("hidden");
        if (isHidden) {
            mobileMenu.classList.remove("hidden");
            setTimeout(() => {
                mobileMenu.classList.remove("opacity-0");
                mobileMenu.classList.add("opacity-100", "flex");
                mobileMenu.classList.remove("z-[-10]");
                mobileMenu.classList.add("z-[100]");
                document.body.style.overflow = "hidden";
            }, 10);
        } else {
            mobileMenu.classList.remove("opacity-100");
            mobileMenu.classList.add("opacity-0");
            setTimeout(() => {
                mobileMenu.classList.add("hidden");
                mobileMenu.classList.remove("flex", "z-[100]");
                mobileMenu.classList.add("z-[-10]");
                document.body.style.overflow = "auto";
            }, 300);
        }
    };

    if (menuBtn && closeBtn) {
        menuBtn.addEventListener("click", toggleMobileMenu);
        closeBtn.addEventListener("click", toggleMobileMenu);
    }
    mobileLinks.forEach(link => link.addEventListener("click", toggleMobileMenu));

    // =====================================================
    // 2. NAVBAR GLASSMORPHISM AL SCROLL
    // =====================================================
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("bg-dark/80", "backdrop-blur-md", "border-white/10", "py-3");
            navbar.classList.remove("backdrop-blur-none", "border-white/0", "py-4");
        } else {
            navbar.classList.remove("bg-dark/80", "backdrop-blur-md", "border-white/10", "py-3");
            navbar.classList.add("backdrop-blur-none", "border-white/0", "py-4");
        }
    });

    // =====================================================
    // 3. REVEAL SCROLL ANIMATIONS
    // =====================================================
    const reveals = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    reveals.forEach(el => revealObserver.observe(el));

    // =====================================================
    // 4. FORMULARIO DE CONTACTO
    // =====================================================
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...`;
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = `<i class="fa-solid fa-check"></i> ¡Solicitud Enviada!`;
                btn.classList.add("bg-green-500", "from-green-500", "to-green-400");
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                    btn.classList.remove("bg-green-500", "from-green-500", "to-green-400");
                }, 3000);
            }, 1500);
        });
    }

    // =====================================================
    // 5. THREE.JS — HERO PARTICLE NETWORK (3D)
    // =====================================================
    function initHeroParticles() {
        const canvas = document.getElementById("hero-canvas");
        if (!canvas || typeof THREE === "undefined") return;

        const isMobile      = window.innerWidth < 768;
        const COUNT         = isMobile ? 70 : 150;
        const CONNECT_DIST  = isMobile ? 100 : 140;
        const MAX_LINES     = isMobile ? 120 : 380;
        const SPREAD        = { x: 750, y: 520, z: 380 };

        // ── Scene / Camera / Renderer ──────────────────
        const scene    = new THREE.Scene();
        const camera   = new THREE.PerspectiveCamera(
            55,
            window.innerWidth / window.innerHeight,
            1,
            3000
        );
        camera.position.z = 480;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha:     true,
            antialias: !isMobile,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        // ── Palette ────────────────────────────────────
        // purple #6d28d9 · sky #0ea5e9 · amber #f59e0b
        const PALETTE = [
            [0.427, 0.157, 0.851], // purple (weighted ×2)
            [0.427, 0.157, 0.851],
            [0.055, 0.647, 0.914], // sky blue (weighted ×2)
            [0.055, 0.647, 0.914],
            [0.965, 0.620, 0.043], // amber (accent spark)
        ];

        // ── Particle Buffers ───────────────────────────
        const posArr = new Float32Array(COUNT * 3);
        const colArr = new Float32Array(COUNT * 3);
        const posVec = []; // live positions (objects for math)
        const velVec = []; // velocities

        for (let i = 0; i < COUNT; i++) {
            const x = (Math.random() - 0.5) * SPREAD.x;
            const y = (Math.random() - 0.5) * SPREAD.y;
            const z = (Math.random() - 0.5) * SPREAD.z;

            posArr[i * 3]     = x;
            posArr[i * 3 + 1] = y;
            posArr[i * 3 + 2] = z;
            posVec.push({ x, y, z });

            velVec.push({
                x: (Math.random() - 0.5) * 0.28,
                y: (Math.random() - 0.5) * 0.28,
                z: (Math.random() - 0.5) * 0.18,
            });

            const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
            colArr[i * 3]     = c[0];
            colArr[i * 3 + 1] = c[1];
            colArr[i * 3 + 2] = c[2];
        }

        // ── Points Mesh ────────────────────────────────
        const pointsGeo = new THREE.BufferGeometry();
        pointsGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
        pointsGeo.setAttribute("color",    new THREE.BufferAttribute(colArr, 3));

        const pointsMat = new THREE.PointsMaterial({
            size:            4.0,
            vertexColors:    true,
            transparent:     true,
            opacity:         0.92,
            sizeAttenuation: true,
            blending:        THREE.AdditiveBlending,
            depthWrite:      false,
        });

        const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
        scene.add(pointsMesh);

        // ── Line Segments ──────────────────────────────
        const linePos = new Float32Array(MAX_LINES * 6); // 2 verts × 3 coords per line
        const lineCol = new Float32Array(MAX_LINES * 6);

        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
        lineGeo.setAttribute("color",    new THREE.BufferAttribute(lineCol, 3));
        lineGeo.setDrawRange(0, 0);

        const lineMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent:  true,
            opacity:      0.40,
            blending:     THREE.AdditiveBlending,
            depthWrite:   false,
        });

        const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(lineSegments);

        // ── Mouse Parallax ─────────────────────────────
        let targetX = 0, targetY = 0;
        document.addEventListener("mousemove", (e) => {
            targetX = (e.clientX / window.innerWidth  - 0.5);
            targetY = (e.clientY / window.innerHeight - 0.5);
        });

        // ── Resize ─────────────────────────────────────
        window.addEventListener("resize", () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });

        // ── Animate ────────────────────────────────────
        let frame = 0;

        function animate() {
            requestAnimationFrame(animate);
            frame++;

            // Move particles
            for (let i = 0; i < COUNT; i++) {
                const p = posVec[i];
                const v = velVec[i];
                p.x += v.x;
                p.y += v.y;
                p.z += v.z;

                if (Math.abs(p.x) > SPREAD.x / 2) v.x *= -1;
                if (Math.abs(p.y) > SPREAD.y / 2) v.y *= -1;
                if (Math.abs(p.z) > SPREAD.z / 2) v.z *= -1;

                posArr[i * 3]     = p.x;
                posArr[i * 3 + 1] = p.y;
                posArr[i * 3 + 2] = p.z;
            }
            pointsGeo.attributes.position.needsUpdate = true;

            // Build connection lines
            let numLines = 0;
            for (let i = 0; i < COUNT && numLines < MAX_LINES; i++) {
                for (let j = i + 1; j < COUNT && numLines < MAX_LINES; j++) {
                    const dx   = posVec[i].x - posVec[j].x;
                    const dy   = posVec[i].y - posVec[j].y;
                    const dz   = posVec[i].z - posVec[j].z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < CONNECT_DIST) {
                        const alpha = 1 - dist / CONNECT_DIST;
                        const base  = numLines * 6;

                        linePos[base]     = posVec[i].x;
                        linePos[base + 1] = posVec[i].y;
                        linePos[base + 2] = posVec[i].z;
                        linePos[base + 3] = posVec[j].x;
                        linePos[base + 4] = posVec[j].y;
                        linePos[base + 5] = posVec[j].z;

                        lineCol[base]     = colArr[i * 3]     * alpha;
                        lineCol[base + 1] = colArr[i * 3 + 1] * alpha;
                        lineCol[base + 2] = colArr[i * 3 + 2] * alpha;
                        lineCol[base + 3] = colArr[j * 3]     * alpha;
                        lineCol[base + 4] = colArr[j * 3 + 1] * alpha;
                        lineCol[base + 5] = colArr[j * 3 + 2] * alpha;

                        numLines++;
                    }
                }
            }
            lineGeo.attributes.position.needsUpdate = true;
            lineGeo.attributes.color.needsUpdate    = true;
            lineGeo.setDrawRange(0, numLines * 2);

            // Mouse parallax — smooth follow
            camera.position.x += (targetX * 35 - camera.position.x) * 0.04;
            camera.position.y += (-targetY * 25 - camera.position.y) * 0.04;
            camera.lookAt(scene.position);

            // Gentle slow rotation
            pointsMesh.rotation.y  = frame * 0.0008;
            lineSegments.rotation.y = frame * 0.0008;

            // Subtle "breathing" scale pulse
            const pulse = 1 + Math.sin(frame * 0.012) * 0.025;
            pointsMesh.scale.setScalar(pulse);
            lineSegments.scale.setScalar(pulse);

            renderer.render(scene, camera);
        }

        animate();
    }

    // Init — Three.js loads sync before DOMContentLoaded, but guard anyway
    if (typeof THREE !== "undefined") {
        initHeroParticles();
    } else {
        window.addEventListener("load", initHeroParticles);
    }

});