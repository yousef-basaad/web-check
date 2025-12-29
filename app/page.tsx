"use client"

import { useState } from "react"
import { Shield, AlertTriangle, XCircle, Loader2 } from "lucide-react"

interface ScanResult {
  status: "safe" | "suspicious" | "malicious"
  stats: {
    harmless: number
    suspicious: number
    malicious: number
    undetected: number
  }
  permalink: string
}

// API endpoint - changes automatically based on environment
const API_URL = "/api/scan"

export default function Page() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState("")

  const handleScan = async () => {
    if (!url.trim()) {
      setError("Please enter a link")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Scan failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during scanning")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Determine color and icon based on result
  const getStatusConfig = () => {
    if (!result) return null

    switch (result.status) {
      case "safe":
        return {
          icon: <Shield className="w-12 h-12" />,
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200",
          label: "Safe",
        }
      case "suspicious":
        return {
          icon: <AlertTriangle className="w-12 h-12" />,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          label: "Suspicious",
        }
      case "malicious":
        return {
          icon: <XCircle className="w-12 h-12" />,
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          label: "Malicious",
        }
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center"
    >
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Link Checker</h1>
            <p className="text-gray-600">Check link safety using VirusTotal</p>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter the link here..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                onKeyPress={(e) => e.key === "Enter" && handleScan()}
                disabled={loading}
              />
            </div>

            <button
              onClick={handleScan}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                "Scan Link"
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">{error}</div>
          )}

          {/* Result Section */}
          {result && statusConfig && (
            <div className="mt-6 space-y-4">
              <div className={`${statusConfig.bg} ${statusConfig.border} border-2 rounded-xl p-6 text-center`}>
                <div className={`${statusConfig.color} flex justify-center mb-3`}>{statusConfig.icon}</div>
                <h2 className={`text-2xl font-bold ${statusConfig.color} mb-2`}>{statusConfig.label}</h2>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{result.stats.harmless}</div>
                  <div className="text-sm text-gray-600">Harmless</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{result.stats.suspicious}</div>
                  <div className="text-sm text-gray-600">Suspicious</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{result.stats.malicious}</div>
                  <div className="text-sm text-gray-600">Malicious</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">{result.stats.undetected}</div>
                  <div className="text-sm text-gray-600">Undetected</div>
                </div>
              </div>

              {/* VirusTotal Link */}
              <a
                href={result.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-blue-600 hover:text-blue-700 font-medium"
              >
                View full details on VirusTotal
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
