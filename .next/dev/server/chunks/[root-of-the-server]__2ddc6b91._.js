module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/scan/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY || "";
const VIRUSTOTAL_API_URL = "https://www.virustotal.com/api/v3";
async function parseJsonResponse(response) {
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Invalid response from VirusTotal: ${text.substring(0, 200)}`);
    }
    try {
        return await response.json();
    } catch (error) {
        const text = await response.text();
        throw new Error(`Failed to parse JSON: ${text.substring(0, 200)}`);
    }
}
async function waitForAnalysis(analysisId, maxRetries = 10) {
    for(let i = 0; i < maxRetries; i++){
        const response = await fetch(`${VIRUSTOTAL_API_URL}/analyses/${analysisId}`, {
            headers: {
                "x-apikey": VIRUSTOTAL_API_KEY
            }
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to get analysis from VirusTotal: ${text}`);
        }
        const data = await parseJsonResponse(response);
        const status = data.data.attributes.status;
        console.log(`[v0] Analysis status: ${status}, retry ${i + 1}/${maxRetries}`);
        // If completed, return the data
        if (status === "completed") {
            return data;
        }
        // Wait 2 seconds before next retry
        await new Promise((resolve)=>setTimeout(resolve, 2000));
    }
    throw new Error("Analysis timed out");
}
async function POST(request) {
    try {
        const { url } = await request.json();
        console.log("[v0] Scanning URL:", url);
        if (!url) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "URL is required"
            }, {
                status: 400
            });
        }
        if (!VIRUSTOTAL_API_KEY) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "VirusTotal API key not configured"
            }, {
                status: 500
            });
        }
        const urlId = Buffer.from(url).toString("base64").replace(/=/g, "");
        console.log("[v0] Checking for cached results, URL ID:", urlId);
        const cachedResponse = await fetch(`${VIRUSTOTAL_API_URL}/urls/${urlId}`, {
            headers: {
                "x-apikey": VIRUSTOTAL_API_KEY
            }
        });
        if (cachedResponse.ok) {
            console.log("[v0] Found cached results");
            const cachedData = await parseJsonResponse(cachedResponse);
            const stats = cachedData.data.attributes.last_analysis_stats;
            console.log("[v0] Cached stats received:", JSON.stringify(stats));
            // VirusTotal returns these exact field names
            const result = {
                harmless: stats.harmless || 0,
                suspicious: stats.suspicious || 0,
                malicious: stats.malicious || 0,
                undetected: stats.undetected || 0
            };
            console.log("[v0] Parsed result:", JSON.stringify(result));
            let status = "safe";
            if (result.malicious > 0) {
                status = "malicious";
            } else if (result.suspicious > 0) {
                status = "suspicious";
            }
            console.log("[v0] Final status:", status);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status,
                stats: result,
                permalink: `https://www.virustotal.com/gui/url/${urlId}`
            });
        }
        console.log("[v0] No cached results, submitting for new scan");
        const submitResponse = await fetch(`${VIRUSTOTAL_API_URL}/urls`, {
            method: "POST",
            headers: {
                "x-apikey": VIRUSTOTAL_API_KEY,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `url=${encodeURIComponent(url)}`
        });
        if (!submitResponse.ok) {
            const errorText = await submitResponse.text();
            console.error("[v0] Submit error:", errorText);
            throw new Error("Failed to submit URL to VirusTotal");
        }
        const submitData = await parseJsonResponse(submitResponse);
        const analysisId = submitData.data.id;
        console.log("[v0] Analysis ID:", analysisId);
        const analysisData = await waitForAnalysis(analysisId);
        const stats = analysisData.data.attributes.stats;
        console.log("[v0] Analysis stats:", JSON.stringify(stats));
        const result = {
            harmless: stats.harmless || 0,
            suspicious: stats.suspicious || 0,
            malicious: stats.malicious || 0,
            undetected: stats.undetected || 0
        };
        // Determine status
        let status = "safe";
        if (result.malicious > 0) {
            status = "malicious";
        } else if (result.suspicious > 0) {
            status = "suspicious";
        }
        console.log("[v0] Final status:", status);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status,
            stats: result,
            permalink: `https://www.virustotal.com/gui/url/${urlId}`
        });
    } catch (error) {
        console.error("[v0] Error scanning URL:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : "Failed to scan URL"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2ddc6b91._.js.map