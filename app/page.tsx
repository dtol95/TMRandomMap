"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { X, Shuffle, Filter } from "lucide-react"
import historyData from "../data/history.json"

interface TrackmaniaMap {
  uid: string
  name: string
  author: string
  events: Array<{
    at: string
    event: string
    uid: string
  }>
  authorTime: number
  votes: {
    tally: number[]
    recorded: string
  }
  download: string
}

interface HistoryData {
  format: number
  generated: string
  maps: TrackmaniaMap[]
}

export default function TrackmaniaRandomizer() {
  const [selectedMaps, setSelectedMaps] = useState<TrackmaniaMap[]>([])
  const [availableMaps, setAvailableMaps] = useState<TrackmaniaMap[]>([])
  const [yearFilters, setYearFilters] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>(["2021", "2022", "2023", "2024", "2025"])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true)
  const [isRevealing, setIsRevealing] = useState(false)
  const [revealedMaps, setRevealedMaps] = useState<string[]>([])

  // Extract years from map events and get available maps
  useEffect(() => {
    const data = historyData as HistoryData
    const maps = data.maps

    // Set fixed year range from 2021-2025
    setYearFilters(["2021", "2022", "2023", "2024", "2025"])
    setAvailableMaps(maps)
  }, [])

  // Filter maps based on selected years
  const getFilteredMaps = () => {
    if (selectedYears.length === 0) return availableMaps

    return availableMaps.filter((map) => {
      return map.events.some((event) => {
        const eventYear = new Date(event.at).getFullYear().toString()
        return selectedYears.includes(eventYear)
      })
    })
  }

  // Get random maps
  const getRandomMaps = (count: number, excludeIds: string[] = []) => {
    const filteredMaps = getFilteredMaps().filter((map) => !excludeIds.includes(map.uid))
    const shuffled = [...filteredMaps].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  // Remove a map and replace with new random one
  const removeMap = (mapId: string) => {
    const currentIds = selectedMaps.map((m) => m.uid)
    const newMap = getRandomMaps(1, currentIds)

    if (newMap.length > 0) {
      setSelectedMaps((prev) => prev.map((map) => (map.uid === mapId ? newMap[0] : map)))
    }
  }

  // Reroll all maps
  const rerollAllMaps = () => {
    setSelectedMaps(getRandomMaps(5))
  }

  // Handle year filter changes
  const handleYearToggle = (year: string) => {
    setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]))
  }

  // Save year filters and close dialog
  const saveYearFilters = () => {
    setIsDialogOpen(false)
    // Maps will be re-filtered automatically due to useEffect dependency
  }

  // Removed auto-loading of maps - now starts empty

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Trackmania Map Randomizer</h1>
          <p className="text-muted-foreground">Discover random Trackmania maps from your history</p>
        </header>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <Button onClick={rerollAllMaps} className="flex items-center gap-2" size="lg">
            <Shuffle className="w-4 h-4" />
            Reroll All Maps
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
                <Filter className="w-4 h-4" />
                Filter by Year ({selectedYears.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Filter by Year</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {yearFilters.map((year) => (
                  <div key={year} className="flex items-center space-x-2">
                    <Checkbox
                      id={year}
                      checked={selectedYears.includes(year)}
                      onCheckedChange={() => handleYearToggle(year)}
                    />
                    <label
                      htmlFor={year}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {year}
                    </label>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={saveYearFilters}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Maps List */}
        {selectedMaps.length > 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4 text-center text-card-foreground">Selected Maps</h2>
              <ol className="space-y-3">
                {selectedMaps.map((map, index) => (
                  <li
                    key={map.uid}
                    className="group flex items-center justify-between p-3 rounded-md hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <div>
                        <span className="font-medium text-card-foreground">{map.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">by {map.author}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeMap(map.uid)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="bg-card rounded-lg border p-8">
              <Shuffle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No Maps Selected</h3>
              <p className="text-muted-foreground mb-6">Click "Reroll All Maps" to get 5 random Trackmania maps</p>
              <Button onClick={rerollAllMaps} className="flex items-center gap-2 mx-auto">
                <Shuffle className="w-4 h-4" />
                Get Random Maps
              </Button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            {selectedMaps.length > 0
              ? `Showing ${selectedMaps.length} maps from ${getFilteredMaps().length} available maps`
              : `${getFilteredMaps().length} maps available`}
            {selectedYears.length < yearFilters.length && <span> (filtered by {selectedYears.join(", ")})</span>}
          </p>
        </div>
      </div>
    </div>
  )
}
