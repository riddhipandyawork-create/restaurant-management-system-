import "./index.css";
import heroImage from "./assets/images/hero.jpg";
function App() {
  return (
    <div>
      <header className="navbar">
        <h1>🍽 FoodieHub</h1>

        <nav>
          <a href="#">Home</a>
          <a href="#">Menu</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      <section className="hero">

    <div className="left">

        <h2>Savor Every Bite,
Experience Pure Happiness</h2>

        <p>
            Enjoy freshly prepared dishes made with premium ingredients,
expert chefs, and lightning-fast delivery right to your doorstep.
        </p>

        <div className="buttons">
            <button>🍽 Order Food</button>
            <button className="outline">📖 View Menu</button>
        </div>

    </div>

    <div className="right">

        <img src={heroImage} alt="Food"/>

    </div>

</section>
    </div>
  );
}

export default App;
{/* Statistics Section */}

<section className="stats">

  <div className="stat-card">
    <h2>15K+</h2>
    <p>Happy Customers</p>
  </div>

  <div className="stat-card">
    <h2>120+</h2>
    <p>Food Items</p>
  </div>

  <div className="stat-card">
    <h2>25+</h2>
    <p>Expert Chefs</p>
  </div>

  <div className="stat-card">
    <h2>30 Min</h2>
    <p>Fast Delivery</p>
  </div>

</section>