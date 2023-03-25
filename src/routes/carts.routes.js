import { Router } from 'express';
import CartManager from '../dao/fs/CartManager.js';
import cartDao from '../dao/cartDao.js';
import productDao from '../dao/productDao.js';
import { cartModel } from '../dao/models/cart.models.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const carts = await cartDao.getCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartDao.getCartById(cid);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    await cartDao.createCart(req.body);
    res.status(201).json({ message: 'Carrito creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { quantity, pid } = req.body;
  try {
    const existingProduct = await cartDao.getCartProductById(cid, pid);
    if (existingProduct) {
      res.status(409).json({ error: 'El producto ya existe en el carrito' });
    } else {
      const product = await productDao.getProductById(pid);
      if (!product) {
        res.status(404).json({ error: 'El producto no se encuentra en la base de datos' });
      } else {
        await cartDao.updateCart(cid, { product: pid, quantity });
        res.json({ message: 'Carrito actualizado exitosamente' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    await cartDao.updateQuantityToCart(cid, pid, quantity);
    res.json({ message: 'Cantidades actualizadas exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    await cartDao.deleteProductFromCart(cid, pid);
    res.json({ message: 'Producto eliminado del carrito exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    await cartDao.emptyCart(cid);
    res.json({ message: 'Carrito vaciado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
