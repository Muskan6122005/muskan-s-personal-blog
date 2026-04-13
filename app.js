document.addEventListener("DOMContentLoaded", () => {
    // 1. Custom Cursor
    const cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    document.body.appendChild(cursor);

    const cursorFollower = document.createElement("div");
    cursorFollower.classList.add("custom-cursor-follower");
    document.body.appendChild(cursorFollower);

    document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
        
        // Add a slight delay for the follower
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + "px";
            cursorFollower.style.top = e.clientY + "px";
        }, 80);
    });

    // Expand cursor on hover
    const hoverElements = document.querySelectorAll('a, button, .crazy-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.classList.add('cursor-hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursorFollower.classList.remove('cursor-hovering');
        });
    });

    // 2. Scroll Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // 3. Card Glow Effect tracking mouse
    document.querySelectorAll('.crazy-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
