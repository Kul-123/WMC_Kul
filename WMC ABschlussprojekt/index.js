// event listener für suche
document.getElementById('searchButton').addEventListener('click', spieleSuchen);
document.getElementById('searchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') spieleSuchen();
});

// spiele datenbank direkt hier lokal drin (vorgabe: arrays)
const spieleDatenbank = [
    {
        id: 1,
        name: "The Witcher 3",
        genre: "RPG / Open World",
        jahr: "2015",
        bild: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400"
    },
    {
        id: 2,
        name: "Cyberpunk 2077",
        genre: "RPG / Sci-Fi",
        jahr: "2020",
        bild: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400"
    },
    {
        id: 3,
        name: "Minecraft",
        genre: "Sandbox / Open World",
        jahr: "2011",
        bild: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=400"
    },
    {
        id: 4,
        name: "Counter-Strike 2",
        genre: "Shooter / Taktik",
        jahr: "2023",
        bild: "https://images.unsplash.com/photo-1542751130-996894959508?w=400"
    },
    {
        id: 5,
        name: "Elden Ring",
        genre: "RPG / Soulslike",
        jahr: "2022",
        bild: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400"
    }
];

function spieleSuchen() {
    const input = document.getElementById('searchInput').value.trim().toLowerCase();
    const container = document.getElementById('gameResults');
    
    // dom node inhalt leeren (vorgabe: dom austauschen)
    container.innerHTML = '';

    if (!input) return;

    // array nach name oder genre filtern
    const gefundeneSpiele = spieleDatenbank.filter(g => 
        g.name.toLowerCase().includes(input) || 
        g.genre.toLowerCase().includes(input)
    );

    if (gefundeneSpiele.length === 0) {
        container.innerHTML = '<p class="no-results">keine spiele gefunden... nutze die begriffe aus der liste oben!</p>';
        return;
    }

    // schleife durch treffer und elemente erzeugen (vorgabe: dom erzeugen)
    gefundeneSpiele.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';

        card.innerHTML = `
            <img src="${game.bild}" alt="${game.name}">
            <div class="game-card-content">
                <h3>${game.name}</h3>
                <p class="genre-tag">${game.genre}</p>
                <p class="year-tag">Release: ${game.jahr}</p>
                <button onclick="spielMerken('${game.name}')">auf wunschliste</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// spiel im localstorage merken
window.spielMerken = function(gameName) {
    let wunschliste = JSON.parse(localStorage.getItem('gameXplorerList')) || [];

    if (!wunschliste.includes(gameName)) {
        wunschliste.push(gameName);
        localStorage.setItem('gameXplorerList', JSON.stringify(wunschliste));
        alert(gameName + ' wurde hinzugefügt!');
    } else {
        alert('hast du schon auf der liste!');
    }
};