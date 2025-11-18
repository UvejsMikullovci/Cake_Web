<div className="dessert-container">
 <section className="Desserts-sections">
<div className="sort-box">
<select className="sort-select" value={sortType} onChange={(e) => setSortType(e.target.value)}>
<option value="popular">Most Popular</option>
<option value="low-high">Price: Low to High</option>
<option value="high-low">Price: High to Low</option>
<option value="newest">Newest</option>
</select>
</div>


<div className="category-tabs">
<button className={activeCategory === "birthday" ? "active" : ""} onClick={() => setActiveCategory("birthday")}>Birthday Cakes</button>
<button className={activeCategory === "wedding" ? "active" : ""} onClick={() => setActiveCategory("wedding")}>Wedding Cakes</button>
<button className={activeCategory === "cookies" ? "active" : ""} onClick={() => setActiveCategory("cookies")}>Cookies</button>
<button className={activeCategory === "pies" ? "active" : ""} onClick={() => setActiveCategory("pies")}>Pies & Other</button>
</div>


<div className="grid-cakes">
{sortedCakes.map((cake) => (
<div key={cake.id} className="cake-card">
<img src={cake.img} alt={cake.title} className="cake-img" />
<h3 className="cake-title">{cake.title}</h3>
<p className="cake-price">${cake.price}.00</p>
</div>
))}
</div>
</section>
</div>