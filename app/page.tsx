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

// API endpoint - يتغير تلقائياً حسب البيئة
const API_URL = "/api/scan"

export default function Page() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState("")

  const handleScan = async () => {
    if (!url.trim()) {
      setError("الرجاء إدخال رابط")
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
        throw new Error(errorData.error || "فشل الفحص")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء الفحص")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // تحديد اللون والأيقونة حسب النتيجة
  const getStatusConfig = () => {
    if (!result) return null

    switch (result.status) {
      case "safe":
        return {
          icon: <Shield className="w-12 h-12" />,
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200",
          label: "آمن",
        }
      case "suspicious":
        return {
          icon: <AlertTriangle className="w-12 h-12" />,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          label: "مشبوه",
        }
      case "malicious":
        return {
          icon: <XCircle className="w-12 h-12" />,
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          label: "خطير",
        }
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center"
      dir="rtl"
    >
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">فحص الروابط</h1>
            <p className="text-gray-600">تحقق من أمان الروابط باستخدام VirusTotal</p>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="أدخل الرابط هنا..."
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
                  جاري الفحص...
                </>
              ) : (
                "فحص الرابط"
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
                  <div className="text-sm text-gray-600">آمن</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{result.stats.suspicious}</div>
                  <div className="text-sm text-gray-600">مشبوه</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{result.stats.malicious}</div>
                  <div className="text-sm text-gray-600">خطير</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">{result.stats.undetected}</div>
                  <div className="text-sm text-gray-600">غير محدد</div>
                </div>
              </div>

              {/* VirusTotal Link */}
              <a
                href={result.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-blue-600 hover:text-blue-700 font-medium"
              >
                عرض التفاصيل الكاملة على VirusTotal
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">تعليمات التشغيل:</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">1.</span>
              <span>أضف API Key من قسم Vars في الشريط الجانبي</span>
            </li>
            <li className="mr-6 bg-gray-50 p-2 rounded font-mono text-xs">VIRUSTOTAL_API_KEY</li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">2.</span>
              <span>احصل على API Key من: virustotal.com/gui/my-apikey</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">3.</span>
              <span>أدخل رابط وابدأ الفحص!</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
