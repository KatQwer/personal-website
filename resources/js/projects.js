// Tech icon mapping for SVG files
const techIconMap = {
    'Alpine.js': 'alpinedotjs',
    'Bootstrap': 'bootstrap',
    'C++': 'cplusplus',
    'C#': 'csharp',
    'CSS': 'css',
    'Docker': 'docker',
    'Figma': 'figma',
    'Git': 'git',
    'HTML': 'html5',
    'Java': 'java',
    'JavaScript': 'javascript',
    'Jupyter': 'jupyter',
    'Laravel': 'laravel',
    'Linux': 'linux',
    'Livewire': 'livewire',
    'Markdown': 'markdown',
    'MongoDB': 'mongodb',
    'Packet Tracer': 'packettracer',
    'PHP': 'php',
    'Qlik Sense': 'qlik',
    'React': 'react',
    'Security': 'security',
    'SQL': 'sql',
    'StarUML': 'staruml',
    'Tailwind CSS': 'tailwindcss',
    'TypeScript': 'typescript',
    'Windows': 'windows'
};

// Projects data - will be loaded from JSON
let projectsData = {};

// Load projects data from JSON file
async function loadProjectsData() {
    try {
        const response = await fetch('./resources/json/projects.json');
        projectsData = await response.json();
    } catch (error) {
        console.error('Error loading projects data:', error);
    }
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', function() {
            menu.classList.toggle('hidden');
        });
    }
}

// Filter Functionality
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-mainpink-500', 'text-white');
                b.classList.add('bg-mainblack-100', 'text-mainblack-600');
            });

            btn.classList.remove('bg-mainblack-100', 'text-mainblack-600');
            btn.classList.add('bg-mainpink-500', 'text-white');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Modal Functionality
function initModal() {
    const modal = document.getElementById('project-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalClose = document.getElementById('modal-close');

    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalFeatures = document.getElementById('modal-features');
    const modalTech = document.getElementById('modal-tech');
    const modalDate = document.getElementById('modal-date');
    const modalLinks = document.getElementById('modal-links');

    // 🔥 NEW (image containers)
    const modalMainImage = document.getElementById('modal-main-image');
    const modalThumbnails = document.getElementById('modal-thumbnails');

    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.project;
            const project = projectsData[projectId];

            if (!project) return;

            // Basic info
            modalTitle.textContent = project.title;
            modalDescription.textContent = project.description;
            modalDate.textContent = project.date;

            // Features
            modalFeatures.innerHTML = project.features.map(feature => `
                <li class="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-mainpink-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    ${feature}
                </li>
            `).join('');

            // Tech
            modalTech.innerHTML = project.tech.map(tech => {
                const iconName = techIconMap[tech] || tech.toLowerCase().replace(/\s+/g, '');
                return `
                    <span class="flex items-center gap-2 px-3 py-1.5 bg-white text-mainblack-600 rounded-full text-sm font-medium">
                        <img src="./resources/svg/${iconName}.svg" alt="${tech}" class="w-4 h-4" onerror="this.style.display='none'">
                        ${tech}
                    </span>
                `;
            }).join('');

            // Links
            modalLinks.innerHTML = `
                <a href="${project.liveUrl}" class="flex items-center gap-2 text-mainblack-600 hover:text-mainpink-500 transition-colors">
                    Live Demo
                </a>
                <a href="${project.githubUrl}" class="flex items-center gap-2 text-mainblack-600 hover:text-mainpink-500 transition-colors">
                    GitHub Repo
                </a>
            `;

            // Image system
            if (project.images && project.images.length > 0) {
                
                // Main image
                modalMainImage.innerHTML = `
                    <img src="${project.images[0]}" class="w-full h-full object-cover rounded-2xl">
                `;

                // Thumbnails
                modalThumbnails.innerHTML = project.images.map((img, index) => `
                    <img src="${img}" 
                         class="w-24 h-16 object-cover rounded-lg cursor-pointer border ${index === 0 ? 'border-mainpink-500' : 'border-transparent'}"
                         data-index="${index}">
                `).join('');

                // Click thumbnail → change main image
                modalThumbnails.querySelectorAll('img').forEach(thumb => {
                    thumb.addEventListener('click', () => {
                        modalMainImage.innerHTML = `
                            <img src="${thumb.src}" class="w-full h-full object-cover rounded-2xl">
                        `;

                        // Highlight active thumbnail
                        modalThumbnails.querySelectorAll('img').forEach(t => {
                            t.classList.remove('border-mainpink-500');
                            t.classList.add('border-transparent');
                        });

                        thumb.classList.add('border-mainpink-500');
                    });
                });
            } else {
                // fallback if no images
                modalMainImage.innerHTML = `<p class="text-mainblack-400">No images available</p>`;
                modalThumbnails.innerHTML = '';
            }

            // Show modal
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    modalClose?.addEventListener('click', closeModal);
    modalBackdrop?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
    await loadProjectsData();
    initMobileMenu();
    initFilters();
    initModal();
});