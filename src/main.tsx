import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { useAppStore } from './store/useAppStore'
import spellsData from './assets/data/spells.json'
import type { Spell } from './types'

// Load static spell data into store before render
useAppStore.getState().setSpells(spellsData as Spell[])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
