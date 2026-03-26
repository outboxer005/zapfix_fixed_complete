import { createSignal, onMount, Show, For, batch, createMemo } from "solid-js"
import { SystemDiagnostics, type FullSystemCheck } from "@/utils/system-diagnostics"
import { CommandInspector, type CommandAnalysis } from "@/utils/command-safety-inspector"
import { CommandExecutionEngine, type CommandExecutionResult } from "@/utils/command-execution-engine"
import { DeveloperRequirements } from "@/utils/developer-requirements"

/**
 * Full System Diagnostic Component
 * Comprehensive system health check and developer requirements
 */
export default function FullDiagnosticsPage() {
  const [systemCheck, setSystemCheck] = createSignal<FullSystemCheck | null>(null)
  const [isRunning, setIsRunning] = createSignal(false)
  const [activeTab, setActiveTab] = createSignal<"system" | "developer" | "commands">("system")
  const [commandInput, setCommandInput] = createSignal("")
  const [commandAnalysis, setCommandAnalysis] = createSignal<CommandAnalysis | null>(null)
  const [selectedShell, setSelectedShell] = createSignal<"powershell" | "bash" | "cmd">("powershell")
  const [executionResult, setExecutionResult] = createSignal<CommandExecutionResult | null>(null)
  const [isExecuting, setIsExecuting] = createSignal(false)
  const [checkHistory, setCheckHistory] = createSignal<FullSystemCheck[]>([])

  onMount(() => {
    // Auto-run initial diagnosis
    runFullDiagnosis()
  })

  /**
   * Run full system diagnosis
   */
  const runFullDiagnosis = async () => {
    batch(() => {
      setIsRunning(true)
    })

    try {
      const result = await SystemDiagnostics.runFullCheck("windows")
      batch(() => {
        setSystemCheck(result)
        setCheckHistory([...checkHistory(), result])
      })
    } catch (error) {
      console.error("Diagnostic check failed:", error)
    } finally {
      setIsRunning(false)
    }
  }

  /**
   * Analyze a command
   */
  const analyzeCommand = (command: string) => {
    if (!command.trim()) {
      setCommandAnalysis(null)
      return
    }

    const analysis = CommandInspector.analyze(command)
    setCommandAnalysis(analysis)
    setExecutionResult(null)
  }

  const executeAnalyzedCommand = async () => {
    const analysis = commandAnalysis()
    if (!analysis) return

    setIsExecuting(true)
    setExecutionResult(null)

    try {
      const result = await CommandExecutionEngine.executeCommand({
        command: analysis.command,
        shell: selectedShell(),
      })
      setExecutionResult(result)
    } finally {
      setIsExecuting(false)
    }
  }

  /**
   * Get status badge color
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  /**
   * Get overall health indicator
   */
  const getHealthIndicator = (check: FullSystemCheck | null) => {
    if (!check) return { color: "gray", text: "Not checked", icon: "?" }

    switch (check.overall.status) {
      case "healthy":
        return { color: "green", text: "Healthy", icon: "✓" }
      case "warning":
        return { color: "yellow", text: "Warning", icon: "⚠" }
      case "critical":
        return { color: "red", text: "Critical", icon: "✕" }
    }
  }

  const health = createMemo(() => getHealthIndicator(systemCheck()))

  return (
    <div class="flex flex-col h-full w-full bg-background-base">
      {/* Header */}
      <div class="flex-shrink-0 p-4 border-b border-border-weak bg-background-base">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-text-base">🔧 Full System Diagnose</h1>
            <p class="text-sm text-text-weak mt-1">
              Comprehensive system health check, developer requirements, and command safety inspector
            </p>
          </div>
          <button
            onClick={runFullDiagnosis}
            disabled={isRunning()}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isRunning() ? "Running..." : "🔄 Run Diagnosis"}
          </button>
        </div>

        {/* Health Status Widget */}
        <Show when={systemCheck()}>
          <div class="grid grid-cols-4 gap-3 text-sm">
            <div class="p-3 bg-background-element rounded-lg border border-border-weak">
              <div class="text-text-weak">Overall Status</div>
              <div class={`text-lg font-bold mt-1 text-${health().color}-600`}>
                {health().icon} {health().text}
              </div>
            </div>
            <div class="p-3 bg-background-element rounded-lg border border-border-weak">
              <div class="text-text-weak">Issues Found</div>
              <div class="text-lg font-bold mt-1 text-text-base">
                {systemCheck()?.overall.issues}
              </div>
            </div>
            <div class="p-3 bg-background-element rounded-lg border border-border-weak">
              <div class="text-text-weak">Critical Issues</div>
              <div class="text-lg font-bold mt-1 text-red-600">
                {systemCheck()?.overall.criticalIssues}
              </div>
            </div>
            <div class="p-3 bg-background-element rounded-lg border border-border-weak">
              <div class="text-text-weak">Check Duration</div>
              <div class="text-lg font-bold mt-1 text-text-base">
                {systemCheck()?.duration}ms
              </div>
            </div>
          </div>
        </Show>
      </div>

      {/* Tabs */}
      <div class="flex-shrink-0 px-4 pt-4 border-b border-border-weak flex gap-2">
        <button
          onClick={() => setActiveTab("system")}
          class={`px-4 py-2 rounded-t-md font-medium transition ${
            activeTab() === "system"
              ? "bg-background-element text-text-base border-b-2 border-blue-600"
              : "text-text-weak hover:text-text-base"
          }`}
        >
          📊 System Health
        </button>
        <button
          onClick={() => setActiveTab("developer")}
          class={`px-4 py-2 rounded-t-md font-medium transition ${
            activeTab() === "developer"
              ? "bg-background-element text-text-base border-b-2 border-blue-600"
              : "text-text-weak hover:text-text-base"
          }`}
        >
          👨‍💻 Developer Needs
        </button>
        <button
          onClick={() => setActiveTab("commands")}
          class={`px-4 py-2 rounded-t-md font-medium transition ${
            activeTab() === "commands"
              ? "bg-background-element text-text-base border-b-2 border-blue-600"
              : "text-text-weak hover:text-text-base"
          }`}
        >
          ⚙️ Command Inspector
        </button>
      </div>

      {/* Content Area */}
      <div class="flex-1 overflow-y-auto">
        {/* System Health Tab */}
        <Show when={activeTab() === "system"}>
          <div class="p-4 space-y-4">
            <Show when={systemCheck()} fallback={<div class="text-text-weak">No diagnostic data yet</div>}>
              <div class="space-y-3">
                <For each={systemCheck()?.results ?? []}>
                  {(result) => (
                    <div class="p-4 bg-background-element rounded-lg border border-border-weak">
                      <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <span
                            class={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(result.status)}`}
                          >
                            {result.status.toUpperCase()}
                          </span>
                          <h3 class="font-semibold text-text-base">{result.name}</h3>
                        </div>
                        <Show when={result.severity}>
                          <span
                            class={`text-xs font-medium px-2 py-1 rounded ${
                              result.severity === "high"
                                ? "bg-red-100 text-red-800"
                                : result.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {result.severity?.toUpperCase()}
                          </span>
                        </Show>
                      </div>

                      <p class="text-sm text-text-weak mb-3">{result.message}</p>

                      <Show when={result.details}>
                        <div class="bg-background-base p-2 rounded text-xs text-text-weak font-mono mb-3">
                          {JSON.stringify(result.details, null, 2)}
                        </div>
                      </Show>

                      <Show when={result.suggestedFix}>
                        <div class="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                          💡 Suggested Fix: {result.suggestedFix}
                        </div>
                      </Show>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </Show>

        {/* Developer Needs Tab */}
        <Show when={activeTab() === "developer"}>
          <div class="p-4 space-y-4">
            <div class="mb-4">
              <h3 class="font-semibold text-text-base mb-3">Developer Requirements & Needs</h3>

              <div class="space-y-3">
                <For each={DeveloperRequirements.getCommonNeeds()}>
                  {(need) => (
                    <div class="p-3 bg-background-element rounded-lg border border-border-weak">
                      <div class="flex items-start justify-between mb-2">
                        <div>
                          <h4 class="font-semibold text-text-base">{need.title}</h4>
                          <p class="text-xs text-text-weak">{need.description}</p>
                        </div>
                        <div class="flex gap-2">
                          <span
                            class={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              need.fulfilled
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {need.fulfilled ? "✓ Fulfilled" : "⚠ Pending"}
                          </span>
                          <span
                            class={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              need.importance === "critical"
                                ? "bg-red-100 text-red-800"
                                : need.importance === "high"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {need.importance.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <Show when={need.suggestion}>
                        <p class="text-sm text-text-weak mb-2 pl-3 border-l-2 border-blue-500">
                          {need.suggestion}
                        </p>
                      </Show>

                      <Show when={need.relatedCommands && need.relatedCommands.length > 0}>
                        <div class="mt-2 space-y-1">
                          <div class="text-xs text-text-weak font-medium">Related Commands:</div>
                          <For each={need.relatedCommands || []}>
                            {(cmd) => (
                              <button
                                onClick={() => {
                                  setCommandInput(cmd)
                                  setActiveTab("commands")
                                }}
                                class="text-xs text-blue-600 hover:underline text-left block pl-3"
                              >
                                $ {cmd}
                              </button>
                            )}
                          </For>
                        </div>
                      </Show>
                    </div>
                  )}
                </For>
              </div>
            </div>

            <div class="mb-4">
              <h3 class="font-semibold text-text-base mb-3">Quick Setup Commands</h3>
              <div class="space-y-2">
                <For each={DeveloperRequirements.getQuickSetupCommands()}>
                  {(cmd) => (
                    <button
                      onClick={() => {
                        setCommandInput(cmd)
                        setActiveTab("commands")
                      }}
                      class="w-full text-left p-2 bg-background-base hover:bg-background-element rounded border border-border-weak transition font-mono text-sm text-text-weak hover:text-text-base"
                    >
                      $ {cmd}
                    </button>
                  )}
                </For>
              </div>
            </div>
          </div>
        </Show>

        {/* Command Inspector Tab */}
        <Show when={activeTab() === "commands"}>
          <div class="p-4 space-y-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-text-base mb-2">
                Enter Command to Analyze
              </label>
              <div class="flex gap-2">
                <select
                  value={selectedShell()}
                  onInput={(e) => setSelectedShell(e.currentTarget.value as "powershell" | "bash" | "cmd")}
                  class="px-3 py-2 bg-background-element border border-border-weak rounded-md text-text-base"
                >
                  <option value="powershell">PowerShell</option>
                  <option value="cmd">CMD</option>
                  <option value="bash">Bash</option>
                </select>
                <input
                  type="text"
                  value={commandInput()}
                  onInput={(e) => {
                    setCommandInput(e.currentTarget.value)
                    analyzeCommand(e.currentTarget.value)
                  }}
                  placeholder="Enter PowerShell/Bash command..."
                  class="flex-1 px-3 py-2 bg-background-element border border-border-weak rounded-md text-text-base placeholder-text-weak focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => analyzeCommand(commandInput())}
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Analyze
                </button>
              </div>
            </div>

            <Show when={commandAnalysis()}>
              {(analysis) => (
                <div class="space-y-4">
                  {/* Risk Overview */}
                  <div class="p-4 bg-background-element rounded-lg border border-border-weak">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="font-semibold text-text-base">Risk Assessment</h4>
                      <span
                        class={`inline-block px-3 py-1 rounded-full font-bold text-white ${
                          analysis().riskLevel === "safe"
                            ? "bg-green-600"
                            : analysis().riskLevel === "caution"
                              ? "bg-yellow-600"
                              : analysis().riskLevel === "warning"
                                ? "bg-orange-600"
                                : "bg-red-600"
                        }`}
                      >
                        {analysis().riskLevel.toUpperCase()}
                      </span>
                    </div>

                    <div class="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <div class="text-text-weak">Category</div>
                        <div class="font-semibold text-text-base">{analysis().category}</div>
                      </div>
                      <div>
                        <div class="text-text-weak">Blocked</div>
                        <div class={`font-semibold ${analysis().isBlocked ? "text-red-600" : "text-green-600"}`}>
                          {analysis().isBlocked ? "YES" : "NO"}
                        </div>
                      </div>
                    </div>

                    <p class="text-sm text-text-weak whitespace-pre-wrap">{analysis().explanation}</p>
                  </div>

                  {/* Concerns */}
                  <Show when={analysis().concerns.length > 0}>
                    <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 class="font-semibold text-yellow-900 mb-2">⚠️ Concerns</h4>
                      <ul class="list-disc list-inside space-y-1 text-sm text-yellow-900">
                        <For each={analysis().concerns}>
                          {(concern) => <li>{concern}</li>}
                        </For>
                      </ul>
                    </div>
                  </Show>

                  {/* Impact Analysis */}
                  <div class="p-4 bg-background-element rounded-lg border border-border-weak">
                    <h4 class="font-semibold text-text-base mb-3">Estimated Impact</h4>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div
                        class={`p-2 rounded ${
                          analysis().estimatedImpact.system
                            ? "bg-red-100 text-red-900"
                            : "bg-green-100 text-green-900"
                        }`}
                      >
                        System: {analysis().estimatedImpact.system ? "YES" : "NO"}
                      </div>
                      <div
                        class={`p-2 rounded ${
                          analysis().estimatedImpact.files
                            ? "bg-red-100 text-red-900"
                            : "bg-green-100 text-green-900"
                        }`}
                      >
                        Files: {analysis().estimatedImpact.files ? "YES" : "NO"}
                      </div>
                      <div
                        class={`p-2 rounded ${
                          analysis().estimatedImpact.network
                            ? "bg-red-100 text-red-900"
                            : "bg-green-100 text-green-900"
                        }`}
                      >
                        Network: {analysis().estimatedImpact.network ? "YES" : "NO"}
                      </div>
                      <div
                        class={`p-2 rounded ${
                          analysis().estimatedImpact.security
                            ? "bg-red-100 text-red-900"
                            : "bg-green-100 text-green-900"
                        }`}
                      >
                        Security: {analysis().estimatedImpact.security ? "YES" : "NO"}
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <Show when={analysis().suggestions.length > 0}>
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 class="font-semibold text-blue-900 mb-2">💡 Suggestions</h4>
                      <ul class="space-y-2 text-sm text-blue-900">
                        <For each={analysis().suggestions}>
                          {(suggestion) => (
                            <li class="flex items-start gap-2">
                              <span class="flex-shrink-0">→</span>
                              <span>{suggestion}</span>
                            </li>
                          )}
                        </For>
                      </ul>
                    </div>
                  </Show>

                  {/* Block Reason */}
                  <Show when={analysis().isBlocked && analysis().blockReason}>
                    <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 class="font-semibold text-red-900 mb-2">🚫 Reason for Blocking</h4>
                      <p class="text-sm text-red-900">{analysis().blockReason}</p>
                    </div>
                  </Show>

                  {/* Execution Button */}
                  <Show
                    when={!analysis().isBlocked}
                    fallback={
                      <button
                        disabled
                        class="w-full px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed opacity-50"
                      >
                        Blocked - Cannot Execute
                      </button>
                    }
                  >
                    <button
                      disabled={isExecuting()}
                      onClick={executeAnalyzedCommand}
                      class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition font-semibold"
                    >
                      {isExecuting() ? "Executing..." : "▶ Execute Command"}
                    </button>
                  </Show>

                  <Show when={executionResult()}>
                    {(result) => (
                      <div
                        classList={{
                          "p-4 rounded-lg border": true,
                          "bg-green-50 border-green-200": result().success,
                          "bg-red-50 border-red-200": !result().success,
                        }}
                      >
                        <h4
                          classList={{
                            "font-semibold mb-2": true,
                            "text-green-900": result().success,
                            "text-red-900": !result().success,
                          }}
                        >
                          {result().success ? "Execution Succeeded" : "Execution Failed"}
                        </h4>
                        <div class="text-xs text-text-weak mb-2">Shell: {selectedShell()}</div>
                        <Show when={result().output}>
                          <pre class="text-xs whitespace-pre-wrap bg-background-base p-2 rounded border border-border-weak overflow-x-auto">
                            {result().output}
                          </pre>
                        </Show>
                        <Show when={result().error}>
                          <div class="text-sm text-red-800 mt-2">{result().error}</div>
                        </Show>
                      </div>
                    )}
                  </Show>
                </div>
              )}
            </Show>
          </div>
        </Show>
      </div>
    </div>
  )
}
