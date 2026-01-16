export function downloadCSV(expenses) {
  const header = "Money,Description,Category\n";

  const rows = expenses
    .map((ex) => `${ex.money},${ex.description},${ex.category}`)
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
}
