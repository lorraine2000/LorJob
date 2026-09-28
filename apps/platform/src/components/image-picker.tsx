"use client"

import { useRef, useState } from "react"
import { Button } from "./ui/button"
import { Edit, Trash2, User } from "lucide-react"

type ImagePickerProps = {
  value?: FileList 
  onChange: (fileList: FileList | undefined) => void
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const file = value?.[0] ?? null
  const [preview, setPreview] = useState<string | null>(file ? URL.createObjectURL(file) : null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(undefined)
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const objectUrl = URL.createObjectURL(files[0])
      setPreview(objectUrl)
      onChange(files)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative cursor-pointer group"
        onClick={handleClick}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Prévisualisation"
            className="h-24 w-24 rounded-full object-cover border shadow"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground border shadow text-xl font-medium">
            <User className="w-8 h-8" />
          </div>
        )}

        {preview && (
          <>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute -top-2 -right-2 text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Supprimer</span>
            </Button>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute -bottom-2 -right-2 hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation()
                handleClick()
              }}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Changer</span>
            </Button>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </div>
  )
}
