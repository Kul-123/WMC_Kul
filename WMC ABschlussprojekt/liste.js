// array aus dem speicher holen oder standardliste setzen (vorgabe)
let spieleListe = JSON.parse(localStorage.getItem('gameXplorerList')) || ["Gothic 2", "GTA 5"];

const listUI = document.getElementById('gameList');
const emptyTxt = document.getElementById('emptyMessage');
const inputField = document.getElementById('gameInput');

document.getElementById('addButton').addEventListener('click', spielHinzufuegen);

function listeAnzeigen() {
    listUI.innerHTML = '';

    if (spieleListe.length === 0) {
        emptyTxt.classList.remove('hidden');
    } else {
        emptyTxt.classList.add('hidden');

        // li nodes im dom erzeugen per schleife
        spieleListe.forEach((game, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${game}</span>
                <button class="delete-btn" onclick="spielLoeschen(${index})">entfernen</button>
            `;
            listUI.appendChild(li);
        });
    }

    localStorage.setItem('gameXplorerList', JSON.stringify(spieleListe));
}

function spielHinzufuegen() {
    const text = inputField.value.trim();
    if (text === '') return;

    spieleListe.push(text); // ins array werfen
    inputField.value = '';
    listeAnzeigen(); // dom aktualisieren
}

// node löschen (vorgabe)
window.spielLoeschen = function(index) {
    spieleListe.splice(index, 1); // aus array löschen
    listeAnzeigen();
};

listeAnzeigen();