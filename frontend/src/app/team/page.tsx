'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  UserPlus,
  Settings,
  Shield,
  Crown,
  Mail,
  MoreVertical,
  Trash2,
  Edit,
  Check,
  X,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { useAuthStore } from '@/lib/store'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface TeamMember {
  id: string
  user_id: string
  email: string
  name: string
  avatar: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  joined_at: string
  last_active: string
}

interface Invitation {
  id: string
  email: string
  role: string
  status: 'pending' | 'accepted' | 'expired'
  invited_at: string
}

export default function TeamPage() {
  const { user } = useAuthStore()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<string>('editor')
  const [editingMember, setEditingMember] = useState<string | null>(null)

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    setIsLoading(true)
    try {
      const [membersRes, invitationsRes] = await Promise.all([
        fetch('/api/v1/team/members', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/v1/team/invitations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ])

      const membersData = await membersRes.json()
      const invitationsData = await invitationsRes.json()

      setMembers(membersData.members)
      setInvitations(invitationsData.invitations)
    } catch (error) {
      console.error('Failed to fetch team data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address')
      return
    }

    try {
      await fetch('/api/v1/team/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })

      toast.success('Invitation sent!')
      setShowInviteModal(false)
      setInviteEmail('')
      setInviteRole('editor')
      fetchTeamData()
    } catch (error) {
      toast.error('Failed to send invitation')
    }
  }

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      await fetch(`/api/v1/team/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: newRole }),
      })

      toast.success('Role updated!')
      setEditingMember(null)
      fetchTeamData()
    } catch (error) {
      toast.error('Failed to update role')
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      await fetch(`/api/v1/team/members/${memberId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })

      toast.success('Member removed')
      fetchTeamData()
    } catch (error) {
      toast.error('Failed to remove member')
    }
  }

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await fetch(`/api/v1/team/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })

      toast.success('Invitation cancelled')
      fetchTeamData()
    } catch (error) {
      toast.error('Failed to cancel invitation')
    }
  }

  const roles = [
    { value: 'admin', label: 'Admin', description: 'Full access to all features' },
    { value: 'editor', label: 'Editor', description: 'Can edit projects and templates' },
    { value: 'viewer', label: 'Viewer', description: 'Can view projects only' },
  ]

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge className="bg-yellow-500/20 text-yellow-500"><Crown className="h-3 w-3 mr-1" />Owner</Badge>
      case 'admin':
        return <Badge className="bg-purple-500/20 text-purple-500"><Shield className="h-3 w-3 mr-1" />Admin</Badge>
      case 'editor':
        return <Badge variant="secondary"><Edit className="h-3 w-3 mr-1" />Editor</Badge>
      default:
        return <Badge variant="outline"><Users className="h-3 w-3 mr-1" />Viewer</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Team Management</h1>
                <p className="text-muted-foreground">
                  Manage your team members and their permissions
                </p>
              </div>
            </div>
            <Button onClick={() => setShowInviteModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{members.length}</div>
              <p className="text-muted-foreground">Team Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{invitations.length}</div>
              <p className="text-muted-foreground">Pending Invitations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">
                {user?.subscription_tier === 'team' ? 'Unlimited' : '3'}
              </div>
              <p className="text-muted-foreground">Seats Available</p>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="members">
          <TabsList className="mb-6">
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-1" />
              Members ({members.length})
            </TabsTrigger>
            <TabsTrigger value="invitations">
              <Mail className="h-4 w-4 mr-1" />
              Invitations ({invitations.length})
            </TabsTrigger>
          </TabsList>

          {/* Members List */}
          <TabsContent value="members">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {members.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-xl border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={member.avatar}
                          fallback={member.name?.charAt(0) || member.email.charAt(0)}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{member.name || 'Unknown'}</p>
                            {getRoleBadge(member.role)}
                          </div>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm text-muted-foreground">
                          <p>Joined {formatDate(member.joined_at)}</p>
                          <p>Last active {formatDate(member.last_active)}</p>
                        </div>
                        {member.role !== 'owner' && (
                          <div className="flex items-center gap-2">
                            {editingMember === member.id ? (
                              <>
                                <select
                                  defaultValue={member.role}
                                  onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                                  className="px-2 py-1 rounded border border-border text-sm"
                                >
                                  {roles.map((role) => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                  ))}
                                </select>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingMember(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingMember(member.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRemoveMember(member.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invitations List */}
          <TabsContent value="invitations">
            <Card>
              <CardContent className="p-6">
                {invitations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending invitations</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invitations.map((invitation) => (
                      <motion.div
                        key={invitation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 rounded-xl border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar fallback={invitation.email.charAt(0).toUpperCase()} />
                          <div>
                            <p className="font-medium">{invitation.email}</p>
                            <p className="text-sm text-muted-foreground">
                              Invited as {invitation.role} • {formatDate(invitation.invited_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            invitation.status === 'accepted' ? 'success' :
                            invitation.status === 'expired' ? 'error' : 'warning'
                          }>
                            {invitation.status}
                          </Badge>
                          {invitation.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCancelInvitation(invitation.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Invite Modal */}
        <Modal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          title="Invite Team Member"
        >
          <div className="space-y-4">
            <Input
              label="Email Address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              leftIcon={<Mail className="h-4 w-4" />}
            />
            <div>
              <label className="text-sm font-medium mb-2 block">Role</label>
              <div className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role.value}
                    onClick={() => setInviteRole(role.value)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      inviteRole === role.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{role.label}</p>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                      {inviteRole === role.value && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite}>Send Invitation</Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  )
}
