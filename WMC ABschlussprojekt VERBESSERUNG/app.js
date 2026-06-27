// Globale Listen für die App (Erfüllt Array-Anforderung)
let allGames = []; 
let watchlist = [];

const appContent = document.getElementById('app-content');
const navHome = document.getElementById('nav-home');
const navExplore = document.getElementById('nav-explore');
const navWatchlist = document.getElementById('nav-watchlist');

document.addEventListener('DOMContentLoaded', () => {
    loadPage('home');
});

// Event-Handling für Navigation
navHome.addEventListener('click', (e) => { e.preventDefault(); loadPage('home'); updateNav(navHome); });
navExplore.addEventListener('click', (e) => { e.preventDefault(); loadPage('explore'); updateNav(navExplore); });
navWatchlist.addEventListener('click', (e) => { e.preventDefault(); loadPage('watchlist'); updateNav(navWatchlist); });

function updateNav(activeLink) {
    [navHome, navExplore, navWatchlist].forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function loadPage(page) {
    appContent.innerHTML = ''; // DOM leeren vor Neuaufbau

    if (page === 'home') renderHome();
    if (page === 'explore') renderExplore();
    if (page === 'watchlist') renderWatchlist();
}

// --- SEITE 1: HOME ---
function renderHome() {
    const section = document.createElement('section');
    section.className = 'hero';
    section.innerHTML = `
        <h1>Finde dein nächstes Abenteuer</h1>
        <p>Durchsuche eine kuratierte Liste von Free-to-Play Titeln und speichere deine Favoriten.</p>
        <button class="btn" id="btn-start" style="width: auto; margin-top: 1.5rem; padding: 0.8rem 2.5rem;">Direkt loslegen</button>
    `;
    appContent.appendChild(section);

    document.getElementById('btn-start').addEventListener('click', () => {
        navExplore.click();
    });
}

// --- SEITE 2: EXPLORE (Echtes Fetch + Filter & Suche) ---
async function renderExplore() {
    // 1. Überschrift erzeugen
    const title = document.createElement('h2');
    title.textContent = 'Game Explorer';
    title.style.marginBottom = '1.5rem';
    appContent.appendChild(title);

    // 2. Such- und Filterleiste erzeugen (DOM Manipulation)
    const controls = document.createElement('div');
    controls.className = 'controls-container';
    controls.innerHTML = `
        <input type="text" id="search-box" class="search-input" placeholder="Nach Titel suchen...">
        <select id="genre-filter" class="filter-select">
            <option value="all">Alle Genres</option>
            <option value="Shooter">Shooter</option>
            <option value="MMORPG">MMORPG</option>
            <option value="Battle Royale">Battle Royale</option>
            <option value="MOBA">MOBA</option>
        </select>
    `;
    appContent.appendChild(controls);

    // 3. Grid für die Karten erzeugen
    const grid = document.createElement('div');
    grid.className = 'game-grid';
    appContent.appendChild(grid);

    grid.innerHTML = '<p>Spiele werden geladen...</p>';

    // Daten via Fetch holen (falls API oder Proxy blockiert -> Fallback)
    if (allGames.length === 0) {
        try {
            const res = await fetch('https://cors-anywhere.herokuapp.com/https://www.freetogame.com/api/games');
            if (res.ok) {
                allGames = await res.json();
            } else {
                allGames = getLargeFallbackData(); 
            }
        } catch (err) {
            allGames = getLargeFallbackData(); // Bei Netzwerkfehler Fallback nutzen
        }
    }

    // Initiale Anzeige (erste 12 Spiele)
    displayGames(allGames.slice(0, 12), grid);

    // Event Listener für Echtzeit-Suche und Filter
    const searchBox = document.getElementById('search-box');
    const genreFilter = document.getElementById('genre-filter');

    const filterLogic = () => {
        const searchTerm = searchBox.value.toLowerCase();
        const selectedGenre = genreFilter.value;

        // Array filtern nach zwei Kriterien parallel
        const filtered = allGames.filter(game => {
            const matchesSearch = game.title.toLowerCase().includes(searchTerm);
            const matchesGenre = selectedGenre === 'all' || game.genre === selectedGenre;
            return matchesSearch && matchesGenre;
        });

        displayGames(filtered.slice(0, 12), grid);
    };

    searchBox.addEventListener('input', filterLogic);
    genreFilter.addEventListener('change', filterLogic);
}

// Hilfsfunktion: Baut die Karten komplett über saubere DOM-Methoden auf
function displayGames(gamesList, targetGrid) {
    targetGrid.innerHTML = ''; // Altes Grid leeren

    if(gamesList.length === 0) {
        targetGrid.innerHTML = '<p>Keine Spiele zu den Filtereinstellungen gefunden.</p>';
        return;
    }

    gamesList.forEach(game => {
        // DOM Nodes erzeugen & verschachteln
        const card = document.createElement('div');
        card.className = 'game-card';

        const img = document.createElement('img');
        img.src = game.thumbnail;
        img.alt = game.title;

        const info = document.createElement('div');
        info.className = 'game-info';

        const h3 = document.createElement('h3');
        h3.textContent = game.title;

        // Tags/Badges
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'game-tags';
        tagsDiv.innerHTML = `
            <span class="badge">${game.genre}</span>
            <span class="badge">${game.platform}</span>
        `;

        const p = document.createElement('p');
        p.textContent = game.short_description;

        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = 'Zur Watchlist';

        // Event zum Hinzufügen ins Array
        btn.addEventListener('click', () => {
            if (!watchlist.some(item => item.id === game.id)) {
                watchlist.push(game);
                alert(`${game.title} wurde gemerkt!`);
            } else {
                alert('Dieses Spiel ist bereits auf deiner Watchlist.');
            }
        });

        // Zusammenbau
        info.appendChild(h3);
        info.appendChild(tagsDiv);
        info.appendChild(p);
        info.appendChild(btn);
        
        card.appendChild(img);
        card.appendChild(info);
        targetGrid.appendChild(card);
    });
}

// --- SEITE 3: WATCHLIST (DOM Nodes gezielt löschen) ---
function renderWatchlist() {
    const title = document.createElement('h2');
    title.textContent = 'Meine Watchlist';
    title.style.marginBottom = '1.5rem';
    appContent.appendChild(title);

    if (watchlist.length === 0) {
        const msg = document.createElement('p');
        msg.textContent = 'Deine Watchlist ist aktuell leer. Füge im Explorer Spiele hinzu!';
        appContent.appendChild(msg);
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'game-grid';
    appContent.appendChild(grid);

    watchlist.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.id = `watch-item-${game.id}`; // Wichtig für gezieltes Löschen

        card.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}">
            <div class="game-info">
                <h3>${game.title}</h3>
                <div class="game-tags"><span class="badge">${game.genre}</span></div>
                <p>${game.short_description}</p>
                <button class="btn btn-danger" onclick="deleteFromWatchlist(${game.id})">Entfernen</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Node-Löschung (Anforderung: DOM Nodes löschen)
window.deleteFromWatchlist = function(id) {
    // 1. Aus globalem Array entfernen
    watchlist = watchlist.filter(item => item.id !== id);

    // 2. Direktes Element im DOM finden und zerstören
    const el = document.getElementById(`watch-item-${id}`);
    if (el) el.remove();

    // Ansicht auffrischen, falls jetzt alles leer ist
    if (watchlist.length === 0) {
        loadPage('watchlist');
    }
};

// Großes Fallback-Daten-Array (12 hochwertige Spiele)
function getLargeFallbackData() {
    return [
        { id: 1, title: "Overwatch 2", genre: "Shooter", platform: "PC / Konsole", thumbnail: "https://www.freetogame.com/g/540/thumbnail.jpg", short_description: "Ein teambasierter Action-Shooter von Blizzard Entertainment." },
        { id: 2, title: "Apex Legends", genre: "Battle Royale", platform: "PC / Konsole", thumbnail: "https://www.freetogame.com/g/11/thumbnail.jpg", short_description: "Ein strategisches Battle-Royale-Spiel im Titanfall-Universum." },
        { id: 3, title: "Valorant", genre: "Shooter", platform: "PC", thumbnail: "https://www.freetogame.com/g/433/thumbnail.jpg", short_description: "Ein taktischer 5v5-Shooter mit einzigartigen Charakter-Fähigkeiten." },
        { id: 4, title: "Counter-Strike 2", genre: "Shooter", platform: "PC", thumbnail: "https://www.freetogame.com/g/573/thumbnail.jpg", short_description: "Der legendäre taktische Shooter auf Basis der Source 2 Engine." },
        { id: 5, title: "Lost Ark", genre: "MMORPG", platform: "PC", thumbnail: "https://www.freetogame.com/g/517/thumbnail.jpg", short_description: "Ein actionreiches MMO im Diablostil mit riesiger offener Welt." },
        { id: 6, title: "Guild Wars 2", genre: "MMORPG", platform: "PC", thumbnail: "https://www.freetogame.com/g/111/thumbnail.jpg", short_description: "Eines der beliebtesten Online-Rollenspiele mit dynamischen Events." },
        { id: 7, title: "League of Legends", genre: "MOBA", platform: "PC", thumbnail: "https://www.freetogame.com/g/347/thumbnail.jpg", short_description: "Das meistgespielte kompetitive Strategiespiel der Welt." },
        { id: 8, title: "Dota 2", genre: "MOBA", platform: "PC", thumbnail: "https://www.freetogame.com/g/345/thumbnail.jpg", short_description: "Taktisch tiefgründiges MOBA-Urgestein von Valve." },
        { id: 9, title: "PUBG: Battlegrounds", genre: "Battle Royale", platform: "PC / Konsole", thumbnail: "https://www.freetogame.com/g/516/thumbnail.jpg", short_description: "Landen, plündern und als Letzter in diesem Shooter überleben." },
        { id: 10, title: "Warframe", genre: "Shooter", platform: "PC / Konsole", thumbnail: "https://www.freetogame.com/g/2/thumbnail.jpg", short_description: "Steuere hochentwickelte Kampfanzüge in diesem rasanten Sci-Fi Koop." },
        { id: 11, title: "Genshin Impact", genre: "MMORPG", platform: "PC / Mobile", thumbnail: "https://www.freetogame.com/g/475/thumbnail.jpg", short_description: "Wunderschönes Open-World Anime RPG mit Elementar-Kampfsystem." },
        { id: 12, title: "Fortnite", genre: "Battle Royale", platform: "PC / Konsole", thumbnail: "https://www.freetogame.com/g/521/thumbnail.jpg", short_description: "Baue und kämpfe im weltweit bekannten Phänomen von Epic Games." }
    ];
}