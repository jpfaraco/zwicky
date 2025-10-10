import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

export function IdeasList({ ideas }) {
  if (ideas.length === 0) return null

  return (
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
  )
}
