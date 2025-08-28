// Configuration settings for the S.A.I.N.T. Crypto Intelligence System
const CONFIG = {
    // API endpoints
    APIs: {
        coinMarketCap: {
            url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency',
            key: 'your_coinmarketcap_api_key_here'
        },
        twitter: {
            url: 'https://api.twitter.com/2',
            key: 'your_twitter_api_key_here'
        },
        news: {
            url: 'https://newsapi.org/v2',
            key: 'your_newsapi_key_here'
        }
    },
    
    // Update intervals (in milliseconds)
    intervals: {
        dataFetch: 60000, // 1 minute
        modelRetrain: 86400000, // 24 hours
        healthCheck: 30000 // 30 seconds
    },
    
    // Thresholds for predictions
    thresholds: {
        breakout: 0.7,
        inflow: 0.6,
        fundamental: 0.7,
        influencer: 0.3
    },
    
    // List of influencers to monitor
    influencers: [
        'elonmusk',
        'realDonaldTrump',
        'VitalikButerin',
        'rogerkver',
        'APompliano',
        'SatoshiLite',
        'CryptoYoda1338',
        'cz_binance',
        'iofounders',
        'nickcobb'
    ],
    
    // List of coins to prioritize
    priorityCoins: [
        'BTC', 'ETH', 'BNB', 'ADA', 'XRP', 'SOL', 'DOT', 'DOGE',
        'AVAX', 'MATIC', 'LTC', 'LINK', 'UNI', 'ALGO', 'BCH',
        'XLM', 'VET', 'ATOM', 'ETC', 'THETA', 'FIL', 'TRX'
    ],
    
    // System settings
    system: {
        maxCoinsToDisplay: 25,
        maxHistoryPoints: 50,
        initialLoadDelay: 2000,
        retryAttempts: 3,
        retryDelay: 5000
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
