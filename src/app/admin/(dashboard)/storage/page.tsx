'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  FolderOpen, 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Loader2, 
  HardDrive, 
  ExternalLink,
  FileImage,
  AlertCircle,
  FileIcon
} from 'lucide-react'
import { listBucketFiles, uploadFile, deleteFile } from '@/app/actions/storage'

interface StorageFile {
  name: string
  id: string
  created_at: string
  updated_at: string
  last_accessed_at: string
  metadata: any
  publicUrl: string
}

export default function StorageAdminPage() {
  const buckets = [
    { id: 'brand-assets', label: 'Brand Assets', desc: 'Logos, banners, and general UI marketing assets.' },
    { id: 'project-images', label: 'Project Images', desc: 'Case study mockup covers, challenges, and results screenshots.' },
    { id: 'client-logos', label: 'Client Logos', desc: 'Company and client brand partner logos.' },
    { id: 'team-avatars', label: 'Team Avatars', desc: 'Professional headshots for team profiles.' },
    { id: 'testimonial-avatars', label: 'Testimonial Avatars', desc: 'Customer and client reviewer face shots.' }
  ]

  const [activeBucket, setActiveBucket] = useState(buckets[0].id)
  const [files, setFiles] = useState<StorageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchFiles()
  }, [activeBucket])

  async function fetchFiles() {
    setLoading(true)
    setError(null)
    const result = await listBucketFiles(activeBucket)
    if (result.error) {
      setError(result.error)
      setFiles([])
    } else {
      setFiles((result.files as StorageFile[]) || [])
    }
    setLoading(false)
  }

  // Handle Drag Over
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // Handle Drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0])
    }
  }

  // Handle File Input Select
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0])
    }
  }

  // Trigger File Input Click
  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Upload Logic
  const handleUpload = async (file: File) => {
    // Basic type validation
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed to be uploaded.')
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', activeBucket)

    const result = await uploadFile(formData)
    if (result.error) {
      setError(result.error)
    } else {
      // Refresh bucket file list
      await fetchFiles()
    }
    setUploading(false)
  }

  // Delete Logic
  const handleDelete = async (fileName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${fileName}"?`)) return

    setError(null)
    const result = await deleteFile(activeBucket, fileName)
    if (result.error) {
      setError(result.error)
    } else {
      setFiles(files.filter(f => f.name !== fileName))
    }
  }

  // Copy Clipboard Helper
  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-theme">
        <div>
          <div className="flex items-center gap-2 text-muted-text mb-1">
            <HardDrive className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Cloud Assets</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-foreground">
            Media Storage & Buckets
          </h2>
          <p className="text-xs text-muted-text mt-1">
            Store and manage brand icons, testimonial heads, team images, and project mockups.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-red-400">Storage Operation Warning</p>
            <p className="text-muted-text mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Tabs list for 5 buckets */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 border-b border-border-theme pb-4">
        {buckets.map((b) => {
          const isActive = activeBucket === b.id
          return (
            <button
              key={b.id}
              onClick={() => setActiveBucket(b.id)}
              className={`px-4 py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                isActive 
                  ? 'border-primary/30 bg-primary/10 text-foreground shadow-lg shadow-primary/5' 
                  : 'border-transparent text-muted-text bg-surface-base hover:bg-white/[0.08] hover:text-foreground'
              }`}
            >
              {b.label}
            </button>
          )
        })}
      </div>

      {/* Active Bucket Description */}
      <div className="bg-surface-base border border-border-theme p-4 rounded-xl text-xs text-muted-text font-mono">
        <span className="text-primary font-bold">Active Bucket ID: </span>
        <span className="text-foreground font-bold">{activeBucket}</span>
        <span className="mx-2 text-muted-text/30">|</span>
        <span>{buckets.find(b => b.id === activeBucket)?.desc}</span>
      </div>

      {/* Upload files section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upload Zone (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider font-display text-foreground">
            Upload Asset
          </h3>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border border-dashed rounded-2xl p-8 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[220px] bg-foreground/[0.005] ${
              dragActive 
                ? 'border-[#ED3F27] bg-primary/5' 
                : 'border-border hover:border-white/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {uploading ? (
              <div className="space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-xs font-mono text-muted-text uppercase tracking-widest">
                  Uploading to cloud...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-full bg-surface-base flex items-center justify-center mx-auto text-muted-text">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">
                    Drag and drop file here
                  </p>
                  <p className="text-[10px] text-muted-text">
                    Supports PNG, JPEG, SVG, WebP up to 10MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onButtonClick}
                  className="border border-border hover:border-white/20 bg-surface-base text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl text-foreground transition-all cursor-pointer"
                >
                  Choose File
                </button>
              </div>
            )}
          </div>
        </div>

        {/* File List Grid (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider font-display text-foreground">
              Stored Assets ({files.length})
            </h3>
            <button
              onClick={fetchFiles}
              className="text-[10px] font-mono text-muted-text hover:text-foreground uppercase tracking-wider border border-border-theme bg-surface-base px-2.5 py-1 rounded-lg transition-all"
            >
              Refresh List
            </button>
          </div>

          {loading ? (
            <div className="h-[220px] flex flex-col items-center justify-center border border-border-theme rounded-2xl bg-surface-base/30">
              <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-text">Listing remote assets...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="h-[220px] flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-white/[0.002]">
              <FolderOpen className="h-8 w-8 text-muted-text/30 mb-2" />
              <p className="text-xs font-bold text-muted-text uppercase tracking-wide">No assets in this bucket</p>
              <p className="text-[10px] text-muted-text/50 mt-1">Upload an image file on the left to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {files.map((file) => {
                const isCopied = copiedId === file.name
                return (
                  <div 
                    key={file.id} 
                    className="bg-surface-base border border-border-theme rounded-2xl overflow-hidden hover:border-border transition-all flex flex-col group"
                  >
                    {/* Image preview area */}
                    <div className="h-32 bg-bg-base flex items-center justify-center relative overflow-hidden border-b border-border-theme">
                      <img 
                        src={file.publicUrl} 
                        alt={file.name} 
                        className="max-h-full max-w-full object-contain p-2 group-hover:scale-[1.03] transition-all duration-300"
                        onError={(e) => {
                          // Handle broken images
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      
                      {/* Hover Overlay Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleCopyUrl(file.publicUrl, file.name)}
                          className="p-2 bg-foreground/10 hover:bg-primary/20 border border-border hover:border-primary/30 rounded-xl text-foreground transition-all"
                          title="Copy Public URL"
                        >
                          {isCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <a
                          href={file.publicUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-foreground/10 hover:bg-white/20 border border-border rounded-xl text-foreground transition-all"
                          title="View Full Size"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(file.name)}
                          className="p-2 bg-foreground/10 hover:bg-red-500/20 border border-border hover:border-red-500/30 rounded-xl text-red-400 transition-all"
                          title="Delete File"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata & Copy action */}
                    <div className="p-3 space-y-1.5 flex-grow flex flex-col justify-between">
                      <div className="min-w-0">
                        <p className="text-[10px] text-foreground/80 font-mono font-bold truncate" title={file.name}>
                          {file.name.substring(file.name.indexOf('_') + 1)}
                        </p>
                        <p className="text-[8px] text-muted-text font-mono">
                          {formatBytes(file.metadata?.size || 0)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopyUrl(file.publicUrl, file.name)}
                        className={`w-full py-1.5 rounded-lg border text-[9px] font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isCopied 
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' 
                            : 'border-border-theme bg-surface-base text-muted-text hover:text-foreground hover:bg-white/[0.08]'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </section>

    </div>
  )
}
