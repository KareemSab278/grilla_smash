import { useMemo, useState } from 'react'
import { styles } from './Styles'
import { Buttons } from '../Components/Buttons'
import { CheckoutForm } from '../Components/CheckoutForm'
import { Modal } from '../Components/Modal'
import { ProductCard } from '../Components/Product'
import type { Product, CartItem, OrderForm } from '../Types'
import { About, Featured, Footer, Header, Hero, Menu } from './Components'

const DELIVERY_FEE = 2.5

const emptyForm: OrderForm = {
  fullName: '', phone: '', email: '', address: '', postcode: '',
  cardNumber: '', expiry: '', cvv: '',
}

export const App = () => {
  const [activeCategory, setActiveCategory] = useState('burgers')
  const [cart, setCart] = useState<CartItem[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalView, setModalView] = useState<'cart' | 'checkout' | 'success'>('cart')
  const [form, setForm] = useState<OrderForm>(emptyForm)
  const [error, setError] = useState('')
  const [orderNumber, setOrderNumber] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === activeCategory),
    [activeCategory],
  )

  const featuredProducts = products.filter((p) => p.popular)
  const cartQuantity = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart])
  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.product.price * i.quantity, 0), [cart])
  const total = useMemo(() => (cart.length > 0 ? subtotal + DELIVERY_FEE : 0), [cart.length, subtotal])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: number, change: number) => {
    setCart((prev) =>
      prev.map((i) => i.product.id === productId ? { ...i, quantity: i.quantity + change } : i)
        .filter((i) => i.quantity > 0)
    )
  }

  const removeItem = (productId: number) => setCart((prev) => prev.filter((i) => i.product.id !== productId))

  const openCart = () => { setModalOpen(true); setModalView('cart') }

  const openCheckout = () => {
    if (cart.length === 0) return
    setModalOpen(true)
    setModalView('checkout')
  }

  const closeModal = () => {
    if (modalView === 'checkout') return
    setModalOpen(false)
    setError('')
    if (modalView === 'success') setModalView('cart')
  }

  const handleFormChange = (field: keyof OrderForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = () => {
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim() ||
      !form.postcode.trim() || !form.cardNumber.trim() || !form.expiry.trim() || !form.cvv.trim()) {

      return
    }
    setError('')
    setIsSubmitting(true)
    window.setTimeout(() => {
      setIsSubmitting(false)
      setOrderNumber(Math.floor(1000 + Math.random() * 9000))
      setModalView('success')
      setCart([])
      setForm(emptyForm)
    }, 900)
  }

  const handleOrderAgain = () => {
    setOrderNumber(null)
    setModalView('cart')
    setModalOpen(false)
  }

  return (
    <>
      <Header cartQuantity={cartQuantity} openCart={openCart} />

      <main>

        <Hero
          setActiveCategory={setActiveCategory}
        />

        <Featured
          featuredProducts={featuredProducts}
          onAddToCart={addToCart}
        />

        <Menu
          categories={categories}
          activeCategory={activeCategory}
          filteredProducts={filteredProducts}
          onSetActiveCategory={setActiveCategory}
          addToCart={addToCart}
        />

        <About />

      </main>

      {/* MODAL (cart → checkout → success) */}
      <Modal
        open={modalOpen}
        title={modalView === 'checkout' ? 'Checkout' : modalView === 'success' ? 'Order Confirmed' : 'Your Order'}
        onClose={closeModal}
        disableClose={modalView === 'checkout'}
      >
        {modalView === 'cart' && (
          <>
            <div style={styles.modalBody}>
              {cart.length === 0 ? (
                <div style={styles.cartEmpty}>
                  <p>Your cart is empty</p>
                  <p>Add some smash burgers!</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div style={styles.cartItem} key={item.product.id}>
                    <div style={styles.cartItemInfo}>
                      <h4 style={styles.cartItemName}>{item.product.name}</h4>
                      <p style={styles.cartItemPrice}>£{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div style={styles.cartItemActions}>
                      <button type="button" style={styles.cartActionBtn} onClick={() => updateQuantity(item.product.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" style={styles.cartActionBtn} onClick={() => updateQuantity(item.product.id, 1)}>+</button>
                      <button type="button" style={styles.removeBtn} onClick={() => removeItem(item.product.id)}>Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div style={styles.modalFooter}>
                <div style={styles.cartTotalRow}><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
                <div style={styles.cartTotalRow}><span>Delivery</span><span>£{DELIVERY_FEE.toFixed(2)}</span></div>
                <div style={styles.cartTotalFinal}><span>Total</span><span>£{total.toFixed(2)}</span></div>
                <div style={styles.cartActions}>
                  <Buttons.primary onClick={openCheckout} title="Checkout" />
                  <Buttons.secondary onClick={closeModal} title="Keep Shopping" />
                </div>
              </div>
            )}
          </>
        )}

        {modalView === 'checkout' && (
          <CheckoutForm
            form={form}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onBack={() => setModalView('cart')}
            error={error}
            isSubmitting={isSubmitting}
            subtotal={subtotal}
            delivery={DELIVERY_FEE}
            total={total}
          />
        )}

        {modalView === 'success' && (
          <div style={styles.modalBody}>
            <div style={styles.successScreen}>
              <div style={styles.successIcon}>✓</div>
              <h2>Thank You!</h2>
              <p>Your order has been placed successfully.</p>
              <div style={styles.orderNumber}>Order #{orderNumber}</div>
              <p>Estimated delivery: <strong>30-45 mins</strong></p>
              <br />
              <Buttons.primary onClick={handleOrderAgain} title="Order Again" />
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </>
  )
}


const products: Product[] = [
  { id: 1, name: 'Original Double Smash', category: 'burgers', price: 5.49, description: 'Two smashed patties, cheese, lettuce, gherkins and signature smash sauce.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop' },
  { id: 2, name: 'Oklahoma Burger', category: 'burgers', price: 5.99, description: 'Smash patties grilled with onions, cheese, lettuce and smash sauce.', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=400&fit=crop', popular: true },
  { id: 3, name: 'Nacho Smash', category: 'burgers', price: 5.99, description: 'Smashed beef patty topped with nachos, cheese sauce and jalapeños.', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&h=400&fit=crop', popular: true },
  { id: 4, name: 'Single Smash', category: 'burgers', price: 4.49, description: 'One smashed patty with cheese, lettuce, gherkins and smash sauce.', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&h=400&fit=crop' },
  { id: 5, name: 'Quarter Chicken', category: 'chicken', price: 5.29, description: 'Flame grilled peri-peri chicken. Choose your heat level.', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=400&fit=crop' },
  { id: 6, name: 'Half Chicken', category: 'chicken', price: 7.99, description: 'Half chicken grilled to perfection. Lemon & Herb to Wild.', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=400&fit=crop' },
  { id: 7, name: 'Full Chicken', category: 'chicken', price: 12.99, description: 'Whole peri-peri chicken. Feeds 2-3 people.', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&h=400&fit=crop' },
  { id: 8, name: 'Chicken Wings', category: 'chicken', price: 4.99, description: '6 crispy wings tossed in your choice of peri sauce.', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&h=400&fit=crop' },
  { id: 9, name: 'Chicken Strips', category: 'chicken', price: 4.49, description: '3 tender grilled chicken strips. Perfect for dipping.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=400&fit=crop' },
  { id: 10, name: 'Chicken Burger', category: 'chicken', price: 4.99, description: 'Grilled chicken breast with lettuce, mayo and peri drizzle.', image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&h=400&fit=crop', popular: true },
  { id: 11, name: 'Chicken & Rice', category: 'chicken', price: 6.49, description: 'Grilled peri chicken served over spiced rice with coleslaw.', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=400&fit=crop' },
  { id: 12, name: 'Chicken Wrap', category: 'wraps', price: 4.99, description: 'Grilled chicken, lettuce, cheese and peri mayo wrapped tight.', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&h=400&fit=crop' },
  { id: 13, name: 'Smash Wrap', category: 'wraps', price: 5.49, description: 'Smashed patty, cheese, gherkins and smash sauce in a tortilla.', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&h=400&fit=crop' },
  { id: 14, name: 'Chicken Loaded Fries', category: 'loaded-fries', price: 5.49, description: 'Fries topped with grilled chicken, cheese sauce and jalapeños.', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&h=400&fit=crop' },
  { id: 15, name: 'Beef Loaded Fries', category: 'loaded-fries', price: 5.99, description: 'Fries loaded with smashed beef, cheese sauce and smash sauce.', image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd3c65?w=500&h=400&fit=crop' },
  { id: 16, name: 'Fries', category: 'sides', price: 2.49, description: 'Crispy golden fries, lightly salted.', image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd3c65?w=500&h=400&fit=crop' },
  { id: 17, name: 'Peri Fries', category: 'sides', price: 2.99, description: 'Fries tossed in peri-peri seasoning. Spicy and addictive.', image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&h=400&fit=crop' },
  { id: 18, name: 'Nachos', category: 'sides', price: 3.49, description: 'Tortilla chips with cheese sauce and salsa.', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&h=400&fit=crop' },
  { id: 19, name: 'Onion Rings', category: 'sides', price: 2.99, description: 'Crispy battered onion rings.', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&h=400&fit=crop' },
  { id: 20, name: 'Mozzarella Sticks', category: 'sides', price: 3.49, description: '6 golden mozzarella sticks with dip.', image: 'https://images.unsplash.com/photo-1539252554453-1f1a5af5b5ae?w=500&h=400&fit=crop' },
  { id: 21, name: 'Chilli Cheese Bites', category: 'sides', price: 3.49, description: 'Bite-sized chilli cheese nuggets. Crispy and gooey.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=400&fit=crop' },
  { id: 22, name: 'Coke', category: 'drinks', price: 1.49, description: '330ml can.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&h=400&fit=crop' },
  { id: 23, name: 'Coke Zero', category: 'drinks', price: 1.49, description: '330ml can. No sugar.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&h=400&fit=crop' },
]

const categories = Array.from(new Set(products.map((p) => p.category))).map((category) => {
  const label = category.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  return { id: category, label }
})
