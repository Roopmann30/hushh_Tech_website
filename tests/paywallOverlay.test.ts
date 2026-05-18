// @vitest-environment jsdom

import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PaywallOverlay } from "../src/components/PaywallOverlay";

describe("PaywallOverlay error handling", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    vi.clearAllMocks();
  });

  it("resets loading state if onPayment throws an error", async () => {
    const onPayment = vi.fn().mockRejectedValue(new Error("Payment failed"));

    await act(async () => {
      root.render(
        React.createElement(
          ChakraProvider,
          null,
          React.createElement(PaywallOverlay, {
            profileName: "Test User",
            slug: "test-user",
            onPayment,
          }),
        ),
      );
    });

    const paymentButton = Array.from(document.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Unlock Now with Stripe"),
    ) as HTMLButtonElement | null;

    expect(paymentButton).not.toBeNull();

    await act(async () => {
      paymentButton?.click();
    });

    expect(onPayment).toHaveBeenCalledTimes(1);
    expect(paymentButton?.getAttribute("data-loading")).toBeNull();
  });
});
