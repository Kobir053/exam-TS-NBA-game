const BASE_URL = "https://nbaserver-q21u.onrender.com/api/filter";

enum Position {
    PG,
    SG,
    SF,
    PF,
    C
};

interface Player {
    playerName?: string;
    position: string;
    twoPercent: number;
    threePercent: number;
    points: number;
}

let myPlayers: Player[] = [];
let playersFromAPI : Player[] = [];

function getDetailsFromForm(form: HTMLFormElement) : Player {
    const detailsToSearch: Player = {
        position: form["position"].value,
        twoPercent: +form["field-goal"].value,
        threePercent: +form["3-points"].value,
        points: +form["points"].value
    };
    return detailsToSearch;
}

async function searchPlayers(details: Player) : Promise<Player[]> {
    console.log(details);
    const request = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(details)
    };
    try{
        const response = await fetch(BASE_URL, request);
        if(!response.ok){
            throw new Error("response status is not ok");
        }
        else{
            const resJson = await response.json();
            console.log(resJson); 
            return resJson;
        }
    }
    catch(err: any){
        throw new Error("failed to get the players while trying to get them");
    }
}

async function listenerToForm (e: Event) : Promise<void> {
    e.preventDefault();
    const details = getDetailsFromForm(e.target as HTMLFormElement);
    try{
        playersFromAPI = await searchPlayers(details);
        if(!playersFromAPI){
            throw new Error("didn't got the players from API");
        }
        else{
            insertPlayersToTable(playersFromAPI);
        }
    }
    catch(err: any){
        throw new Error("failed in 'try' in the button of search function");
    }
}

function insertPlayersToTable (players: Player[]) : void {
    const tbody = document.querySelector("tbody") as HTMLElement;
    tbody.innerHTML = "";
    players.forEach((player: Player) => {
        const newRow: HTMLTableRowElement = addRowToTable(player);
        tbody.appendChild(newRow);
    })
}

// function getPlayerDetailsFromTable (player: Player) : Player {

// }

function addRowToTable (player: Player) : HTMLTableRowElement {
    const tr = document.createElement("tr") as HTMLTableRowElement;

    const playerTD = document.createElement("td") as HTMLTableCellElement;
    playerTD.textContent = player.playerName!;
    
    const positionTD = document.createElement("td") as HTMLTableCellElement;
    positionTD.textContent = player.position;

    const pointsTD = document.createElement("td") as HTMLTableCellElement;
    pointsTD.textContent = player.points.toString();

    const fgTD = document.createElement("td") as HTMLTableCellElement;
    fgTD.textContent = player.twoPercent.toString();

    const threePointsTD = document.createElement("td") as HTMLTableCellElement;
    threePointsTD.textContent = player.threePercent.toString();

    const actionTD = document.createElement("td") as HTMLTableCellElement;
    const button = document.createElement("button") as HTMLButtonElement;
    button.textContent = `Add ${player.playerName?.substring(0, player.playerName.indexOf(" "))} to Current Team`;
    // event listener to button
    actionTD.appendChild(button);

    tr.append(playerTD, positionTD, pointsTD, fgTD, threePointsTD, actionTD);
    return tr;
}

const searchForm = document.getElementById("search-form") as HTMLFormElement;
searchForm.addEventListener("submit", listenerToForm);