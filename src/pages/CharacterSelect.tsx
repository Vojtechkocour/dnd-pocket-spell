import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { CharacterCard } from '../components/character/CharacterCard'
import { CharacterForm } from '../components/character/CharacterForm'
import { Button } from '../components/ui/Button'

export function CharacterSelect() {
  const characters = useAppStore((s) => s.characters)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-arcane-950 text-parchment-100">
      <header className="bg-arcane-900 border-b border-arcane-800 px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-gold-400">D&D Pocket Spell</h1>
        <Button onClick={() => setShowForm(true)} size="sm">
          + New Character
        </Button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {characters.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔮</div>
            <h2 className="font-display text-2xl text-parchment-200 mb-2">
              No Characters
            </h2>
            <p className="text-parchment-200/60 mb-8">
              Create your first spellcasting character and start managing your spells.
            </p>
            <Button onClick={() => setShowForm(true)} size="lg">
              Create First Character
            </Button>
          </div>
        ) : (
          <>
            <h2 className="font-display text-xl text-parchment-200 mb-6">
              Your Characters ({characters.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          </>
        )}
      </main>

      <CharacterForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  )
}
