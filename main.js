document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbar = document.querySelector('nav');

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on window resize if screen becomes large
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024) { // 1024px is Tailwind's 'lg' breakpoint
            mobileMenu.classList.add('hidden');
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Typewriter effect
    const textArray = [
        { text: "DEBBINDU BAIRAGI", color: "#34d399" }, // emerald-400 (vibrant green)
        { text: "🌟 Machine Learning Enthusiast | Backend Developer | Data & Web Research Expert 🌟", color: "#22d3ee" }, // cyan-400
        { text: "With a strong foundation in ML and backend development, I combine data management, research, and technical expertise to deliver scalable, data-driven solutions.", color: "#38bdf8" }, // sky-400
        { text: "Core Skills: Python, Django, SQL, Web Scraping, Data Entry, Web Research", color: "#818cf8" }, // indigo-400
        { text: "Key Highlights: Efficient backend design, automated data collection, and data insights for optimized operations.", color: "#f472b6" } // pink-400
      ];      

    let textIndex = 0;
    let charIndex = 0;
    const typingDelay = 50;
    const typewriterElement = document.getElementById('typewriter');

    function typeLine() {
        if (textIndex < textArray.length) {
            const line = textArray[textIndex];
            if (charIndex < line.text.length) {
                if (charIndex === 0) {
                    // Start a new line
                    const newLine = document.createElement('div');
                    newLine.style.color = line.color;
                    newLine.classList.add('typewriter-line');
                    typewriterElement.appendChild(newLine);
                }
                const currentLineElement = typewriterElement.lastChild;
                currentLineElement.textContent += line.text.charAt(charIndex);
                charIndex++;
                setTimeout(typeLine, typingDelay);
            } else {
                charIndex = 0;
                textIndex++;
                setTimeout(typeLine, 500); // Delay before starting next line
            }
        } else {
            // Add padding class when text is complete
            typewriterElement.classList.add('pt-8');
            // Restart the animation after a delay
            setTimeout(() => {
                typewriterElement.innerHTML = '';
                typewriterElement.classList.remove('pt-8');
                textIndex = 0;
                charIndex = 0;
                typeLine();
            }, 3000); // Increased delay to 3 seconds
        }
    }

    // Auto-hide navbar when scrolling to the bottom
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollPosition >= documentHeight - 10) { // Adjusted to account for slight differences
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
    });

    // Updated GitHub repositories fetch with error handling
    const reposContainer = document.getElementById('repos-container');
    const githubUsername = 'debbindubd';

    async function fetchGitHubRepos() {
        try {
            // Add authentication using Personal Access Token
            const headers = {
                'Accept': 'application/vnd.github.v3+json',
                // If you have a GitHub token:
                // 'Authorization': 'token YOUR_GITHUB_TOKEN'
            };

            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`, {
                headers: headers
            });

            if (!response.ok) {
                throw new Error('GitHub API rate limit exceeded or other error');
            }

            const repos = await response.json();
            
            // Clear existing content
            reposContainer.innerHTML = '';

            // Display only public, non-fork repositories
            repos
                .filter(repo => !repo.fork && !repo.private)
                .slice(0, 6) // Show only up to 6 repos
                .forEach(repo => {
                    const repoElement = document.createElement('div');
                    repoElement.classList.add('bg-gray-700/20', 'rounded-lg', 'p-6', 'border', 'border-gray-800', 'hover:border-gray-600', 'transition-colors');
                    
                    const languages = repo.language ? `<span class="text-sm text-purple-300">${repo.language}</span>` : '';
                    
                    repoElement.innerHTML = `
                        <h3 class="text-xl font-semibold mb-2">${repo.name}</h3>
                        <p class="text-purple-400 mb-4">${repo.description || 'No description available'}</p>
                        ${languages}
                        <div class="mt-4">
                            <a href="${repo.html_url}" target="_blank" 
                               class="inline-block text-purple-400 hover:text-white transition-colors">
                               View Repository <i class="fas fa-external-link-alt ml-1"></i>
                            </a>
                        </div>
                    `;
                    reposContainer.appendChild(repoElement);
                });

        } catch (error) {
            console.error('Error fetching repositories:', error);
            reposContainer.innerHTML = `
                <div class="col-span-full text-center text-purple-400">
                    <p>Currently unable to load GitHub repositories.</p>
                    <a href="https://github.com/${githubUsername}" target="_blank" 
                       class="inline-block mt-4 text-white hover:text-purple-400 transition-colors">
                       Visit GitHub Profile <i class="fas fa-external-link-alt ml-1"></i>
                    </a>
                </div>
            `;
        }
    }

    fetchGitHubRepos();

    typeLine();
});