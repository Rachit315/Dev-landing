// Enhanced Express server for Dev Quotes (Vercel Serverless Compatible)
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')

const app = express()

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// MongoDB connection - Vercel serverless compatible
let client = null
let quotesCollection = null

async function getDatabaseConnection() {
  if (client && client.topology && client.topology.isConnected()) {
    return { client, quotesCollection }
  }

  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    console.warn('MONGODB_URI is not set. Set it in Vercel environment variables.')
    throw new Error('MONGODB_URI is not configured')
  }

  try {
    client = new MongoClient(mongoUri, {
      maxPoolSize: 1, // Reduced for serverless
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    })
    
    await client.connect()
    const databaseName = process.env.MONGODB_DB || 'Dev_quotes'
    const db = client.db(databaseName)
    quotesCollection = db.collection('quote_message')
    
    console.log(`✅ Connected to MongoDB database: ${databaseName}`)
    return { client, quotesCollection }
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message)
    throw error
  }
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const { quotesCollection } = await getDatabaseConnection()
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: quotesCollection ? 'connected' : 'disconnected',
      uptime: process.uptime()
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    })
  }
})

// POST /api/quotes — submit a quote
app.post('/api/quotes', async (req, res) => {
  try {
    const { quotesCollection } = await getDatabaseConnection()

    const { name, role, quote } = req.body || {}

    if (typeof quote !== 'string') {
      return res.status(400).json({ 
        error: 'Quote is required and must be a string',
        timestamp: new Date().toISOString()
      })
    }

    const trimmedQuote = quote.trim()
    if (trimmedQuote.length < 20 || trimmedQuote.length > 1000) {
      return res.status(400).json({ 
        error: 'Quote must be between 20 and 1000 characters',
        timestamp: new Date().toISOString()
      })
    }

    const safeName = typeof name === 'string' && name.trim() ? name.trim() : 'Anonymous'
    const safeRole = typeof role === 'string' && role.trim() ? role.trim() : 'Developer'

    const newQuote = {
      name: safeName,
      role: safeRole,
      quote: trimmedQuote,
      created_at: new Date(),
      ip_address: req.ip || req.connection.remoteAddress
    }

    const result = await quotesCollection.insertOne(newQuote)
    console.log(`✅ New quote added by ${safeName} (${safeRole})`)
    
    return res.status(201).json({ 
      success: true, 
      id: result.insertedId,
      message: 'Quote submitted successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error handling POST /api/quotes:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    })
  }
})

// GET /api/quotes — fetch all quotes (newest first)
app.get('/api/quotes', async (req, res) => {
  try {
    const { quotesCollection } = await getDatabaseConnection()

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    const allQuotes = await quotesCollection
      .find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const totalQuotes = await quotesCollection.countDocuments()

    return res.json({
      quotes: allQuotes,
      pagination: {
        page,
        limit,
        total: totalQuotes,
        pages: Math.ceil(totalQuotes / limit)
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error handling GET /api/quotes:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    })
  }
})

// GET /api/quotes/:id — fetch a specific quote
app.get('/api/quotes/:id', async (req, res) => {
  try {
    const { quotesCollection } = await getDatabaseConnection()

    const { MongoClient } = require('mongodb')
    const ObjectId = MongoClient.ObjectId

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        error: 'Invalid quote ID format',
        timestamp: new Date().toISOString()
      })
    }

    const quote = await quotesCollection.findOne({ _id: new ObjectId(req.params.id) })
    
    if (!quote) {
      return res.status(404).json({ 
        error: 'Quote not found',
        timestamp: new Date().toISOString()
      })
    }

    return res.json({
      quote,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error handling GET /api/quotes/:id:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    })
  }
})

// GET /api/stats — get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const { quotesCollection } = await getDatabaseConnection()

    const totalQuotes = await quotesCollection.countDocuments()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const quotesToday = await quotesCollection.countDocuments({
      created_at: { $gte: today }
    })

    const topRoles = await quotesCollection.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray()

    return res.json({
      stats: {
        totalQuotes,
        quotesToday,
        topRoles
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error handling GET /api/stats:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/quotes',
      'GET /api/quotes/:id',
      'POST /api/quotes',
      'GET /api/stats'
    ],
    timestamp: new Date().toISOString()
  })
})

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  
  // Graceful shutdown for local development
  process.on('SIGTERM', async () => {
    console.log('🔄 SIGTERM received, shutting down gracefully...')
    if (client) await client.close()
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    console.log('🔄 SIGINT received, shutting down gracefully...')
    if (client) await client.close()
    process.exit(0)
  })

  // Start server for local development
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
    console.log(`📝 API docs: http://localhost:${PORT}/api/`)
  })
}

module.exports = app
