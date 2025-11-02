"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings, Plus, Minus, Zap } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PomodoroTimerProps {
  taskTitle?: string
  initialMinutes?: number
}

export function PomodoroTimer({ taskTitle, initialMinutes = 25 }: PomodoroTimerProps) {
  const [timerMode, setTimerMode] = useState<"work" | "break">("work")
  const [minutes, setMinutes] = useState(initialMinutes)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [workMinutes, setWorkMinutes] = useState(initialMinutes)
  const [breakMinutes, setBreakMinutes] = useState(5)
  const [longBreakMinutes, setLongBreakMinutes] = useState(15)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          // Timer completed
          const isWorkSession = timerMode === "work"

          if (isWorkSession) {
            setSessionsCompleted((prev) => prev + 1)
            // Auto-switch to break
            const needsLongBreak = (sessionsCompleted + 1) % 4 === 0
            setTimerMode("break")
            setMinutes(needsLongBreak ? longBreakMinutes : breakMinutes)
          } else {
            // Break completed, switch back to work
            setTimerMode("work")
            setMinutes(workMinutes)
          }

          setSeconds(0)
          setIsRunning(false)

          // Play notification sound
          if (!isMuted) {
            playNotification()
          }
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, minutes, seconds, timerMode, sessionsCompleted, isMuted, workMinutes, breakMinutes, longBreakMinutes])

  const playNotification = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = timerMode === "work" ? 880 : 440
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = () => {
    setIsRunning(false)
    setTimerMode("work")
    setMinutes(workMinutes)
    setSeconds(0)
  }

  const handleApplySettings = () => {
    setShowSettings(false)
    setIsRunning(false)
    setMinutes(workMinutes)
    setSeconds(0)
    setTimerMode("work")
  }

  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  const progressPercentage =
    timerMode === "work"
      ? ((workMinutes * 60 - (minutes * 60 + seconds)) / (workMinutes * 60)) * 100
      : ((breakMinutes * 60 - (minutes * 60 + seconds)) / (breakMinutes * 60)) * 100

  return (
    <div className="w-full space-y-6">
      <Card
        className={`p-8 text-center transition-all ${
          timerMode === "work"
            ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20"
            : "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800"
        }`}
      >
        {/* Task Display */}
        <div className="mb-6">
          {taskTitle && <p className="text-sm text-muted-foreground mb-2">Current Task</p>}
          {taskTitle && <p className="font-semibold text-foreground truncate">{taskTitle}</p>}
        </div>

        {/* Mode Indicator */}
        <div className="mb-4">
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
              timerMode === "work" ? "bg-primary/20 text-primary" : "bg-green-500/20 text-green-600 dark:text-green-400"
            }`}
          >
            {timerMode === "work" ? "Focus Time" : "Break Time"}
          </span>
        </div>

        {/* Timer Display */}
        <div className="mb-6">
          <div className="text-6xl font-bold font-mono mb-2 tracking-tighter">
            <span className="text-primary">{timeDisplay}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {sessionsCompleted} sessions completed
            {sessionsCompleted > 0 && <span> • {Math.floor(sessionsCompleted * 25)} minutes focused</span>}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all rounded-full ${
              timerMode === "work"
                ? "bg-gradient-to-r from-primary to-accent"
                : "bg-gradient-to-r from-green-500 to-emerald-500"
            }`}
            style={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center mb-4">
          <Button onClick={toggleTimer} className="flex-1 min-w-32" size="lg">
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="icon" className="h-10 w-10 bg-transparent">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button onClick={() => setIsMuted(!isMuted)} variant="outline" size="icon" className="h-10 w-10">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Button onClick={() => setShowSettings(true)} variant="outline" size="icon" className="h-10 w-10">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Adjust Buttons */}
        <div className="flex gap-2 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newMinutes = Math.max(1, minutes - 1)
              setMinutes(newMinutes)
            }}
            disabled={isRunning}
            className="text-xs"
          >
            <Minus className="w-3 h-3 mr-1" />
            -1 min
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newMinutes = minutes + 1
              setMinutes(newMinutes)
            }}
            disabled={isRunning}
            className="text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            +1 min
          </Button>
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{sessionsCompleted}</div>
          <p className="text-xs text-muted-foreground mt-1">Sessions</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent">{Math.floor(sessionsCompleted * 25)}</div>
          <p className="text-xs text-muted-foreground mt-1">Minutes</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            <Zap className="w-5 h-5 inline" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Active</p>
        </Card>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pomodoro Settings</DialogTitle>
            <DialogDescription>Customize your timer durations</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Work Duration (minutes)</label>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setWorkMinutes(Math.max(1, workMinutes - 5))}
                  className="h-8"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{workMinutes}</span>
                <Button size="sm" variant="outline" onClick={() => setWorkMinutes(workMinutes + 5)} className="h-8">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Short Break (minutes)</label>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBreakMinutes(Math.max(1, breakMinutes - 1))}
                  className="h-8"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{breakMinutes}</span>
                <Button size="sm" variant="outline" onClick={() => setBreakMinutes(breakMinutes + 1)} className="h-8">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Long Break (minutes)</label>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setLongBreakMinutes(Math.max(5, longBreakMinutes - 5))}
                  className="h-8"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{longBreakMinutes}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setLongBreakMinutes(longBreakMinutes + 5)}
                  className="h-8"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground pt-2">Long breaks occur after every 4 sessions</p>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={handleApplySettings}>
                Apply Settings
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
