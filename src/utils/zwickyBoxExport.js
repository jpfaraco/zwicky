export function exportZwickyBox(challenge, attributes) {
  const data = {
    challenge,
    attributes: attributes.map(attr => ({
      name: attr.name,
      question: attr.question || '',
      items: attr.items.map(item => ({
        text: item.text
      }))
    })),
    exportedAt: new Date().toISOString(),
    version: '1.0'
  }

  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `zwicky-box-${Date.now()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function importZwickyBox(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result)

        // Validate structure
        if (!json.challenge || !Array.isArray(json.attributes)) {
          throw new Error('Invalid Zwicky Box format: missing required fields')
        }

        // Transform imported data to match app state format
        const attributes = json.attributes.map((attr, index) => ({
          id: Date.now() + index,
          name: attr.name,
          question: attr.question || '',
          items: (attr.items || []).map((item, itemIndex) => ({
            id: Date.now() + index * 1000 + itemIndex,
            text: item.text || '',
            selected: false
          }))
        }))

        resolve({
          challenge: json.challenge,
          attributes
        })
      } catch (error) {
        reject(new Error(`Failed to import: ${error.message}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}
