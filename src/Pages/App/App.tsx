import { useEffect, useMemo, useState } from 'react'
import { CheckoutForm } from '../../Components/CheckoutForm'
import { ItemEditor } from '../../Components/ItemEditor'
import { Modal } from '../../Components/Modal'
import { pay } from '../../Helpers/pay'
import { chargeDeliveryFee } from '../../Logic/chargeDeliveryFee'
import type { CartItem, KdsOrderPayload, OrderForm, Product, MenuResponse } from '../../Types'
import { About, CartSection, Featured, Footer, Header, Hero, Menu, NoLocation, SuccessMessage } from './Helpers/Components'
import { getMenu, products } from '../../Helpers/menu'
import { getCartItemTotal, requiresChickenSauce } from '../../Logic/editor'
import { getNearestLocationAndDistance } from '../../Logic/locationCheck'
import { Loading } from '../../Components/Loading'
import { orders } from '../../Helpers/order'

const ORDER_STORAGE_KEY = 'grilla_pending_order'
const STORE_UID = import.meta.env.VITE_STORE_UID ?? 'GRILLA_SMASH'

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

export const App = () => {

  const [nearestLocation, setNearestLocation] = useState<string | false>(false)
  const [distanceKm, setDistanceKm] = useState<number | null>(null)
  useEffect(() => { findLocation() }, [])
  const [menu, setMenu] = useState<MenuResponse | null>(null)
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
  const [loading, setLoading] = useState(false)
  const [storeId, setStoreId] = useState<string>('1')


  useEffect(() => {
    const getLiveMenu = async () => {
      try {
        const liveMenu = await getMenu()
        setMenu(liveMenu)
        if (!liveMenu.products.some((product) => product.category === activeCategory) && liveMenu.products.length > 0) {
          setActiveCategory(liveMenu.products[0].category)
        }
      } catch (error) {
        console.error('Unable to load live menu:', error)
      }
    }
    getLiveMenu()
  }, [])

  const productsSource = menu?.products ?? products

  const categories = useMemo(() => Array.from(new Set(productsSource.map((p) => p.category))).map((category) => {
    const label = category.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    return { id: category, label }
  }), [productsSource])

  const filteredProducts = useMemo(
    () => productsSource.filter((p) => p.category === activeCategory),
    [productsSource, activeCategory],
  )

  const featuredProducts = useMemo(() => productsSource.filter((p) => p.popular), [productsSource])
  const cartQuantity = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart])
  const subtotal = useMemo(() => cart.reduce((s, i) => s + getCartItemTotal(i), 0), [cart])
  const deliveryFee = useMemo(() => chargeDeliveryFee(isPickup ? 0 : distanceKm), [isPickup, distanceKm])
  const total = useMemo(() => (cart.length > 0 ? subtotal + deliveryFee : 0), [cart.length, subtotal, deliveryFee])

  const hasMissingChickenSauce = useMemo(() => cart.some(requiresChickenSauce), [cart])

  const editingItem = editingCartItemId !== null
    ? cart.find(i => i.id === editingCartItemId) ?? null
    : null


  const findLocation = async () => {
    setLoading(true)
    const { nearestLocation, distanceKm, branchId } = await getNearestLocationAndDistance()
    setNearestLocation(nearestLocation)
    setDistanceKm(distanceKm)
    if (branchId) {
      setStoreId(branchId)
    }
    setLoading(false)
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

  const buildPendingOrderPayload = (): KdsOrderPayload => ({
    UID: STORE_UID,
    orderData: {
      items: cart,
      total,
      delivery: deliveryFee,
      subtotal,
      isPickup,
      customer: {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        address1: form.address1,
        address2: form.address2,
        city: form.city,
        postcode: form.postcode,
      },
      storeId,
      status: 'pending',
    },
  })

  const savePendingOrder = () => {
    try {
      sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(buildPendingOrderPayload()))
    } catch (error) {
      console.error('Unable to save pending order:', error)
    }
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


  return loading ?
    (
      <Loading active={true} />
    )
    :
    (
      !nearestLocation && !viewOnly
        ?
        <NoLocation
          onTryAgain={() => { findLocation(); }}
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
                  onPrepareOrder={savePendingOrder}
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
