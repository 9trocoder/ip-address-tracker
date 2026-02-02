
const apiKey = "at_GgqxZe2xkILn9TzK2UROhfERsrDWR";

// DOM 
const ipEl = document.getElementById("ip-address");
const locationEl = document.getElementById("location");
const timezoneEl = document.getElementById("timezone");
const ispEl = document.getElementById("isp");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// Initialize map
let map = L.map("map", {
  zoomControl: false, 
});


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);


const markerIcon = L.icon({
  iconUrl: "./images/icon-location.svg",
  iconSize: [46, 56],
  iconAnchor: [23, 56],
});

let marker;

function updateMap(lat, lng) {
  map.setView([lat, lng], 13);

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
}


function updateInfo(data) {
  ipEl.textContent = data.ip;
  locationEl.textContent = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
  timezoneEl.textContent = `UTC ${data.location.timezone}`;
  ispEl.textContent = data.isp;
}


async function getIPData(ipOrDomain = "") {
  let url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`;

  if (ipOrDomain) {
    // Simple check to see if input is an IP or Domain
    const isIp =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipOrDomain,
      );

    if (isIp) {
      url += `&ipAddress=${ipOrDomain}`;
    } else {
      url += `&domain=${ipOrDomain}`;
    }
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch IP data");

    const data = await response.json();

    updateInfo(data);
    updateMap(data.location.lat, data.location.lng);
  } catch (error) {
    console.error("Error:", error);
    alert(
      "Could not find location for this IP/Domain. Please check your input or API key.",
    );
  }
}


// User search input Event listener for api
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = searchInput.value.trim();
  if (val) {
    getIPData(val);
  }
});

// Fetch current user IP address at initial
document.addEventListener("DOMContentLoaded", () => {
  getIPData(); 
});
