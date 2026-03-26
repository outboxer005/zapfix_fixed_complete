/**
 * Command Safety Inspector
 * Validates and analyzes commands for safety and potential harm
 */

export type CommandRiskLevel = "safe" | "caution" | "warning" | "critical"

export type CommandCategory =
  | "info"
  | "file_operation"
  | "system_control"
  | "network"
  | "package_management"
  | "security"
  | "development"
  | "other"

export interface CommandAnalysis {
  command: string
  category: CommandCategory
  riskLevel: CommandRiskLevel
  harmfulPatterns: string[]
  concerns: string[]
  suggestions: string[]
  isBlocked: boolean
  blockReason?: string
  explanation: string
  estimatedImpact: {
    system: boolean
    files: boolean
    network: boolean
    security: boolean
  }
}

/**
 * Command inspector for analyzing command safety
 */
export const CommandInspector = {
  /**
   * Harmful command patterns that should be blocked
   */
  BLOCKED_PATTERNS: [
    /rm\s+-rf\s+\/(?!tmp|var|home|[^/]+\/)/,  // rm -rf / protection
    /del\s+.*[C-Z]:\\/,  // del C:\/ D:\/ etc
    /format\s+[C-Z]:/,  // format C: D: etc
    /shutdown\s*(-s|-h|\/s)/,  // shutdown commands
    /taskkill\s+\/F\s+\/IM\s+svchost/,  // critical service termination
    /net\s+stop\s+(windows|security|firewall)/i,  // stop critical services
    /bcdedit\s+\/delete/,  // delete boot entries
    /diskpart/,  // disk partitioning tool
    /fdisk/,  // fdisk command
    /mkfs/,  // make filesystem
    /dd\s+if=.*of=\/dev[a-z0-9]*/i,  // raw disk operations
    /chmod\s+777\s+\/(?!tmp|home|[^/]+\/)/,  // chmod 777 on root
    /chown\s+-R\s+.*\/(?!tmp|home|[^/]+\/)/,  // chown -R on root
    /sudo\s+rm\s+-rf\s+\/(?!tmp|var|home)/i,  // sudo rm -rf on root
    /remove-item\s+.*(-recurse|\/s).*(-force|\/q)/i,  // PowerShell recursive forced delete
    /remove-item\s+.*\*.*(-recurse|\/s)?/i,  // wildcard delete in PowerShell
    /rmdir\s+\/s\s+\/q/i,  // Windows recursive quiet directory delete
    /rd\s+\/s\s+\/q/i,  // Windows recursive quiet directory delete (short form)
    /wget.*eval/i,  // download and execute
    /curl.*eval/i,  // download and execute
    /\|\s*sh\s*-c\s*.*rm/i,  // pipe to shell with rm
    /\|\s*bash\s+-c\s*.*rm/i,  // pipe to bash with rm
  ],

  /**
   * Warning patterns that require careful review
   */
  WARNING_PATTERNS: [
    { pattern: /npm\s+install\s+-g/, reason: "Global npm installation" },
    { pattern: /sudo\s+npm/, reason: "Using sudo with npm" },
    { pattern: /npm\s+audit\s+fix\s+--force/, reason: "Force npm audit fix can break dependencies" },
    { pattern: /pip\s+install\s+--upgrade\s+pip/, reason: "pip upgrade" },
    { pattern: /git\s+push\s+--force/, reason: "Force push can lose commits" },
    { pattern: /git\s+reset\s+--hard/, reason: "Hard reset will lose uncommitted changes" },
    { pattern: /chmod\s+777/, reason: "chmod 777 gives full permissions to everyone" },
    { pattern: /chown\s+-R/, reason: "Recursive ownership change" },
    { pattern: /docker\s+run\s+-i?\s+-t\s+--rm/, reason: "Docker container execution" },
    { pattern: /systemctl\s+(start|stop|restart)\s+/, reason: "System service control" },
    { pattern: /curl\s+.*-x\s+/i, reason: "Proxy usage in curl" },
  ],

  /**
   * Safe command patterns
   */
  SAFE_PATTERNS: [
    /npm\s+list/,  // npm list
    /npm\s+info/,  // npm info
    /npm\s+search/,  // npm search
    /git\s+status/,  // git status
    /git\s+log/,  // git log
    /git\s+branch/,  // git branch
    /ls\s+|dir\s+|pwd\s+|echo\s+/,  // listing and info
    /node\s+--version/,  // version checks
    /npm\s+--version/,  // version checks
  ],

  /**
   * Analyze a command for safety
   */
  analyze(command: string): CommandAnalysis {
    const trimmedCommand = command.trim().toLowerCase()

    // Check if command is blocked
    for (const pattern of this.BLOCKED_PATTERNS) {
      if (pattern.test(trimmedCommand)) {
        return {
          command,
          category: "security",
          riskLevel: "critical",
          harmfulPatterns: [pattern.source],
          concerns: ["This command is blocked for safety reasons"],
          suggestions: [
            "This operation is too dangerous and is blocked to prevent system damage",
            "If you believe this is safe, consider using specific sub-commands",
          ],
          isBlocked: true,
          blockReason: "Matches blocked command pattern - potential system damage",
          explanation: "This command pattern is known to cause severe system damage and is blocked",
          estimatedImpact: {
            system: true,
            files: true,
            network: false,
            security: true,
          },
        }
      }
    }

    // Check category and risk level
    const category = this.categorizeCommand(trimmedCommand)
    const harmfulPatterns = this.findHarmfulPatterns(trimmedCommand)
    const riskLevel = this.calculateRiskLevel(category, harmfulPatterns.length)

    // Get concerns based on category
    const concerns = this.getCommandConcerns(trimmedCommand, category)
    const suggestions = this.getSuggestions(trimmedCommand, category, riskLevel)

    return {
      command,
      category,
      riskLevel,
      harmfulPatterns: harmfulPatterns.map((p) => p.reason),
      concerns,
      suggestions,
      isBlocked: false,
      explanation: this.getExplanation(category, riskLevel),
      estimatedImpact: {
        system: category === "system_control",
        files: category === "file_operation",
        network: category === "network",
        security: category === "security" || riskLevel === "critical",
      },
    }
  },

  /**
   * Categorize command
   */
  categorizeCommand(command: string): CommandCategory {
    if (/^(ls|dir|pwd|echo|cat|grep|find|locate|which|type)\s+/.test(command)) return "info"
    if (/^(cp|mv|rm|mkdir|rmdir|touch|chmod|chown|chgrp|ln|tar|zip|unzip)\s+/.test(command))
      return "file_operation"
    if (/^(shutdown|reboot|restart|service|systemctl|uptime|ps|top|kill|pkill)\s+/.test(command))
      return "system_control"
    if (/^(ping|curl|wget|netstat|nc|nslookup|tracert|curl|ssh|scp|ftp|telnet)\s+/.test(command))
      return "network"
    if (/^(npm|pip|apt|yum|brew|choco|yarn|pnpm|bun)\s+/.test(command)) return "package_management"
    if (/^(sudo|su|passwd|useradd|userdel|usermod|groupadd|chmod|chown|setfacl|semanage)\s+/.test(command))
      return "security"
    if (/^(git|svn|hg|node|python|ruby|java|gcc|make|cmake|cargo|docker|docker-compose)\s+/.test(command))
      return "development"
    return "other"
  },

  /**
   * Find harmful patterns in command
   */
  findHarmfulPatterns(command: string): Array<{ pattern: RegExp; reason: string }> {
    const found: Array<{ pattern: RegExp; reason: string }> = []

    for (const { pattern, reason } of this.WARNING_PATTERNS) {
      if (pattern.test(command)) {
        found.push({ pattern, reason })
      }
    }

    return found
  },

  /**
   * Calculate risk level based on category and harmful patterns
   */
  calculateRiskLevel(category: CommandCategory, harmfulCount: number): CommandRiskLevel {
    if (harmfulCount > 2) return "critical"
    if (harmfulCount > 1) return "warning"
    if (harmfulCount > 0) return "caution"

    switch (category) {
      case "system_control":
      case "security":
        return "warning"
      case "file_operation":
      case "package_management":
        return "caution"
      case "network":
        return "caution"
      default:
        return "safe"
    }
  },

  /**
   * Get command concerns
   */
  getCommandConcerns(command: string, category: CommandCategory): string[] {
    const concerns: string[] = []

    if (category === "file_operation") {
      if (/\brm\b/.test(command)) concerns.push("Will permanently delete files")
      if (/--force|-f/.test(command)) concerns.push("Force flag will bypass safety confirmations")
      if (/--recursive|-r|-R/.test(command)) concerns.push("Will recursively process directories")
    }

    if (category === "system_control") {
      concerns.push("This command affects system-level operations")
      if (/sudo\s+/.test(command)) concerns.push("Requires elevated privileges")
    }

    if (category === "security") {
      concerns.push("This command affects security or permissions")
      if (/chmod/.test(command)) concerns.push("Changing file permissions")
      if (/chown/.test(command)) concerns.push("Changing file ownership")
    }

    if (category === "package_management") {
      if (/-g|--global/.test(command)) concerns.push("Will install globally")
      if (/install/.test(command) && !command.includes("--registry")) {
        concerns.push("Installing from default registry - verify package authenticity")
      }
    }

    return concerns
  },

  /**
   * Get suggestions based on command analysis
   */
  getSuggestions(command: string, category: CommandCategory, riskLevel: CommandRiskLevel): string[] {
    const suggestions: string[] = []

    if (riskLevel === "critical") {
      suggestions.push("⛔ This command is BLOCKED. It poses severe risks to system stability")
      return suggestions
    }

    if (riskLevel === "warning") {
      suggestions.push("⚠️ Verify this is intentional before execution")
      suggestions.push("Consider testing on a non-critical system first")
    }

    if (riskLevel === "caution") {
      suggestions.push("📋 Review the command parameters carefully")
      if (category === "file_operation") {
        suggestions.push("Consider creating a backup before running file operations")
      }
    }

    if (category === "package_management") {
      suggestions.push("Verify the package source and name to prevent typosquatting attacks")
      suggestions.push("Check package reviews and download statistics")
    }

    if (category === "security") {
      suggestions.push("Ensure you understand the permission implications")
    }

    if (category === "network") {
      suggestions.push("Ensure network connectivity before running")
      if (/curl|wget/.test(command) && /\|/.test(command)) {
        suggestions.push("⚠️ Avoid piping downloaded content directly to shell - download first, inspect, then execute")
      }
    }

    if (category === "development") {
      suggestions.push("Ensure development tools are properly installed")
    }

    return suggestions
  },

  /**
   * Get risk explanation
   */
  getExplanation(category: CommandCategory, riskLevel: CommandRiskLevel): string {
    const categoryDesc = {
      info: "Information retrieval command",
      file_operation: "File system operation",
      system_control: "System control command",
      network: "Network operation",
      package_management: "Package manager command",
      security: "Security/permission-related command",
      development: "Development tool command",
      other: "Other command",
    }

    const riskDesc = {
      safe: "This command appears to be safe for general use",
      caution: "This command requires some caution - review parameters before execution",
      warning: "This command has potential risks - ensure it is what you intend",
      critical: "This command is blocked - it poses severe risks to system stability",
    }

    return `${categoryDesc[category]} - Risk Level: ${riskLevel}\n${riskDesc[riskLevel]}`
  },

  /**
   * Get risk color for UI
   */
  getRiskColor(riskLevel: CommandRiskLevel): string {
    switch (riskLevel) {
      case "safe":
        return "#10b981" // green
      case "caution":
        return "#f59e0b" // amber
      case "warning":
        return "#f97316" // orange
      case "critical":
        return "#ef4444" // red
      default:
        return "#6b7280" // gray
    }
  },

  /**
   * Get risk icon for UI
   */
  getRiskIcon(riskLevel: CommandRiskLevel): string {
    switch (riskLevel) {
      case "safe":
        return "✓"
      case "caution":
        return "⚠"
      case "warning":
        return "⚠"
      case "critical":
        return "✕"
      default:
        return "?"
    }
  },

  /**
   * Check if command can be executed
   */
  canExecute(analysis: CommandAnalysis): boolean {
    return !analysis.isBlocked && analysis.riskLevel !== "critical"
  },

  /**
   * Suggest safe alternatives
   */
  suggestAlternatives(command: string): string[] {
    const alternatives: string[] = []

    if (/rm\s+-rf\s+/.test(command)) {
      alternatives.push('Consider using "rm -rf" with confirmation: rm -i')
      alternatives.push("Or use a file manager with trash/recycle bin")
    }

    if (/git\s+push\s+--force/.test(command)) {
      alternatives.push("Use git push --force-with-lease (safer force push)")
      alternatives.push("Coordinate with team members before using force push")
    }

    if (/npm\s+install\s+-g/.test(command)) {
      alternatives.push("Consider using local installation and npx instead")
      alternatives.push("Use a version manager like nvm instead of global install")
    }

    if (/sudo/.test(command)) {
      alternatives.push("Verify if elevated privileges are truly necessary")
      alternatives.push("Consider fixing permissions instead of using sudo")
    }

    return alternatives
  },
}
