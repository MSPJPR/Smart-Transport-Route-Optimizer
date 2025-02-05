document.addEventListener("DOMContentLoaded", function () {
    loadHistory();
    updateTraffic();
    setInterval(updateTraffic, 5000);
});

function calculateOptimalRoute() {
    let locations = document.getElementById("locations").value.split(",");
    let costs = document.getElementById("costs").value.split(",").map(Number);
    let size = Math.sqrt(costs.length);
    
    if (size % 1 !== 0 || locations.length !== size) {
        alert("Invalid input. Ensure the cost matrix is square and matches the number of locations.");
        return;
    }

    let optimalRoute = findOptimalRoute(locations, costs, size);
    document.getElementById("result").innerText = "Best Route: " + optimalRoute;
    saveToHistory(optimalRoute);
}

function findOptimalRoute(locations, costs, size) {
    let minCost = Infinity, bestRoute = [];
    
    function permute(arr, cost = 0, path = []) {
        if (arr.length === 0) {
            if (cost < minCost) {
                minCost = cost;
                bestRoute = [...path];
            }
            return;
        }
        for (let i = 0; i < arr.length; i++) {
            let nextCost = cost + (path.length ? costs[locations.indexOf(path[path.length - 1]) * size + locations.indexOf(arr[i])] : 0);
            permute([...arr.slice(0, i), ...arr.slice(i + 1)], nextCost, [...path, arr[i]]);
        }
    }

    permute(locations);
    return bestRoute.join(" → ") + " (Cost: " + minCost + ")";
}

function saveToHistory(route) {
    let history = JSON.parse(localStorage.getItem("routeHistory")) || [];
    history.push(route);
    localStorage.setItem("routeHistory", JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem("routeHistory")) || [];
    let historyList = document.getElementById("history");
    historyList.innerHTML = "";
    history.forEach(route => {
        let li = document.createElement("li");
        li.textContent = route;
        historyList.appendChild(li);
    });
}

function updateTraffic() {
    let conditions = ["Heavy Traffic 🚗", "Moderate Traffic 🚙", "Light Traffic 🚕"];
    document.getElementById("traffic").innerText = "Traffic: " + conditions[Math.floor(Math.random() * conditions.length)];
}
