// Express server for Dev Quotes
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')

const app = express()
app.use(cors())
app.use(express.json())

// MongoDB connection
const mongoUri = process.env.MONGODB_URI
if (!mongoUri) {
  // Early warning in logs, but allow process to start so the user can set env
  // eslint-disable-next-line no-console
  console.warn('MONGODB_URI is not set. Set it in server/.env before starting the server.')
}

const client = new MongoClient(mongoUri || 'mongodb://localhost:27017')
let quotesCollection = null

async function initDatabaseConnection() {
  try {
    await client.connect()
    const databaseName = process.env.MONGODB_DB || 'Dev_quotes'
    const db = client.db(databaseName)
    quotesCollection = db.collection('quote_message')
    // eslint-disable-next-line no-console
    console.log(`Connected to MongoDB database: ${databaseName}`)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to MongoDB:', error.message)
    throw error
  }
}

// POST /api/quotes — submit a quote
app.post('/api/quotes', async (req, res) => {
  try {
    if (!quotesCollection) {
      return res.status(503).json({ error: 'Database not initialized' })
    }

    const { name, role, quote } = req.body || {}

    if (typeof quote !== 'string') {
      return res.status(400).json({ error: 'Quote is required' })
    }

    const trimmedQuote = quote.trim()
    if (trimmedQuote.length < 20 || trimmedQuote.length > 1000) {
      return res.status(400).json({ error: 'Quote must be between 20 and 1000 characters' })
    }

    const safeName = typeof name === 'string' && name.trim() ? name.trim() : null
    const safeRole = typeof role === 'string' && role.trim() ? role.trim() : null

    const newQuote = {
      name: safeName,
      role: safeRole,
      quote: trimmedQuote,
      created_at: new Date(),
    }

    const result = await quotesCollection.insertOne(newQuote)
    return res.json({ success: true, id: result.insertedId })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error handling POST /api/quotes:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/quotes — fetch all quotes (newest first)
app.get('/api/quotes', async (_req, res) => {
  try {
    if (!quotesCollection) {
      return res.status(503).json({ error: 'Database not initialized' })
    }

    const allQuotes = await quotesCollection
      .find()
      .sort({ created_at: -1 })
      .toArray()

    return res.json(allQuotes)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error handling GET /api/quotes:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

const PORT = process.env.PORT || 3000

initDatabaseConnection()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Server not started due to DB connection error:', error.message)
    process.exit(1)
  })


