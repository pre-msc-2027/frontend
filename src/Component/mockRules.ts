import type { Rule } from "./types";

export const mockRules: Rule[] = [
  {
    rule_id: "R-CASING-001",
    name: "Casing des identifiants",
    description:
      "Impose un style de casse cohérent pour les variables, fonctions et classes.",
    tags: ["style", "conventions", "readability"],
    parameters: [
      {
        type: "enum",
        name: "target_casing",
        default: "snake_case",
        description: "Style de casse attendu pour les identifiants ciblés.",
        options: {
          allowed: ["snake_case", "camelCase", "PascalCase", "kebab-case"],
        },
      },
      {
        type: "enum",
        name: "targets",
        default: ["variables", "functions"],
        description: "Catégories d’éléments concernés par la règle.",
        options: {
          allowed: ["variables", "functions", "classes", "constants"],
          multiple: true,
        },
      },
      {
        type: "boolean",
        name: "ignore_test_files",
        default: true,
        description:
          "Ignore les fichiers de test (ex: *_test.*, test_*).",
        options: {},
      },
      {
        type: "regex",
        name: "exclude_paths",
        default: ["^vendor/", "^build/"],
        description: "Chemins à exclure via expressions régulières.",
        options: {
          examples: ["^dist/", "^third_party/"],
        },
      },
    ],
  },
  {
    rule_id: "R-SEVERITY-LEVEL",
    name: "Seuil de sévérité",
    description: "Filtre les findings selon un minimum de sévérité.",
    tags: ["filter", "severity"],
    parameters: [
      {
        type: "enum",
        name: "severity_minimum",
        default: "medium",
        description: "Niveau de sévérité minimum retenu.",
        options: {
          allowed: ["low", "medium", "high", "critical"],
        },
      },
    ],
  },
  {
    rule_id: "R-IGNORE-PATHS",
    name: "Ignorer des chemins",
    description: "Permet d’exclure des répertoires/fichiers via regex.",
    tags: ["filter", "paths"],
    parameters: [
      {
        type: "regex",
        name: "patterns",
        default: ["^node_modules/", "^.git/"],
        description: "Expressions régulières à ignorer.",
        options: {
          examples: ["^dist/", "^coverage/"],
        },
      },
    ],
  },
];

