const path = window.location.pathname
const message = document.getElementById("message")
const backBtn = document.getElementById("backBtn")
const redirectContainer = document.getElementById("redirectContainer")
const redirectBtn = document.getElementById("redirectBtn")
const dropdownBtn = document.querySelector(".dropdown-btn")
const mirrorList = document.getElementById("mirrorList")
const autoToggle = document.getElementById("autoToggle")

const mirrors = [
    "vidfast.pro",
    "vidfast.in",
    "vidfast.io",
    "vidfast.me",
    "vidfast.net",
    "vidfast.pm",
    "vidfast.xyz"
]

function handleMovie(p) {
    const match = p.match(/^\/movie\/(\d+)-/)
    if (match) {
        const id = match[1]
        return mirrors.map(m => `https://${m}/movie/${id}?autoplay=true`)
    }
    return null
}

function handleTV(p) {
    const match = p.match(/^\/tv\/(\d+)-[^/]+(?:\/season\/(\d+))?(?:\/episode\/(\d+))?/)
    if (!match) return null
    const id = match[1]
    const season = match[2] || "1"
    const episode = match[3] || "1"
    if (match[3] && !match[2]) return null
    return mirrors.map(m => `https://${m}/tv/${id}/${season}/${episode}?autoplay=true`)
}

let targets = null
if (path.startsWith("/movie/")) {
    targets = handleMovie(path)
} else if (path.startsWith("/tv/")) {
    targets = handleTV(path)
}

const savedPref = localStorage.getItem("autoRedirect")
if (savedPref === "true") {
    autoToggle.checked = true
}

if (targets && autoToggle.checked) {
    window.location.href = targets[0]
}

if (targets) {
    message.textContent = "Choose a mirror or click redirect"
    redirectContainer.style.display = "inline-flex"
    redirectBtn.onclick = () => window.location.href = targets[0]
    mirrors.forEach((m, i) => {
        const link = document.createElement("a")
        link.textContent = m
        link.href = targets[i]
        mirrorList.appendChild(link)
    })
    dropdownBtn.onclick = e => {
        e.stopPropagation()
        mirrorList.classList.toggle("show")
    }
    document.addEventListener("click", e => {
        if (!redirectContainer.contains(e.target)) {
            mirrorList.classList.remove("show")
        }
    })
    autoToggle.addEventListener("change", () => {
        const enabled = autoToggle.checked
        localStorage.setItem("autoRedirect", enabled ? "true" : "false")
        if (enabled) {
            window.location.href = targets[0]
        }
    })
} else {
    message.textContent = "Error: Invalid TMDB URL"
    backBtn.style.display = "inline-block"
    backBtn.onclick = () => history.back()
}
