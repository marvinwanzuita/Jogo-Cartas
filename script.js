// Funções globais
function getSavedCards() {
    const cardsJSON = localStorage.getItem('migobotCards');
    return cardsJSON ? JSON.parse(cardsJSON) : [];
}

function saveCard(card) {
    const cards = getSavedCards();
    cards.push(card);
    localStorage.setItem('migobotCards', JSON.stringify(cards));
}

// Página de criação
function setupFormPage() {
    const form = document.getElementById('cardForm');
    const imagePreview = document.getElementById('imagePreview');
    const imageInput = document.getElementById('cardImage');
    
    // Preview da imagem
    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
            reader.readAsDataURL(file);
        }
    });
    
    // Envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const robotName = document.getElementById('robotName').value.trim();
        const robotCode = document.getElementById('robotCode').value.trim();
        const imageFile = imageInput.files[0];
        
        // Validação
        if (!robotName || !robotCode || !imageFile) {
            alert('Por favor, preencha todos os campos');
            return;
        }
        
        if (robotCode.length !== 5 || !/^\d+$/.test(robotCode)) {
            alert('O código deve conter exatamente 5 dígitos numéricos');
            return;
        }
        
        // Criar carta
        const reader = new FileReader();
        reader.onload = function(e) {
            const card = {
                name: robotName,
                code: robotCode,
                image: e.target.result,
                createdAt: new Date().getTime()
            };
            
            saveCard(card);
            alert('Carta criada com sucesso!');
            form.reset();
            imagePreview.innerHTML = '';
        };
        reader.readAsDataURL(imageFile);
    });
}

// Página da galeria
function setupGalleryPage() {
    const gallery = document.getElementById('cardsGallery');
    const cards = getSavedCards();
    
    if (cards.length === 0) {
        gallery.innerHTML = '<p class="no-cards">Nenhuma carta criada ainda. <a href="index.html">Crie sua primeira carta!</a></p>';
        return;
    }
    
    // Ordenar cartas por data de criação (mais novas primeiro)
    cards.sort((a, b) => b.createdAt - a.createdAt);
    
    // Adicionar cartas à galeria
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        gallery.appendChild(cardElement);
    });
    
    // Configurar modal
    setupModal();
}

function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.dataset.cardId = card.createdAt;
    
    const img = document.createElement('img');
    img.src = card.image;
    img.alt = card.name;
    img.className = 'card-image';
    
    cardDiv.appendChild(img);
    cardDiv.addEventListener('click', () => openModal(card));
    
    return cardDiv;
}

// Modal
function setupModal() {
    const modal = document.getElementById('cardModal');
    const closeBtn = document.querySelector('.close-modal');
    
    // Fechar modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    // Fechar ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

function openModal(card) {
    const modal = document.getElementById('cardModal');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalStats = document.getElementById('modalStats');
    
    // Preencher dados
    modalImage.src = card.image;
    modalImage.alt = card.name;
    modalName.textContent = card.name;
    
    // Limpar e adicionar estatísticas
    modalStats.innerHTML = '';
    const statsLabels = ['Frequência', 'Resistência', 'Inteligência', 'Potência', 'Eficiência'];
    
    statsLabels.forEach((label, index) => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        
        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.textContent = card.code[index];
        
        const statLabel = document.createElement('div');
        statLabel.className = 'stat-label';
        statLabel.textContent = label;
        
        statItem.appendChild(statValue);
        statItem.appendChild(statLabel);
        modalStats.appendChild(statItem);
    });
    
    // Mostrar modal
    modal.classList.add('show');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cardForm')) {
        setupFormPage();
    } else if (document.getElementById('cardsGallery')) {
        setupGalleryPage();
    }
});