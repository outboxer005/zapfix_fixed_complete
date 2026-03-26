/**
 * System Information Utilities
 * Provides system health information and monitoring
 */

export interface SystemHealth {
  timestamp: Date
  cpu: CPUHealth
  memory: MemoryHealth
  disk: DiskHealth
  network: NetworkHealth
  processes: ProcessHealth
  services: ServiceHealth
}

export interface CPUHealth {
  usage: number // percentage
  temperature?: number // celsius
  cores: number
  model: string
  speed: string
}

export interface MemoryHealth {
  total: number // bytes
  used: number // bytes
  free: number // bytes
  usagePercent: number
}

export interface DiskHealth {
  total: number // bytes
  used: number // bytes
  free: number // bytes
  usagePercent: number
  ioWait?: number
}

export interface NetworkHealth {
  isConnected: boolean
  latency?: number // ms
  bandwidth?: {
    download: number // Mbps
    upload: number // Mbps
  }
  activeConnections: number
}

export interface ProcessHealth {
  count: number
  topProcesses: Array<{
    name: string
    pid: number
    memory: number
    cpu: number
  }>
}

export interface ServiceHealth {
  critical: string[] // critical services
  running: number
  stopped: number
  errors: string[]
}

/**
 * System information collector
 */
export const SystemInfoUtilities = {
  /**
   * Get current system health
   */
  async getSystemHealth(): Promise<SystemHealth> {
    return {
      timestamp: new Date(),
      cpu: await this.getCPUHealth(),
      memory: await this.getMemoryHealth(),
      disk: await this.getDiskHealth(),
      network: await this.getNetworkHealth(),
      processes: await this.getProcessHealth(),
      services: await this.getServiceHealth(),
    }
  },

  /**
   * Get CPU information
   */
  async getCPUHealth(): Promise<CPUHealth> {
    // In production, would use system APIs
    return {
      usage: Math.floor(Math.random() * 80) + 10,
      cores: 8,
      model: "Intel Core i7-13700K",
      speed: "3.4 GHz",
    }
  },

  /**
   * Get memory information
   */
  async getMemoryHealth(): Promise<MemoryHealth> {
    // In production, would use system APIs
    const total = 16 * 1024 * 1024 * 1024 // 16GB
    const used = Math.floor(total * (Math.random() * 0.6 + 0.2))
    const free = total - used

    return {
      total,
      used,
      free,
      usagePercent: Math.round((used / total) * 100),
    }
  },

  /**
   * Get disk information
   */
  async getDiskHealth(): Promise<DiskHealth> {
    // In production, would use system APIs
    const total = 512 * 1024 * 1024 * 1024 // 512GB
    const used = Math.floor(total * (Math.random() * 0.4 + 0.2))
    const free = total - used

    return {
      total,
      used,
      free,
      usagePercent: Math.round((used / total) * 100),
    }
  },

  /**
   * Get network information
   */
  async getNetworkHealth(): Promise<NetworkHealth> {
    // In production, would use system APIs
    const isOnline = typeof navigator !== "undefined" && navigator.onLine

    return {
      isConnected: isOnline,
      latency: isOnline ? Math.round(Math.random() * 50) + 10 : undefined,
      bandwidth: isOnline
        ? {
            download: Math.round(Math.random() * 100) + 50,
            upload: Math.round(Math.random() * 50) + 20,
          }
        : undefined,
      activeConnections: isOnline ? Math.floor(Math.random() * 50) + 10 : 0,
    }
  },

  /**
   * Get process information
   */
  async getProcessHealth(): Promise<ProcessHealth> {
    // In production, would use system APIs
    return {
      count: Math.floor(Math.random() * 150) + 50,
      topProcesses: [
        {
          name: "chrome.exe",
          pid: 1234,
          memory: 512 * 1024 * 1024, // 512MB
          cpu: 15,
        },
        {
          name: "code.exe",
          pid: 5678,
          memory: 256 * 1024 * 1024, // 256MB
          cpu: 8,
        },
        {
          name: "node.exe",
          pid: 9012,
          memory: 128 * 1024 * 1024, // 128MB
          cpu: 5,
        },
      ],
    }
  },

  /**
   * Get service health
   */
  async getServiceHealth(): Promise<ServiceHealth> {
    // In production, would query system services
    return {
      critical: ["wuauserv", "NcbService", "WinDefend"],
      running: 45,
      stopped: 3,
      errors: ["AudioEndpointBuilder - Error loading user profile"],
    }
  },

  /**
   * Format bytes to human readable string
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  },

  /**
   * Get health status based on thresholds
   */
  getHealthStatus(health: SystemHealth): "healthy" | "warning" | "critical" {
    let issues = 0
    let critical = 0

    // Check CPU
    if (health.cpu.usage > 80) {
      issues++
      if (health.cpu.usage > 95) critical++
    }

    // Check memory
    if (health.memory.usagePercent > 80) {
      issues++
      if (health.memory.usagePercent > 95) critical++
    }

    // Check disk
    if (health.disk.usagePercent > 85) {
      issues++
      if (health.disk.usagePercent > 95) critical++
    }

    // Check network
    if (!health.network.isConnected) {
      issues++
      critical++
    }

    // Check services
    if (health.services.errors.length > 0) {
      issues += health.services.errors.length
    }

    if (critical > 0) return "critical"
    if (issues > 2) return "warning"
    return "healthy"
  },

  /**
   * Get health suggestions based on current health
   */
  getHealthSuggestions(health: SystemHealth): string[] {
    const suggestions: string[] = []

    // CPU suggestions
    if (health.cpu.usage > 75) {
      suggestions.push("💡 High CPU usage detected. Consider closing unnecessary applications.")
    }

    // Memory suggestions
    if (health.memory.usagePercent > 80) {
      suggestions.push("💡 Memory usage is high. Consider restarting your system or closing memory-intensive apps.")
    }

    // Disk suggestions
    if (health.disk.usagePercent > 85) {
      suggestions.push("💡 Disk space is running low. Consider cleaning up temporary files or uninstalling unused software.")
    }

    if (health.disk.usagePercent > 95) {
      suggestions.push(
        "🚨 CRITICAL: Disk is almost full! Free up space immediately to prevent system crashes."
      )
    }

    // Network suggestions
    if (!health.network.isConnected) {
      suggestions.push("💡 Network connection is offline. Check your internet connection.")
    } else if (health.network.latency && health.network.latency > 100) {
      suggestions.push("💡 Network latency is high. This may affect performance.")
    }

    // Service suggestions
    if (health.services.errors.length > 0) {
      suggestions.push(`💡 ${health.services.errors.length} service(s) have errors. Consider reviewing system services.`)
    }

    // Process suggestions
    if (health.processes.count > 200) {
      suggestions.push("💡 Many processes are running. Consider checking Task Manager for resource-heavy applications.")
    }

    return suggestions
  },

  /**
   * Monitor system health continuously
   */
  createHealthMonitor(
    callback: (health: SystemHealth) => void,
    interval: number = 5000
  ): () => void {
    const monitor = setInterval(async () => {
      const health = await this.getSystemHealth()
      callback(health)
    }, interval)

    return () => clearInterval(monitor)
  },
}

