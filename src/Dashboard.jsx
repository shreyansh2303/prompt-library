import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function Dashboard({ session }) {
  const [prompts, setPrompts] = useState([])
  const [currentText, setCurrentText] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    fetchPrompts()
  }, [])

  async function fetchPrompts() {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching prompts:', error)
    } else {
      setPrompts(data)
    }
  }

  async function handleSavePrompt(e) {
    e.preventDefault()
    if (!currentText.trim()) return

    if (editId) {
      const { error } = await supabase
        .from('prompts')
        .update({ content: currentText })
        .eq('id', editId)
      if (error) console.error('Error updating:', error)
    } else {
      const { error } = await supabase
        .from('prompts')
        .insert({ content: currentText })
      if (error) console.error('Error adding:', error)
    }

    setCurrentText('')
    setEditId(null)
    setIsEditing(false)
    fetchPrompts()
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(">_ WARNING: PURGE THIS FILE FROM MAINFRAME?")
    if (!confirmDelete) return

    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting:', error)
    } else {
      fetchPrompts()
    }
  }

  async function handleCopy(id, text) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      
      setTimeout(() => {
        setCopiedId(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  function openEditorForNew() {
    setCurrentText('')
    setEditId(null)
    setIsEditing(true)
  }

  function openEditorForEdit(prompt) {
    setCurrentText(prompt.content)
    setEditId(prompt.id)
    setIsEditing(true)
  }

  if (isEditing) {
    return (
      <div className="full-screen-editor">
        <div className="editor-header">
          <h3>{editId ? '>_ EDIT MODE' : '>_ NEW ENTRY'}</h3>
        </div>
        
        <form onSubmit={handleSavePrompt} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="Type or paste your prompt here..."
            autoFocus 
          />
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={() => {
                setIsEditing(false)
                setCurrentText('')
                setEditId(null)
              }}
              style={{ flex: 1 }}
            >
              Abort
            </button>
            <button type="submit" style={{ flex: 2 }}>
              {editId ? 'Execute Update' : 'Execute Save'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <>
      <div className="app-container">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2>Prompt.OBJ</h2>
          <button onClick={() => supabase.auth.signOut()} style={{ fontSize: '16px', padding: '5px 10px' }}>Log Out</button>
        </header>

        <div>
          {prompts.length === 0 ? (
            <p> NO DATA FOUND IN MAINFRAME.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
              {prompts.map((prompt) => (
                <div key={prompt.id} className="prompt-card">
                  
                  <div className="prompt-content">
                    {prompt.content}
                  </div>
                  
                  <div className="prompt-actions">
                    <button 
                      className="btn-small btn-copy" 
                      onClick={() => handleCopy(prompt.id, prompt.content)}
                    >
                      {copiedId === prompt.id ? '> COPIED! <' : 'COPY'}
                    </button>

                    <button className="btn-small" onClick={() => openEditorForEdit(prompt)}>
                      EDIT
                    </button>
                    <button className="btn-small btn-del" onClick={() => handleDelete(prompt.id)}>
                      DEL
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bottom-bar">
        <button onClick={openEditorForNew}>+ Initialize Prompt</button>
      </div>
    </>
  )
}