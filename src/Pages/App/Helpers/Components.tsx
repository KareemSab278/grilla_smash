import { styles } from '../Styles'
import { ProductCard } from '../../../Components/Product'
import type { CartItem, Product } from '../../../Types'
import { Buttons } from '../../../Components/Buttons'
import { getCartItemTotal } from '../../../Logic/editor'


export const Footer = () => (
  <footer style={styles.footerSection}>
    <div className="container footer" style={{ ...styles.container, ...styles.footer }}>
      <div style={styles.footerCol}>
        <h3 style={styles.footerH3}>Opening Hours</h3>
        <p style={styles.footerP}>11AM – 11PM</p>
      </div>
      <div style={styles.footerCol}>
        <h3 style={styles.footerH3}>Phone</h3>
        <p style={styles.footerP}>01922 663739</p>
      </div>
      <div style={styles.footerCol}>
        <h3 style={styles.footerH3}>Follow Us</h3>
        <p style={styles.footerP}>@grillasmashuk</p>
      </div>
    </div>
  </footer>
)



export const Featured = ({ featuredProducts, onAddToCart, viewOnly }: {
  featuredProducts: Product[], onAddToCart: (product: Product) => void, viewOnly: boolean
}) => (
  <section className="featured" id="featured" style={styles.featured}>
    <div className="container" style={styles.container}>
      <h2 style={styles.sectionH2}>Customer Favourites</h2>
      <div className="featured-grid" style={styles.featuredGrid}>
        {featuredProducts.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={() => onAddToCart(p)} viewOnly={viewOnly} />
        ))}
      </div>
    </div>
  </section>
)


interface MenuProps {
  categories: { id: string, label: string }[]
  activeCategory: string
  filteredProducts: Product[]
  onSetActiveCategory: (categoryId: string) => void
  addToCart: (product: Product) => void
  viewOnly: boolean
}

export const Menu = ({ categories, onSetActiveCategory, activeCategory, filteredProducts, addToCart, viewOnly }: MenuProps) => (
  <section className="menu" id="menu" style={styles.menu}>
    <div className="container" style={styles.container}>
      <h2 style={styles.sectionH2}>Full Menu</h2>
      <div className="category-buttons" style={styles.categoryButtons}>
        {categories.map((cat) => (
          <Buttons.category
            key={cat.id}
            onClick={() => onSetActiveCategory(cat.id)}
            title={cat.label}
            optionalStyles={{ marginRight: '10px', marginBottom: '10px', background: activeCategory === cat.id ? '#F7931E' : '#222222', color: activeCategory === cat.id ? '#111111' : '#F7931E', border: '2px solid #F7931E' }}
          />
        ))}
      </div>
      <div className="product-grid" style={styles.productGrid}>
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} viewOnly={viewOnly} />
        ))}
      </div>
    </div>
  </section>
)

export const Hero = ({ setActiveCategory }: { setActiveCategory: (category: string) => void }) => (
  <section className="hero" id="home" style={styles.hero}>
    <div className="hero-overlay" style={styles.heroOverlay} />
    <div className="container hero-content" style={{ ...styles.container, ...styles.heroContent }}>
      <div className="hero-text" style={styles.heroText}>
        <h2 style={styles.heroTextH2}>THE HOME OF</h2>
        <h1 style={styles.heroTextH1}>SMASH BURGERS</h1>
        <p style={styles.heroTextP}>Fresh smashed beef. Juicy grilled peri-peri chicken. Loaded fries. Delivered hot.</p>
        <Buttons.primary
          onClick={() => {
            setActiveCategory('burgers')
            document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
          }}
          title="Order Now"
        />
      </div>
      <div className="hero-image" >
        <img
          src="public/images/hero-burger.jpg"
          alt="The Go Ape Oklahoma"
          loading="lazy"
          style={styles.heroImageImg}

        />
      </div>
    </div>
  </section>
)

export const NoLocation = ({ onTryAgain, onContinue }: { onTryAgain: () => void, onContinue: () => void }) => (
  <main className="no-close-location" style={styles.noLocation}>
    <div style={styles.noLocationContent}>
      <h1 style={{ marginBottom: '16px', fontSize: '2rem', color: '#fff' }}>Location Needed</h1>
      <p style={{ marginBottom: '24px', lineHeight: 1.7, color: '#ffffff' }}>
        We couldn't find a location near you using your shared location, or location access
        may not have been granted. Please allow location access and try again.
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexDirection: 'column' }}>
        <Buttons.primary onClick={() => onTryAgain()} title="Retry" />
        <Buttons.secondary onClick={() => onContinue()} title="Continue Without Location" />
      </div>

    </div>
  </main>
)

export const Header = ({ cartQuantity, openCart, nearestLocation, viewOnly }: { cartQuantity: number, openCart: () => void, nearestLocation: string | false, viewOnly: boolean }) => (
  <header style={styles.header}>
    <div className="container nav" style={{ ...styles.container, ...styles.nav }}>
      <div className="logo" style={styles.logo}>
        <div>
          <span className="orange" style={styles.logoOrange}>GRILL'A</span>&nbsp;
          <span style={styles.logoText}>SMASH</span>
        </div>
        {nearestLocation && nearestLocation.length > 0 && !viewOnly && (<div style={styles.locationText}>{nearestLocation}</div>)}
      </div>
      <nav style={styles.navLinks}>
        <a href="#home" style={styles.navLink}>Home</a>
        <a href="#featured" style={styles.navLink}>Popular</a>
        <a href="#menu" style={styles.navLink}>Menu</a>
        <a href="#about" style={styles.navLink}>About</a>
      </nav>

      {cartQuantity > 0 && !viewOnly ? <Buttons.primary onClick={openCart} title={`My Cart (${cartQuantity})`} /> : <div style={{ width: 180 }}></div>}
    </div>

  </header>
)

