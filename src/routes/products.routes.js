import { Router } from 'express'
import { uploader } from '../utils/multer.js'
import productDao from '../dao/productDao.js'
import { productModel } from '../dao/models/products.models.js'

const router = Router()

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit)
  const query = req.query.query || null
  const sort = parseInt(req.query.sort)
  const page = parseInt(req.query.page)

  try {
    const result = await productDao.getProducts(limit, JSON.parse(query), sort, page)
    res.json({
      status: 'success',
      payload: result,
    })
  } catch (error) {
    res.status(500).json({ error })
  }
})

router.get('/:pid', async (req, res) => {
  const pid = req.params.pid

  try {
    const product = await productDao.getProductById(pid)
    if (!product) {
      res.status(404).json({ message: `Product with ID ${pid} not found` })
    } else {
      res.json(product)
    }
  } catch (error) {
    res.status(500).json({ error })
  }
})

router.post('/', uploader.single('thumbnail'), async (req, res) => {
  const { title, description, category, price, code, stock } = req.body
  const thumbnailName = req.file?.filename || 'Sin Imagen'

  try {
    const addedProduct = await productDao.createProduct({
      title,
      description,
      category,
      price,
      thumbnailName,
      code,
      stock,
    })

    res.status(201).json({ info: 'Product added', addedProduct })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
})

router.put('/:pid', async (req, res) => {
  const pid = req.params.pid
  const updatedValue = req.body

  try {
    await productDao.updateProduct(pid, updatedValue)
    res.status(200).json({ status: 'success', payload: updatedValue })
  } catch (error) {
    res.status(500).json({ error })
  }
})

router.delete('/:pid', async (req, res) => {
  const pid = req.params.pid

  try {
    await productDao.deleteProduct(pid)
    res.status(200).json({ status: 'success', message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

export default router
