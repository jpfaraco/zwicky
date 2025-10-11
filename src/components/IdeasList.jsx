import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { ChevronDown, Loader2, Sparkles } from 'lucide-react'

export function IdeasList({ ideas, onExpandIdea, onGenerateVariation, generatingVariationId }) {
  const [newIdeaIds, setNewIdeaIds] = useState(new Set())
  const [expandingIds, setExpandingIds] = useState(new Set())
  const prevIdeasRef = useRef(ideas)

  useEffect(() => {
    const prevIdeas = prevIdeasRef.current

    // Check if a new idea was added
    if (ideas.length > prevIdeas.length) {
      const newIdea = ideas.find(idea => !prevIdeas.some(prev => prev.id === idea.id))
      if (newIdea) {
        setNewIdeaIds(prev => new Set(prev).add(newIdea.id))
        setTimeout(() => {
          setNewIdeaIds(prev => {
            const next = new Set(prev)
            next.delete(newIdea.id)
            return next
          })
        }, 2000)
      }
    }

    // Check if an idea just got expandedContent added
    ideas.forEach(idea => {
      const prevIdea = prevIdeas.find(p => p.id === idea.id)
      if (prevIdea &&
          prevIdea.expanded === 'loading' &&
          idea.expanded === true &&
          idea.expandedContent &&
          !prevIdea.expandedContent) {
        setExpandingIds(prev => new Set(prev).add(idea.id))
        setTimeout(() => {
          setExpandingIds(prev => {
            const next = new Set(prev)
            next.delete(idea.id)
            return next
          })
        }, 500)
      }
    })

    prevIdeasRef.current = ideas
  }, [ideas])

  if (ideas.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Generated Ideas</h2>
      <div className="space-y-4">
        {ideas.map((idea) => {
          const isNewIdea = newIdeaIds.has(idea.id)
          const isExpanding = expandingIds.has(idea.id)

          return (
            <div
              key={idea.id}
              className={isNewIdea ? 'animate-slideDown overflow-hidden' : ''}
            >
              <Card>
              <CardHeader>
                <div className="flex gap-1 flex-col">
                  <span className="text-xs text-muted-foreground">
                    {idea.timestamp}
                  </span>
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="idea-content text-md text-foreground">
                  <ReactMarkdown>{idea.text}</ReactMarkdown>
                </div>

                <div
                  className={`idea-content text-md text-foreground overflow-hidden ${
                    isExpanding ? 'transition-[max-height,padding,border] duration-500 ease-in-out' : ''
                  } ${
                    idea.expanded === true && idea.expandedContent
                      ? 'max-h-[2000px] pt-3 border-t'
                      : 'max-h-0 pt-0 border-0'
                  }`}
                >
                  {idea.expandedContent && <ReactMarkdown>{idea.expandedContent}</ReactMarkdown>}
                </div>

              <div className="flex gap-2 pt-2">
                {!idea.expanded && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExpandIdea(idea.id)}
                  >
                    <ChevronDown className="h-4 w-4" />
                    Expand
                  </Button>
                )}

                {idea.expanded === 'loading' && (
                  <Button variant="outline" size="sm" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Expanding...
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onGenerateVariation(idea.id)}
                  disabled={generatingVariationId === idea.id}
                >
                  {generatingVariationId === idea.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate variation
                    </>
                  )}
                </Button>
              </div>

              {idea.components && idea.components.length > 0 && (
                <div className="pt-4 border-t">
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
              )}
            </CardContent>
          </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
