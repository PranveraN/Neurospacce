import { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext({
  editMode: false,
  toggle: () => {},
  flash: () => {},
  flashVisible: false,
  lang: 'sq',
  setLang: () => {},
})

export function EditModeProvider({ children }) {
  const [editMode, setEditMode] = useState(false)
  const [flashVisible, setFlashVisible] = useState(false)
  const [lang, setLang] = useState('sq')

  const flash = useCallback(() => {
    setFlashVisible(true)
    setTimeout(() => setFlashVisible(false), 1400)
  }, [])

  return (
    <Ctx.Provider value={{ editMode, toggle: () => setEditMode(m => !m), flash, flashVisible, lang, setLang }}>
      {children}
    </Ctx.Provider>
  )
}

export const useEditMode = () => useContext(Ctx)
