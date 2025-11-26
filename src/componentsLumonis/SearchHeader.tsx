"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks"
import {
  setSearchQuery,
  addRecentSearch,
  clearRecentSearches,
  selectSearchQuery,
  selectRecentSearches,
  setSidebarOpen,
  selectSidebarOpen,
} from "../app/redux/slice/filterSlice"
import { Search, Settings2, Trash2, X, Clock, FilterIcon } from "lucide-react"

export function SearchHeader() {
  const t = useTranslations('search')
  
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector(selectSearchQuery)
  const recentSearches = useAppSelector(selectRecentSearches)
  const sidebarOpen = useAppSelector(selectSidebarOpen)
  const [showRecent, setShowRecent] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowRecent(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query))
    if (query.trim()) {
      dispatch(addRecentSearch(query))
    }
    setShowRecent(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      dispatch(addRecentSearch(searchQuery))
    }
    setShowRecent(false)
  }

  return (
    <div className="space-y-3 w-full">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
          className="p-2.5 hover:bg-primary/10 rounded-lg transition-all hover:scale-110 border-2 border-border"
          title={t('openFilters')}
        >
          <FilterIcon className="w-5 h-5" />
        </button>

        <div className="flex-1 relative group" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={t('placeholder')}
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              onFocus={() => setShowRecent(true)}
              className="w-full pl-12 pr-10 py-3 border-2 border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm hover:shadow-md"
            />
            
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  dispatch(setSearchQuery(""))
                  setShowRecent(true)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-primary/10 rounded-full transition-all"
                title={t('clearSearch')}
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {showRecent && recentSearches.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-card border-2 border-border rounded-xl shadow-lg overflow-hidden">
              <div className="p-3">
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t('recentSearches')}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch(clearRecentSearches())
                    }}
                    className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    {t('clear')}
                  </button>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-3 py-2 hover:bg-primary/5 rounded-lg transition-all flex items-center gap-3 text-sm text-foreground"
                    >
                      <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all font-semibold whitespace-nowrap"
        >
          {t('buttonSearch')}
        </button>

        <button
          type="button"
          className="p-3 hover:bg-primary/10 rounded-xl transition-all hover:scale-110 border-2 border-border"
          title={t('moreFilters')}
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}