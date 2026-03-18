import type { Character, ExportData } from '../types'

export function exportCharacters(characters: Character[]): void {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    characters,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dnd-pocket-spell-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function parseImportFile(json: unknown): ExportData {
  if (typeof json !== 'object' || json === null) {
    throw new Error('Invalid file format')
  }
  const data = json as Record<string, unknown>
  if (data.version !== 1) {
    throw new Error('Unsupported backup version')
  }
  if (!Array.isArray(data.characters)) {
    throw new Error('Missing character data')
  }
  return data as unknown as ExportData
}

export function readJsonFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target?.result as string))
      } catch {
        reject(new Error('File is not valid JSON'))
      }
    }
    reader.onerror = () => reject(new Error('Error reading file'))
    reader.readAsText(file)
  })
}
