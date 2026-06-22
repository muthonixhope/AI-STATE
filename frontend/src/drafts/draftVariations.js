// Pure frontend draft variation system.
// Takes the base draft string returned by the API and rewrites it in a different style.
// This makes the Regenerate button produce meaningfully different text each time.

export const VARIATION_LABELS = ["Standard", "Formal", "Brief", "Friendly"];

function applyFormal(text) {
  return text
    .replace(/^Dear ([^,\n]+),\n\n/m, (_, name) =>
      `Dear ${name},\n\nI am writing to formally inform you that `
    )
    .replace(/Best regards,/gi, "Yours sincerely,")
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
  const opener = lines.find((l) => l.startsWith("Dear")) || lines[0];
  const closing = lines
    .filter(
      (l) =>
        l.startsWith("Best") ||
        l.startsWith("Yours") ||
        l.startsWith("Property") ||
        l === "Property Management Team"
    )
    .join("\n");
  const body = lines.filter(
    (l) =>
      !l.startsWith("Dear") &&
      !l.startsWith("Best") &&
      !l.startsWith("Yours") &&
      l !== "Property Management Team" &&
      l !== "Property Manager"
  );
  // Take first meaningful sentence from body
  const mainFact = body[0] || "";
  return `${opener}\n\n${mainFact}\n\n${closing || "Best regards,\nProperty Management Team"}`;
}

function applyFriendly(text) {
  return text
    .replace(/^Dear ([^,\n]+),\n\n/m, (_, name) =>
      `Hi ${name},\n\nHope you're doing well! `
    )
    .replace(/Best regards,/gi, "Warm regards,")
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

export function applyVariation(baseDraft, idx) {
  const i = ((idx % 4) + 4) % 4;
  if (i === 0) return baseDraft;
  if (i === 1) return applyFormal(baseDraft);
  if (i === 2) return applyBrief(baseDraft);
  return applyFriendly(baseDraft);
}
