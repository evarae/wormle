import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import App from "./App";

const fakeGameData = {
  date: "1969-06-20",
  game: {
    words: [
      {
        offset: 1,
        text: "dragon",
      },
      {
        offset: 0,
        text: "pegasus",
      },
      {
        offset: 0,
        text: "kraken",
      },
    ],
    pathString: "pkregakenusnogsaard",
    startCoordinates: {
      x: 0,
      y: 1,
    },
    theme: "The Monster Manual",
  },
};

const server = setupServer(
  http.get("/data/game.json", () => {
    return HttpResponse.json(fakeGameData);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders game title", () => {
  render(<App />);
  const textElement = screen.getByText("WORMLE");
  expect(textElement).toBeInTheDocument();
});

test("Displays game grid", async () => {
  render(<App />);

  //Displays modal
  const modal = await screen.findByRole("presentation");
  expect(modal).toBeInTheDocument();

  //Closes modal
  fireEvent.keyDown(modal, { key: "Escape", code: "Escape" });
  expect(modal).not.toBeInTheDocument();

  //Displays word rows
  const wordRows = await screen.findAllByRole("row");
  expect(wordRows.length).toBe(fakeGameData.game.words.length);

  //Displays grid buttons
  const gridButtons = await screen.findAllByRole("button", {
    name: /coordinate \d+, \d+, guess (?:[A-Za-z]+|none)/i,
  });

  //Sets the first letter
  const startButton = await screen.findByRole("button", {
    name: /coordinate 1, 2, guess p/i,
  });

  expect(startButton).toBeInTheDocument();
  expect(startButton).toHaveTextContent("p");

  expect(gridButtons.length).toBe(fakeGameData.game.pathString.length);
});

test("Displays reset tiles button", async () => {
  render(<App />);
  const resetButton = await screen.findByText("Reset tiles");
  expect(resetButton).toBeInTheDocument();
});
