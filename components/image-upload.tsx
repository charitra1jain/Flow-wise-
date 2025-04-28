"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // Generate a random placeholder image
      const width = Math.floor(Math.random() * 500) + 500
      const height = Math.floor(Math.random() * 300) + 300
      const placeholderUrl = `/placeholder.svg?height=${height}&width=${width}`

      onChange(placeholderUrl)
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
        variant: "success",
      })
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

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className={`border-2 border-dashed rounded-md p-4 ${className}`}>
      {value ? (
        <div className="relative w-full h-full">
          <img src={value || "/placeholder.svg"} alt="Uploaded" className="w-full h-full object-cover rounded-md" />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
          >
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">{isUploading ? "Uploading..." : "Click to upload an image"}</p>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  )
}
