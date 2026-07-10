import { styles } from './Styles'

export const Footer = () => (
  <footer style={styles.footerSection}>
    <div className="container footer" style={{ ...styles.container, ...styles.footer }}>
      <div style={styles.footerCol}>
        <h3 style={styles.footerH3}>Opening Hours</h3>
        <p style={styles.footerP}>11AM – 9PM</p>
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

import { ProductCard } from '../Components/Product'
import type { Product } from '../Types'
import { Buttons } from '../Components/Buttons'

export const Featured = ({ featuredProducts, onAddToCart }: {
  featuredProducts: Product[], onAddToCart: (product: Product) => void
}) => (
  <section className="featured" id="featured" style={styles.featured}>
    <div className="container" style={styles.container}>
      <h2 style={styles.sectionH2}>Customer Favourites</h2>
      <div className="featured-grid" style={styles.featuredGrid}>
        {featuredProducts.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={() => onAddToCart(p)} />
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
}

export const Menu = ({ categories, onSetActiveCategory, activeCategory, filteredProducts, addToCart }: MenuProps) => (
  <section className="menu" id="menu" style={styles.menu}>
    <div className="container" style={styles.container}>
      <h2 style={styles.sectionH2}>Full Menu</h2>
      <div className="category-buttons" style={styles.categoryButtons}>
        {categories.map((cat) => (
          <Buttons.category
            key={cat.id}
            onClick={() => onSetActiveCategory(cat.id)}
            title={cat.label}
            optionalStyles={{ marginRight: '10px', marginBottom: '10px', background: activeCategory === cat.id ? '#F7931E' : '#222222', color: activeCategory === cat.id ? '#111111' : '#F7931E' }}
          />
        ))}
      </div>
      <div className="product-grid" style={styles.productGrid}>
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} />
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
      <div className="hero-image" style={styles.heroImage}>
        <img
          src="public/images/hero-burger.jpg"
          alt="Smash burger"
          loading="lazy"
          style={styles.heroImageImg}
        />
      </div>
    </div>
  </section>
)

export const Header = ({ cartQuantity, openCart }: { cartQuantity: number, openCart: () => void }) => (
  <header style={styles.header}>
    <div className="container nav" style={{ ...styles.container, ...styles.nav }}>
      <div className="logo" style={styles.logo}>
        <span className="orange" style={styles.logoOrange}>GRILL'A</span>&nbsp;
        <span style={styles.logoText}>SMASH</span>
      </div>
      <nav style={styles.navLinks}>
        <a href="#home" style={styles.navLink}>Home</a>
        <a href="#featured" style={styles.navLink}>Popular</a>
        <a href="#menu" style={styles.navLink}>Menu</a>
        <a href="#about" style={styles.navLink}>About</a>
      </nav>
      {cartQuantity > 0 ? <Buttons.primary onClick={openCart} title={`My Cart (${cartQuantity})`} /> : <div style={{ width: 180 }}></div>}
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