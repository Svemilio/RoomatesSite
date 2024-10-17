
function roomatesGenerateInput() {
    const roomatesCounter = document.getElementById('roomatesCounter').value;
    const roomatesDiv = document.getElementById('roomates');
    const buttonFormRooms = document.getElementById('rooms');

    // Reset dei contenuti
    roomatesDiv.innerHTML = '';
    buttonFormRooms.innerHTML = '';

    if (roomatesCounter > 0) {
        roomatesDiv.innerHTML = '<h3 class="text-center">Coinquilini</h3>';
        
        // Creare una riga di Bootstrap
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row g-3';

        for (let i = 1; i <= roomatesCounter; i++) {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-12 col-md-6';

            const input = document.createElement('input');
            input.type = 'text';
            input.name = 'coinquilino' + i;
            input.id = 'coinquilino' + i;
            input.placeholder = 'Nome coinquilino ' + i;
            input.className = 'form-control';  // Classe Bootstrap
            input.required = true;

            colDiv.appendChild(input);
            rowDiv.appendChild(colDiv);
        }

        roomatesDiv.appendChild(rowDiv);

        // Aggiungere il pulsante "Stanze"
        buttonFormRooms.innerHTML = '<button class="btn btn-success mt-4" onclick="saveRoomates()">Stanze</button>';
    } else {
        roomatesDiv.innerHTML = '<p class="text-danger">Per favore, inserisci un numero valido di coinquilini.</p>';
    }
}


function roomsGenerate() {
    
    const numRooms = document.getElementById('numRooms').value;
    const roomsDiv = document.getElementById('rooms');
    const buttonGenerate = document.getElementById('button');

    roomsDiv.innerHTML = '';

    if (numRooms> 0) {
        roomsDiv.innerHTML = '<h3>Stanze</h3>';

        const rowDiv = document.createElement('div');
        rowDiv.className = 'row g-3';

        for (let i = 1; i <= numRooms; i++) {
            
            const colDiv = document.createElement('div');
            colDiv.className = 'col-12 col-md-6';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.name = 'room' + i;
            input.id = 'room' + i;
            input.placeholder = 'Nome stanza' + i;
            input.className = 'form-control';  // Classe Bootstrap
            input.required = true;
            
            colDiv.append(input);
            rowDiv.appendChild(colDiv);
            
        }
        roomsDiv.appendChild(rowDiv);
    } else {
        roomsDiv.innerHTML = '<p>Per favore, inserisci un numero valido di coinquilini.</p>';
    }

    buttonGenerate.innerHTML = '<button onclick="saveRooms()">Buona fortuna</button>';

}

function saveRoomates() {
    let roomatesCounter = document.getElementById("roomatesCounter").value;
    let roomates = [];
    let missingName = false;

    for (let i = 1; i <= roomatesCounter; i++) {
        
        let nameRoomate = document.getElementById("coinquilino" + i).value;
        if(nameRoomate === ""){
            missingName = true;
            alert("Inserisci tutti i coinquilini!");
            break;
        }
        roomates.push(nameRoomate);
    }
    if(!missingName){
        sessionStorage.setItem("listRoomates", JSON.stringify(roomates));
        window.location.href = "rooms.html";
    }else{
        window.location.href = "form.html";
    }

    
}

function saveRooms() {
    let numRooms = document.getElementById("numRooms").value;
    let rooms = [];
    let missingName = false;

    for (let i = 1; i <= numRooms; i++) {
        let nameRoom = document.getElementById("room" + i).value;
        if(nameRoom === ""){
            missingName = true;
            alert("Inserisci tutte le stanze!");
            break
        }
        rooms.push(nameRoom);
    }
    if(!missingName){
        sessionStorage.setItem("listRooms", JSON.stringify(rooms));
        randomRoomatesTask();
    }else{
        window.location.href = "rooms.html";
    }
}

function randomRoomatesTask(){
    const resultDiv = document.getElementById('result');
    let rooms = [];
    let roomates = [];
    rooms = JSON.parse(sessionStorage.getItem("listRooms"));
    roomates = JSON.parse(sessionStorage.getItem("listRoomates"));

    let randomResult = associateRooms(roomates,rooms);
    sessionStorage.setItem("randomResult", JSON.stringify(randomResult));

    showTable();
}


function randomizeArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function associateRooms(roomates, rooms) {
    
    randomizeArray(roomates);
    randomizeArray(rooms);

    let assignments = {};

   
    for (let i = 0; i < roomates.length; i++) {
        assignments[roomates[i]] = [rooms[i]];
    }
    rooms = rooms.slice(roomates.length);

    let index = 0;
    while (rooms.length > 0) {
        let roomate = roomates[index];
        assignments[roomate].push(rooms.shift());
        index = (index + 1) % roomates.length;
    }

    return assignments;
}

function showTable() {
    const resultDiv = document.getElementById('result');
    const randomResult = JSON.parse(sessionStorage.getItem("randomResult"));

    if (!randomResult) {
        resultDiv.innerHTML = '<p>Nessun dato disponibile.</p>';
        return;
    }

    let table = '<table>';
    table += '<tr><th>Coinquilino</th><th>Stanze da pulire</th></tr>';

    for (const coinquilino in randomResult) {
        const stanze = randomResult[coinquilino].join(', ');
        table += `<tr><td>${coinquilino}</td><td>${stanze}</td></tr>`;
    }

    table += '</table>';
    resultDiv.innerHTML = table;
}
