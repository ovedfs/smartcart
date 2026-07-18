# 🛒 SmartCart - Despensa Inteligente

Aplicación web progresiva para gestionar listas de compras de manera inteligente. Construida con **React**, **Vite**, **Tailwind CSS** y desplegada en **Netlify**.

## ✨ Características

- **🔍 Búsqueda inteligente de productos** — Busca productos directamente desde Walmart México y agrégalos a tu lista con un clic.
- **📝 Lista de compras personalizable** — Agrega productos personalizados con nombre, precio y unidad.
- **🛍️ Modo Compra** — Marca los productos como comprados, ajusta cantidades y precios sobre la marcha.
- **💰 Totales en tiempo real** — Calcula automáticamente el total estimado y el total real de lo comprado.
- **💾 Persistencia local** — Tu lista se guarda automáticamente en el navegador (localStorage).
- **📱 Diseño responsive** — Interfaz adaptada para móvil y escritorio.

## 🚀 Tecnologías

- [React 19](https://react.dev/) — UI
- [Vite](https://vitejs.dev/) — Build tool
- [Tailwind CSS](https://tailwindcss.com/) — Estilos
- [Netlify Functions](https://docs.netlify.com/functions/overview/) — API serverless para búsqueda de productos
- [Lucide React](https://lucide.dev/) + [React Icons](https://react-icons.github.io/react-icons/) — Iconografía
- [Radix UI](https://www.radix-ui.com/) — Componentes accesibles

## 🛠️ Desarrollo local

```bash
# Clonar el repositorio
git clone https://github.com/ovedfs/smartcart.git
cd smartcart

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de entorno

Copia el archivo de ejemplo y completa las variables necesarias:

```bash
cp .env.example .env
```

## 🚢 Despliegue

El proyecto está configurado para desplegarse en **Netlify** con funciones serverless incluidas.

```bash
# Build de producción
npm run build

# Preview local del build
npm run preview
```

## 📁 Estructura del proyecto

```
smartcart/
├── netlify/
│   └── functions/
│       └── search-product.js   # Función serverless para búsqueda de productos
├── public/                      # Archivos estáticos
├── src/
│   ├── assets/                  # Recursos (imágenes, etc.)
│   ├── components/              # Componentes reutilizables (Button, Input, Card, Badge, Checkbox)
│   ├── App.jsx                  # Componente principal
│   ├── App.css                  # Estilos de la app
│   ├── index.css                # Estilos globales (Tailwind)
│   └── main.jsx                 # Punto de entrada
├── .env.example                 # Variables de entorno de ejemplo
├── netlify.toml                 # Configuración de Netlify
├── tailwind.config.js           # Configuración de Tailwind CSS
└── vite.config.js               # Configuración de Vite
```

## 📄 Licencia

MIT