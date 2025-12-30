import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Workout Planner title", () => {
  render(<App />);
  const title = screen.getByRole("heading", { name: /workout planner/i });
  expect(title).toBeInTheDocument();
});
