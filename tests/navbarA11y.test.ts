// @vitest-environment jsdom

import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";

import Navbar from "../src/components/Navbar";

vi.mock("../src/auth/AuthSessionProvider", () => ({
  useAuthSession: () => ({
    status: "unauthenticated",
    session: null,
    user: null,
    signOut: vi.fn(),
  }),
}));

vi.mock("../src/hooks/useStockQuotes", () => ({
  useStockQuotes: () => ({
    quotes: [
      {
        symbol: "AAPL",
        displaySymbol: "AAPL",
        percentChange: 1.2,
        isUp: true,
        logo: "https://example.com/aapl.png",
      },
    ],
    loading: false,
    lastUpdated: new Date(),
  }),
  STOCK_LOGOS: {},
}));

describe("Navbar accessibility", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    // Mock matchMedia for Chakra UI
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    vi.clearAllMocks();
  });

  it("uses semantic links for desktop navigation", async () => {
    await act(async () => {
      root.render(
        React.createElement(
          ChakraProvider,
          null,
          React.createElement(
            MemoryRouter,
            null,
            React.createElement(Navbar)
          )
        )
      );
    });

    const navLinks = Array.from(container.querySelectorAll("nav a"));
    expect(navLinks.length).toBeGreaterThan(0);
    expect(navLinks[0].getAttribute("href")).toBe("/");
  });

  it("provides ARIA labels for stock ticker chips", async () => {
    await act(async () => {
      root.render(
        React.createElement(
          ChakraProvider,
          null,
          React.createElement(
            MemoryRouter,
            null,
            React.createElement(Navbar)
          )
        )
      );
    });

    const tickerChip = container.querySelector('[aria-label*="AAPL: Up"]');
    expect(tickerChip).not.toBeNull();
  });
});
