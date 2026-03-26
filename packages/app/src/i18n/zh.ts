import { dict as en } from "./en"

type Keys = keyof typeof en

export const dict = {
  "language.zh": "Chinese (Simplified)",
  "terminal.title": "Terminal",
  "terminal.title.numbered": "Terminal {{number}}",
  "error.dev.rootNotFound": "Root element not found. Did you forget to add it to your index.html?",
} satisfies Partial<Record<Keys, string>>
