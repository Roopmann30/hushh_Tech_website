// @vitest-environment jsdom

import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import LocationPermissionModal from "../src/components/LocationPermissionModal";

describe("LocationPermissionModal", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    // Mock innerWidth and documentElement.clientWidth for scrollbar calculation
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    Object.defineProperty(document.documentElement, 'clientWidth', { writable: true, configurable: true, value: 1024 });
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    vi.clearAllMocks();
  });

  async function renderModal(props: React.ComponentProps<typeof LocationPermissionModal>) {
    await act(async () => {
      root.render(React.createElement(LocationPermissionModal, props));
    });
  }

  it("calls onSkip when backdrop is clicked and not detecting", async () => {
    const onSkip = vi.fn();
    await renderModal({
      isOpen: true,
      onRequestLocation: vi.fn(),
      onSkip,
      isDetecting: false,
    });

    const backdrop = container.querySelector('[role="dialog"]');
    expect(backdrop).not.toBeNull();
    
    await act(async () => {
      backdrop?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it("does not call onSkip when backdrop is clicked while detecting", async () => {
    const onSkip = vi.fn();
    await renderModal({
      isOpen: true,
      onRequestLocation: vi.fn(),
      onSkip,
      isDetecting: true,
    });

    const backdrop = container.querySelector('[role="dialog"]');
    await act(async () => {
      backdrop?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onSkip).not.toHaveBeenCalled();
  });

  it("calls onSkip when manual selection button is clicked and not detecting", async () => {
    const onSkip = vi.fn();
    await renderModal({
      isOpen: true,
      onRequestLocation: vi.fn(),
      onSkip,
      isDetecting: false,
    });

    const skipButton = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("Select Manually")
    );
    expect(skipButton).not.toBeNull();

    await act(async () => {
      skipButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it("does not call onSkip when Escape is pressed while detecting", async () => {
    const onSkip = vi.fn();
    await renderModal({
      isOpen: true,
      onRequestLocation: vi.fn(),
      onSkip,
      isDetecting: true,
    });

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(onSkip).not.toHaveBeenCalled();
  });

  it("calls onSkip when Escape is pressed and not detecting", async () => {
    const onSkip = vi.fn();
    await renderModal({
      isOpen: true,
      onRequestLocation: vi.fn(),
      onSkip,
      isDetecting: false,
    });

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(onSkip).toHaveBeenCalledTimes(1);
  });
});
