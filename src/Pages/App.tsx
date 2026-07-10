import { useMemo, useState } from 'react'
import { Buttons } from '../Components/Buttons'
import { CheckoutForm } from '../Components/CheckoutForm'
import { Modal } from '../Components/Modal'
import { ProductCard } from '../Components/Product'

type Product = {
  id: number
  name: string
  category: string
  price: number
  description: string
  image: string
  popular: boolean
}

type CartItem = {
  product: Product
  quantity: number
}

type OrderForm = {
  fullName: string
  phone: string
  email: string
  address: string
  postcode: string
  cardNumber: string
  expiry: string
  cvv: string
}

const DELIVERY_FEE = 2.5

const categories = [
  { id: 'burgers', label: 'Smash Burgers' },
  { id: 'chicken', label: 'Chicken' },
  { id: 'wraps', label: 'Wraps' },
  { id: 'loaded-fries', label: 'Loaded Fries' },
  { id: 'sides', label: 'Sides' },
  { id: 'drinks', label: 'Drinks' },
]

const products: Product[] = [
  { id: 1, name: 'Original Double Smash', category: 'burgers', price: 5.49, description: 'Two smashed patties, cheese, lettuce, gherkins and signature smash sauce.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop', popular: true },
  { id: 2, name: 'Oklahoma Burger', category: 'burgers', price: 5.99, description: 'Smash patties grilled with onions, cheese, lettuce and smash sauce.', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=400&fit=crop', popular: true },
  { id: 3, name: 'Nacho Smash', category: 'burgers', price: 5.99, description: 'Smashed beef patty topped with nachos, cheese sauce and jalapeños.', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&h=400&fit=crop', popular: false },
  { id: 4, name: 'Single Smash', category: 'burgers', price: 4.49, description: 'One smashed patty with cheese, lettuce, gherkins and smash sauce.', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&h=400&fit=crop', popular: false },
  { id: 5, name: 'Quarter Chicken', category: 'chicken', price: 5.29, description: 'Flame grilled peri-peri chicken. Choose your heat level.', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=400&fit=crop', popular: true },
  { id: 6, name: 'Half Chicken', category: 'chicken', price: 7.99, description: 'Half chicken grilled to perfection. Lemon & Herb to Wild.', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=400&fit=crop', popular: false },
  { id: 7, name: 'Full Chicken', category: 'chicken', price: 12.99, description: 'Whole peri-peri chicken. Feeds 2-3 people.', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&h=400&fit=crop', popular: false },
  { id: 8, name: 'Chicken Wings', category: 'chicken', price: 4.99, description: '6 crispy wings tossed in your choice of peri sauce.', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&h=400&fit=crop', popular: false },
  { id: 9, name: 'Chicken Strips', category: 'chicken', price: 4.49, description: '3 tender grilled chicken strips. Perfect for dipping.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=400&fit=crop', popular: false },
  { id: 10, name: 'Chicken Burger', category: 'chicken', price: 4.99, description: 'Grilled chicken breast with lettuce, mayo and peri drizzle.', image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&h=400&fit=crop', popular: false },
  { id: 11, name: 'Chicken & Rice', category: 'chicken', price: 6.49, description: 'Grilled peri chicken served over spiced rice with coleslaw.', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=400&fit=crop', popular: false },
  { id: 12, name: 'Chicken Wrap', category: 'wraps', price: 4.99, description: 'Grilled chicken, lettuce, cheese and peri mayo wrapped tight.', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&h=400&fit=crop', popular: true },
  { id: 13, name: 'Smash Wrap', category: 'wraps', price: 5.49, description: 'Smashed patty, cheese, gherkins and smash sauce in a tortilla.', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&h=400&fit=crop', popular: false },
  { id: 14, name: 'Chicken Loaded Fries', category: 'loaded-fries', price: 5.49, description: 'Fries topped with grilled chicken, cheese sauce and jalapeños.', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&h=400&fit=crop', popular: true },
  { id: 15, name: 'Beef Loaded Fries', category: 'loaded-fries', price: 5.99, description: 'Fries loaded with smashed beef, cheese sauce and smash sauce.', image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd3c65?w=500&h=400&fit=crop', popular: false },
  { id: 16, name: 'Fries', category: 'sides', price: 2.49, description: 'Crispy golden fries, lightly salted.', image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd3c65?w=500&h=400&fit=crop', popular: false },
  { id: 17, name: 'Peri Fries', category: 'sides', price: 2.99, description: 'Fries tossed in peri-peri seasoning. Spicy and addictive.', image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&h=400&fit=crop', popular: false },
  { id: 18, name: 'Nachos', category: 'sides', price: 3.49, description: 'Tortilla chips with cheese sauce and salsa.', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&h=400&fit=crop', popular: false },
  { id: 19, name: 'Onion Rings', category: 'sides', price: 2.99, description: 'Crispy battered onion rings.', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&h=400&fit=crop', popular: false },
  { id: 20, name: 'Mozzarella Sticks', category: 'sides', price: 3.49, description: '6 golden mozzarella sticks with dip.', image: 'https://images.unsplash.com/photo-1539252554453-1f1a5af5b5ae?w=500&h=400&fit=crop', popular: false },
  { id: 21, name: 'Chilli Cheese Bites', category: 'sides', price: 3.49, description: 'Bite-sized chilli cheese nuggets. Crispy and gooey.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=400&fit=crop', popular: false },
  { id: 22, name: 'Coke', category: 'drinks', price: 1.49, description: '330ml can.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&h=400&fit=crop', popular: false },
  { id: 23, name: 'Coke Zero', category: 'drinks', price: 1.49, description: '330ml can. No sugar.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&h=400&fit=crop', popular: false },
]

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
  const featuredProducts = useMemo(() => products.filter((p) => p.popular).slice(0, 4), [])
  const cartQuantity = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart])
  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.product.price * i.quantity, 0), [cart])
  const total = useMemo(() => (cart.length > 0 ? subtotal + DELIVERY_FEE : 0), [cart.length, subtotal])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1 }]
    })
    setModalOpen(true)
    setModalView('cart')
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
      setError('Please fill in all required fields.')
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

  const cartLabel = cartQuantity > 0 ? `🛒  Cart (${cartQuantity})` : '🛒  Cart'

  return (
    <>
      <header>
        <div className="container nav">
          <div className="logo">
            <span className="orange">GRILL'A</span>&nbsp;
            <span>SMASH</span>
          </div>
          <nav>
            <a href="#home">Home</a>
            <a href="#featured">Popular</a>
            <a href="#menu">Menu</a>
            <a href="#about">About</a>
          </nav>
          <Buttons.primary onClick={openCart} title={cartLabel} />
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="home">
          <div className="hero-overlay" />
          <div className="container hero-content">
            <div className="hero-text">
              <h2>THE HOME OF</h2>
              <h1>SMASH BURGERS</h1>
              <p>Fresh smashed beef. Juicy grilled peri-peri chicken. Loaded fries. Delivered hot.</p>
              <Buttons.primary
                onClick={() => {
                  setActiveCategory('burgers')
                  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
                }}
                title="Order Now"
              />
            </div>
            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&h=800&fit=crop"
                alt="Smash burger"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features">
          <div className="container">
            <div className="feature">🍔<h3>Fresh Smash Burgers</h3></div>
            <div className="feature">🔥<h3>Grilled Peri Chicken</h3></div>
            <div className="feature">🚚<h3>Fast Delivery</h3></div>
            <div className="feature">⭐<h3>Premium Ingredients</h3></div>
          </div>
        </section>

        {/* FEATURED */}
        <section className="featured" id="featured">
          <div className="container">
            <h2>Customer Favourites</h2>
            <div className="featured-grid">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} />
              ))}
            </div>
          </div>
        </section>

        {/* MENU */}
        <section className="menu" id="menu">
          <div className="container">
            <h2>Full Menu</h2>
            <div className="category-buttons">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={activeCategory === cat.id ? 'active' : ''}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="product-grid">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} />
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about" id="about">
          <div className="container about-grid">
            <div>
              <h2>Why Grill'A Smash?</h2>
              <p>
                We serve freshly smashed burgers, flame grilled chicken and loaded fries
                cooked to order using quality ingredients. Whether you&apos;re craving a
                juicy burger or spicy peri-peri chicken, we&apos;ve got you covered.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=900&h=700&fit=crop"
                alt="Smash burger"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="container footer">
          <div>
            <h3>Opening Hours</h3>
            <p>11AM – 9PM</p>
          </div>
          <div>
            <h3>Phone</h3>
            <p>01922 663739</p>
          </div>
          <div>
            <h3>Follow Us</h3>
            <p>@grillasmashuk</p>
          </div>
        </div>
      </footer>

      {/* MODAL (cart → checkout → success) */}
      <Modal
        open={modalOpen}
        title={modalView === 'checkout' ? 'Checkout' : modalView === 'success' ? 'Order Confirmed' : 'Your Order'}
        onClose={closeModal}
        disableClose={modalView === 'checkout'}
      >
        {modalView === 'cart' && (
          <>
            <div className="modal-body">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <p>🛒</p>
                  <p>Your cart is empty</p>
                  <p>Add some smash burgers!</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div className="cart-item" key={item.product.id}>
                    <div className="cart-item-info">
                      <h4>{item.product.name}</h4>
                      <p>£{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="cart-item-actions">
                      <button type="button" onClick={() => updateQuantity(item.product.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.product.id, 1)}>+</button>
                      <button type="button" className="remove-btn" onClick={() => removeItem(item.product.id)}>Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="modal-footer">
                <div className="cart-total-row"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
                <div className="cart-total-row"><span>Delivery</span><span>£{DELIVERY_FEE.toFixed(2)}</span></div>
                <div className="cart-total-final"><span>Total</span><span>£{total.toFixed(2)}</span></div>
                <div className="cart-actions">
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
          <div className="modal-body">
            <div className="success-screen">
              <div className="success-icon">✓</div>
              <h2>Thank You!</h2>
              <p>Your order has been placed successfully.</p>
              <div className="order-number">Order #{orderNumber}</div>
              <p>Estimated delivery: <strong>30-45 mins</strong></p>
              <br />
              <Buttons.primary onClick={handleOrderAgain} title="Order Again" />
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
