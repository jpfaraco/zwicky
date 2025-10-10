export async function generateAttributes(challenge) {
  const response = await fetch('/api/anthropic/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
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

Generate the attributes with questions as a JSON array:`
      }]
    })
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  const attributesText = data.content[0].text
  const attributesData = JSON.parse(attributesText)

  return attributesData.map((attr, index) => ({
    id: Date.now() + index,
    name: attr.name,
    question: attr.question,
    items: []
  }))
}

export async function generateIdea(challenge, selectedComponents) {
  const componentsText = selectedComponents
    .map(comp => `${comp.attribute}: ${comp.item}`)
    .join('\n')

  const response = await fetch('/api/anthropic/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are a creative innovation expert. Generate a single, specific, actionable idea that solves the given challenge by combining the selected attribute items.

Requirements:
- The idea MUST incorporate ALL provided attribute items
- The idea MUST address the original challenge
- The idea should be specific, not generic
- The idea should be feasible and realistic
- The idea should be described in 1-2 sentences, maximum 350 characters
- Be creative and think outside the box
- Respond in the same language as the challenge and attribute items
- Return ONLY the idea text, no additional formatting

Challenge: ${challenge}

Selected Components:
${componentsText}

Generate an innovative idea:`
      }]
    })
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  return data.content[0].text
}
