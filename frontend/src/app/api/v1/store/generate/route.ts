import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { config, products, features } = body

    const store = generateStore(config, products, features)

    return NextResponse.json({
      success: true,
      data: store,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate store' },
      { status: 500 }
    )
  }
}

function generateStore(config: any, products: any[], features: any) {
  return {
    name: config.storeName,
    type: config.storeType,
    currency: config.currency,
    products: products.filter((p: any) => p.name),
    features,
    code: generateStoreCode(config, products, features),
  }
}

function generateStoreCode(config: any, products: any[], features: any) {
  const productList = products
    .filter((p: any) => p.name)
    .map((p: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: p.name,
      price: parseFloat(p.price) || 9.99,
      description: p.description || 'Product description',
    }))

  return `"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"

const products = ${JSON.stringify(productList, null, 2)}

export default function Store() {
  const [cart, setCart] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <h1 className="text-2xl font-bold">${config.storeName}</h1>
      </header>
      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold">\${product.price.toFixed(2)}</span>
                  <Button onClick={() => addToCart(product)}>Add to Cart</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}`
}
