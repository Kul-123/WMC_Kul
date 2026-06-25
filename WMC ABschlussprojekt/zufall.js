document.getElementById('randomButton').addEventListener('click', holZufallsSpiel);

// datenbank hier spiegeln damit fetch sauber auflösen kann ohne cors fehrer
const lokaleSpiele = [
    { name: "The Witcher 3", genre: "RPG / Open World", jahr: "2015" },
    { name: "Cyberpunk 2077", genre: "RPG / Sci-Fi", jahr: "2020" },
    { name: "Minecraft", genre: "Sandbox / Open World", jahr: "2011" },
    { name: "Counter-Strike 2", genre: "Shooter / Taktik", jahr: "2023" },
    { name: "Elden Ring", genre: "RPG / Soulslike", jahr: "2022" }
];

function holZufallsSpiel() {
    const box = document.getElementById('gameDisplay');
    box.innerHTML = '<p class="loading">verbindung zum server wird aufgebaut...</p>';
    box.classList.remove('hidden');

    // VORGABE: fetch benutzen um eine zufallszahl zu generieren (0 bis 4)
    fetch('https://www.random.org/integers/?num=1&min=0&max=4&col=1&base=10&format=plain&rnd=new')
        .then(res => res.json())
        .then(zufallsIndex => {
            const gewähltesGame = lokaleSpiele[zufallsIndex];
            
            // inhalt im dom komplett austauschen
            box.innerHTML = `
                <h2>Dein Match: ${gewähltesGame.name}</h2>
                <div class="match-info">
                    <p><strong>Genre:</strong> ${gewähltesGame.genre}</p>
                    <p><strong>Release:</strong> ${gewähltesGame.jahr}</p>
                </div>
                <p class="api-note">die api hat den index ${zufallsIndex} zurückgegeben.</p>
            `;
        })
        .catch(err => {
            // fallback falls die test-api mal blockiert
            console.log("api fehler, nutze lokalen zufall", err);
            const handIndex = Math.floor(Math.random() * lokaleSpiele.length);
            const gewähltesGame = lokaleSpiele[handIndex];
            
            box.innerHTML = `
                <h2>Dein Match (Lokal): ${gewähltesGame.name}</h2>
                <div class="match-info">
                    <p><strong>Genre:</strong> ${gewähltesGame.genre}</p>
                </div>
                <p class="api-note" style="color: #e74c3c;">hinweis: offline-zufall genutzt.</p>
            `;
        });
}