// const path = window.location.pathname;
const path = "/movie/12345-some-movie-title";
const message = document.getElementById("message");
const findBtn = document.getElementById("findBtn");
const redirectContainer = document.getElementById("redirectContainer");
const redirectBtn = document.getElementById("redirectBtn");
const dropdownBtn = document.querySelector(".dropdown-btn");
const mirrorList = document.getElementById("mirrorList");
const autoToggle = document.getElementById("autoToggle");
const rotateText = document.querySelector('.rotate-text');

const mirrors = [
    "vidfast.pro",
    "vidfast.in",
    "vidfast.io",
    "vidfast.me",
    "vidfast.net",
    "vidfast.pm",
    "vidfast.xyz"
];

function handleMovie(p) {
    const match = p.match(/^\/movie\/(\d+)(?:-[^/]+)?/);
    if (!match) return null;
    const id = match[1];
    return mirrors.map(m => `https://${m}/movie/${id}?autoplay=true&theme=00FFB2`);
}

function handleTV(p) {
    const match = p.match(/^\/tv\/(\d+)(?:-[^/]+)?(?:\/season\/(\d+))?(?:\/episode\/(\d+))?/);
    if (!match) return null;
    const id = match[1];
    const season = match[2] || "1";
    const episode = match[3] || "1";
    if (match[3] && !match[2]) return null;
    return mirrors.map(m => `https://${m}/tv/${id}/${season}/${episode}?autoplay=true&theme=00FFB2`);
}

let targets = null;
if (path.startsWith("/movie/")) {
    targets = handleMovie(path);
} else if (path.startsWith("/tv/")) {
    targets = handleTV(path);
}

const latestMirror = localStorage.getItem("latestMirror") || "vidfast.pro";
redirectBtn.textContent += ` (${latestMirror})`;
const autoRedirect = localStorage.getItem("autoRedirect");
if (autoRedirect === "true") {
    autoToggle.checked = true;
}

if (targets && autoToggle.checked) {
    window.location.href = targets[mirrors.indexOf(latestMirror)];
}

if (targets) {
    message.textContent = "Choose a mirror or click redirect";
    redirectContainer.style.display = "inline-flex";
    redirectBtn.onclick = () => window.location.href = targets[mirrors.indexOf(latestMirror)];
    mirrors.forEach((m, i) => {
        const link = document.createElement("a");
        link.textContent = m === latestMirror ? `${m} (latest)` : m;
        link.addEventListener("click", () => {
            localStorage.setItem("latestMirror", m);
            location.href = targets[i];
        });
        mirrorList.appendChild(link);
    });
    dropdownBtn.onclick = e => {
        e.stopPropagation();
        rotateText.classList.toggle("rotated")
        mirrorList.classList.toggle("show");
    };
    document.addEventListener("click", e => {
        if (!redirectContainer.contains(e.target)) {
            rotateText.classList.remove("rotated")
            mirrorList.classList.remove("show");
        }
    });
} else {
    message.textContent = "Error: Invalid TMDB URL";
    findBtn.style.display = "inline-block";
    findBtn.onclick = () => window.location.href = "https://themoviedb.org/";
}

autoToggle.addEventListener("change", () => {
    const enabled = autoToggle.checked;
    localStorage.setItem("autoRedirect", enabled ? "true" : "false");
    if (enabled && targets) {
        window.location.href = targets[mirrors.indexOf(latestMirror)];
    }
});
