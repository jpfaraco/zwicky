import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { Plus, X } from 'lucide-react'

export function ZwickyBox({ attributes, setAttributes }) {
  const [editingAttribute, setEditingAttribute] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  const addAttribute = () => {
    const newAttribute = {
      id: Date.now(),
      name: 'New Attribute',
      items: []
    }
    setAttributes([...attributes, newAttribute])
    setEditingAttribute(newAttribute.id)
  }

  const deleteAttribute = (id) => {
    setAttributes(attributes.filter(attr => attr.id !== id))
  }

  const updateAttributeName = (id, newName) => {
    setAttributes(attributes.map(attr =>
      attr.id === id ? { ...attr, name: newName } : attr
    ))
  }

  const addItem = (attributeId) => {
    const newItem = {
      id: Date.now(),
      text: '',
      selected: false
    }
    setAttributes(attributes.map(attr =>
      attr.id === attributeId
        ? { ...attr, items: [...attr.items, newItem] }
        : attr
    ))
    setEditingItem({ attributeId, itemId: newItem.id })
  }

  const deleteItem = (attributeId, itemId) => {
    setAttributes(attributes.map(attr =>
      attr.id === attributeId
        ? { ...attr, items: attr.items.filter(item => item.id !== itemId) }
        : attr
    ))
  }

  const updateItemText = (attributeId, itemId, newText) => {
    setAttributes(attributes.map(attr =>
      attr.id === attributeId
        ? {
            ...attr,
            items: attr.items.map(item =>
              item.id === itemId ? { ...item, text: newText } : item
            )
          }
        : attr
    ))
  }

  const toggleItemSelection = (attributeId, itemId) => {
    setAttributes(attributes.map(attr =>
      attr.id === attributeId
        ? {
            ...attr,
            items: attr.items.map(item =>
              item.id === itemId
                ? { ...item, selected: !item.selected }
                : { ...item, selected: false }
            )
          }
        : attr
    ))
  }

  if (attributes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Button onClick={addAttribute} variant="outline">
              <Plus className="h-4 w-4" />
              Add attribute
            </Button>
            <p className="text-muted-foreground">
              No attributes yet. Generate attributes from your challenge or add them manually.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-4 pl-4 md:pl-8 -ml-4 md:-ml-8">
      <div className="flex min-w-max border rounded-lg mx-4 md:mx-8">
        {attributes.map((attribute, index) => (
          <div
            key={attribute.id}
            className={`flex-shrink-0 w-72 px-3 py-4 ${index !== attributes.length - 1 ? 'border-r' : ''}`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 group">
                {editingAttribute === attribute.id ? (
                  <Input
                    autoFocus
                    value={attribute.name}
                    onChange={(e) => updateAttributeName(attribute.id, e.target.value)}
                    onBlur={() => setEditingAttribute(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setEditingAttribute(null)
                    }}
                    className="h-8"
                  />
                ) : (
                  <h3
                    className="font-semibold cursor-pointer hover:text-primary flex-1 text-sm"
                    onClick={() => setEditingAttribute(attribute.id)}
                  >
                    {attribute.name}
                  </h3>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteAttribute(attribute.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {attribute.items.map((item) => (
                  <div
                    key={item.id}
                    className="group"
                  >
                    {editingItem?.attributeId === attribute.id &&
                    editingItem?.itemId === item.id ? (
                      <Input
                        autoFocus
                        value={item.text}
                        onChange={(e) =>
                          updateItemText(attribute.id, item.id, e.target.value)
                        }
                        onBlur={() => {
                          setEditingItem(null)
                          if (!item.text.trim()) {
                            deleteItem(attribute.id, item.id)
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            setEditingItem(null)
                            addItem(attribute.id)
                          }
                        }}
                        className="h-9 text-sm"
                        placeholder="Item name..."
                      />
                    ) : (
                      <Button
                        variant={item.selected ? 'default' : 'outline'}
                        className={`w-full justify-between whitespace-normal text-left h-auto min-h-[36px] py-2 text-sm pr-2 ${item.selected ? 'border border-transparent' : ''}`}
                        onClick={() => toggleItemSelection(attribute.id, item.id)}
                        onDoubleClick={() =>
                          setEditingItem({ attributeId: attribute.id, itemId: item.id })
                        }
                      >
                        <span className="flex-1">{item.text || 'Empty item'}</span>
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2 p-1 hover:bg-background/20 rounded"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            deleteItem(attribute.id, item.id)
                          }}
                          type="button"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={() => addItem(attribute.id)}
                >
                  <Plus className="h-4 w-4" />
                  Add item
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Attribute Button Column */}
        <div className="flex-shrink-0 w-72 px-3 py-4 flex justify-center border-l">
          <Button onClick={addAttribute} variant="outline" className="w-full">
            <Plus className="h-4 w-4" />
            Add attribute
          </Button>
        </div>
      </div>
    </div>
  )
}
