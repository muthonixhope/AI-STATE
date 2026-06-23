// Pure frontend draft tone variations. These operate on the draft BODY only —
// the signature is appended separately by the caller so it stays identical
// across every regenerate (Standard / Formal / Brief / Friendly).

export const VARIATION_LABELS = ["Standard", "Formal", "Brief", "Friendly"];

function applyFormal(text) {
  return text
    .replace(/^Dear ([^,\n]+),\n\n/m, (_, name) =>
      `Dear ${name},\n\nI am writing to formally confirm that `
    )
    .replace(/Thanks for/gi, "Thank you for")
    .replace(/please let us know if you have any further questions\./gi,
      "Should you require any further clarification, please do not hesitate to contact our office."
    )
    .replace(/We will keep you updated/gi, "We shall ensure you are kept fully informed")
    .replace(/we will/gi, "we shall")
    .replace(/can't/gi, "cannot")
    .replace(/won't/gi, "will not")
    .replace(/get back to you/gi, "revert to you with a comprehensive response");
}

function applyBrief(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const opener = lines.find((l) => l.startsWith("Dear") || l.startsWith("Hi")) || lines[0];
  const body = lines.filter((l) => l !== opener);
  const mainFact = body[0] || "";
  return `${opener}\n\n${mainFact}`;
}

function applyFriendly(text) {
  return text
    .replace(/^Dear ([^,\n]+),\n\n/m, (_, name) =>
      `Hi ${name},\n\nHope you're doing well! `
    )
    .replace(/Thank you for reaching out\./gi, "Thanks so much for getting in touch!")
    .replace(/Thank you for your message\./gi, "Thanks for your message — happy to help!")
    .replace(/Thank you for contacting us/gi, "Thanks for reaching out to us")
    .replace(
      /Please let us know if you have any further questions\./gi,
      "Feel free to reach out anytime if you have more questions — we're always happy to help! 😊"
    )
    .replace(/We will/gi, "We'll")
    .replace(/we will/gi, "we'll");
}

export function applyVariation(baseBody, idx) {
  const i = ((idx % 4) + 4) % 4;
  if (i === 0) return baseBody;
  if (i === 1) return applyFormal(baseBody);
  if (i === 2) return applyBrief(baseBody);
  return applyFriendly(baseBody);
}
