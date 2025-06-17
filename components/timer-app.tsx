"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"

export function TimerApp() {
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [minutes, setMinutes] = useState(10)
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const createBeepSound = () => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = 800
      oscillator.type = "sine"
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 1)
    }
    audioRef.current = { play: createBeepSound } as any
  }, [])

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            if (audioRef.current) {
              try {
                audioRef.current.play()
              } catch (error) {
                console.log("Audio playback failed:", error)
              }
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, remainingSeconds])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const setTimer = (mins: number, secs = 0) => {
    const total = mins * 60 + secs
    setTotalSeconds(total)
    setRemainingSeconds(total)
    setMinutes(mins)
    setSeconds(secs)
    setIsRunning(false)
  }

  const handleStart = () => {
    if (remainingSeconds > 0) {
      setIsRunning(true)
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setRemainingSeconds(totalSeconds)
  }

  const handleCustomSet = () => {
    const total = minutes * 60 + seconds
    if (total > 0) {
      setTimer(minutes, seconds)
    }
  }

  const presetButtons = [
    { label: "5分", minutes: 5 },
    { label: "10分", minutes: 10 },
    { label: "15分", minutes: 15 },
    { label: "20分", minutes: 20 },
    { label: "30分", minutes: 30 },
    { label: "60分", minutes: 60 },
  ]

  const getTimerColor = () => {
    if (remainingSeconds === 0 && totalSeconds > 0) return "text-red-400"
    if (remainingSeconds <= 60 && remainingSeconds > 0) return "text-yellow-400"
    return "text-foreground"
  }

  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold">タイマー</h1>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-8">
          {/* メインタイマー */}
          <div className="simple-card text-center">
            <div className={`text-8xl font-mono font-bold mb-6 ${getTimerColor()}`}>{formatTime(remainingSeconds)}</div>

            {totalSeconds > 0 && (
              <div className="max-w-md mx-auto mb-8">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>進捗: {Math.round(progress)}%</span>
                  <span>残り: {formatTime(remainingSeconds)}</span>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="bg-primary hover:bg-primary/80 text-primary-foreground gap-2 px-8"
                  disabled={remainingSeconds === 0}
                >
                  <Play className="h-5 w-5" />
                  スタート
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  size="lg"
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground gap-2 px-8"
                >
                  <Pause className="h-5 w-5" />
                  一時停止
                </Button>
              )}

              <Button
                onClick={handleReset}
                size="lg"
                className="border border-border bg-transparent hover:bg-muted text-foreground hover:text-foreground gap-2 px-8"
                disabled={totalSeconds === 0}
              >
                <RotateCcw className="h-5 w-5" />
                リセット
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* プリセット */}
            <div className="simple-card">
              <h2 className="text-lg font-semibold mb-4">クイック設定</h2>
              <div className="grid grid-cols-3 gap-3">
                {presetButtons.map((preset) => (
                  <Button
                    key={preset.label}
                    onClick={() => setTimer(preset.minutes)}
                    className="h-12 border border-border bg-transparent hover:bg-muted text-foreground hover:text-foreground"
                    disabled={isRunning}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* カスタム設定 */}
            <div className="simple-card">
              <h2 className="text-lg font-semibold mb-4">カスタム設定</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minutes" className="text-sm font-medium">
                      分
                    </Label>
                    <Input
                      id="minutes"
                      type="number"
                      min="0"
                      max="999"
                      value={minutes}
                      onChange={(e) => setMinutes(Number.parseInt(e.target.value) || 0)}
                      disabled={isRunning}
                      className="text-center"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seconds" className="text-sm font-medium">
                      秒
                    </Label>
                    <Input
                      id="seconds"
                      type="number"
                      min="0"
                      max="59"
                      value={seconds}
                      onChange={(e) => setSeconds(Number.parseInt(e.target.value) || 0)}
                      disabled={isRunning}
                      className="text-center"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCustomSet}
                  disabled={isRunning}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground w-full"
                >
                  設定
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
