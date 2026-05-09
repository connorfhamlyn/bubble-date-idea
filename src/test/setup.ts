import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { store } from "@/lib/mock";

beforeEach(() => {
  store.reset();
});

afterEach(() => {
  cleanup();
});
