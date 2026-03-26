/**
 * Developer Requirements Module
 * Tracks and manages developer-centric requirements and developer needs
 */

export interface DeveloperNeed {
  id: string
  category: "tools" | "environment" | "workflow" | "performance" | "security" | "debugging"
  title: string
  description: string
  importance: "critical" | "high" | "medium" | "low"
  fulfilled: boolean
  suggestion?: string
  relatedCommands?: string[]
}

export interface DeveloperProfile {
  needs: DeveloperNeed[]
  skillLevel: "beginner" | "intermediate" | "advanced" | "expert"
  focusAreas: string[]
  preferences: {
    preferredShell: "powershell" | "bash" | "cmd"
    preferredEditor: string
    packageManager: "npm" | "yarn" | "pnpm" | "bun"
  }
}

/**
 * Developer requirements tracker
 */
export const DeveloperRequirements = {
  /**
   * Get common developer needs
   */
  getCommonNeeds(): DeveloperNeed[] {
    return [
      // Tools
      {
        id: "version-control",
        category: "tools",
        title: "Version Control (Git)",
        description: "Essential for tracking code changes and collaboration",
        importance: "critical",
        fulfilled: true,
        suggestion: "Ensure Git is installed and configured with your name and email",
        relatedCommands: [
          "git --version",
          "git config --global user.name 'Your Name'",
          "git config --global user.email 'your@email.com'",
        ],
      },
      {
        id: "package-manager",
        category: "tools",
        title: "Package Manager",
        description: "For managing project dependencies",
        importance: "critical",
        fulfilled: true,
        suggestion: "npm, yarn, pnpm, or bun for Node.js projects",
        relatedCommands: ["npm --version", "npm outdated", "npm audit"],
      },
      {
        id: "node-runtime",
        category: "tools",
        title: "Node.js Runtime",
        description: "JavaScript runtime for development",
        importance: "critical",
        fulfilled: true,
        suggestion: "Install latest LTS version",
        relatedCommands: ["node --version", "npm --version"],
      },
      {
        id: "editor",
        category: "tools",
        title: "Code Editor",
        description: "Primary development environment",
        importance: "high",
        fulfilled: true,
        suggestion: "VS Code is recommended",
        relatedCommands: ["code --version", "code ."],
      },
      {
        id: "terminal",
        category: "tools",
        title: "Terminal/Shell",
        description: "Command-line interface for development",
        importance: "high",
        fulfilled: true,
        suggestion: "PowerShell, Bash, or Zsh depending on your OS",
        relatedCommands: [],
      },

      // Environment
      {
        id: "env-variables",
        category: "environment",
        title: "Environment Variables",
        description: "Configuration through environment variables for different environments",
        importance: "high",
        fulfilled: true,
        suggestion: "Set up .env files for local development",
        relatedCommands: ["env", "echo $PATH"],
      },
      {
        id: "path-config",
        category: "environment",
        title: "System PATH Configuration",
        description: "Ensure executables are in system PATH",
        importance: "high",
        fulfilled: true,
        suggestion: "Add Node.js and other tools to PATH",
        relatedCommands: ["echo $PATH"],
      },
      {
        id: "workspace-setup",
        category: "environment",
        title: "Workspace Setup",
        description: "Organized project directory structure",
        importance: "medium",
        fulfilled: true,
        suggestion: "Create a consistent workspace organization",
        relatedCommands: ["mkdir", "ls -la"],
      },

      // Workflow
      {
        id: "dev-server",
        category: "workflow",
        title: "Development Server",
        description: "Local development server for testing",
        importance: "high",
        fulfilled: true,
        suggestion: "Use npm scripts or framework dev commands",
        relatedCommands: ["npm run dev", "npm start"],
      },
      {
        id: "hot-reload",
        category: "workflow",
        title: "Hot Module Reload",
        description: "Auto-reload changes during development",
        importance: "medium",
        fulfilled: true,
        suggestion: "Configure HMR in your build tool",
        relatedCommands: [],
      },
      {
        id: "linting",
        category: "workflow",
        title: "Code Linting",
        description: "Automated code quality checks",
        importance: "high",
        fulfilled: true,
        suggestion: "Use ESLint for JavaScript/TypeScript",
        relatedCommands: ["npm run lint", "npm run lint:fix"],
      },
      {
        id: "formatting",
        category: "workflow",
        title: "Code Formatting",
        description: "Automatic code formatting",
        importance: "high",
        fulfilled: true,
        suggestion: "Use Prettier for consistent formatting",
        relatedCommands: ["npm run format", "npm run format:check"],
      },
      {
        id: "testing",
        category: "workflow",
        title: "Testing Framework",
        description: "Unit and integration testing",
        importance: "high",
        fulfilled: true,
        suggestion: "Set up Jest, Vitest, or similar",
        relatedCommands: ["npm test", "npm run test:watch"],
      },

      // Performance
      {
        id: "build-optimization",
        category: "performance",
        title: "Build Optimization",
        description: "Optimize bundle size and build time",
        importance: "medium",
        fulfilled: false,
        suggestion: "Use code splitting and lazy loading, analyze bundle size",
        relatedCommands: ["npm run build", "npm run analyze"],
      },
      {
        id: "caching",
        category: "performance",
        title: "Caching Strategy",
        description: "Implement efficient caching",
        importance: "medium",
        fulfilled: false,
        suggestion: "Configure npm cache and use package-lock.json",
        relatedCommands: ["npm cache clean --force", "npm ci"],
      },
      {
        id: "monitoring",
        category: "performance",
        title: "Performance Monitoring",
        description: "Track and monitor performance metrics",
        importance: "low",
        fulfilled: false,
        suggestion: "Add performance monitoring tools",
        relatedCommands: [],
      },

      // Security
      {
        id: "dep-security",
        category: "security",
        title: "Dependency Security",
        description: "Keep dependencies secure and updated",
        importance: "high",
        fulfilled: true,
        suggestion: "Regularly run npm audit and update dependencies",
        relatedCommands: [
          "npm audit",
          "npm audit fix",
          "npm outdated",
          "npm update",
        ],
      },
      {
        id: "secrets-management",
        category: "security",
        title: "Secrets Management",
        description: "Securely manage API keys and secrets",
        importance: "high",
        fulfilled: true,
        suggestion: "Use .env files and environment variables",
        relatedCommands: [],
      },
      {
        id: "access-control",
        category: "security",
        title: "Access Control",
        description: "Proper file and directory permissions",
        importance: "medium",
        fulfilled: true,
        suggestion: "Set appropriate file permissions",
        relatedCommands: ["chmod", "chown"],
      },

      // Debugging
      {
        id: "debugger",
        category: "debugging",
        title: "Debugger",
        description: "Node.js debugger or browser dev tools",
        importance: "high",
        fulfilled: true,
        suggestion: "Use built-in Node debugger or VS Code debugging",
        relatedCommands: ["node --inspect", "node --inspect-brk"],
      },
      {
        id: "logging",
        category: "debugging",
        title: "Structured Logging",
        description: "Proper logging for debugging",
        importance: "high",
        fulfilled: true,
        suggestion: "Set up winston, pino, or similar logging",
        relatedCommands: [],
      },
      {
        id: "error-tracking",
        category: "debugging",
        title: "Error Tracking",
        description: "Track and monitor application errors",
        importance: "medium",
        fulfilled: false,
        suggestion: "Use Sentry or similar error tracking service",
        relatedCommands: [],
      },
    ]
  },

  /**
   * Get developer profile based on skill level
   */
  getDeveloperProfile(skillLevel: "beginner" | "intermediate" | "advanced" | "expert"): DeveloperProfile {
    const allNeeds = this.getCommonNeeds()

    const profileBySkill = {
      beginner: {
        needsSubset: allNeeds.slice(0, 10),
        focusAreas: ["basics", "tools", "workflow"],
        preferences: {
          preferredShell: "powershell" as const,
          preferredEditor: "VS Code",
          packageManager: "npm" as const,
        },
      },
      intermediate: {
        needsSubset: allNeeds.slice(0, 18),
        focusAreas: ["workflow", "performance", "security"],
        preferences: {
          preferredShell: "powershell" as const,
          preferredEditor: "VS Code",
          packageManager: "npm" as const,
        },
      },
      advanced: {
        needsSubset: allNeeds,
        focusAreas: ["performance", "security", "debugging", "optimization"],
        preferences: {
          preferredShell: "powershell" as const,
          preferredEditor: "VS Code",
          packageManager: "bun" as const,
        },
      },
      expert: {
        needsSubset: allNeeds,
        focusAreas: ["everything"],
        preferences: {
          preferredShell: "powershell" as const,
          preferredEditor: "any",
          packageManager: "bun" as const,
        },
      },
    }

    const profile = profileBySkill[skillLevel]
    return {
      needs: profile.needsSubset,
      skillLevel,
      focusAreas: profile.focusAreas,
      preferences: profile.preferences,
    }
  },

  /**
   * Get recommended commands by category
   */
  getRecommendedCommands(category: string): Array<{ command: string; description: string }> {
    const commands: Record<string, Array<{ command: string; description: string }>> = {
      daily: [
        { command: "npm run dev", description: "Start development server" },
        { command: "npm run lint", description: "Run code linter" },
        { command: "npm test", description: "Run tests" },
        { command: "git status", description: "Check git status" },
        { command: "git add .", description: "Stage all changes" },
        { command: "git commit -m 'message'", description: "Commit changes" },
      ],
      maintenance: [
        { command: "npm audit", description: "Check for vulnerabilities" },
        { command: "npm update", description: "Update dependencies" },
        { command: "npm outdated", description: "List outdated packages" },
        { command: "npm cache clean --force", description: "Clean npm cache" },
        { command: "git gc", description: "Optimize git repository" },
      ],
      debugging: [
        { command: "node --inspect app.js", description: "Debug Node.js with inspector" },
        { command: "npm run dev -- --debug", description: "Run with debug flags" },
        { command: "console.log()", description: "Basic logging" },
        { command: "debugger", description: "Debug statement in code" },
      ],
      security: [
        { command: "npm audit fix", description: "Fix vulnerabilities" },
        { command: "npm audit fix --force", description: "Force fix vulnerabilities" },
        { command: "npm ci", description: "Clean install dependencies" },
        { command: "git log --all", description: "Review all commits" },
      ],
      performance: [
        { command: "npm run build", description: "Build for production" },
        { command: "npm run build:analyze", description: "Analyze bundle size" },
        { command: "npm run build -- --profile", description: "Profile build" },
      ],
    }

    return commands[category] || []
  },

  /**
   * Get quick setup commands
   */
  getQuickSetupCommands(): string[] {
    return [
      "npm install",
      "npm run prepare",
      "git config --global core.autocrlf true",
      "npm run lint:fix",
      "npm test",
      "npm run build",
    ]
  },

  /**
   * Get environment check commands
   */
  getEnvironmentCheckCommands(): string[] {
    return [
      "node --version",
      "npm --version",
      "git --version",
      "npm config get registry",
      "echo $PATH",
      "which node",
      "which npm",
      "which git",
    ]
  },

  /**
   * Get optimization suggestions
   */
  getOptimizationSuggestions(): string[] {
    return [
      "Use npm ci instead of npm install in CI/CD pipelines",
      "Implement code splitting and lazy loading",
      "Use tree-shaking to remove dead code",
      "Minify and compress assets",
      "Use CDN for static assets",
      "Implement caching headers",
      "Monitor bundle size changes",
      "Use performance monitoring tools",
      "Optimize database queries",
      "Implement rate limiting",
    ]
  },
}