/**
 * System metrics tracker for historical data
 */
export class SystemMetricsTracker {
  private history: SystemHealth[] = []
  private maxHistory: number = 100

  addSample(health: SystemHealth): void {
    this.history.push(health)
    if (this.history.length > this.maxHistory) {
      this.history.shift()
    }
  }

  getHistory(): SystemHealth[] {
    return [...this.history]
  }

  getAverageHealth(): {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
  } {
    if (this.history.length === 0) {
      return { cpuUsage: 0, memoryUsage: 0, diskUsage: 0 }
    }

    const sum = this.history.reduce(
      (acc, health) => ({
        cpu: acc.cpu + health.cpu.usage,
        memory: acc.memory + health.memory.usagePercent,
        disk: acc.disk + health.disk.usagePercent,
      }),
      { cpu: 0, memory: 0, disk: 0 }
    )

    return {
      cpuUsage: Math.round(sum.cpu / this.history.length),
      memoryUsage: Math.round(sum.memory / this.history.length),
      diskUsage: Math.round(sum.disk / this.history.length),
    }
  }

  getMaxHealth(): {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
  } {
    if (this.history.length === 0) {
      return { cpuUsage: 0, memoryUsage: 0, diskUsage: 0 }
    }

    const values = this.history.map((health) => ({
      cpu: health.cpu.usage,
      memory: health.memory.usagePercent,
      disk: health.disk.usagePercent,
    }))

    return {
      cpuUsage: Math.max(...values.map((v) => v.cpu)),
      memoryUsage: Math.max(...values.map((v) => v.memory)),
      diskUsage: Math.max(...values.map((v) => v.disk)),
    }
  }

  clear(): void {
    this.history = []
  }
}
