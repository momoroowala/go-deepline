
        // ========== SMOOTH SCROLL ==========
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                var target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // ========== INTERSECTION OBSERVERS ==========
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('section').forEach(function (s) { sectionObserver.observe(s); });

        // Initialize hero as visible immediately
        document.querySelector('.hero').classList.add('visible');

        // Staggered animation for cards
        var staggerObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function () {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.service-card').forEach(function (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            staggerObserver.observe(card);
        });

        // ========== NAV SCROLL ==========
        var navEl = document.querySelector('nav');
        var scrollTicking = false;
        window.addEventListener('scroll', function () {
            if (!scrollTicking) {
                requestAnimationFrame(function () {
                    if (window.scrollY > 20) {
                        navEl.classList.add('scrolled');
                    } else {
                        navEl.classList.remove('scrolled');
                    }
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });

        // ========== MOBILE MENU ==========
        var mobileBtn = document.querySelector('.mobile-menu');
        var navRight = document.querySelector('.nav-right');
        if (mobileBtn && navRight) {
            mobileBtn.addEventListener('click', function () {
                var isVisible = navRight.style.display === 'flex';
                navRight.style.display = isVisible ? 'none' : 'flex';
                navRight.style.flexDirection = 'column';
                navRight.style.position = 'absolute';
                navRight.style.top = '100%';
                navRight.style.left = '0';
                navRight.style.right = '0';
                navRight.style.background = 'var(--deep-purple-navy)';
                navRight.style.padding = '16px 40px';
                navRight.style.borderTop = '1px solid rgba(255,255,255,0.1)';
            });
        }
        // ========== MOCKUP ANIMATIONS ==========
        function countUp(el) {
            var target = parseFloat(el.dataset.count);
            var prefix = el.dataset.prefix || '';
            var suffix = el.dataset.suffix || '';
            var decimals = parseInt(el.dataset.decimal) || 0;
            var duration = 800;
            var start = performance.now();
            function update(now) {
                var progress = Math.min((now - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = eased * target;
                el.textContent = prefix + current.toFixed(decimals) + suffix;
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }

        var mockupObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('mockup-visible');
                    // Trigger count-up on all count-val elements within
                    var countEls = entry.target.querySelectorAll('.count-val');
                    countEls.forEach(function (el, i) {
                        setTimeout(function () { countUp(el); }, 100 + i * 80);
                    });
                    mockupObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        document.querySelectorAll('.service-preview').forEach(function (p) { mockupObserver.observe(p); });

        // ========== LEAD CAPTURE ==========
        function handleLeadCapture(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const firstName = document.getElementById('leadFirst').value.trim();
            const lastName = document.getElementById('leadLast').value.trim();
            const company = document.getElementById('leadCompany').value.trim();
            const email = document.getElementById('leadEmail').value.trim();

            if (!firstName || !lastName || !company || !email) return;

            fetch('https://script.google.com/macros/s/AKfycbxH-0F_yuJve8Bvzf1WWqYc5Z0ptXRRktVCmLEEa-7Dbs3ear7cNESr6-Bmm8mQIJaZ/exec', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    name: firstName + ' ' + lastName,
                    email: email,
                    tool: 'Free Customer Audit Form',
                    company: company,
                    _subject: 'New Lead: ' + firstName + ' ' + lastName + ' - Free Customer Audit Form',
                    message: firstName + ' ' + lastName + ' (' + email + ') from ' + company + ' requested the Free Customer Audit Form.'
                })
            }).catch(function () { });

            if (btn) {
                btn.textContent = 'Submitted';
                btn.style.backgroundColor = 'var(--signal-green)';
                btn.style.color = '#fff';
            }

            var formSuccess = document.getElementById('formSuccess');
            if (formSuccess) formSuccess.style.display = 'block';

            var formNote = document.getElementById('formNote');
            if (formNote) formNote.style.display = 'none';
        }
    