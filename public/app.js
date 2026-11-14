const mediaFrame = document.querySelector("#media-frame");
const loadingState = document.querySelector("#loading-state");
const title = document.querySelector("#apod-title");
const date = document.querySelector("#apod-date");
const explanation = document.querySelector("#apod-explanation");
const credit = document.querySelector("#apod-credit");
const badge = document.querySelector("#media-badge");
const errorState = document.querySelector("#error-state");
const errorMessage = document.querySelector("#error-message");
const datePicker = document.querySelector("#apod-date-picker");
let activeRequest;

datePicker.min = "1995-06-16";
datePicker.max = new Date().toISOString().slice(0, 10);

function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function showMedia(apod) {
  if (apod.media_type === "image") {
    const image = document.createElement("img");
    image.className = "apod-image";
    image.src = apod.url;
    image.alt = apod.title;
    image.loading = "eager";
    image.addEventListener("error", () => {
      showError("A imagem de hoje não pôde ser carregada.");
    }, { once: true });
    mediaFrame.replaceChildren(image);
    return;
  }

  if (apod.media_type === "video") {
    const video = document.createElement("iframe");
    video.className = "apod-video";
    video.src = apod.url;
    video.title = apod.title;
    video.loading = "lazy";
    video.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    video.allowFullscreen = true;
    video.referrerPolicy = "strict-origin-when-cross-origin";
    mediaFrame.replaceChildren(video);
    return;
  }

  mediaFrame.replaceChildren();
  showError("O formato de mídia de hoje não é compatível.");
}

function showError(message) {
  loadingState.hidden = true;
  errorState.hidden = false;
  errorMessage.textContent = message;
}

async function loadApod(selectedDate = "") {
  activeRequest?.abort();
  activeRequest = new AbortController();
  loadingState.hidden = false;
  errorState.hidden = true;
  mediaFrame.replaceChildren(loadingState);
  title.textContent = "Carregando descoberta...";
  date.textContent = "NASA ASTRONOMY PICTURE OF THE DAY";
  explanation.textContent = "";
  credit.textContent = "";
  badge.hidden = true;

  try {
    const url = new URL("/api/apod", window.location.origin);
    if (selectedDate) url.searchParams.set("date", selectedDate);
    const response = await fetch(url, { signal: activeRequest.signal });
    const apod = await response.json();
    if (!response.ok) throw new Error(apod.error || "Não foi possível carregar o APOD.");

    title.textContent = apod.title;
    date.textContent = formatDate(apod.date);
    datePicker.value = apod.date;
    explanation.textContent = apod.explanation;
    credit.textContent = apod.copyright ? `Imagem: ${apod.copyright.trim()}` : "";
    badge.textContent = apod.media_type === "video" ? "VÍDEO" : "IMAGEM";
    badge.hidden = false;
    showMedia(apod);
    loadingState.hidden = true;
  } catch (error) {
    if (error.name === "AbortError") return;
    mediaFrame.replaceChildren();
    showError(error.message);
  }
}

document.querySelector("#date-form").addEventListener("submit", (event) => {
  event.preventDefault();
  loadApod(datePicker.value);
});
document.querySelector("#retry-button").addEventListener("click", () => {
  loadApod(datePicker.value);
});
loadApod();
