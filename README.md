# PC Hardware — Tienda + Panel de Administración

## Archivos
- `index.html` — tienda.
- `style.css` — diseño de la tienda.
- `script.js` — buscador, filtros y carrito.
- `admin.html` — panel de administración.
- `admin.css` — diseño del panel.
- `admin.js` — alta, edición, eliminación, importación y exportación de productos.
- `assets/` — imágenes.

## Abrir el panel
Después de publicar la página, entra a:

`https://TU-USUARIO.github.io/TU-REPOSITORIO/admin.html`

También puedes abrir `admin.html` directamente.

## Agregar un producto
1. Pulsa **+ Agregar producto**.
2. Escribe nombre, precio, categoría y especificaciones.
3. En Imagen coloca la ruta de una imagen, por ejemplo `assets/rtx5080.jpg`.
4. Sube esa imagen a la carpeta `assets` de tu repositorio.
5. Guarda.

### Importante sobre GitHub Pages
Esta versión usa `localStorage`, por lo que los productos que agregues desde el panel se guardan **solo en el navegador/dispositivo donde los agregaste**. GitHub Pages no proporciona una base de datos ni un servidor para guardar cambios globalmente.

Para una administración real desde cualquier teléfono/PC, habría que conectar el panel a una base de datos/backend (por ejemplo Supabase, Firebase o un servidor propio). En ese caso también se puede añadir inicio de sesión de administrador, inventario, pedidos, imágenes subidas y sincronización entre dispositivos.

## WhatsApp
En `script.js`, cambia `18055555555` por tu número con código de país, sin `+`, espacios ni guiones.
