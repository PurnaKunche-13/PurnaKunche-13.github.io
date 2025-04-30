const display = document.getElementById("display");
const themeSwitch = document.getElementById("themeSwitch");

function appendValue(val) {
  display.value += val;
}

function clearDisplay() {
  display.value = "";
}

function backspace() {
  display.value = display.value.slice(0, -1);
}

function calculateResult() {
  try {
    display.value = eval(display.value.replace("%", "/100"));
  } catch {
    display.value = "Error";
  }
}

// Handle keyboard input
document.addEventListener("keydown", function (e) {
  if (e.key.match(/[0-9\+\-\*\/\.\%]/)) {
    appendValue(e.key);
  } else if (e.key === "Enter") {
    calculateResult();
  } else if (e.key === "Backspace") {
    backspace();
  } else if (e.key === "Escape") {
    clearDisplay();
  }
});

// Theme switch toggle
themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});
