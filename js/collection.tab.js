let currentFilter = 'all';


const ctaData = {
    "t100": { text: "Go To T100 Bifolds Page", url: "t100-bifolds.html" },
    "t350": { text: "Go To T350 Sliders Page", url: "t350-sliders.html" },
    "a100": { text: "Go To A100 BifoldsPage", url: "a100-bifolds.html" }
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

function handleImageError(img) {
    img.onerror = null;
    img.src = 'images/placeholder.png';
}

function renderCards(filter) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = ''; 

    allProducts.forEach(product => {
        if (filter === 'all' || product.categories.includes(filter)) {
            const card = document.createElement('div');
            card.className = 'product-card';

            console.log("Rendering image for:", product.id, product.image);
            
            card.innerHTML = `
                <h3>${product.title}</h3>
                <div class="small-text">${product.id}</div>
                <div class="square">
                    <img loading="lazy" 
                        src="${product.image}" 
                        onerror="handleImageError(this)" 
                        alt="${product.title}" 
                        class="product-img">
                </div>
                <p class="dark-text">${product.description}</p>
                <div class="flex-row gap-small">
                    ${product.tags.map(tag => `<span class="tag label">${tag}</span>`).join('')}
                </div>
            `;

            card.addEventListener('click', () => {
                showProductDetails(product);
            });

            grid.appendChild(card);
        }
    });
}

function showProductDetails(product) {

    const grid = document.getElementById('productGrid');
    const infoSection = document.getElementById('productInfo');

    const tableRows = [
        {label: "Part Code", value: product.id},
        {label: "Finish", value: product.finish},
        {label: "Load Rating", value: product.loadRating},
        {label: "Extrusion Length", value: product.extrusionLength},
        {label: "Weight", value: product.weight},
        {label: "Length", value: product.lengthValue},
        {label: "Material", value: product.material},
        {label: "Used With", value: product.usedWith},
        {label: "Guide Pitch (mm)", value: product.guidePitch},
        {label: "Wheel", value: product.wheel},
        {label: "Wheel Depth (C)", value: product.c},
        {label: "Bearing", value: product.bearing}
    ];

    const tableHTML = tableRows.filter(row => row.value && row.value !== "NULL" && row.value !== "").map(row => `<tr><th>${row.label}</th><td>${row.value}</td></tr>`).join('');

    infoSection.innerHTML = `
        <button class="back-button" id="backBtn">Go Back</button>
        <div class="dual-grid margin-top-2 gap-4">
            <div class="column gap-small">
                <h1 class="dark-text">${product.title}</h1>
                <p class="dark-text">${product.longDescription}</p>
                <ul class="product-info-features">
                    ${product.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <table class="product-info-table margin-vert-small">
                    ${tableHTML}
                </table>
                <div class="column">
                    <h3 class="dark-text">Drawings</h3>
                    <div class="row gap-small">
                        ${(product.drawings || []).map(img => `
                            <div class="image square small" onclick="openLightbox('${img}')" style="cursor: zoom-in;">
                                <img src="${img}" onerror="handleImageError(this)"/>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="square light-grey-bg align-self-start">
                <img src="${product.image}"/>
            </div>
        </div>
    `;

    grid.style.display = 'none';
    infoSection.style.display = 'block';

    document.getElementById('backBtn').addEventListener('click', goBackToGrid);
}

function goBackToGrid() {
    const grid =  document.getElementById('productGrid');
    const infoSection = document.getElementById('productInfo');

    infoSection.style.display = 'none';
    grid.style.display = 'grid';

    renderCards(currentFilter);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === currentFilter);
    });

    //scroll back to top
    const scrollTarget = document.getElementById('collection');
    window.scrollTo({
        top: scrollTarget.offsetTop,
        behavior: 'smooth'
    });
}

function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');

    lightbox.addEventListener('click', (e) => {
        if (e.target.id === 'lightbox' || e.target.classList.contains('close-lightbox')) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const ctaButton = document.getElementById('categoryCTA'); 
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.getAttribute('data-filter');
            currentFilter = category;

            document.getElementById('productInfo').style.display = 'none';
            document.getElementById('productGrid').style.display = 'grid';
            
            renderCards(category);
            
            if (category === 'all') {
                ctaButton.style.display = 'none'; 
            } else if (ctaData[category]) {
                ctaButton.style.display = 'inline-flex'; 
                ctaButton.href = ctaData[category].url;
                ctaButton.innerText = ctaData[category].text;
            }
        });
    });

    const currentActive = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    if (currentActive === 'all') ctaButton.style.display = 'none';
}

loadProducts();