export const About = () => (
  <section className="about" id="about" style={styles.about}>
    <div className="container about-grid" style={{ ...styles.container, ...styles.aboutGrid }}>
      <div style={styles.aboutText}>
        <h2 style={styles.aboutH2}>Why Grill'A Smash?</h2>
        <p style={styles.aboutP}>
          We serve freshly smashed burgers, flame grilled chicken and loaded fries
          cooked to order using quality ingredients. Whether you&apos;re craving a
          juicy burger or spicy peri-peri chicken, we&apos;ve got you covered.
        </p>
      </div>
      <div style={styles.aboutImage}>
        <img
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=900&h=700&fit=crop"
          alt="Smash burger"
          loading="lazy"
          style={styles.aboutImg}
        />
      </div>
    </div>
  </section>
)

interface CartSectionProps {
  cart: CartItem[],
  updateQuantity: (itemId: number, change: number) => void,
  subtotal: number,
  total: number,
  DELIVERY_FEE: number,
  openCheckout: () => void,
  closeModal: () => void,
  onEditItem: (itemId: number) => void,
}

export const CartSection = ({ cart, updateQuantity, subtotal, total, DELIVERY_FEE, openCheckout, closeModal, onEditItem }: CartSectionProps) => {
  const hasMissingChickenSauce = cart.some(item => item.product.category === 'chicken' && !item.sauceChoice)
  return (
    <>
      <div style={styles.modalBody}>
        {cart.length === 0 ? (
          <div style={styles.cartEmpty}>
            <p>Your cart is empty</p>
            <p>Add some smash burgers!</p>
          </div>
        ) : (
          cart.map((item) => {
            const needsSauce = item.product.category === 'chicken' && !item.sauceChoice
            return (
              <div style={{ ...styles.cartItem, background: needsSauce ? 'rgba(255, 74, 74, 0.08)' : styles.cartItem.background, border: needsSauce ? '1px solid #ff6868' : styles.cartItem.border }} key={item.id}>
                <div style={{ ...styles.cartItemInfo, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <h4 style={styles.cartItemName}>{item.product.name}</h4>
                  </div>

                  {/* Sauce */}
                  {item.sauceChoice && (
                    <p style={{ margin: '2px 0 0', color: '#888', fontSize: '0.76rem' }}>
                      Sauce: {item.sauceChoice}
                    </p>
                  )}
                  {needsSauce && (
                    <p style={{ margin: '6px 0 0', color: '#ff8a8a', fontSize: '0.78rem' }}>
                      Please select a sauce for this chicken item.
                    </p>
                  )}

                  {/* Extras */}
                  {item.extras && item.extras.length > 0 && (
                    <p style={{ margin: '2px 0 0', color: '#888', fontSize: '0.76rem' }}>
                      + {item.extras.map(e => e.name).join(', ')}
                    </p>
                  )}

                  {/* Meal */}
                  {item.meal && (
                    <p style={{ margin: '3px 0 0', color: '#F7931E', fontSize: '0.76rem' }}>
                      🍽 Meal: {item.meal.side.name} + {item.meal.drink.name}
                    </p>
                  )}

                  <p style={{ ...styles.cartItemPrice, marginTop: 5 }}>
                    £{getCartItemTotal(item).toFixed(2)}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ ...styles.cartItemActions, marginLeft: 10, marginTop: 20 }}>
                    <button type="button" style={styles.cartActionBtn} onClick={() => updateQuantity(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button type="button" style={styles.cartActionBtn} onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <button type="button" style={{ ...styles.editBtn, marginTop: 12 }} onClick={() => onEditItem(item.id)}>Customize</button>
                </div>
              </div>
            )
          })
        )}
      </div>
      {cart.length > 0 && (
        <div style={styles.modalFooter}>
          <div style={styles.cartTotalRow}><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
          <div style={styles.cartTotalRow}><span>Delivery</span><span>£{DELIVERY_FEE.toFixed(2)}</span></div>
          <div style={styles.cartTotalFinal}><span>Total</span><span>£{total.toFixed(2)}</span></div>
          <div style={styles.cartActions}>

            {!hasMissingChickenSauce && <Buttons.primary onClick={openCheckout} title="Checkout" />}

            <Buttons.secondary onClick={closeModal} title="Keep Shopping" />
          </div>
        </div>
      )}
    </>
  )
}

export const SuccessMessage = ({ orderNumber, handleOrderAgain }: { orderNumber: number | null, handleOrderAgain: () => void }) =>
  orderNumber !== null && (
    <div style={styles.modalBody}>
      <div style={styles.successScreen}>
        <div style={styles.successIcon}>✓</div>
        <h2>Thank You!</h2>
        <p>Your order has been placed successfully.</p>
        <div style={styles.orderNumber}>Order #{orderNumber}</div>
        <p>Estimated delivery: <strong>30-45 mins</strong></p>
        <br />
        <Buttons.primary onClick={handleOrderAgain} title="Still Hungry?" />
      </div>
    </div>
  )
