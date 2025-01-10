const submitform = document.getElementById("form");
const btn = document.getElementById("translate-btn");
const copyBtn = document.getElementById("copy-btn");
const textOutputContainer = document.getElementById("text-out");
const translationInputArea = document.getElementById("before-translation");
const translationOutputArea = document.getElementById("after-translation");
const translationInputLabel = document.getElementById(
  "before-translation-label"
);
const langSet = document.getElementById("fieldset");
let isTranslated = false;

submitform.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (isTranslated) {
    translationInputLabel.innerText = "Text to translate 👇";
    translationInputArea.readOnly = false;
    btn.innerText = "Start Over";
    translationInputArea.value = "";
    translationOutputArea.value = "";
    btn.innerText = "Translate";
  } else {
    btn.disabled = true;
    const targetLang = document.querySelector(
      'input[name="lang"]:checked'
    ).value;
    const messages = [
      {
        role: "system",
        content:
          "You are an expert translator. Given a text in a target language, write a translation text without further explanation. If user makes a typo, give a best guess translation. If you are not sure, write 'not sure'. If you are unable to translate, write 'unable to translate'. If you are unable to understand the text, write 'unable to understand'.",
      },
      {
        role: "user",
        content: `translate ${translationInputArea.value} to ${targetLang}`,
      },
    ];

    try {
      const url = "https://openai-api-worker.hasan-h-ozbakir.workers.dev/";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Worker Error: ${data.error}`);
      }
      translationOutputArea.value = data.content;
    } catch (err) {
      console.error(err.message);
    }
    translationInputLabel.innerText = "Original text 👇";
    translationInputArea.readOnly = true;
    btn.innerText = "Start Over";
  }
  isTranslated = !isTranslated;
  langSet.classList.toggle("reverse");
  textOutputContainer.classList.toggle("reverse");
  btn.disabled = false;
});

copyBtn.addEventListener("click", function () {
  translationInputArea.select();
  translationInputArea.setSelectionRange(0, 99999);
  navigator.clipboard
    .writeText(translationInputArea.value)
    .then(() => {
      const copyMessage = document.getElementById("copy-message");
      copyMessage.style.display = "block";
      copyMessage.style.opacity = "1";
      setTimeout(() => {
        copyMessage.style.opacity = "0"; // Fade out
        setTimeout(() => {
          copyMessage.style.display = "none"; // Hide after fade-out
        }, 500);
      }, 1000); // Keep visible for 1 second
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
});

// copyBtn.addEventListener("click", function () {
//   translationInputArea.select();
//   translationInputArea.setSelectionRange(0, 99999);
//   navigator.clipboard
//     .writeText(translationInputArea.value)
//     .then(() => {
//       alert("Text copied to clipboard!");
//     })
//     .catch((err) => {
//       console.error("Failed to copy text: ", err);
//     });
// });
