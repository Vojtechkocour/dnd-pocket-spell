import { createBrowserRouter } from 'react-router-dom'
import { CharacterSelect } from '../pages/CharacterSelect'
import { CharacterDashboard } from '../pages/CharacterDashboard'
import { SpellLibrary } from '../pages/SpellLibrary'
import { SpellDetail } from '../pages/SpellDetail'

export const router = createBrowserRouter([
  { path: '/', element: <CharacterSelect /> },
  { path: '/dashboard', element: <CharacterDashboard /> },
  { path: '/library', element: <SpellLibrary /> },
  { path: '/spells/:id', element: <SpellDetail /> },
])
