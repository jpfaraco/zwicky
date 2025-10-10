import { useState } from 'react'
import { Button } from './components/ui/button'
import { Loader2, Sparkles, X } from 'lucide-react'
import { ChallengeInput } from './components/ChallengeInput'
import { ZwickyBox } from './components/ZwickyBox'
import { IdeasList } from './components/IdeasList'
import { generateAttributes as generateAttributesAPI, generateIdea as generateIdeaAPI } from './services/anthropicService'
import './App.css'

function App() {
  const [challenge, setChallenge] = useState('')
  const [attributes, setAttributes] = useState([])
  const [isGeneratingAttributes, setIsGeneratingAttributes] = useState(false)
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false)
  const [ideas, setIdeas] = useState([])
  const [error, setError] = useState(null)

  const handleGenerateAttributes = async () => {
    if (!challenge.trim()) {
      setError('Please enter a challenge description')
      return
    }

    setIsGeneratingAttributes(true)
    setError(null)

    try {
      const newAttributes = await generateAttributesAPI(challenge)
      setAttributes(newAttributes)
    } catch (err) {
      console.error('Error generating attributes:', err)
      setError(`Failed to generate attributes: ${err.message}`)
    } finally {
      setIsGeneratingAttributes(false)
    }
  }

  const handleGenerateIdea = async () => {
    if (!challenge.trim()) {
      setError('Please enter a challenge description')
      return
    }

    setIsGeneratingIdea(true)
    setError(null)

    try {
      let selectedComponents = []
      const attributesWithItems = attributes.filter(attr => attr.items.length > 0)

      const hasAnySelection = attributesWithItems.some(attr =>
        attr.items.some(item => item.selected)
      )

      if (hasAnySelection) {
        attributesWithItems.forEach(attr => {
          const selectedItem = attr.items.find(item => item.selected)
          if (selectedItem) {
            selectedComponents.push({ attribute: attr.name, item: selectedItem.text })
          }
        })
      } else {
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

      const ideaText = await generateIdeaAPI(challenge, selectedComponents)

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
        <ChallengeInput
          challenge={challenge}
          setChallenge={setChallenge}
          onGenerateAttributes={handleGenerateAttributes}
          isGenerating={isGeneratingAttributes}
        />

        {/* Zwicky Box Section Title */}
        <h2 className="text-2xl font-bold">Zwicky Box</h2>
      </div>

      {/* Zwicky Box Grid - Full Width */}
      <div className="mt-4">
        <ZwickyBox attributes={attributes} setAttributes={setAttributes} />
      </div>

      {/* Generate Idea Button & Ideas Section */}
      <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-8 py-8">
        {attributes.length > 0 && (
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleGenerateIdea}
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

        <IdeasList ideas={ideas} />
      </div>
    </div>
  )
}

export default App
