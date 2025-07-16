const denominations = [
  { id: "n500", value: 500, output: "tot500" },
  { id: "n200", value: 200, output: "tot200" },
  { id: "n100", value: 100, output: "tot100" },
  { id: "n50", value: 50, output: "tot50" },
  { id: "n20", value: 20, output: "tot20" },
  { id: "n10", value: 10, output: "tot10" },
  { id: "c20", value: 20, output: "totc20" },
  { id: "c10", value: 10, output: "totc10" },
  { id: "c5", value: 5, output: "totc5" },
  { id: "c2", value: 2, output: "totc2" },
  { id: "c1", value: 1, output: "totc1" },
];

function updateTotal() {
  let grandTotal = 0;

  denominations.forEach((item) => {
    const input = document.getElementById(item.id);
    const output = document.getElementById(item.output);
    const count = parseInt(input.value) || 0;
    const total = count * item.value;
    output.textContent = total;
    grandTotal += total;
  });

  document.getElementById("final").textContent = grandTotal;
}

// Set up event listeners
denominations.forEach((item) => {
  const input = document.getElementById(item.id);
  input.addEventListener("input", updateTotal);
});

function empty() {
  denominations.forEach((item) => {
    const input = document.getElementById(item.id);
    const output = document.getElementById(item.output);
    input.value = "";
    output.textContent = "0";
  });
  document.getElementById("final").textContent = "0";
}
