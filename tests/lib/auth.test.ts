// __tests__/authOptions.test.ts
import { describe, it, expect, beforeEach, afterEach, vi,Mock } from "vitest";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { authOptions } from "../../src/lib/auth"; // Ajustez le chemin d'importation
import CredentialsProvider from "next-auth/providers/credentials";

// On va mocker Prisma et bcrypt via Vitest :
vi.mock("@prisma/client", () => {
  const mockFindFirst = vi.fn();
  return {
    PrismaClient: vi.fn().mockImplementation(() => ({
      utilisateur: {
        findFirst: mockFindFirst,
      },
    })),
  };
});

vi.mock("bcrypt", () => ({
  compare: vi.fn(),
}));

describe("authOptions - CredentialsProvider authorize()", () => {
  const prisma = new PrismaClient() as unknown as {
    utilisateur: { findFirst: ReturnType<typeof vi.fn> };
  };

  // Récupération du provider "credentials"
  const credentialsProvider = authOptions.providers?.find(
    (provider) => provider.id === "credentials"
  ) as ReturnType<typeof CredentialsProvider>;

  // Simplifie l’appel direct à la fonction authorize
  const authorizeFn = credentialsProvider?.authorize as (
    credentials: Record<"email" | "password", string> | undefined
  ) => Promise<any>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retourne null si credentials est undefined", async () => {
    const result = await authorizeFn(undefined);
    expect(result).toBeNull();
  });

  it("retourne null si email ou password sont vides", async () => {
    const result1 = await authorizeFn({ email: "", password: "123" });
    const result2 = await authorizeFn({ email: "test@example.com", password: "" });

    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });

  it("retourne null si l'utilisateur est introuvable", async () => {
    // On configure le mock de findFirst pour renvoyer null
    prisma.utilisateur.findFirst.mockResolvedValueOnce(null);

    const result = await authorizeFn({
      email: "inexistant@example.com",
      password: "123456",
    });

    expect(prisma.utilisateur.findFirst).toHaveBeenCalledWith({
      where: { email: "inexistant@example.com" },
      include: {
        affectations: { include: { role: true } },
      },
    });
    expect(result).toBeNull();
  });

  it("retourne null si le mot de passe est incorrect", async () => {
    // L'utilisateur existe
    prisma.utilisateur.findFirst.mockResolvedValueOnce({
      id_utilisateur: 42,
      email: "test@example.com",
      nom: "Doe",
      prenom: "John",
      motDePasse: "hashed-password",
      affectations: [
        {
          role: {
            nomRole: "USER",
          },
        },
      ],
    });

    // bcrypt.compare renvoie false
    (bcrypt.compare as Mock).mockResolvedValue(false);

    const result = await authorizeFn({
      email: "test@example.com",
      password: "mauvais-password",
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "mauvais-password",
      "hashed-password"
    );
    expect(result).toBeNull();
  });

  it("retourne l'objet User si tout est correct", async () => {
    prisma.utilisateur.findFirst.mockResolvedValueOnce({
      id_utilisateur: 42,
      email: "test@example.com",
      nom: "Doe",
      prenom: "John",
      motDePasse: "hashed-password",
      affectations: [
        {
          role: {
            nomRole: "ADMIN",
          },
        },
        {
          role: {
            nomRole: "USER",
          },
        },
      ],
    });

    // bcrypt.compare renvoie true
    (bcrypt.compare as Mock).mockResolvedValue(true);

    const result = await authorizeFn({
      email: "test@example.com",
      password: "bon-password",
    });

    expect(bcrypt.compare).toHaveBeenCalledWith("bon-password", "hashed-password");
    expect(result).toEqual({
      id: 42,
      id_utilisateur: 42,
      email: "test@example.com",
      nom: "Doe",
      prenom: "John",
      role: ["ADMIN", "USER"],
    });
  });
});
