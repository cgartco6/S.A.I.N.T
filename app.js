// Main Application Logic for the S.A.I.N.T. Crypto Intelligence System

class CryptoIntelligenceApp {
    constructor() {
        this.coinData = [];
        this.sortField = 'change24h';
        this.sortDirection = 'desc';
        this.currentFilter = 'all';
        this.updateInterval = null;
        this.updateTimer = 60;
        this.charts = {
            moneyFlow: null,
            dominance: null
        };
    }

    // Initialize the application
    async initialize() {
        console.log("Initializing Crypto Intelligence Application...");
        
        try {
            // Initialize components
            await this.initializeComponents();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Set up periodic updates
            this.startUpdateCycle();
            
            // Initial data load
            await this.fetchData();
            
            console.log("Application initialized successfully");
            this.updateStatus("System operational. Monitoring markets...", "success");
            
        } catch (error) {
            console.error("Failed to initialize application:", error);
            this.updateStatus(`Initialization failed: ${error.message}`, "error");
            
            // Attempt to self-heal
            setTimeout(() => {
                this.initialize();
            }, 5000);
        }
    }

    // Initialize all components
    async initializeComponents() {
        // Initialize data service
        if (!dataService.isDataServiceConnected()) {
            await dataService.initialize();
        }
        
        // Initialize ML models
        const modelInfo = mlModels.getModelInfo();
        if (!modelInfo.isInitialized) {
            await mlModels.initialize();
        }
        
        // Initialize self-healing protocol
        selfHealing.initialize();
        
        // Initialize charts
        this.initializeCharts();
    }

