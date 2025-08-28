// Self-Healing Protocol for the S.A.I.N.T. Crypto Intelligence System

class SelfHealing {
    constructor() {
        this.healthStatus = {
            system: 'initializing',
            dataService: 'unknown',
            mlModels: 'unknown',
            apis: 'unknown',
            lastCheck: null
        };
        
        this.errorLog = [];
        this.recoveryAttempts = 0;
        this.maxRecoveryAttempts = 5;
    }

    // Initialize self-healing system
    initialize() {
        console.log("Initializing self-healing protocol...");
        
        // Set up periodic health checks
        setInterval(() => {
            this.checkSystemHealth();
        }, 30000); // Check every 30 seconds
        
        this.healthStatus.system = 'operational';
        this.healthStatus.lastCheck = new Date();
        
        console.log("Self-healing protocol initialized");
    }

    // Check overall system health
    async checkSystemHealth() {
        console.log("Performing system health check...");
        
        const healthCheck = {
            timestamp: new Date(),
            dataService: await this.checkDataService(),
            mlModels: await this.checkMLModels(),
            apis: await this.checkAPIs(),
            overall: 'healthy'
        };
        
        // Determine overall health status
        if (healthCheck.dataService.status === 'unhealthy' || 
            healthCheck.mlModels.status === 'unhealthy' ||
            healthCheck.apis.status === 'unhealthy') {
            healthCheck.overall = 'degraded';
        }
        
        if (healthCheck.dataService.status === 'critical' || 
            healthCheck.mlModels.status === 'critical') {
            healthCheck.overall = 'critical';
        }
        
        // Update health status
        this.healthStatus.dataService = healthCheck.dataService.status;
        this.healthStatus.mlModels = healthCheck.mlModels.status;
        this.healthStatus.apis = healthCheck.apis.status;
        this.healthStatus.lastCheck = healthCheck.timestamp;
        
        // Log health check
        this.errorLog.push({
            type: 'health_check',
            severity: healthCheck.overall === 'healthy' ? 'info' : 'warning',
            message: `System health check: ${healthCheck.overall}`,
            timestamp: healthCheck.timestamp,
            details: healthCheck
        });
        
        // Trigger recovery if needed
        if (healthCheck.overall !== 'healthy') {
            await this.attemptRecovery(healthCheck);
        }
        
        return healthCheck;
    }

    // Check data service health
    async checkDataService() {
        try {
            const isConnected = dataService.isDataServiceConnected();
            const hasData = dataService.getAllCoinData().length > 0;
            
            if (isConnected && hasData) {
                return { status: 'healthy', message: 'Data service is operational' };
            } else if (!isConnected) {
                return { status: 'unhealthy', message: 'Data service is not connected' };
            } else {
                return { status: 'critical', message: 'Data service has no data' };
            }
        } catch (error) {
            return { status: 'critical', message: `Data service error: ${error.message}` };
        }
    }

    // Check ML models health
    async checkMLModels() {
        try {
            const modelInfo = mlModels.getModelInfo();
            
            if (modelInfo.isInitialized) {
                return { status: 'healthy', message: 'ML models are operational' };
            } else {
                return { status: 'critical', message: 'ML models are not initialized' };
            }
        } catch (error) {
            return { status: 'critical', message: `ML models error: ${error.message}` };
        }
    }

    // Check API connections
    async checkAPIs() {
        // In a real implementation, we would ping the APIs
        // For this demo, we'll simulate API checks
        
        const apiStatus = {
            coinMarketCap: Math.random() > 0.2 ? 'healthy' : 'unhealthy',
            twitter: Math.random() > 0.3 ? 'healthy' : 'unhealthy',
            news: Math.random() > 0.1 ? 'healthy' : 'unhealthy'
        };
        
        const unhealthyCount = Object.values(apiStatus).filter(status => status !== 'healthy').length;
        
        if (unhealthyCount === 0) {
            return { status: 'healthy', message: 'All APIs are operational', details: apiStatus };
        } else if (unhealthyCount <= 1) {
            return { status: 'unhealthy', message: 'Some APIs are degraded', details: apiStatus };
        } else {
            return { status: 'critical', message: 'Multiple APIs are unavailable', details: apiStatus };
        }
    }

    // Attempt to recover from issues
    async attemptRecovery(healthCheck) {
        console.log("Attempting system recovery...");
        this.recoveryAttempts++;
        
        if (this.recoveryAttempts > this.maxRecoveryAttempts) {
            console.error("Max recovery attempts reached. Manual intervention may be required.");
            this.errorLog.push({
                type: 'recovery_failed',
                severity: 'critical',
                message: 'Maximum recovery attempts reached',
                timestamp: new Date(),
                details: { recoveryAttempts: this.recoveryAttempts }
            });
            return false;
        }
        
        // Attempt to recover data service if needed
        if (healthCheck.dataService.status !== 'healthy') {
            console.log("Attempting to recover data service...");
            try {
                await dataService.initialize();
            } catch (error) {
                console.error("Failed to recover data service:", error);
            }
        }
        
        // Attempt to recover ML models if needed
        if (healthCheck.mlModels.status !== 'healthy') {
            console.log("Attempting to recover ML models...");
            try {
                await mlModels.initialize();
            } catch (error) {
                console.error("Failed to recover ML models:", error);
            }
        }
        
        // Log recovery attempt
        this.errorLog.push({
            type: 'recovery_attempt',
            severity: 'warning',
            message: `Recovery attempt ${this.recoveryAttempts}`,
            timestamp: new Date(),
            details: { healthCheck }
        });
        
        // Reset recovery attempts if system is now healthy
        const newHealthCheck = await this.checkSystemHealth();
        if (newHealthCheck.overall === 'healthy') {
            this.recoveryAttempts = 0;
            console.log("System recovery successful");
            return true;
        }
        
        console.log("System recovery partially successful");
        return false;
    }

    // Get current health status
    getHealthStatus() {
        return this.healthStatus;
    }

    // Get error log
    getErrorLog(limit = 20) {
        return this.errorLog.slice(-limit);
    }

    // Add error to log
    logError(type, severity, message, details = null) {
        const errorEntry = {
            type,
            severity,
            message,
            timestamp: new Date(),
            details
        };
        
        this.errorLog.push(errorEntry);
        
        // Trigger recovery for critical errors
        if (severity === 'critical') {
            this.attemptRecovery({ overall: 'critical' });
        }
        
        return errorEntry;
    }

    // Reset recovery attempts
    resetRecoveryAttempts() {
        this.recoveryAttempts = 0;
        console.log("Recovery attempts reset");
    }
}

// Create global instance
const selfHealing = new SelfHealing();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SelfHealing;
}
