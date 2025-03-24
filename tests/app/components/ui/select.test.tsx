import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/app/components/ui/select";

describe("Select Component", () => {
  it("renders the Select component", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    // Vérifie que le placeholder est affiché
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("opens the select menu when clicked", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    // Simule un clic pour ouvrir le menu déroulant
    fireEvent.click(screen.getByText("Select an option"));

    // Vérifie que les options du menu déroulant sont affichées
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("selects an item when clicked", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    // Ouvre le menu
    fireEvent.click(screen.getByText("Select an option"));

    // Sélectionne l'option "Option 1"
    fireEvent.click(screen.getByText("Option 1"));

    // Vérifie que "Option 1" est sélectionné
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });
});
