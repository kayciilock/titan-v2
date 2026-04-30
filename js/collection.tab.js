
const ctaData = {
    "t100": { text: "Go To T100 Bifolds Page", url: "t100-bifolds.html" },
    "t350": { text: "Go To T350 Sliders Page", url: "t350-sliders.html" },
    "a100": { text: "Go To A100 BifoldsPage", url: "a100-bifolds.html" },
    "platform-integrated": { text: "Go To Platform Integrated Bifolds Page", url: "platform-integrated-bifolds.html" }
};

let allProducts = [];

async function loadProducts() {
    try {
        const response = await fetch('json/titan.collection.json');
        if (!response.ok) throw new Error("Failed to load JSON");
        
        allProducts = await response.json();
        renderCards('all');
        setupFilters();
        
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('productGrid').innerHTML = "<p>Error loading products.</p>";
    }
}

function renderCards(filter) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = ''; 

    allProducts.forEach(product => {
        if (filter === 'all' || product.categories.includes(filter)) {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            card.innerHTML = `
                <h3>${product.title}</h3>
                <div class="small-text">${product.id}</div>
                <div class="square">
                    <img loading="lazy" src="${product.image}" alt="${product.title}" class="product-img">
                </div>
                <p class="dark-text">${product.description}</p>
                <div class="flex-row gap-small">
                    ${product.tags.map(tag => `<span class="tag label">${tag}</span>`).join('')}
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const ctaButton = document.getElementById('categoryCTA'); 
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. UI Toggle (Tabs)
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 2. Filter & Render Cards
            const category = button.getAttribute('data-filter');
            renderCards(category);

            // 3. CTA Visibility Logic
            if (category === 'all') {
                ctaButton.style.display = 'none'; // Hide for "All"
            } else if (ctaData[category]) {
                ctaButton.style.display = 'inline-flex'; // Show for specific categories
                ctaButton.href = ctaData[category].url;
                ctaButton.innerText = ctaData[category].text;
            }
        });
    });

    // Run once on load to ensure button is hidden if "All" is default
    const currentActive = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    if (currentActive === 'all') ctaButton.style.display = 'none';
}


loadProducts();