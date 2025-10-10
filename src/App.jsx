import { useState } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Loader2, Plus, X, Sparkles } from 'lucide-react'
import './App.css'

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

function App() {
  const [challenge, setChallenge] = useState('')
  const [attributes, setAttributes] = useState([])
  const [isGeneratingAttributes, setIsGeneratingAttributes] = useState(false)
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false)
  const [ideas, setIdeas] = useState([])
  const [editingAttribute, setEditingAttribute] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [error, setError] = useState(null)

  // Generate attributes using Claude API
  const generateAttributes = async () => {
    if (!challenge.trim()) {
      setError('Please enter a challenge description')
      return
    }

    if (!ANTHROPIC_API_KEY) {
      setError('API key not configured. Please set VITE_ANTHROPIC_API_KEY in your .env file')
      return
    }

    setIsGeneratingAttributes(true)
    setError(null)

    try {
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
            content: `You are an expert at morphological analysis and creative problem-solving.
Given a challenge, generate 3 to 5 relevant attributes (dimensions) that should be considered when creating solutions.

Requirements:
- Attributes should be distinct and non-overlapping
- Attributes should be broad enough to allow multiple items
- Attributes should be directly relevant to solving the challenge
- Attribute names should be concise (1-3 words)
- Respond in the same language as the challenge
- Return ONLY a JSON array of attribute names

Example for "How might we create a new fitness app?":
["Target Audience", "Core Feature", "Monetization", "Platform", "Engagement Method"]

Challenge: ${challenge}

Generate the attributes as a JSON array:`
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const attributesText = data.content[0].text

      // Parse JSON from response
      const attributeNames = JSON.parse(attributesText)

      // Create attribute objects with empty items
      const newAttributes = attributeNames.map((name, index) => ({
        id: Date.now() + index,
        name,
        items: []
      }))

      setAttributes(newAttributes)
    } catch (err) {
      console.error('Error generating attributes:', err)
      setError(`Failed to generate attributes: ${err.message}`)
    } finally {
      setIsGeneratingAttributes(false)
    }
  }

  // Add new attribute manually
  const addAttribute = () => {
    const newAttribute = {
      id: Date.now(),
      name: 'New Attribute',
      items: []
    }
    setAttributes([...attributes, newAttribute])
    setEditingAttribute(newAttribute.id)
  }

  // Delete attribute
  const deleteAttribute = (id) => {
    setAttributes(attributes.filter(attr => attr.id !== id))
  }

  // Update attribute name
  const updateAttributeName = (id, newName) => {
    setAttributes(attributes.map(attr =>
      attr.id === id ? { ...attr, name: newName } : attr
    ))
  }

  // Add item to attribute
  const addItem = (attributeId) => {
    const newItem = {
      id: Date.now(),
      text: '',
      selected: false
    }
    setAttributes(attributes.map(attr =>
      attr.id === attributeId
        ? { ...attr, items: [...attr.items, newItem] }
        : attr
    ))
    setEditingItem({ attributeId, itemId: newItem.id })
  }

  // Delete item
  const deleteItem = (attributeId, itemId) => {
    setAttributes(attributes.map(attr =>
      attr.id === attributeId
        ? { ...attr, items: attr.items.filter(item => item.id !== itemId) }
        : attr
    ))
  }

  // Update item text
  const updateItemText = (attributeId, itemId, newText) => {
    setAttributes(attributes.map(attr =>
      attr.id === attributeId
        ? {
            ...attr,
            items: attr.items.map(item =>
              item.id === itemId ? { ...item, text: newText } : item
            )
          }
        : attr
    ))
  }

  // Toggle item selection
  const toggleItemSelection = (attributeId, itemId) => {
    setAttributes(attributes.map(attr =>
      attr.id === attributeId
        ? {
            ...attr,
            items: attr.items.map(item =>
              item.id === itemId
                ? { ...item, selected: !item.selected }
                : { ...item, selected: false } // Only one selection per attribute
            )
          }
        : attr
    ))
  }

  // Generate idea using Claude API
  const generateIdea = async () => {
    if (!ANTHROPIC_API_KEY) {
      setError('API key not configured. Please set VITE_ANTHROPIC_API_KEY in your .env file')
      return
    }

    if (!challenge.trim()) {
      setError('Please enter a challenge description')
      return
    }

    setIsGeneratingIdea(true)
    setError(null)

    try {
      // Get selected items or random selection
      let selectedComponents = []
      const attributesWithItems = attributes.filter(attr => attr.items.length > 0)

      // Check if ANY items are selected across all attributes
      const hasAnySelection = attributesWithItems.some(attr =>
        attr.items.some(item => item.selected)
      )

      if (hasAnySelection) {
        // If any items are selected, only use selected items
        attributesWithItems.forEach(attr => {
          const selectedItem = attr.items.find(item => item.selected)
          if (selectedItem) {
            selectedComponents.push({ attribute: attr.name, item: selectedItem.text })
          }
        })
      } else {
        // If no items are selected, pick random from all attributes
        attributesWithItems.forEach(attr => {
          const randomItem = attr.items[Math.floor(Math.random() * attr.items.length)]
          selectedComponents.push({ attribute: attr.name, item: randomItem.text })
        })
      }

      if (selectedComponents.length === 0) {
        setError('Please add some items to the attributes first')
        setIsGeneratingIdea(false)
        return
      }

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
      const ideaText = data.content[0].text

      const newIdea = {
        id: Date.now(),
        text: ideaText,
        components: selectedComponents,
        timestamp: new Date().toLocaleString()
      }

      setIdeas([newIdea, ...ideas])
    } catch (err) {
      console.error('Error generating idea:', err)
      setError(`Failed to generate idea: ${err.message}`)
    } finally {
      setIsGeneratingIdea(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-4 md:py-8">
      <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Zwicky Box Idea Generator</h1>
          <p className="text-muted-foreground">
            Generate innovative ideas using morphological analysis and AI
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setError(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Challenge Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe your challenge... (e.g., 'How might we increase customer engagement?')"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              onClick={generateAttributes}
              disabled={isGeneratingAttributes || !challenge.trim()}
              className="w-full md:w-auto"
            >
              {isGeneratingAttributes ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate attributes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Zwicky Box Section Title */}
        <h2 className="text-2xl font-bold">Zwicky Box</h2>

        {attributes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <Button onClick={addAttribute} variant="outline">
                <Plus className="h-4 w-4" />
                Add attribute
              </Button>
              <p className="text-muted-foreground">
                No attributes yet. Generate attributes from your challenge or add them manually.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto pb-4 px-4 md:px-8 -mx-4 md:-mx-8">
            <div className="flex min-w-max border rounded-lg mx-4 md:mx-8">
                {attributes.map((attribute, index) => (
                  <div
                    key={attribute.id}
                    className={`flex-shrink-0 w-72 px-3 py-4 ${index !== attributes.length - 1 ? 'border-r' : ''}`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 group">
                        {editingAttribute === attribute.id ? (
                          <Input
                            autoFocus
                            value={attribute.name}
                            onChange={(e) => updateAttributeName(attribute.id, e.target.value)}
                            onBlur={() => setEditingAttribute(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') setEditingAttribute(null)
                            }}
                            className="h-8"
                          />
                        ) : (
                          <h3
                            className="font-semibold cursor-pointer hover:text-primary flex-1 text-sm"
                            onClick={() => setEditingAttribute(attribute.id)}
                          >
                            {attribute.name}
                          </h3>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteAttribute(attribute.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {attribute.items.map((item) => (
                          <div
                            key={item.id}
                            className="group"
                          >
                            {editingItem?.attributeId === attribute.id &&
                            editingItem?.itemId === item.id ? (
                              <Input
                                autoFocus
                                value={item.text}
                                onChange={(e) =>
                                  updateItemText(attribute.id, item.id, e.target.value)
                                }
                                onBlur={() => {
                                  setEditingItem(null)
                                  // Delete the item if it's empty
                                  if (!item.text.trim()) {
                                    deleteItem(attribute.id, item.id)
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    setEditingItem(null)
                                    addItem(attribute.id)
                                  }
                                }}
                                className="h-9 text-sm"
                                placeholder="Item name..."
                              />
                            ) : (
                              <Button
                                variant={item.selected ? 'default' : 'outline'}
                                className={`w-full justify-between whitespace-normal text-left h-auto min-h-[36px] py-2 text-sm pr-2 ${item.selected ? 'border border-transparent' : ''}`}
                                onClick={() => toggleItemSelection(attribute.id, item.id)}
                                onDoubleClick={() =>
                                  setEditingItem({ attributeId: attribute.id, itemId: item.id })
                                }
                              >
                                <span className="flex-1">{item.text || 'Empty item'}</span>
                                <button
                                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2 p-1 hover:bg-background/20 rounded"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    deleteItem(attribute.id, item.id)
                                  }}
                                  type="button"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          className="w-full text-sm"
                          onClick={() => addItem(attribute.id)}
                        >
                          <Plus className="h-4 w-4" />
                          Add item
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Attribute Button Column */}
                <div className="flex-shrink-0 w-72 px-3 py-4 flex justify-center border-l">
                  <Button onClick={addAttribute} variant="outline" className="w-full">
                    <Plus className="h-4 w-4" />
                    Add attribute
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Generate Idea Button & Ideas Section */}
      <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-8 py-8">
        {attributes.length > 0 && (
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={generateIdea}
              disabled={isGeneratingIdea}
              className="min-w-[200px]"
            >
              {isGeneratingIdea ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate idea
                </>
              )}
            </Button>
          </div>
        )}

        {/* Idea History Section */}
        {ideas.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Generated Ideas</h2>
            <div className="space-y-4">
              {ideas.map((idea) => (
                <Card key={idea.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">Idea</CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {idea.timestamp}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base leading-relaxed">{idea.text}</p>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-2">Components used:</p>
                    <div className="flex flex-wrap gap-2">
                      {idea.components.map((comp, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-secondary px-2 py-1 rounded"
                        >
                          <strong>{comp.attribute}:</strong> {comp.item}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
