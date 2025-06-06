document.addEventListener('DOMContentLoaded', function() {
    // Verifica se estamos na página de criação ou galeria
    if (document.getElementById('cardForm')) {
        setupFormPage();
    } else if (document.getElementById('cardsGallery')) {
        setupGalleryPage();
    }
});

function setupFormPage() {
    const form = document.getElementById('cardForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const robotName = document.getElementById('robotName').value;
        const robotCode = document.getElementById('robotCode').value;
        const imageFile = document.getElementById('cardImage').files[0];
        
        if (!robotName || !robotCode || !imageFile) {
            alert('Por favor, preencha todos os campos');
            return;
        }
        
        if (robotCode.length !== 5 || !/^\d+$/.test(robotCode)) {
            alert('O código deve conter exatamente 5 dígitos numéricos');
            return;
        }
        
        // Ler a imagem como URL
        const reader = new FileReader();
        reader.onload = function(e) {
            const card = {
                name: robotName,
                code: robotCode,
                image: e.target.result,
                createdAt: new Date().toISOString()
            };
            
            saveCard(card);
            alert('Carta criada com sucesso!');
            form.reset();
        };
        reader.readAsDataURL(imageFile);
    });
}

function setupGalleryPage() {
    const gallery = document.getElementById('cardsGallery');
    const cards = getSavedCards();
    
    if (cards.length === 0) {
        gallery.innerHTML = '<p>Nenhuma carta criada ainda.</p>';
        return;
    }
    
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        gallery.appendChild(cardElement);
    });
}

function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    
    const img = document.createElement('img');
    img.src = card.image;
    img.alt = card.name;
    img.className = 'card-image';
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'card-info';
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'card-name';
    nameDiv.textContent = card.name;
    
    const statsDiv = document.createElement('div');
    statsDiv.className = 'card-stats';
    
    // Criar elementos para cada estatística
    const statsLabels = ['FREQ', 'RES', 'INT', 'POT', 'EFI'];
    for (let i = 0; i < 5; i++) {
        const statDiv = document.createElement('div');
        statDiv.className = 'stat';
        
        const valueDiv = document.createElement('div');
        valueDiv.textContent = card.code[i];
        
        const labelDiv = document.createElement('div');
        labelDiv.className = 'stat-label';
        labelDiv.textContent = statsLabels[i];
        
        statDiv.appendChild(valueDiv);
        statDiv.appendChild(labelDiv);
        statsDiv.appendChild(statDiv);
    }
    
    infoDiv.appendChild(nameDiv);
    infoDiv.appendChild(statsDiv);
    
    cardDiv.appendChild(img);
    cardDiv.appendChild(infoDiv);
    
    return cardDiv;
}

// Funções para armazenamento local
function saveCard(card) {
    const cards = getSavedCards();
    cards.push(card);
    localStorage.setItem('migobotCards', JSON.stringify(cards));
}

function getSavedCards() {
    const cardsJSON = localStorage.getItem('migobotCards');
    return cardsJSON ? JSON.parse(cardsJSON) : [];
}