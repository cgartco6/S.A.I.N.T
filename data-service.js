// Data Service for the S.A.I.N.T. Crypto Intelligence System

class DataService {
    constructor() {
        this.coinData = [];
        this.historicalData = [];
        this.influencerData = [];
        this.isConnected = false;
    }

    // Initialize data service
    async initialize() {
        console.log("Initializing data service...");
        
        try {
            // In a real implementation, we would connect to APIs
            // For this demo, we'll generate mock data
            
            await this.fetchMarketData();
            this.isConnected = true;
            console.log("Data service initialized successfully");
            return true;
            
        } catch (error) {
            console.error("Failed to initialize data service:", error);
            this.isConnected = false;
            return false;
        }
    }

    // Fetch market data from APIs
    async fetchMarketData() {
        console.log("Fetching market data...");
        
        try {
            // Generate realistic mock data
            this.generateMockData();
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log("Market data fetched successfully");
            return this.coinData;
            
        } catch (error) {
            console.error("Failed to fetch market data:", error);
            throw error;
        }
    }

    // Fetch influencer data from APIs
    async fetchInfluencerData() {
        console.log("Fetching influencer data...");
        
        try {
            // Generate mock influencer data
            this.influencerData = this.generateMockInfluencerData();
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            console.log("Influencer data fetched successfully");
            return this.influencerData;
            
        } catch (error) {
            console.error("Failed to fetch influencer data:", error);
            throw error;
        }
    }

    // Generate realistic mock data for demonstration
    generateMockData() {
        this.coinData = [];
        
        // Top cryptocurrencies by market cap
        const coins = [
            'Bitcoin', 'Ethereum', 'Binance Coin', 'Cardano', 'XRP', 'Solana', 'Polkadot', 'Dogecoin',
            'Avalanche', 'Polygon', 'Litecoin', 'Chainlink', 'Uniswap', 'Algorand', 'Bitcoin Cash',
            'Stellar', 'VeChain', 'Cosmos', 'Ethereum Classic', 'Theta Network', 'Filecoin', 'TRON',
            'Monero', 'Tezos', 'EOS', 'Aave', 'Compound', 'Crypto.com Coin', 'Shiba Inu', 'Maker'
        ];
        
        const symbols = [
            'BTC', 'ETH', 'BNB', 'ADA', 'XRP', 'SOL', 'DOT', 'DOGE',
            'AVAX', 'MATIC', 'LTC', 'LINK', 'UNI', 'ALGO', 'BCH',
            'XLM', 'VET', 'ATOM', 'ETC', 'THETA', 'FIL', 'TRX',
            'XMR', 'XTZ', 'EOS', 'AAVE', 'COMP', 'CRO', 'SHIB', 'MKR'
        ];
        
        for (let i = 0; i < coins.length; i++) {
            const price = Math.random() * 1000 + 10;
            const change24h = (Math.random() - 0.5) * 20;
            const volume = Math.random() * 1000000000 + 1000000;
            const marketCap = Math.random() * 100000000000 + 1000000000;
            
            this.coinData.push({
                name: coins[i],
                symbol: symbols[i],
                price: price,
                change24h: change24h,
                volume: volume,
                marketCap: marketCap,
                marketCapRank: i + 1,
                volumeChange24h: Math.random() * 5,
                priceChange1h: (Math.random() - 0.5) * 5,
                priceChange7d: (Math.random() - 0.5) * 30,
                socialVolume: Math.floor(Math.random() * 1000),
                developmentActivity: Math.floor(Math.random() * 100),
                communityScore: Math.floor(Math.random() * 100),
                age: Math.floor(Math.random() * 2000) + 100,
                influencerImpact: 0
            });
        }
        
        // Add specific influencer impact
        const dogeIndex = this.coinData.findIndex(coin => coin.symbol === 'DOGE');
        if (dogeIndex !== -1) {
            this.coinData[dogeIndex].influencerImpact = 0.8;
        }
        
        const ethIndex = this.coinData.findIndex(coin => coin.symbol === 'ETH');
        if (ethIndex !== -1) {
            this.coinData[ethIndex].influencerImpact = 0.6;
        }
        
        // Store historical data
        this.storeHistoricalData();
        
        return this.coinData;
    }

    // Generate mock influencer data
    generateMockInfluencerData() {
        const influencers = [
            { name: 'Elon Musk', username: 'elonmusk', followers: 78000000, impactScore: 0.95 },
            { name: 'Donald Trump', username: 'realDonaldTrump', followers: 87000000, impactScore: 0.85 },
            { name: 'Vitalik Buterin', username: 'VitalikButerin', followers: 4300000, impactScore: 0.75 },
            { name: 'Roger Ver', username: 'rogerkver', followers: 710000, impactScore: 0.65 },
            { name: 'Pomp', username: 'APompliano', followers: 1100000, impactScore: 0.70 }
        ];
        
        // Add recent activity
        influencers.forEach(influencer => {
            influencer.recentActivity = [
                {
                    type: 'tweet',
                    content: `Just mentioned ${this.getRandomCoin()} in a tweet`,
                    timestamp: new Date(Date.now() - Math.random() * 86400000),
                    impact: Math.random() * 0.3 + 0.1
                }
            ];
        });
        
        return influencers;
    }

    // Get a random coin symbol
    getRandomCoin() {
        const coins = ['BTC', 'ETH', 'DOGE', 'SHIB', 'ADA', 'XRP', 'SOL', 'DOT'];
        return coins[Math.floor(Math.random() * coins.length)];
    }

    // Store historical data for charts
    storeHistoricalData() {
        const timestamp = new Date();
        
        // Store market cap data
        const totalMarketCap = this.coinData.reduce((sum, coin) => sum + coin.marketCap, 0);
        const btcMarketCap = this.coinData.find(coin => coin.symbol === 'BTC')?.marketCap || 0;
        const btcDominance = (btcMarketCap / totalMarketCap) * 100;
        
        this.historicalData.push({
            timestamp,
            totalMarketCap,
            btcDominance,
            fearGreed: Math.floor(Math.random() * 100)
        });
        
        // Keep only the most recent data points
        if (this.historicalData.length > 50) {
            this.historicalData = this.historicalData.slice(-50);
        }
    }

    // Get historical data for charts
    getHistoricalData() {
        return this.historicalData;
    }

    // Get data for a specific coin
    getCoinData(symbol) {
        return this.coinData.find(coin => coin.symbol === symbol);
    }

    // Get all coin data
    getAllCoinData() {
        return this.coinData;
    }

    // Get top gainers
    getTopGainers(limit = 10) {
        return [...this.coinData]
            .filter(coin => coin.change24h > 0)
            .sort((a, b) => b.change24h - a.change24h)
            .slice(0, limit);
    }

    // Get top losers
    getTopLosers(limit = 10) {
        return [...this.coinData]
            .filter(coin => coin.change24h < 0)
            .sort((a, b) => a.change24h - b.change24h)
            .slice(0, limit);
    }

    // Check if data service is connected
    isDataServiceConnected() {
        return this.isConnected;
    }
}

// Create global instance
const dataService = new DataService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataService;
}
