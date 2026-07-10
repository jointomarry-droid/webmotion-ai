'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Bell,
  Palette,
  Globe,
  Key,
  Trash2,
  Save,
  Camera,
  Check,
  ExternalLink,
  Shield,
  Smartphone,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Profile form state
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [productUpdates, setProductUpdates] = useState(true)

  // Appearance preferences
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [editorFontSize, setEditorFontSize] = useState(14)
  const [vimMode, setVimMode] = useState(false)

  // Connected accounts
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: false,
    github: false,
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, email, bio, website }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser({ ...user!, name: data.user.name, email: data.user.email })
        toast.success('Profile updated!')
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      await fetch('/api/v1/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      })
      toast.success('Password changed!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await fetch('/api/v1/auth/account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      toast.success('Account deleted')
      window.location.href = '/'
    } catch (error) {
      toast.error('Failed to delete account')
    }
  }

  const handleConnectOAuth = async (provider: 'google' | 'github') => {
    toast.success(`${provider} integration coming soon!`)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-1" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-1" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-1" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-1" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Globe className="h-4 w-4 mr-1" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="api-keys">
              <Key className="h-4 w-4 mr-1" />
              API Keys
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and public profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium">{user?.name || 'No name set'}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <Button variant="link" className="p-0 h-auto mt-1">
                      Change avatar
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <Input
                  label="Website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  leftIcon={<Globe className="h-4 w-4" />}
                />
                <div>
                  <label className="text-sm font-medium mb-2 block">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full h-24 px-3 py-2 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} isLoading={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleChangePassword} isLoading={isLoading}>
                      <Lock className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Authenticator App</p>
                        <p className="text-sm text-muted-foreground">
                          Use an authenticator app to generate one-time codes
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-500">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible actions for your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your account activity
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                    <div>
                      <p className="font-medium">Product Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new features and improvements
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={productUpdates}
                      onChange={(e) => setProductUpdates(e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">
                        Receive tips, trends, and inspiration
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={marketingEmails}
                      onChange={(e) => setMarketingEmails(e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => toast.success('Preferences saved!')}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how WebMotion.ai looks on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['light', 'dark', 'system'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`p-4 rounded-xl border-2 text-center capitalize transition-all ${
                          theme === t
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        {t}
                        {theme === t && <Check className="h-4 w-4 mx-auto mt-2 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Editor Font Size: {editorFontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="20"
                    value={editorFontSize}
                    onChange={(e) => setEditorFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div>
                    <p className="font-medium">Vim Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Enable vim keybindings in the code editor
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={vimMode}
                    onChange={(e) => setVimMode(e.target.checked)}
                    className="rounded"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>
                  Manage your connected third-party accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-white">
                      <svg className="h-6 w-6" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Google</p>
                      <p className="text-sm text-muted-foreground">
                        {connectedAccounts.google ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  {connectedAccounts.google ? (
                    <Badge variant="success">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Button variant="outline" onClick={() => handleConnectOAuth('google')}>
                      Connect
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gray-900">
                      <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">GitHub</p>
                      <p className="text-sm text-muted-foreground">
                        {connectedAccounts.github ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  {connectedAccounts.github ? (
                    <Badge variant="success">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Button variant="outline" onClick={() => handleConnectOAuth('github')}>
                      Connect
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-black">
                      <Key className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">API Keys</p>
                      <p className="text-sm text-muted-foreground">
                        Manage your API keys for integrations
                      </p>
                    </div>
                  </div>
                  <Link href="/settings/api-keys">
                    <Button variant="outline">
                      Manage Keys
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for AI providers and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Configure your API keys for OpenAI, Anthropic, Supabase, Stripe, and more.
                </p>
                <Link href="/settings/api-keys">
                  <Button>
                    <Key className="h-4 w-4 mr-2" />
                    Manage API Keys
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Account Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account"
        >
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete your account? This action cannot be undone.
              All your data, projects, and subscription will be permanently deleted.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  )
}
