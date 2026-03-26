/**
 * Diagnostic Utilities Index
 * Central export point for all diagnostic tools and utilities
 */

// System Diagnostics
export {
  SystemDiagnostics,
  type DiagnosticResult,
  type FullSystemCheck,
  type SystemInfo,
  type DeveloperRequirements as DeveloperRequirementsType,
  type Requirement,
} from "./system-diagnostics"

// Command Safety Inspector
export {
  CommandInspector,
  type CommandRiskLevel,
  type CommandCategory,
  type CommandAnalysis,
} from "./command-safety-inspector"

// Command Execution Engine
export {
  CommandExecutionEngine,
  type CommandExecutionResult,
  type CommandExecutionRequest,
} from "./command-execution-engine"

// Developer Requirements
export {
  DeveloperRequirements,
  type DeveloperNeed,
  type DeveloperProfile,
} from "./developer-requirements"

// System Info Utilities
export {
  SystemInfoUtilities,
  SystemMetricsTracker,
  type SystemHealth,
  type CPUHealth,
  type MemoryHealth,
  type DiskHealth,
  type NetworkHealth,
  type ProcessHealth,
  type ServiceHealth,
} from "./system-info-utilities"

// Components
export { DiagnoseSidebarButton, DiagnosticStatusBadge } from "@/components/diagnostic-sidebar"
