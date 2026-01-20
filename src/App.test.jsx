import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
describe("Expense Tracker App", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("renders the heading", () => {
    const heading = screen.getByText(/expense tracker/i);
    expect(heading).toBeInTheDocument();
  });

  test("renders add expense form", () => {
    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  test("can type into title and amount inputs", async () => {
    const titleInput = screen.getByPlaceholderText(/title/i);
    const amountInput = screen.getByPlaceholderText(/amount/i);

    await userEvent.type(titleInput, "Groceries");
    await userEvent.type(amountInput, "50");

    expect(titleInput).toHaveValue("Groceries");
    expect(amountInput).toHaveValue(50);
  });

  test("can add a new expense", async () => {
    const titleInput = screen.getByPlaceholderText(/title/i);
    const amountInput = screen.getByPlaceholderText(/amount/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(titleInput, "Rent");
    await userEvent.type(amountInput, "1000");
    fireEvent.click(addButton);

    const expenseItem = screen.getByText(/rent/i);
    expect(expenseItem).toBeInTheDocument();
    expect(screen.getByText("$1000")).toBeInTheDocument();
  });

  test("updates total expense after adding", async () => {
    const titleInput = screen.getByPlaceholderText(/title/i);
    const amountInput = screen.getByPlaceholderText(/amount/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(titleInput, "Internet");
    await userEvent.type(amountInput, "60");
    fireEvent.click(addButton);

    const total = screen.getByText(/total:/i);
    expect(total).toHaveTextContent("Total: $60");
  });

  test("can remove an expense", async () => {
    const titleInput = screen.getByPlaceholderText(/title/i);
    const amountInput = screen.getByPlaceholderText(/amount/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(titleInput, "Coffee");
    await userEvent.type(amountInput, "5");
    fireEvent.click(addButton);

    const removeBtn = screen.getByRole("button", { name: /remove/i });
    fireEvent.click(removeBtn);

    const expenseItem = screen.queryByText(/coffee/i);
    expect(expenseItem).not.toBeInTheDocument();
  });

  test("total updates after removing an expense", async () => {
    const titleInput = screen.getByPlaceholderText(/title/i);
    const amountInput = screen.getByPlaceholderText(/amount/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(titleInput, "Snack");
    await userEvent.type(amountInput, "10");
    fireEvent.click(addButton);

    const removeBtn = screen.getByRole("button", { name: /remove/i });
    fireEvent.click(removeBtn);

    const total = screen.getByText(/total:/i);
    expect(total).toHaveTextContent("Total: $0");
  });

  test("does not allow empty title", async () => {
    const amountInput = screen.getByPlaceholderText(/amount/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(amountInput, "10");
    fireEvent.click(addButton);

    const alert = screen.getByText(/title is required/i);
    expect(alert).toBeInTheDocument();
  });

  test("does not allow zero or negative amount", async () => {
    const titleInput = screen.getByPlaceholderText(/title/i);
    const amountInput = screen.getByPlaceholderText(/amount/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(titleInput, "Test");
    await userEvent.type(amountInput, "-5");
    fireEvent.click(addButton);

    const alert = screen.getByText(/amount must be greater than 0/i);
    expect(alert).toBeInTheDocument();
  });

  test("renders expense list correctly", async () => {
    const titleInput = screen.getByPlaceholderText(/title/i);
    const amountInput = screen.getByPlaceholderText(/amount/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(titleInput, "Book");
    await userEvent.type(amountInput, "20");
    fireEvent.click(addButton);

    const listItem = screen.getByText(/book/i);
    expect(listItem).toBeInTheDocument();
  });
});

