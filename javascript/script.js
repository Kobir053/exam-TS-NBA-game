"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = "https://nbaserver-q21u.onrender.com/api/filter";
var Position;
(function (Position) {
    Position[Position["PG"] = 0] = "PG";
    Position[Position["SG"] = 1] = "SG";
    Position[Position["SF"] = 2] = "SF";
    Position[Position["PF"] = 3] = "PF";
    Position[Position["C"] = 4] = "C";
})(Position || (Position = {}));
;
let myPlayers = [];
let playersFromAPI = [];
function getDetailsFromForm(form) {
    const detailsToSearch = {
        position: form["position"].value,
        twoPercent: +form["field-goal"].value,
        threePercent: +form["3-points"].value,
        points: +form["points"].value
    };
    return detailsToSearch;
}
function searchPlayers(details) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(details);
        const request = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(details)
        };
        try {
            const response = yield fetch(BASE_URL, request);
            if (!response.ok) {
                throw new Error("response status is not ok");
            }
            else {
                const resJson = yield response.json();
                console.log(resJson);
                return resJson;
            }
        }
        catch (err) {
            throw new Error("failed to get the players while trying to get them");
        }
    });
}
function listenerToForm(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const details = getDetailsFromForm(e.target);
        try {
            playersFromAPI = yield searchPlayers(details);
            if (!playersFromAPI) {
                throw new Error("didn't got the players from API");
            }
            else {
                insertPlayersToTable(playersFromAPI);
            }
        }
        catch (err) {
            throw new Error("failed in 'try' in the button of search function");
        }
    });
}
function insertPlayersToTable(players) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    players.forEach((player) => {
        const newRow = addRowToTable(player);
        tbody.appendChild(newRow);
    });
}
// function getPlayerDetailsFromTable (player: Player) : Player {
// }
function addRowToTable(player) {
    var _a;
    const tr = document.createElement("tr");
    const playerTD = document.createElement("td");
    playerTD.textContent = player.playerName;
    const positionTD = document.createElement("td");
    positionTD.textContent = player.position;
    const pointsTD = document.createElement("td");
    pointsTD.textContent = player.points.toString();
    const fgTD = document.createElement("td");
    fgTD.textContent = player.twoPercent.toString();
    const threePointsTD = document.createElement("td");
    threePointsTD.textContent = player.threePercent.toString();
    const actionTD = document.createElement("td");
    const button = document.createElement("button");
    button.textContent = `Add ${(_a = player.playerName) === null || _a === void 0 ? void 0 : _a.substring(0, player.playerName.indexOf(" "))} to Current Team`;
    // event listener to button
    actionTD.appendChild(button);
    tr.append(playerTD, positionTD, pointsTD, fgTD, threePointsTD, actionTD);
    return tr;
}
const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", listenerToForm);
