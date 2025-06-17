"use client"

import { useState } from "react"
import { Copy, RefreshCw, Type, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export function TextProcessingApp() {
  const [inputText, setInputText] = useState("")
  const [passwordLength, setPasswordLength] = useState(12)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const { toast } = useToast()

  const convertToUppercase = () => {
    setInputText(inputText.toUpperCase())
  }

  const convertToLowercase = () => {
    setInputText(inputText.toLowerCase())
  }

  const convertToFullWidth = () => {
    const fullWidthText = inputText.replace(/[!-~]/g, (char) => {
      return String.fromCharCode(char.charCodeAt(0) + 0xfee0)
    })
    setInputText(fullWidthText)
  }

  const convertToHalfWidth = () => {
    const halfWidthText = inputText.replace(/[！-～]/g, (char) => {
      return String.fromCharCode(char.charCodeAt(0) - 0xfee0)
    })
    setInputText(halfWidthText)
  }

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
    let password = ""
    for (let i = 0; i < passwordLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setGeneratedPassword(password)
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "コピー完了!",
        description: `${type}をクリップボードにコピーしました`,
      })
    } catch (err) {
      toast({
        title: "エラー",
        description: "クリップボードへのコピーに失敗しました",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold">テキスト処理</h1>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Text Conversion */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                テキスト変換
              </CardTitle>
              <CardDescription>大文字・小文字、全角・半角文字の変換を行います</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text-input">入力テキスト</Label>
                <Textarea
                  id="text-input"
                  placeholder="ここにテキストを入力してください..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={convertToUppercase}
                  className="border border-border bg-transparent hover:bg-muted text-foreground hover:text-foreground"
                >
                  大文字
                </Button>
                <Button
                  onClick={convertToLowercase}
                  className="border border-border bg-transparent hover:bg-muted text-foreground hover:text-foreground"
                >
                  小文字
                </Button>
                <Button
                  onClick={convertToFullWidth}
                  className="border border-border bg-transparent hover:bg-muted text-foreground hover:text-foreground"
                >
                  全角
                </Button>
                <Button
                  onClick={convertToHalfWidth}
                  className="border border-border bg-transparent hover:bg-muted text-foreground hover:text-foreground"
                >
                  半角
                </Button>
                <Button
                  onClick={() => copyToClipboard(inputText, "テキスト")}
                  className="border border-border bg-transparent hover:bg-muted text-foreground hover:text-foreground gap-2"
                >
                  <Copy className="h-4 w-4" />
                  コピー
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Generator */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                パスワード生成
              </CardTitle>
              <CardDescription>安全なパスワードを生成します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="password-length">パスワード長</Label>
                  <Input
                    id="password-length"
                    type="number"
                    min="4"
                    max="50"
                    value={passwordLength}
                    onChange={(e) => setPasswordLength(Number.parseInt(e.target.value) || 12)}
                  />
                </div>
                <Button
                  onClick={generatePassword}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  生成
                </Button>
              </div>

              {generatedPassword && (
                <div className="space-y-2">
                  <Label>生成されたパスワード</Label>
                  <div className="flex gap-2">
                    <Input value={generatedPassword} readOnly className="font-mono" />
                    <Button
                      onClick={() => copyToClipboard(generatedPassword, "パスワード")}
                      className="border border-border bg-transparent hover:bg-muted text-foreground hover:text-foreground"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
