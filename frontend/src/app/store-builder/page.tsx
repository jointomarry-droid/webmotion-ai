'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  ShoppingCart,
  Store,
  Package,
  CreditCard,
  BarChart3,
  Copy,
  Check,
  Download,
  Plus,
  Trash2,
  Heart,
  Tag,
  Star,
  Mail,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Product {
  name: string
  price: string
  description: string
}

interface StoreConfig {
  storeName: string
  storeType: 'physical' | 'digital' | 'subscription'
  currency: string
}

export default function StoreBuilderPage() {
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  const [storeConfig, setStoreConfig] = useState<StoreConfig>({
    storeName: '',
    storeType: 'digital',
    currency: 'USD',
  })

  const [products, setProducts] = useState<Product[]>([
    { name: '', price: '', description: '' },
  ])

  const [features, setFeatures] = useState({
    cart: true,
    wishlist: true,
    reviews: true,
    coupons: true,
    analytics: true,
    emailMarketing: false,
  })

  const addProduct = () => {
    setProducts([...products, { name: '', price: '', description: '' }])
  }

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index))
    }
  }

  const updateProduct = (index: number, field: keyof Product, value: string) => {
    const updated = [...products]
    updated[index][field] = value
    setProducts(updated)
  }

  const handleGenerate = async () => {
    if (!storeConfig.storeName) {
      toast.error('Please enter a store name')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/v1/store/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ config: storeConfig, products, features }),
      })
      const data = await response.json()
      setGeneratedCode(data.code)
    } catch (error) {
      setGeneratedCode(generateMockStore())
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockStore = () => {
    const productList = products
      .filter((p) => p.name)
      .map(
        (p) => `  { id: "1", name: "${p.name}", price: ${parseFloat(p.price) || 9.99}, description: "${p.description || 'Product description'}" }`
      )
      .join(',\n')

    return `"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Star } from "lucide-react"

const products = [
${productList || `  { id: "1", name: "Product 1", price: 29.99, description: "Amazing product" },
  { id: "2", name: "Product 2", price: 49.99, description: "Great quality" },
  { id: "3", name: "Product 3", price: 19.99, description: "Best value" }`}
]

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export default function Store() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const addToCart = (product: typeof products[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    )
  }

  const applyCoupon = () => {
    if (couponCode === "SAVE10") setDiscount(0.1)
    else if (couponCode === "SAVE20") setDiscount(0.2)
    else setDiscount(0)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal * (1 - discount)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">${storeConfig.storeName || "My Store"}</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => toggleWishlist("all")}>
              <Heart className="h-4 w-4 mr-2" /> Wishlist ({wishlist.length})
            </Button>
            <Button onClick={() => document.getElementById("cart")?.scrollIntoView()}>
              <ShoppingCart className="h-4 w-4 mr-2" /> Cart ({cart.length})
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Products Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <Package className="h-12 w-12" />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart
                      className={\`h-4 w-4 \${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}\`}
                    />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold">\${product.price.toFixed(2)}</span>
                    <Button size="sm" onClick={() => addToCart(product)}>
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Cart */}
        {cart.length > 0 && (
          <section id="cart">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        \${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">\${(item.price * item.quantity).toFixed(2)}</span>
                      <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.id)}>
                        ×
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Coupon */}
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Coupon code (try SAVE10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={applyCoupon}>Apply</Button>
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>\${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({(discount * 100)}%)</span>
                      <span>-\${(subtotal * discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>\${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full mt-4">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Checkout
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  )
}`
  }

  const handleCopyCode = () => {
    if (generatedCode) {
      copyToClipboard(generatedCode)
      setCopiedCode(true)
      toast.success('Code copied!')
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleDownload = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'store-page.tsx'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Downloaded!')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">AI Store Builder</h1>
              <p className="text-muted-foreground">
                Generate complete e-commerce pages with cart, checkout, and payments
              </p>
            </div>
          </div>
        </motion.div>

        {!generatedCode ? (
          <div className="max-w-3xl mx-auto">
            {/* Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {s}
                    </div>
                    <span className={`text-sm ${step === s ? 'font-medium' : 'text-muted-foreground'}`}>
                      {s === 1 ? 'Store Details' : s === 2 ? 'Products' : 'Features'}
                    </span>
                    {s < 3 && <div className="w-12 h-px bg-border" />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Step 1: Store Details */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Store Details</CardTitle>
                    <CardDescription>Configure your store basics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Input
                      label="Store Name"
                      value={storeConfig.storeName}
                      onChange={(e) => setStoreConfig({ ...storeConfig, storeName: e.target.value })}
                      placeholder="My Awesome Store"
                      leftIcon={<Store className="h-4 w-4" />}
                    />

                    <div>
                      <label className="text-sm font-medium mb-3 block">Store Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'physical', name: 'Physical Products', icon: Package },
                          { id: 'digital', name: 'Digital Products', icon: Download },
                          { id: 'subscription', name: 'Subscriptions', icon: CreditCard },
                        ].map((type) => (
                          <Card
                            key={type.id}
                            className={`cursor-pointer transition-all text-center ${
                              storeConfig.storeType === type.id
                                ? 'border-primary bg-primary/5'
                                : 'hover:border-primary/30'
                            }`}
                            onClick={() => setStoreConfig({ ...storeConfig, storeType: type.id as StoreConfig['storeType'] })}
                          >
                            <CardContent className="p-4">
                              <type.icon className={`h-6 w-6 mx-auto mb-2 ${storeConfig.storeType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                              <p className="text-sm font-medium">{type.name}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Currency</label>
                      <div className="flex gap-2">
                        {['USD', 'EUR', 'GBP', 'CAD'].map((cur) => (
                          <Badge
                            key={cur}
                            variant={storeConfig.currency === cur ? 'default' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => setStoreConfig({ ...storeConfig, currency: cur })}
                          >
                            {cur}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button onClick={() => setStep(2)} className="w-full">
                      Continue to Products
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Products */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>Add your products</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={addProduct}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Product
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {products.map((product, index) => (
                      <div key={index} className="p-4 rounded-lg border space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Product {index + 1}</span>
                          {products.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProduct(index)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            value={product.name}
                            onChange={(e) => updateProduct(index, 'name', e.target.value)}
                            placeholder="Product name"
                          />
                          <Input
                            type="number"
                            value={product.price}
                            onChange={(e) => updateProduct(index, 'price', e.target.value)}
                            placeholder="Price"
                          />
                        </div>
                        <Input
                          value={product.description}
                          onChange={(e) => updateProduct(index, 'description', e.target.value)}
                          placeholder="Description (optional)"
                        />
                      </div>
                    ))}

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                        Back
                      </Button>
                      <Button onClick={() => setStep(3)} className="flex-1">
                        Continue to Features
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Features */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Store Features</CardTitle>
                    <CardDescription>Select features to include</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {[
                        { id: 'cart', name: 'Shopping Cart', icon: ShoppingCart, description: 'Add items to cart and checkout' },
                        { id: 'wishlist', name: 'Wishlist', icon: Heart, description: 'Save items for later' },
                        { id: 'reviews', name: 'Product Reviews', icon: Star, description: 'Customer ratings and reviews' },
                        { id: 'coupons', name: 'Coupon Codes', icon: Tag, description: 'Discount codes support' },
                        { id: 'analytics', name: 'Analytics', icon: BarChart3, description: 'Track sales and visitors' },
                        { id: 'emailMarketing', name: 'Email Marketing', icon: Mail, description: 'Capture emails for marketing' },
                      ].map((feature) => (
                        <div
                          key={feature.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            features[feature.id as keyof typeof features]
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-primary/30'
                          }`}
                          onClick={() => setFeatures({ ...features, [feature.id]: !features[feature.id as keyof typeof features] })}
                        >
                          <div className="flex items-center gap-3">
                            <feature.icon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{feature.name}</p>
                              <p className="text-xs text-muted-foreground">{feature.description}</p>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              features[feature.id as keyof typeof features]
                                ? 'bg-primary border-primary'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {features[feature.id as keyof typeof features] && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                        Back
                      </Button>
                      <Button onClick={handleGenerate} isLoading={isGenerating} className="flex-1">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Store
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        ) : (
          /* Generated Result */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Generated Store: {storeConfig.storeName}</h2>
                    <p className="text-muted-foreground mt-1">
                      Complete e-commerce page with cart, wishlist, and checkout
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleCopyCode}>
                      {copiedCode ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      Copy Code
                    </Button>
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={() => { setGeneratedCode(null); setStep(1) }}>
                      Generate New
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">store-page.tsx</CardTitle>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-xl p-4 max-h-[600px] overflow-auto">
                  <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap">
                    {generatedCode}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium mb-1">1. Install dependencies</p>
                  <code className="text-xs text-muted-foreground">npm install stripe @stripe/stripe-js</code>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium mb-1">2. Set up Stripe</p>
                  <code className="text-xs text-muted-foreground">Add your Stripe keys to .env.local</code>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium mb-1">3. Copy the file</p>
                  <code className="text-xs text-muted-foreground">Save as app/store/page.tsx</code>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium mb-1">4. Run your app</p>
                  <code className="text-xs text-muted-foreground">npm run dev</code>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
