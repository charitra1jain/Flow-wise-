"use client"

import { useState } from "react"
import { UserProfile } from "@/components/user-profile"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleAvatarChange = async (avatarUrl: string) => {
    if (!user) return

    setIsUpdating(true)
    try {
      // In a real app, this would be an API call to update the user's avatar
      // For now, we'll just update the local state
      updateUser({
        ...user,
        avatar: avatarUrl,
      })

      toast({
        title: "Profile updated",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8">Your Profile</h1>
      <UserProfile
        username={user?.name || "Guest User"}
        email={user?.email || "guest@example.com"}
        currentAvatar={user?.avatar || ""}
        onAvatarChange={handleAvatarChange}
      />
    </div>
  )
}
