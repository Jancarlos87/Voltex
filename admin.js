const defaults = [
{id:1,name:"PNY GeForce RTX 5070 12GB Triple Fan OC",category:"Componentes",price:765,specs:"3xFan · 2587 MHz · 650W · 300mm · 1x16Pin · 2160p 48fps · 1440p 81fps · 1080p 107fps · DLSS 4 · PCIe 5 · HDMI 2.1 · DP 2.1 · GDDR7",image:"assets/rtx5070.svg",badge:"A ESTRENAR"},
{id:2,name:"Gigabyte GeForce RTX 5060 WindForce OC 8GB",category:"Componentes",price:370,specs:"8GB GDDR7 · PCIe 5.0 · DLSS 4 · Ray Tracing · HDMI 2.1 · DisplayPort 2.1",image:"assets/rtx5060.svg",badge:"A ESTRENAR"},
{id:3,name:"AMD Ryzen 7 5700",category:"Componentes",price:155,specs:"8 núcleos · 16 hilos · AM4 · Hasta 4.6 GHz · 65W",image:"assets/cpu.svg",badge:"OFERTA"},
{id:4,name:"Memoria DDR5 32GB 6000MT/s",category:"Componentes",price:180,specs:"DDR5 · 6000MT/s · CL36 · 1x32GB · Alta velocidad",image:"assets/ram.svg",badge:""},
{id:5,name:"Monitor Gaming 27” 1440p 165Hz",category:"Periféricos",price:299,specs:"27 pulgadas · 2560x1440 · 165Hz · 1ms · HDMI · DisplayPort",image:"assets/monitor.svg",badge:""},
{id:6,name:"Teclado mecánico RGB Gaming",category:"Periféricos",price:79,specs:"Switches mecánicos · RGB · USB · Anti-ghosting",image:"assets/keyboard.svg",badge:"OFERTA"},
{id:7,name:"Mouse Gaming 26K DPI",category:"Periféricos",price:59,specs:"Sensor 26K DPI · 6 botones · RGB · Cable USB",image:"assets/mouse.svg",badge:""},
{id:8,name:"SSD NVMe 1TB PCIe 4.0",category:"Componentes",price:89,specs:"1TB · NVMe · PCIe 4.0 · Lectura hasta 7,000 MB/s",image:"assets/ssd.svg",badge:""}
];

let products;
try{
  const saved=JSON.parse(localStorage.getItem("pcHardwareProducts"));
  products=Array.isArray(saved)&&saved.length?saved:defaults;
}catch(e){products=defaults}
const $=id=>document.getElementById(id);

function save(){localStorage.setItem("pcHardwareProducts",JSON.stringify(products));render()}
function money(v){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(v)}
function escapeHTML(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function render(){
  const term=$("adminSearch").value.toLowerCase().trim();
  const list=products.filter(p=>`${p.name} ${p.category}`.toLowerCase().includes(term));
  $("totalProducts").textContent=products.length;
  $("componentCount").textContent=products.filter(p=>p.category==="Componentes").length;
  $("peripheralCount").textContent=products.filter(p=>p.category==="Periféricos").length;
  $("productTable").innerHTML=list.length?list.map(p=>`
  <tr>
    <td><div class="product-cell"><img src="${p.image}" onerror="this.style.visibility='hidden'" alt=""><div><b>${escapeHTML(p.name)}</b><small>${escapeHTML(p.specs).slice(0,75)}${p.specs.length>75?"…":""}</small></div></div></td>
    <td>${escapeHTML(p.category)}</td><td><b>${money(p.price)}</b></td>
    <td>${p.badge?`<span class="tag">${escapeHTML(p.badge)}</span>`:"—"}</td>
    <td><div class="row-actions"><button class="edit" onclick="editProduct(${p.id})">Editar</button><button class="delete" onclick="deleteProduct(${p.id})">Eliminar</button></div></td>
  </tr>`).join(""):`<tr><td colspan="5" class="empty">No hay productos.</td></tr>`;
}

function openModal(product=null){
  $("modal").classList.add("open");
  $("modalTitle").textContent=product?"Editar producto":"Agregar producto";
  $("productId").value=product?.id||"";
  $("name").value=product?.name||"";
  $("price").value=product?.price??"";
  $("category").value=product?.category||"Componentes";
  $("badge").value=product?.badge||"";
  $("specs").value=product?.specs||"";
  $("image").value=product?.image||"";
  $("preview").src=product?.image||"";
}
function closeModal(){$("modal").classList.remove("open")}
window.editProduct=id=>openModal(products.find(p=>p.id===id));
window.deleteProduct=id=>{
  const p=products.find(x=>x.id===id);
  if(!p)return;
  if(confirm(`¿Eliminar "${p.name}"?`)){products=products.filter(x=>x.id!==id);save()}
};

$("newProduct").onclick=()=>openModal();
$("closeModal").onclick=closeModal;
$("cancel").onclick=closeModal;
$("modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
$("adminSearch").oninput=render;
$("image").oninput=e=>$("preview").src=e.target.value;

$("productForm").onsubmit=e=>{
  e.preventDefault();
  const id=$("productId").value?Number($("productId").value):Date.now();
  const product={
    id,
    name:$("name").value.trim(),
    price:Number($("price").value),
    category:$("category").value,
    badge:$("badge").value,
    specs:$("specs").value.trim(),
    image:$("image").value.trim()||"assets/rtx5070.svg"
  };
  const index=products.findIndex(x=>x.id===id);
  if(index>=0)products[index]=product;else products.push(product);
  save();closeModal();
};

$("exportProducts").onclick=()=>{
  const blob=new Blob([JSON.stringify(products,null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="productos-pc-hardware.json";a.click();URL.revokeObjectURL(a.href);
};

$("importProducts").onchange=e=>{
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const data=JSON.parse(reader.result);
      if(!Array.isArray(data))throw new Error();
      products=data;save();alert("Productos importados correctamente.");
    }catch(err){alert("El archivo JSON no es válido.")}
    e.target.value="";
  };
  reader.readAsText(file);
};

$("resetProducts").onclick=()=>{
  if(confirm("Esto borrará tus cambios del catálogo en este navegador y restaurará los productos de ejemplo.")){
    products=defaults.map(x=>({...x}));save();
  }
};

render();
