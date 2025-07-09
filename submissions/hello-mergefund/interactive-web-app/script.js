/**
 * Interactive Hello MergeFund - JavaScript Controller
 * Handles animations, particle system, user interactions, and effects
 */

class MergeFundApp {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationModes = ['default', 'rainbow', 'shake', 'zoom', 'typewriter'];
        this.currentMode = 0;
        this.animationSpeed = 1;
        this.isLoaded = false;
        
        // Initialize the application
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup all components of the application
     */
    setup() {
        this.setupCanvas();
        this.setupParticles();
        this.setupEventListeners();
        this.setupLoadingScreen();
        this.startAnimationLoop();
        
        console.log('🚀 Hello MergeFund Interactive App Initialized!');
    }

    /**
     * Setup the canvas for particle effects
     */
    setupCanvas() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Setup resize handler
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Resize canvas to match window size
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * Initialize particle system
     */
    setupParticles() {
        const particleCount = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 10000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomColor(),
                life: Math.random() * 100
            });
        }
    }

    /**
     * Get a random color for particles
     */
    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Control buttons
        document.getElementById('animation-mode').addEventListener('click', () => this.changeAnimationMode());
        document.getElementById('speed-control').addEventListener('click', () => this.changeSpeed());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetAnimations());
        document.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Mouse interactions
        document.addEventListener('click', (e) => this.handleClick(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        // Touch interactions for mobile
        document.addEventListener('touchstart', (e) => this.handleTouch(e));
    }

    /**
     * Setup loading screen with animation
     */
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        
        // Simulate loading time
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            this.isLoaded = true;
            this.showWelcomeAnimation();
        }, 3000);
    }

    /**
     * Show welcome animation after loading
     */
    showWelcomeAnimation() {
        const textContainer = document.getElementById('text-container');
        textContainer.style.opacity = '0';
        textContainer.style.transform = 'scale(0.5)';
        
        setTimeout(() => {
            textContainer.style.transition = 'all 1s ease-out';
            textContainer.style.opacity = '1';
            textContainer.style.transform = 'scale(1)';
        }, 500);
    }

    /**
     * Change animation mode
     */
    changeAnimationMode() {
        if (!this.isLoaded) return;
        
        this.currentMode = (this.currentMode + 1) % this.animationModes.length;
        const mode = this.animationModes[this.currentMode];
        const textContainer = document.getElementById('text-container');
        
        // Remove all mode classes
        textContainer.className = textContainer.className.replace(/mode-\w+/g, '');
        
        // Add new mode class
        if (mode !== 'default') {
            textContainer.classList.add(`mode-${mode}`);
        }
        
        // Special handling for typewriter mode
        if (mode === 'typewriter') {
            this.triggerTypewriterEffect();
        }
        
        this.showNotification(`Animation: ${mode}`);
        this.createClickEffect(event);
    }

    /**
     * Trigger typewriter effect
     */
    triggerTypewriterEffect() {
        const textContainer = document.getElementById('text-container');
        textContainer.classList.add('typewriter');
        
        setTimeout(() => {
            textContainer.classList.remove('typewriter');
        }, 6000);
    }

    /**
     * Change animation speed
     */
    changeSpeed() {
        if (!this.isLoaded) return;
        
        const speeds = [0.5, 1, 1.5, 2];
        const speedIndex = speeds.indexOf(this.animationSpeed);
        this.animationSpeed = speeds[(speedIndex + 1) % speeds.length];
        
        document.documentElement.style.setProperty('--animation-speed', `${1/this.animationSpeed}s`);
        this.showNotification(`Speed: ${this.animationSpeed}x`);
        this.createClickEffect(event);
    }

    /**
     * Reset all animations
     */
    resetAnimations() {
        if (!this.isLoaded) return;
        
        this.currentMode = 0;
        this.animationSpeed = 1;
        
        const textContainer = document.getElementById('text-container');
        textContainer.className = 'text-container';
        
        document.documentElement.style.setProperty('--animation-speed', '1s');
        
        // Reset particles
        this.particles = [];
        this.setupParticles();
        
        this.showNotification('Reset Complete');
        this.createClickEffect(event);
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!this.isLoaded) return;
        
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported');
            });
        } else {
            document.exitFullscreen();
        }
        this.createClickEffect(event);
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyPress(e) {
        if (!this.isLoaded) return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.changeAnimationMode();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.changeSpeed();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.changeSpeed();
                break;
            case 'KeyR':
                e.preventDefault();
                this.resetAnimations();
                break;
            case 'KeyF':
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }

    /**
     * Handle click interactions
     */
    handleClick(e) {
        if (!this.isLoaded) return;
        
        this.createClickEffect(e);
        this.addParticlesAtPosition(e.clientX, e.clientY);
    }

    /**
     * Handle mouse movement for particle interaction
     */
    handleMouseMove(e) {
        if (!this.isLoaded) return;
        
        // Make particles follow mouse subtly
        this.particles.forEach(particle => {
            const dx = e.clientX - particle.x;
            const dy = e.clientY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.vx += dx * 0.00005;
                particle.vy += dy * 0.00005;
            }
        });
    }

    /**
     * Handle touch interactions for mobile
     */
    handleTouch(e) {
        if (!this.isLoaded) return;
        
        const touch = e.touches[0];
        this.createClickEffect(touch);
        this.addParticlesAtPosition(touch.clientX, touch.clientY);
    }

    /**
     * Create visual effect at click/touch position
     */
    createClickEffect(e) {
        if (!e || !e.clientX) return;
        
        const effect = document.createElement('div');
        effect.style.position = 'fixed';
        effect.style.left = e.clientX + 'px';
        effect.style.top = e.clientY + 'px';
        effect.style.width = '20px';
        effect.style.height = '20px';
        effect.style.background = 'radial-gradient(circle, #fff, transparent)';
        effect.style.borderRadius = '50%';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '1000';
        effect.style.animation = 'clickRipple 0.6s ease-out forwards';
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 600);
    }

    /**
     * Add particles at specific position
     */
    addParticlesAtPosition(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                size: Math.random() * 4 + 2,
                opacity: 1,
                color: this.getRandomColor(),
                life: 60
            });
        }
    }

    /**
     * Show notification message
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '80px';
        notification.style.right = '20px';
        notification.style.background = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = 'white';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.style.animation = 'fadeInOut 2s ease-in-out forwards';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 2000);
    }

    /**
     * Update particles animation
     */
    updateParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx * this.animationSpeed;
            particle.y += particle.vy * this.animationSpeed;
            
            // Update life
            particle.life -= 1;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -0.8;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -0.8;
            
            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity * (particle.life / 100);
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        
        // Maintain minimum particle count
        if (this.particles.length < 50) {
            this.setupParticles();
        }
    }

    /**
     * Main animation loop
     */
    startAnimationLoop() {
        const animate = () => {
            if (this.isLoaded) {
                this.updateParticles();
            }
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// Additional CSS animations for effects
const additionalStyles = `
@keyframes clickRipple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(5);
        opacity: 0;
    }
}

@keyframes fadeInOut {
    0%, 100% { opacity: 0; transform: translateY(-10px); }
    10%, 90% { opacity: 1; transform: translateY(0); }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application
const mergeFundApp = new MergeFundApp();