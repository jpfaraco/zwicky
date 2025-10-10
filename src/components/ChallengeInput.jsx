import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader2, Sparkles } from 'lucide-react'

export function ChallengeInput({ challenge, setChallenge, onGenerateAttributes, isGenerating }) {
  return (
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
          onClick={onGenerateAttributes}
          disabled={isGenerating || !challenge.trim()}
          className="w-full md:w-auto"
        >
          {isGenerating ? (
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
  )
}
