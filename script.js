const defaultProducts = [
  {id:1,name:"PNY GeForce RTX 5070 12GB Triple Fan OC",category:"Componentes",price:765,specs:"3xFan · 2587 MHz · 650W · 300mm · 1x16Pin · 2160p 48fps · 1440p 81fps · 1080p 107fps · DLSS 4 · PCIe 5 · HDMI 2.1 · DP 2.1 · GDDR7",image:"assets/rtx5070.svg",badge:"A ESTRENAR"},
  {id:2,name:"Gigabyte GeForce RTX 5060 WindForce OC 8GB",category:"Componentes",price:370,specs:"8GB GDDR7 · PCIe 5.0 · DLSS 4 · Ray Tracing · HDMI 2.1 · DisplayPort 2.1",image:"assets/rtx5060.svg",badge:"A ESTRENAR"},
  {id:3,name:"AMD Ryzen 7 5700",category:"Componentes",price:155,specs:"8 núcleos · 16 hilos · AM4 · Hasta 4.6 GHz · 65W",image:"assets/cpu.svg",badge:"OFERTA"},
  {id:4,name:"Memoria DDR5 32GB 6000MT/s",category:"Componentes",price:180,specs:"DDR5 · 6000MT/s · CL36 · 1x32GB · Alta velocidad",image:"assets/ram.svg",badge:""},
  {id:5,name:"Monitor Gaming 27” 1440p 165Hz",category:"Periféricos",price:299,specs:"27 pulgadas · 2560x1440 · 165Hz · 1ms · HDMI · DisplayPort",image:"assets/monitor.svg",badge:""},
  {id:6,name:"Teclado mecánico RGB Gaming",category:"Periféricos",price:79,specs:"Switches mecánicos · RGB · USB · Anti-ghosting",image:"assets/keyboard.svg",badge:"OFERTA"},
  {id:7,name:"Mouse Gaming 26K DPI",category:"Periféricos",price:59,specs:"Sensor 26K DPI · 6 botones · RGB · Cable USB",image:"assets/mouse.svg",badge:""},
  {id:8,name:"SSD NVMe 1TB PCIe 4.0",category:"Componentes",price:89,specs:"1TB · NVMe · PCIe 4.0 · Lectura hasta 7,000 MB/s",image:"assets/ssd.svg",badge:""}
];

function getProducts(){
  try{
    const saved = JSON.parse(localStorage.getItem("pcHardwareProducts"));
    return Array.isArray(saved) && saved.length ? saved : defaultProducts;
  }catch(e){ return defaultProducts; }
}
let products = getProducts();

let activeCategory = "Todos";
let activePrice = "all";
let cart = JSON.parse(localStorage.getItem("pcHardwareCart") || "[]");

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function money(value){
  return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value);
}

function renderProducts(){
  products = getProducts();
  const term = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(p=>{
    const categoryOK=activeCategory==="Todos"||p.category===activeCategory;
    const priceOK=activePrice==="all"||(activePrice==="500"&&Number(p.price)<500)||(activePrice==="1000"&&Number(p.price)<1000);
    const searchOK=`${p.name} ${p.specs}`.toLowerCase().includes(term);
    return categoryOK&&priceOK&&searchOK;
  });
  if(!filtered.length){
    grid.innerHTML=`<div class="empty">No encontramos productos con esa búsqueda.</div>`;
    return;
  }
  grid.innerHTML=filtered.map(p=>`
    <article class="product-card">
      ${p.badge?`<span class="badge">${p.badge}</span>`:""}
      <div class="product-image"><img src="${p.image}" alt="${escapeHTML(p.name)}" loading="lazy"></div>
      <div class="product-info">
        <h3 class="product-title">${escapeHTML(p.name)}</h3>
        <div class="product-specs">${escapeHTML(p.specs)}</div>
        <div class="price">${money(Number(p.price))}</div>
        <button class="add-button" onclick="addToCart(${p.id})">Agregar al carrito</button>
      </div>
    </article>`).join("");
}
function escapeHTML(value){
  return String(value??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function saveCart(){localStorage.setItem("pcHardwareCart",JSON.stringify(cart));}
function addToCart(id){
  const existing=cart.find(item=>item.id===id);
  if(existing) existing.qty++;
  else cart.push({id,qty:1});
  saveCart();renderCart();openCart();
}
function changeQty(id,amount){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=amount;
  if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  saveCart();renderCart();
}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function renderCart(){
  const items=cart.map(item=>{const p=products.find(x=>x.id===item.id);return p?{...p,qty:item.qty}:null}).filter(Boolean);
  document.getElementById("cartCount").textContent=items.reduce((s,i)=>s+i.qty,0);
  document.getElementById("cartItems").innerHTML=items.length?items.map(item=>`
    <div class="cart-item">
      <img src="${item.image}" alt="">
      <div><h4>${escapeHTML(item.name)}</h4><small>${money(item.price)} c/u</small>
      <div class="qty"><button onclick="changeQty(${item.id},-1)">−</button><strong>${item.qty}</strong><button onclick="changeQty(${item.id},1)">+</button></div></div>
      <button class="remove" onclick="removeFromCart(${item.id})">×</button>
    </div>`).join(""):`<div class="empty">Tu carrito está vacío.</div>`;
  const total=items.reduce((s,i)=>s+Number(i.price)*i.qty,0);
  document.getElementById("cartTotal").textContent=money(total);
}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("open");}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("open");}

document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  tab.classList.add("active");activeCategory=tab.dataset.category;renderProducts();
}));
searchInput.addEventListener("input",renderProducts);
document.getElementById("filterButton").addEventListener("click",()=>document.getElementById("filterPanel").classList.toggle("open"));
document.querySelectorAll(".price-filter").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".price-filter").forEach(x=>x.classList.remove("active"));
  button.classList.add("active");activePrice=button.dataset.price;renderProducts();
}));
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("menuButton").addEventListener("click",()=>document.getElementById("mobileMenu").classList.toggle("open"));
document.getElementById("clearCart").addEventListener("click",()=>{cart=[];saveCart();renderCart();});
document.getElementById("checkoutButton").addEventListener("click",()=>{
  if(!cart.length){alert("Agrega al menos un producto al carrito.");return;}
  const items=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `• ${p.name} x${item.qty} — ${money(p.price*item.qty)}`}).join("\n");
  const total=cart.reduce((s,item)=>{const p=products.find(x=>x.id===item.id);return s+p.price*item.qty},0);
  const phone="18055555555";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Hola, quiero hacer este pedido:\n\n${items}\n\nTotal: ${money(total)}`)}`,"_blank");
});
document.getElementById("whatsappButton").href="https://wa.me/18055555555?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20productos.";

window.addEventListener("storage",()=>{products=getProducts();renderProducts();renderCart();});
renderProducts();renderCart();