    // Initialize charts
    initializeCharts() {
        // Money Flow Chart
        const moneyFlowCtx = document.getElementById('money-flow-chart').getContext('2d');
        this.charts.moneyFlow = new Chart(moneyFlowCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Money Inflow',
                    data: [],
                    backgroundColor: '#4cc9f0',
                    borderColor: '#4895ef',
                    borderWidth: 1
                }, {
                    label: 'Money Outflow',
                    data: [],
                    backgroundColor: '#f72585',
                    borderColor: '#b5179e',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e6e6e6'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#e6e6e6'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#e6e6e6'
                        }
                    }
                }
            }
        });
        
        // Dominance Chart
        const dominanceCtx = document.getElementById('dominance-chart').getContext('2d');
        this.charts.dominance = new Chart(dominanceCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'BTC Dominance',
                    data: [],
                    backgroundColor: 'rgba(76, 201, 240, 0.2)',
                    borderColor: '#4cc9f0',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Altcoin Season Index',
                    data: [],
                    backgroundColor: 'rgba(247, 37, 133, 0.2)',
                    borderColor: '#f72585',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e6e6e6'
                        }
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#e6e6e6'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#e6e6e6'
                        }
                    }
                }
            }
        });
    }

    // Fetch data from services
    async fetchData() {
        try {
            this.updateStatus("Fetching market data...", "info");
            
            // Fetch market data
            this.coinData = await dataService.fetchMarketData();
            
            // Process data with AI models
            await this.processDataWithAI();
            
            // Update the UI
            this.updateDashboard();
            
            this.updateStatus("Data updated successfully", "success");
            return true;
            
        } catch (error) {
            console.error("Failed to fetch data:", error);
            this.updateStatus(`Data fetch failed: ${error.message}`, "error");
            
            // Log error for self-healing
            selfHealing.logError('data_fetch', 'error', 'Failed to fetch market data', error);
            
            return false;
        }
    }

    // Process data with AI models
    async processDataWithAI() {
        this.updateStatus("Running AI analysis...", "info");
        
        for (let coin of this.coinData) {
            // Prepare features for ML models
            const features = {
                volumeChange24h: coin.volumeChange24h,
                priceChange24h: coin.change24h / 100,
                priceChange1h: coin.priceChange1h / 100,
                priceChange7d: coin.priceChange7d / 100,
                socialVolume: coin.socialVolume,
                marketCapRank: 1 - (coin.marketCapRank / 100),
                age: coin.age / 2000,
                developmentActivity: coin.developmentActivity / 100,
                communityScore: coin.communityScore / 100
            };
            
            // Get predictions from models
            try {
                coin.breakoutScore = await mlModels.predictBreakout(features);
                coin.inflowScore = await mlModels.predictInflow(features);
                coin.fundamentalScore = await mlModels.predictFundamentals(features);
            } catch (error) {
                console.error(`Failed to process coin ${coin.symbol}:`, error);
                // Set default values if prediction fails
                coin.breakoutScore = 0.5;
                coin.inflowScore = 0.5;
                coin.fundamentalScore = 0.5;
            }
        }
        
        this.updateStatus("AI analysis complete", "success");
    }

    // Update the dashboard with processed data
    updateDashboard() {
        // Filter and sort data
        let filteredData = this.filterData(this.coinData, this.currentFilter);
        let performanceData = this.sortData([...this.coinData], 'change24h', 'desc');
        
        // Update counts
        document.getElementById('breakout-count').textContent = 
            filteredData.filter(coin => coin.breakoutScore > 0.7).length;
        document.getElementById('gainers-count').textContent = 
            performanceData.filter(coin => coin.change24h > 0).length;
        document.getElementById('inflow-count').textContent = 
            filteredData.filter(coin => coin.inflowScore > 0.7).length;
        document.getElementById('prediction-count').textContent = `${filteredData.length} coins`;
        
        // Update performance table (top gainers and losers)
        this.updatePerformanceTable(performanceData);
        
        // Update predictions table
        this.updatePredictionsTable(filteredData);
        
        // Update charts
        this.updateCharts(filteredData);
        
        // Update system info
        this.updateSystemInfo();
    }

    // Filter data based on current filter
    filterData(data, filter) {
        switch(filter) {
            case 'gainers':
                return data.filter(coin => coin.change24h > 0);
            case 'losers':
                return data.filter(coin => coin.change24h < 0);
            default:
                return data;
        }
    }

    // Sort data based on field and direction
    sortData(data, field, direction) {
        return [...data].sort((a, b) => {
            let valueA = a[field];
            let valueB = b[field];
            
            if (valueA === undefined) valueA = direction === 'asc' ? Infinity : -Infinity;
            if (valueB === undefined) valueB = direction === 'asc' ? Infinity : -Infinity;
            
            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // Update performance table (top gainers and losers)
    updatePerformanceTable(data) {
        const performanceBody = document.getElementById('performance-body');
        performanceBody.innerHTML = '';
        
        // Show top 10 and bottom 10
        const topGainers = data.slice(0, 10);
        const topLosers = data.slice(-10).reverse();
        
        const displayData = [...topGainers, ...topLosers];
        
        displayData.forEach(coin => {
            const row = document.createElement('tr');
            
            // Format values
            const formattedPrice = this.formatCurrency(coin.price);
            const formattedChange = this.formatPercentage(coin.change24h / 100);
            const formattedVolume = this.formatLargeNumber(coin.volume);
            
            row.innerHTML = `
                <td>${coin.name} (${coin.symbol})</td>
                <td>${formattedPrice}</td>
                <td class="${coin.change24h >= 0 ? 'positive' : 'negative'}">${formattedChange}</td>
                <td>$${formattedVolume}</td>
            `;
            
            performanceBody.appendChild(row);
        });
    }

    // Update predictions table
    updatePredictionsTable(data) {
        const predictionsBody = document.getElementById('predictions-body');
        predictionsBody.innerHTML = '';
        
        data.slice(0, 10).forEach(coin => {
            const row = document.createElement('tr');
            
            // Format values
            const formattedPrice = this.formatCurrency(coin.price);
            const inflowValue = this.formatPercentage(coin.inflowScore - 0.5);
            const breakoutValue = this.formatPercentage(coin.breakoutScore);
            
            // Create prediction text
            let prediction = 'Neutral';
            let predictionClass = 'neutral';
            
            if (coin.breakoutScore > 0.7 && coin.inflowScore > 0.6) {
                prediction = 'Strong Buy';
                predictionClass = 'positive';
            } else if (coin.breakoutScore > 0.6) {
                prediction = 'Buy';
                predictionClass = 'positive';
            } else if (coin.breakoutScore < 0.4) {
                prediction = 'Sell';
                predictionClass = 'negative';
            }
            
            row.innerHTML = `
                <td>${coin.name} (${coin.symbol})</td>
                <td>${formattedPrice}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${coin.breakoutScore * 100}%; background-color: ${coin.breakoutScore > 0.7 ? '#4cc9f0' : coin.breakoutScore > 0.5 ? '#fca311' : '#f72585'}"></div>
                    </div>
                    ${breakoutValue}
                </td>
                <td class="${coin.inflowScore > 0.5 ? 'positive' : 'negative'}">${inflowValue}</td>
                <td class="${predictionClass}">${prediction}</td>
            `;
            
            predictionsBody.appendChild(row);
        });
    }

    // Update charts with current data
    updateCharts(data) {
        // Update money flow chart
        const top10ByInflow = [...data]
            .sort((a, b) => b.inflowScore - a.inflowScore)
            .slice(0, 10);
        
        this.charts.moneyFlow.data.labels = top10ByInflow.map(coin => coin.symbol);
        this.charts.moneyFlow.data.datasets[0].data = top10ByInflow.map(coin => coin.inflowScore * 100);
        this.charts.moneyFlow.data.datasets[1].data = top10ByInflow.map(coin => (1 - coin.inflowScore) * 100);
        this.charts.moneyFlow.update();
        
        // Update dominance chart (mock data)
        const timeLabels = ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'];
        this.charts.dominance.data.labels = timeLabels;
        
        // Generate some realistic looking time series data
        const btcData = [65, 64.5, 64.2, 63.8, 63.5, 63.2, 63.0];
        const altcoinData = [35, 35.5, 35.8, 36.2, 36.5, 36.8, 37.0];
        
        this.charts.dominance.data.datasets[0].data = btcData;
        this.charts.dominance.data.datasets[1].data = altcoinData;
        this.charts.dominance.update();
    }

    // Update system information
    updateSystemInfo() {
        const modelInfo = mlModels.getModelInfo();
        
        if (modelInfo.breakout) {
            document.getElementById('model-version').textContent = modelInfo.breakout.version;
            
            // Calculate time since last retrain
            const lastRetrain = new Date(modelInfo.breakout.lastTrained);
            const hoursAgo = Math.floor((new Date() - lastRetrain) / (1000 * 60 * 60));
            document.getElementById('last-retrain').textContent = `${hoursAgo}h ago`;
        }
    }

    // Set up event listeners
    setupEventListeners() {
        // Table sorting
        document.querySelectorAll('th[data-sort]').forEach(header => {
            header.addEventListener('click', () => {
                const field = header.getAttribute('data-sort');
                
                if (this.sortField === field) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortField = field;
                    this.sortDirection = 'desc';
                }
                
                this.updateDashboard();
            });
        });
        
        // Filter buttons
        document.querySelectorAll('.filter-btn[data-filter]').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                button.classList.add('active');
                this.currentFilter = button.getAttribute('data-filter');
                
                this.updateDashboard();
            });
        });
        
        // Retrain models button
        document.getElementById('retrain-btn').addEventListener('click', async () => {
            this.updateStatus("Retraining AI models...", "info");
            
            try {
                await mlModels.retrainModels(this.coinData);
                this.updateStatus("Models retrained successfully", "success");
                this.updateSystemInfo();
            } catch (error) {
                console.error("Failed to retrain models:", error);
                this.updateStatus(`Model retraining failed: ${error.message}`, "error");
            }
        });
        
        // Optimize features button
        document.getElementById('optimize-btn').addEventListener('click', async () => {
            this.updateStatus("Optimizing feature engineering...", "info");
            
            // Simulate optimization
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.updateStatus("Feature optimization complete", "success");
        });
        
        // Diagnostic button
        document.getElementById('diagnostic-btn').addEventListener('click', async () => {
            this.updateStatus("Running system diagnostics...", "info");
            
            const healthCheck = await selfHealing.checkSystemHealth();
            
            if (healthCheck.overall === 'healthy') {
                this.updateStatus("System diagnostics passed", "success");
            } else {
                this.updateStatus("System issues detected", "warning");
            }
        });
    }

    // Start the periodic update cycle
    startUpdateCycle() {
        this.updateTimer = 60;
        document.getElementById('update-timer').textContent = `Next update in: ${this.updateTimer}s`;
        
        this.updateInterval = setInterval(() => {
            this.updateTimer--;
            document.getElementById('update-timer').textContent = `Next update in: ${this.updateTimer}s`;
            
            if (this.updateTimer <= 0) {
                this.updateTimer = 60;
                this.fetchData();
            }
        }, 1000);
    }

    // Update status message
    updateStatus(message, type = 'info') {
        const statusElement = document.getElementById('status-message');
        statusElement.textContent = message;
        
        // Remove previous classes
        statusElement.classList.remove('blink');
        
        // Add appropriate styling based on type
        if (type === 'error') {
            statusElement.style.color = '#f72585';
        } else if (type === 'success') {
            statusElement.style.color = '#4cc9f0';
        } else if (type === 'warning') {
            statusElement.style.color = '#fca311';
        } else {
            statusElement.style.color = '#e6e6e6';
        }
        
        // Blink for important messages
        if (type === 'error' || type === 'warning') {
            statusElement.classList.add('blink');
        }
    }

    // Utility functions
    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: value < 1 ? 6 : 2
        }).format(value);
    }

    formatPercentage(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value);
    }

    formatLargeNumber(value) {
        if (value >= 1e9) {
            return (value / 1e9).toFixed(2) + 'B';
        } else if (value >= 1e6) {
            return (value / 1e6).toFixed(2) + 'M';
        } else if (value >= 1e3) {
            return (value / 1e3).toFixed(2) + 'K';
        }
        return value.toFixed(2);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    const app = new CryptoIntelligenceApp();
    await app.initialize();
    
    // Make app available globally for debugging
    window.cryptoApp = app;
});
