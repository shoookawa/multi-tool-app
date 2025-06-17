"use client"

import { useState } from "react"
import { Calculator, DollarSign, JapaneseYenIcon as Yen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function CalculatorApp() {
  // Cost Calculator State
  const [quantity, setQuantity] = useState<number>(1)
  const [unitPrice, setUnitPrice] = useState<number>(0)
  const [taxRate, setTaxRate] = useState<number>(10)

  // Currency Converter State
  const [dollarAmount, setDollarAmount] = useState<number>(0)
  const [exchangeRate, setExchangeRate] = useState<number>(150) // Default USD to JPY rate

  const calculateTotal = () => {
    const subtotal = quantity * unitPrice
    const tax = subtotal * (taxRate / 100)
    return subtotal + tax
  }

  const convertToYen = () => {
    return dollarAmount * exchangeRate
  }

  const convertToDollar = (yenAmount: number) => {
    return yenAmount / exchangeRate
  }

  const resetCalculator = () => {
    setQuantity(1)
    setUnitPrice(0)
    setTaxRate(10)
  }

  const resetConverter = () => {
    setDollarAmount(0)
    setExchangeRate(150)
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold">計算機</h1>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Cost Calculator */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                コスト計算
              </CardTitle>
              <CardDescription>税込み総額を計算します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quantity">数量</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label htmlFor="unit-price">単価 (円)</Label>
                  <Input
                    id="unit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="tax-rate">税率 (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>小計:</span>
                    <span>¥{(quantity * unitPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>税額 ({taxRate}%):</span>
                    <span>¥{(quantity * unitPrice * (taxRate / 100)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>合計:</span>
                    <span>¥{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={resetCalculator}
                className="border border-border bg-transparent hover:bg-muted text-foreground hover:text-foreground w-full"
              >
                リセット
              </Button>
            </CardContent>
          </Card>

          {/* Currency Converter */}
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                <Yen className="h-5 w-5" />
                通貨換算 (USD ⇄ JPY)
              </CardTitle>
              <CardDescription>米ドルと日本円の換算を行います</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="exchange-rate">為替レート (1 USD = ? JPY)</Label>
                <Input
                  id="exchange-rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number.parseFloat(e.target.value) || 150)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dollar-amount">米ドル ($)</Label>
                    <Input
                      id="dollar-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={dollarAmount}
                      onChange={(e) => setDollarAmount(Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">日本円に換算:</div>
                    <div className="text-2xl font-semibold">¥{convertToYen().toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="yen-amount">日本円 (¥)</Label>
                    <Input
                      id="yen-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={convertToYen()}
                      onChange={(e) => setDollarAmount(convertToDollar(Number.parseFloat(e.target.value) || 0))}
                    />
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">米ドルに換算:</div>
                    <div className="text-2xl font-semibold">${dollarAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <Button
                onClick={resetConverter}
                className="border border-border bg-transparent hover:bg-muted text-foreground hover:text-foreground w-full"
              >
                リセット
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
