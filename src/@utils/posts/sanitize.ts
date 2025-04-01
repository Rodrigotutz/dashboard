import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

export function sanitizeHTML(dirty: string): string {
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "em",
      "strong",
      "a",
      "p",
      "br",
      "img",
      "h1",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
    ],
    ALLOWED_ATTR: ["href", "target", "src", "alt", "style", "class"],
    ALLOW_DATA_ATTR: true,
  });
}
