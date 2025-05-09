"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Camera, User, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Sample avatar options - using JPEG format instead of WebP
const AVATAR_OPTIONS = [
  "/images/avatars/avatar-1.jpeg",
  "/images/avatars/avatar-2.jpeg",
  "/images/avatars/avatar-3.jpeg",
  "/images/avatars/avatar-4.jpeg",
  "/images/avatars/avatar-5.jpeg",
  "/images/avatars/avatar-6.jpeg",
  "/images/avatars/avatar-7.jpeg",
  "/images/avatars/avatar-8.jpeg",
]

interface UserProfileProps {
  username?: string
  email?: string
  currentAvatar?: string
  onAvatarChange?: (avatarUrl: string) => void
}

export function UserProfile({
  username = "Jane Doe",
  email = "jane.doe@example.com",
  currentAvatar = "",
  onAvatarChange,
}: UserProfileProps) {
  const [avatar, setAvatar] = useState(currentAvatar)
  const [isUploading, setIsUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Update avatar when currentAvatar prop changes
  useEffect(() => {
    if (currentAvatar) {
      setAvatar(currentAvatar)
    }
  }, [currentAvatar])

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl)
  }

  const applySelectedAvatar = () => {
    if (selectedAvatar) {
      setAvatar(selectedAvatar)
      if (onAvatarChange) {
        onAvatarChange(selectedAvatar)
      }
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })
      setIsDialogOpen(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // In a real app, this would be an API call to upload the image
      // For now, we'll use a placeholder and simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a local URL for the uploaded file
      const imageUrl = URL.createObjectURL(file)
      setAvatar(imageUrl)

      if (onAvatarChange) {
        onAvatarChange(imageUrl)
      }

      toast({
        title: "Image uploaded",
        description: "Your profile picture has been updated successfully.",
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeAvatar = () => {
    setAvatar("")
    if (onAvatarChange) {
      onAvatarChange("")
    }
    toast({
      title: "Avatar removed",
      description: "Your profile picture has been removed.",
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Manage your account information and profile picture</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative">
            <Avatar className="w-24 h-24 border-2 border-primary/20">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={username} />
              <AvatarFallback className="text-2xl">
                <User className="h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            {avatar && (
              <button
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                onClick={removeAvatar}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Update Profile Picture</DialogTitle>
                  <DialogDescription>Choose a new avatar or upload your own image</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="upload" className="w-full mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="avatars">Choose Avatar</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="py-4">
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="border-2 border-dashed rounded-md p-8 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={triggerFileInput}
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {isUploading ? "Uploading..." : "Click to upload an image"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG or JPEG (max. 5MB)</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          For best results, use an image at least 256px by 256px in .jpg, .png, or .jpeg format
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="avatars" className="py-4">
                    <div className="grid grid-cols-4 gap-4">
                      {AVATAR_OPTIONS.map((avatarUrl, index) => (
                        <button
                          key={index}
                          className={`relative rounded-md overflow-hidden border-2 transition-all ${
                            selectedAvatar === avatarUrl
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-transparent hover:border-muted"
                          }`}
                          onClick={() => handleAvatarSelect(avatarUrl)}
                        >
                          <img
                            src={avatarUrl || "/placeholder.svg"}
                            alt={`Avatar option ${index + 1}`}
                            className="w-full aspect-square object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="button" onClick={applySelectedAvatar} disabled={!selectedAvatar}>
                    Apply
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2 flex-1">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} readOnly className="bg-muted/50" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} readOnly className="bg-muted/50" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
