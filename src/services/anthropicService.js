export async function generateAttributes(challenge) {
  const response = await fetch("/api/anthropic/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `You are an expert at morphological analysis and creative problem-solving.
Given a challenge, generate 3 to 5 relevant attributes (dimensions) that should be considered when creating solutions.

For each attribute, also generate a guiding question that helps people think of items for that attribute.

Requirements:
- Attributes should be distinct and non-overlapping
- Attributes should be broad enough to allow multiple items
- Attributes should be directly relevant to solving the challenge
- Attribute names should be concise (1-3 words)
- Questions should help clarify what types of items fit in each attribute
- Questions should be concise (one sentence, maximum 150 characters)
- Respond in the same language as the challenge
- Return ONLY a JSON array of objects with "name" and "question" fields

Example for "How might we increase customer engagement?":
[
  {"name": "Target Audience", "question": "For which specific customer segment are we designing this solution?"},
  {"name": "Core Feature", "question": "Which product, tool, or functionality will serve as the basis for engagement?"},
  {"name": "Communication Channel", "question": "Through which channel will we communicate or deliver this solution?"},
  {"name": "Incentive", "question": "What rewards or benefits will motivate customers to engage?"}
]

Challenge: ${challenge}

Generate the attributes with questions as a JSON array:`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const attributesText = data.content[0].text;
  const attributesData = JSON.parse(attributesText);

  return attributesData.map((attr, index) => ({
    id: Date.now() + index,
    name: attr.name,
    question: attr.question,
    items: [],
  }));
}

export async function generateIdea(challenge, selectedComponents) {
  const componentsText = selectedComponents.map((comp) => `${comp.attribute}: ${comp.item}`).join("\n");

  const response = await fetch("/api/anthropic/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `You are a senior growth & innovation strategist. Generate ONE practical idea by combining ALL selected items from a morphological matrix.

Rules:
- Use ALL selected components. If any item creates an ethical/legal/operational conflict, adapt the execution while preserving the item's intent and state the adjustment.
- Focus on a real end-user problem and the clear value delivered.
- Avoid absolute promises, fabricated testimonials, and unverifiable claims. Use plain language.
- The idea must be testable within 7–14 days with plausible resources.

Input:
Challenge: ${challenge}
Selected components: ${componentsText}

Output (in the same language as the input, and output ONLY the content in the format below):

**Title** (in sentence case, not title case)

[2–4 sentences describing what will be done, for whom, and why it should work. Include the main mechanism that connects the selected components.]
`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

export async function generateIdeaDetails(challenge, selectedComponents, ideaSummary) {
  const componentsText = selectedComponents.map((comp) => `${comp.attribute}: ${comp.item}`).join("\n");

  const response = await fetch("/api/anthropic/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      messages: [
        {
          role: "user",
          content: `You are a senior growth & innovation strategist. You previously generated this idea summary:

${ideaSummary}

Now generate the detailed execution plan for this idea.

Challenge: ${challenge}
Selected components: ${componentsText}

Output (in the same language as the input, and output ONLY the content in the format below. Use sentence case for all headings, not title case):

**How to execute:**
1) …
2) …
3) …
4) …
5) …

**Quick test:**
- **Hypothesis:**
- **7–14 day experiment:**
- **Primary success metric:**
- **Initial target:**

**Risks & compliance:**
- **Risk:**
- **Mitigation:**

**Required resources:**
- [People, tools, rough budget]
`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

export async function generateIdeaVariation(challenge, originalIdea) {
  const response = await fetch("/api/anthropic/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 350,
      messages: [
        {
          role: "user",
          content: `You are a senior innovation strategist. Given the challenge and an existing idea, generate a DIFFERENT variation that addresses the same challenge in a more plausible, realistic, and practical way.

Challenge: ${challenge}

Reference idea (for inspiration only):
${originalIdea}

Your task:
- Internally analyze what could be improved or done differently
- Generate a standalone idea that addresses the challenge better
- Focus on practicality, feasibility, and clear value proposition
- The new idea should be more grounded and actionable
- Do NOT reference or mention the original idea in your output
- Do NOT explain what was wrong with the original idea
- Present the new idea as if it's a completely fresh solution
- Avoid absolute promises, fabricated testimonials, and unverifiable claims

Output (in the same language as the input, and output ONLY the content in the format below):

**Title** (in sentence case, not title case)

[2–4 sentences describing what will be done, for whom, and why it should work. Focus on the value and mechanism of THIS idea only.]
`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}
