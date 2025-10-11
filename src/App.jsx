import { useState, useRef } from 'react'
import { Button } from './components/ui/button'
import { Loader2, Sparkles, X, Download, Upload } from 'lucide-react'
import { ChallengeInput } from './components/ChallengeInput'
import { ZwickyBox } from './components/ZwickyBox'
import { IdeasList } from './components/IdeasList'
import { generateAttributes as generateAttributesAPI, generateIdea as generateIdeaAPI, generateIdeaDetails as generateIdeaDetailsAPI, generateIdeaVariation as generateIdeaVariationAPI } from './services/anthropicService'
import { exportZwickyBox, importZwickyBox } from './utils/zwickyBoxExport'
import './App.css'

function App() {
  const [challenge, setChallenge] = useState('')
  const [attributes, setAttributes] = useState([])
  const [isGeneratingAttributes, setIsGeneratingAttributes] = useState(false)
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false)
  const [generatingVariationId, setGeneratingVariationId] = useState(null)
  const [ideas, setIdeas] = useState([])
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

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

  const handleExport = () => {
    if (!challenge.trim() && attributes.length === 0) {
      setError('Nothing to export. Please add a challenge or attributes first.')
      return
    }
    exportZwickyBox(challenge, attributes)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    try {
      const data = await importZwickyBox(file)
      setChallenge(data.challenge)
      setAttributes(data.attributes)
      setIdeas([]) // Clear ideas when importing
    } catch (err) {
      console.error('Import error:', err)
      setError(err.message)
    }

    // Reset file input
    event.target.value = ''
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

      // Extract title from the idea text (first line with ** markers)
      const titleMatch = ideaText.match(/\*\*(.+?)\*\*/)
      const title = titleMatch ? titleMatch[1] : 'Idea'

      // Remove the title from the text to avoid duplication
      const textWithoutTitle = ideaText.replace(/^\*\*.+?\*\*\s*\n*/m, '').trim()

      const newIdea = {
        id: Date.now(),
        title: title,
        text: textWithoutTitle,
        components: selectedComponents,
        timestamp: new Date().toLocaleString(),
        expanded: false,
        expandedContent: null
      }

      setIdeas([newIdea, ...ideas])
    } catch (err) {
      console.error('Error generating idea:', err)
      setError(`Failed to generate idea: ${err.message}`)
    } finally {
      setIsGeneratingIdea(false)
    }
  }

  const handleExpandIdea = async (ideaId) => {
    const idea = ideas.find(i => i.id === ideaId)
    if (!idea || idea.expanded) return

    setError(null)

    try {
      // Update the idea to show it's being expanded
      setIdeas(ideas.map(i => i.id === ideaId ? { ...i, expanded: 'loading' } : i))

      const fullIdeaText = `**${idea.title}**\n\n${idea.text}`
      const detailsText = await generateIdeaDetailsAPI(challenge, idea.components, fullIdeaText)

      // Update the idea with the expanded content
      setIdeas(ideas.map(i =>
        i.id === ideaId
          ? { ...i, expanded: true, expandedContent: detailsText }
          : i
      ))
    } catch (err) {
      console.error('Error expanding idea:', err)
      setError(`Failed to expand idea: ${err.message}`)
      // Revert the expanded state on error
      setIdeas(ideas.map(i => i.id === ideaId ? { ...i, expanded: false } : i))
    }
  }

  const handleGenerateVariation = async (ideaId) => {
    const idea = ideas.find(i => i.id === ideaId)
    if (!idea) return

    setGeneratingVariationId(ideaId)
    setError(null)

    try {
      const fullIdeaText = `**${idea.title}**\n\n${idea.text}`
      const variationText = await generateIdeaVariationAPI(challenge, fullIdeaText)

      // Extract title from the variation text
      const titleMatch = variationText.match(/\*\*(.+?)\*\*/)
      const title = titleMatch ? titleMatch[1] : 'Idea Variation'

      // Remove the title from the text to avoid duplication
      const textWithoutTitle = variationText.replace(/^\*\*.+?\*\*\s*\n*/m, '').trim()

      const newVariation = {
        id: Date.now(),
        title: title,
        text: textWithoutTitle,
        components: [], // Variations don't necessarily use the same components
        timestamp: new Date().toLocaleString(),
        expanded: false,
        expandedContent: null
      }

      // Add the variation at the top of the list
      setIdeas([newVariation, ...ideas])
    } catch (err) {
      console.error('Error generating variation:', err)
      setError(`Failed to generate variation: ${err.message}`)
    } finally {
      setGeneratingVariationId(null)
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Zwicky Box</h2>
          <div className="flex gap-2">
            <Button onClick={handleImportClick} variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Import
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              disabled={!challenge.trim() && attributes.length === 0}
            >
              <Upload className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportFile}
          className="hidden"
        />
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

        <IdeasList ideas={ideas} onExpandIdea={handleExpandIdea} onGenerateVariation={handleGenerateVariation} generatingVariationId={generatingVariationId} />
      </div>
    </div>
  )
}

export default App
