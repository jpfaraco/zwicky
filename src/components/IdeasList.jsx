import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { ChevronDown, Loader2, Sparkles } from 'lucide-react'

export function IdeasList({ ideas, onExpandIdea, onGenerateVariation, generatingVariationId }) {
  const [animatingId, setAnimatingId] = useState(null)
  const prevIdeasLengthRef = useRef(ideas.length)

  useEffect(() => {
    // Check if a new idea was added (list length increased)
    if (ideas.length > prevIdeasLengthRef.current) {
      // Animate the newest idea (first in the list)
      setAnimatingId(ideas[0].id)

      // Clear the animation state after animation completes
      const timer = setTimeout(() => {
        setAnimatingId(null)
      }, 2000)

      return () => clearTimeout(timer)
    }
    prevIdeasLengthRef.current = ideas.length
  }, [ideas])

  if (ideas.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Generated Ideas</h2>
      <div className="space-y-4">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className={`${
              animatingId === idea.id
                ? 'animate-slideDown overflow-hidden'
                : ''
            }`}
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

              {idea.expanded === true && idea.expandedContent && (
                <div className="idea-content text-md text-foreground pt-3 border-t">
                  <ReactMarkdown>{idea.expandedContent}</ReactMarkdown>
                </div>
              )}

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
        ))}
      </div>
    </div>
  )
}
