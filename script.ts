const BASE_URL = "https://nbaserver-q21u.onrender.com/api/filter";

interface Player {
    playerName?: string;
    position: string;
    twoPercent: number;
    threePercent: number;
    points: number;
}

let playersFromAPI : Player[] = [];

// gets a form element and return the details inside the form - after submitting the form of course..
function getDetailsFromForm(form: HTMLFormElement) : Player {
    const detailsToSearch: Player = {
        position: form["position"].value,
        twoPercent: +form["field-goal"].value,
        threePercent: +form["3-points"].value,
        points: +form["points"].value
    };
    return detailsToSearch;
}

// method for get the players from the API (by POST method) 
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

// the event listener of the form by submitting, try to get the players and if there is a result, it calls the function to enter them into the table
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

// delete the tbody children and iterate through the player list, for each player calls a method to make a row for him and to append it into tbody
function insertPlayersToTable (players: Player[]) : void {
    const tbody = document.querySelector("tbody") as HTMLElement;
    tbody.innerHTML = "";
    players.forEach((player: Player) => {
        const newRow: HTMLTableRowElement = addRowToTable(player);
        tbody.appendChild(newRow);
    })
}

// method that creates the element for showing the player details in the team div, it called where is the first appearance of those elements in that div..
function createElementsForPlayerDiv (div: HTMLDivElement, player: Player) : void {
    const playerNameElement = document.createElement("h4") as HTMLElement;
    playerNameElement.textContent = player.playerName!;

    const playerThreePercentElement = document.createElement("p") as HTMLParagraphElement;
    playerThreePercentElement.setAttribute("class", "three-p");
    playerThreePercentElement.textContent = `Three Precent : ${player.threePercent.toString()}%`;

    const playerTwoPercentElement = document.createElement("p") as HTMLParagraphElement;
    playerTwoPercentElement.setAttribute("class", "two-p");
    playerTwoPercentElement.textContent = `Two Precent : ${player.twoPercent.toString()}%`;

    const playerPointsElement = document.createElement("p") as HTMLParagraphElement;
    playerPointsElement.setAttribute("class", "points");
    playerPointsElement.textContent = "Points :" + player.points.toString();

    div.append(playerNameElement, playerThreePercentElement, playerTwoPercentElement, playerPointsElement);
}

// checks if the div already have a player inside, if it does it changes the details, if it doesn't it calls the method above..
function addPlayerToMyTeam (player: Player) : void {
    const playerDiv = document.getElementById(`${player.position}`) as HTMLDivElement;
    if(playerDiv.childElementCount < 2){
        createElementsForPlayerDiv(playerDiv, player);
        return;
    }
    
    let playerNameElement = document.querySelector(`#${player.position} > h4`) as HTMLElement;
    playerNameElement.textContent = player.playerName!;

    let playerThreePercentElement = document.querySelector(`#${player.position} > .three-p`) as HTMLElement;
    playerThreePercentElement.textContent = `Three Precent : ${player.threePercent.toString()}%`;

    let playerTwoPercentElement = document.querySelector(`#${player.position} > .two-p`) as HTMLElement;
    playerTwoPercentElement.textContent = `Two Precent : ${player.twoPercent.toString()}%`;

    let playerPointsElement = document.querySelector(`#${player.position} > .points`) as HTMLElement;
    playerPointsElement.textContent = "Points :" + player.points.toString();

}

// make the table row for the player with his details and set button for the player so it will be possible to add the player to the team
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

    const button = document.createElement("button") as HTMLButtonElement;
    button.textContent = `Add ${player.playerName?.substring(0, player.playerName.indexOf(" "))} to Current Team`;
    button.addEventListener("click", () => {addPlayerToMyTeam(player)});
    const actionTD = document.createElement("td") as HTMLTableCellElement;
    actionTD.appendChild(button);

    tr.append(playerTD, positionTD, pointsTD, fgTD, threePointsTD, actionTD);
    return tr;
}

const searchForm = document.getElementById("search-form") as HTMLFormElement;
searchForm.addEventListener("submit", listenerToForm);

// get HTMLCollection of the range inputs and iterate through them to add event listener so their label could change its value after changing the value
const inputs = document.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>;
for (const element of inputs) {
    element.addEventListener("input", () => {
        const label = document.getElementById(`${element.getAttribute("name")}-label`) as HTMLLabelElement;
        label.textContent = element.value;
    });
}