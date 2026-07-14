import { useEffect, useMemo, useState } from 'react'
import { CheckoutForm } from '../Components/CheckoutForm'
import { ItemEditor } from '../Components/ItemEditor'
import { Modal } from '../Components/Modal'
import { pay } from '../Logic/pay'
import { chargeDeliveryFee } from '../Logic/chargeDeliveryFee'
import type { CartItem, OrderForm, Product } from '../Types'
import { About, CartSection, Featured, Footer, Header, Hero, Menu, NoLocation, SuccessMessage } from './Components'
import { products } from '../products'
import { getCartItemTotal, requiresChickenSauce } from '../Logic/editor'
import { findNearestLocation, getDistanceToNearestLocationInKm } from '../Logic/locationCheck'

const emptyForm: OrderForm = {
  fullName: '',
  phone: '',
  email: '',
  address1: '',
  address2: '',
  city: '',
  postcode: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
}

const categories = Array.from(new Set(products.map((p) => p.category))).map((category) => {
  const label = category.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  return { id: category, label }
})

export const App = () => {

  const [nearestLocation, setNearestLocation] = useState<string | false>(false)
  const [distanceKm, setDistanceKm] = useState<number | null>(null)
  useEffect(() => { findLocation() }, [])
  const [activeCategory, setActiveCategory] = useState('burgers')
  const [cart, setCart] = useState<CartItem[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalView, setModalView] = useState<'cart' | 'checkout' | 'success' | 'edit'>('cart')
  const [editingCartItemId, setEditingCartItemId] = useState<number | null>(null)
  const [form, setForm] = useState<OrderForm>(emptyForm)
  const [error, setError] = useState('')
  const [orderNumber, setOrderNumber] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPickup, setIsPickup] = useState(false)
  const [viewOnly, setViewOnly] = useState(false)

  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === activeCategory),
    [activeCategory],
  )

  const featuredProducts = products.filter((p) => p.popular)
  const cartQuantity = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart])
  const subtotal = useMemo(() => cart.reduce((s, i) => s + getCartItemTotal(i), 0), [cart])
  const deliveryFee = useMemo(() => chargeDeliveryFee(isPickup ? 0 : distanceKm), [isPickup, distanceKm])
  const total = useMemo(() => (cart.length > 0 ? subtotal + deliveryFee : 0), [cart.length, subtotal, deliveryFee])

  const hasMissingChickenSauce = useMemo(() => cart.some(requiresChickenSauce), [cart])

  const editingItem = editingCartItemId !== null
    ? cart.find(i => i.id === editingCartItemId) ?? null
    : null


  const findLocation = async () => {
    const [nearestLocation, distanceKm] = await Promise.all([
      findNearestLocation(),
      getDistanceToNearestLocationInKm(),
    ])
    nearestLocation && setNearestLocation(nearestLocation)
    setDistanceKm(distanceKm)
  }

  const addToCart = (product: Product) => {
    setCart((prev) => {
      return [...prev, { id: Date.now(), product, quantity: 1 }]
    })
    setModalOpen(true)
  }

  const updateQuantity = (itemId: number, change: number) => {
    setCart((prev) =>
      prev.map((i) => i.id === itemId ? { ...i, quantity: i.quantity + change } : i)
        .filter((i) => i.quantity > 0)
    )
  }

  const openCart = () => { setModalOpen(true); setModalView('cart') }

  const openCheckout = () => {
    if (cart.length === 0) return
    setModalOpen(true)
    setModalView('checkout')
  }

  const openEditor = (itemId: number) => {
    setEditingCartItemId(itemId)
    setModalView('edit')
  }

  const saveCartItemEdit = (updated: CartItem) => {
    setCart(prev => prev.map(i => i.id === updated.id ? updated : i))
    setEditingCartItemId(null)
    setModalView('cart')
  }

  const closeModal = () => {
    if (modalView === 'checkout') return
    setModalOpen(false)
    setError('')
    if (modalView === 'success' || modalView === 'edit') {
      setModalView('cart')
      setEditingCartItemId(null)
    }
  }

  const handleFormChange = (field: keyof OrderForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handlePay = async (token: string) => {
    setIsSubmitting(true)

    const amountInPence = Math.round(total * 100)
    const result = await pay(amountInPence, token)

    if (!result.success) {
      setError(result.error || 'Payment failed')
      setIsSubmitting(false)
      return
    }

    setOrderNumber(Math.floor(1000 + Math.random() * 9000))
    setModalView('success')
    setCart([])
    setForm(emptyForm)
    setIsSubmitting(false)
  }

  const handleOrderAgain = () => {
    setOrderNumber(null)
    setModalView('cart')
    setModalOpen(false)
  }

  const modalTitle =
    modalView === 'checkout' ? 'Checkout' :
      modalView === 'success' ? 'Order Confirmed' :
        modalView === 'edit' ? 'Customise Item' :
          'Your Order'


  return (
    !nearestLocation && !viewOnly
      ?
      <NoLocation
        onContinue={() => { setViewOnly(true); }}
      />
      :
      <>
        <Header
          cartQuantity={cartQuantity}
          openCart={openCart}
          nearestLocation={nearestLocation}
          viewOnly={viewOnly}
        />

        <main>
          <Hero
            setActiveCategory={setActiveCategory}
          />

          <Featured
            featuredProducts={featuredProducts}
            onAddToCart={addToCart}
            viewOnly={viewOnly}
          />

          <Menu
            categories={categories}
            activeCategory={activeCategory}
            filteredProducts={filteredProducts}
            onSetActiveCategory={setActiveCategory}
            addToCart={addToCart}
            viewOnly={viewOnly}
          />

          <About />
        </main>

        {/* MODAL (cart → edit → checkout → success) */}
        {!viewOnly && (
          <Modal
            open={modalOpen}
            title={modalTitle}
            onClose={closeModal}
            disableClose={modalView === 'checkout'}
          >
            {modalView === 'cart' &&
              <CartSection
                cart={cart}
                updateQuantity={updateQuantity}
                subtotal={subtotal}
                total={total}
                DELIVERY_FEE={deliveryFee}
                openCheckout={openCheckout}
                closeModal={closeModal}
                onEditItem={openEditor}
              />
            }

            {modalView === 'edit' && editingItem && (
              <div style={{ padding: '16px 20px' }}>
                <ItemEditor
                  cartItem={editingItem}
                  onSave={saveCartItemEdit}
                  onBack={() => { setEditingCartItemId(null); setModalView('cart') }}
                />
              </div>
            )}

            {modalView === 'checkout' && (
              <CheckoutForm
                form={form}
                onChange={handleFormChange}
                onSubmit={handlePay}
                onBack={() => setModalView('cart')}
                error={error}
                isSubmitting={isSubmitting}
                subtotal={subtotal}
                delivery={deliveryFee}
                total={total}
                disableCheckout={hasMissingChickenSauce}
                isPickup={isPickup}
                onTogglePickup={() => setIsPickup(p => !p)}
              />
            )}

            {modalView === 'success' &&
              <SuccessMessage orderNumber={orderNumber} handleOrderAgain={handleOrderAgain} />
            }
          </Modal>
        )}

        <Footer />
      </>
  )
}
