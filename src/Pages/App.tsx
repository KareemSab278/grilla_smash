import { useMemo, useState } from 'react'
import { CheckoutForm } from '../Components/CheckoutForm'
import { ItemEditor } from '../Components/ItemEditor'
import { Modal } from '../Components/Modal'
import { pay } from '../Logic/pay'
import type { CartItem, OrderForm, Product } from '../Types'
import { About, CartSection, Featured, Footer, Header, Hero, Menu, NoLocation, SuccessMessage } from './Components'
import { products } from '../products'
import { getCartItemTotal, requiresChickenSauce } from '../Logic/editor'
import { Elements } from '@stripe/react-stripe-js'
import {stripeInstance} from '../Logic/stripeInstance'

const DELIVERY_FEE = 2.5

const emptyForm: OrderForm = {
  fullName: '', phone: '', email: '', address1: '', address2: '', city: '', postcode: '',
  cardNumber: '', expiry: '', cvv: '',
}

export const App = ({ nearestLocation }: { nearestLocation: string | false }) => {
  const [activeCategory, setActiveCategory] = useState('burgers')
  const [cart, setCart] = useState<CartItem[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalView, setModalView] = useState<'cart' | 'checkout' | 'success' | 'edit'>('cart')
  const [editingCartItemId, setEditingCartItemId] = useState<number | null>(null)
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
  const subtotal = useMemo(() => cart.reduce((s, i) => s + getCartItemTotal(i), 0), [cart])
  const total = useMemo(() => (cart.length > 0 ? subtotal + DELIVERY_FEE : 0), [cart.length, subtotal])

  const hasMissingChickenSauce = useMemo(() => cart.some(requiresChickenSauce), [cart])

  const editingItem = editingCartItemId !== null
    ? cart.find(i => i.id === editingCartItemId) ?? null
    : null

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



  const handlePay = async (cardElement: any) => {
    setIsSubmitting(true);

    const amountInPence = Math.round(total * 100);

    const result = await pay(amountInPence);

    if (!result.success || !result.client_secret) {
      setError(result.error || "Payment failed");
      setIsSubmitting(false);
      return;
    }

    const stripe = await stripeInstance;

    if (!stripe) {
      setError("Stripe failed to load");
      setIsSubmitting(false);
      return;
    }

    const paymentResult = await stripe.confirmCardPayment(
      result.client_secret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (paymentResult.error) {
      setError(paymentResult.error.message || "Payment failed");
      setIsSubmitting(false);
      return;
    }

    setOrderNumber(Math.floor(1000 + Math.random() * 9000));
    setModalView("success");
    setCart([]);
    setForm(emptyForm);

    setIsSubmitting(false);
  };



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

    !nearestLocation
      ? <NoLocation /> :
      <>
        <Header cartQuantity={cartQuantity} openCart={openCart} nearestLocation={nearestLocation} />

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

        {/* MODAL (cart → edit → checkout → success) */}
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
              DELIVERY_FEE={DELIVERY_FEE}
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
            <Elements stripe={stripeInstance}>
              <CheckoutForm
                form={form}
                onChange={handleFormChange}
                onSubmit={handlePay}
                onBack={() => setModalView('cart')}
                error={error}
                isSubmitting={isSubmitting}
                subtotal={subtotal}
                delivery={DELIVERY_FEE}
                total={total}
                disableCheckout={hasMissingChickenSauce}
              />
            </Elements>
          )}

          {modalView === 'success' &&
            <SuccessMessage orderNumber={orderNumber} handleOrderAgain={handleOrderAgain} />
          }
        </Modal>

        <Footer />
      </>
  )
}

const categories = Array.from(new Set(products.map((p) => p.category))).map((category) => {
  const label = category.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  return { id: category, label }
})
