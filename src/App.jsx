import { useEffect, useMemo, useRef, useState } from 'react';
import { FiSearch, FiPlus, FiTrash2, FiRefreshCw, FiShoppingCart, FiEdit3, FiX, FiDollarSign } from 'react-icons/fi';
import { Button, Input, Card, CardHeader, CardContent, Badge, Checkbox } from './components';

const initialItems = [
  {
    id: 1,
    name: 'Leche Lala Entera',
    quantity: 2,
    unit: 'piezas',
    price: 29,
    basePrice: 29,
    baseQuantity: 2,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80',
    bought: false,
  },
  {
    id: 2,
    name: 'Huevos',
    quantity: 1,
    unit: 'caja',
    price: 44,
    basePrice: 44,
    baseQuantity: 1,
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=300&q=80',
    bought: false,
  },
  {
    id: 3,
    name: 'Pan bimbo',
    quantity: 1,
    unit: 'pieza',
    price: 34,
    basePrice: 34,
    baseQuantity: 1,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80',
    bought: false,
  },
];

// Caché en memoria para evitar peticiones repetidas
const searchCache = new Map();

function App() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('smartcart-items');
      return saved ? JSON.parse(saved) : initialItems;
    } catch {
      return initialItems;
    }
  });
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('edit');
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customUnit, setCustomUnit] = useState('pieza');
  const abortControllerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('smartcart-items', JSON.stringify(items));
  }, [items]);

  const estimatedTotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const realTotal = useMemo(() => items.filter((item) => item.bought).reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const searchProducts = async (term) => {
    const trimmed = term.trim();

    // No buscar si son menos de 3 caracteres
    if (trimmed.length < 3) {
      setResults([]);
      return;
    }

    // Revisar caché primero
    const cacheKey = trimmed.toLowerCase();
    if (searchCache.has(cacheKey)) {
      setResults(searchCache.get(cacheKey));
      return;
    }

    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const res = await fetch(`/.netlify/functions/search-product?query=${encodeURIComponent(trimmed)}`, {
        signal: controller.signal,
      });
      const data = await res.json();
      const products = data.products || [];
      // Guardar en caché
      searchCache.set(cacheKey, products);
      setResults(products);
    } catch (error) {
      if (error.name === 'AbortError') return; // Ignorar cancelaciones
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => searchProducts(search), 800);
    return () => clearTimeout(debounce);
  }, [search]);

  const addItem = (product, quantity = 1, unit = 'pieza') => {
    const newItem = {
      id: Date.now(),
      name: product.name,
      quantity,
      unit,
      price: Number(product.price || 0),
      basePrice: Number(product.price || 0),
      baseQuantity: quantity,
      image: product.image || '',
      bought: false,
    };
    setItems((prev) => [newItem, ...prev]);
    setSearch('');
    setResults([]);
  };

  const handleCustomAdd = () => {
    if (!customName.trim()) return;
    addItem({ name: customName, price: Number(customPrice || 0), image: '' }, 1, customUnit);
    setCustomName('');
    setCustomPrice('');
    setCustomUnit('pieza');
  };

  const toggleBought = (id) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, bought: !item.bought } : item)));
  };

  const updateItem = (id, patch) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetPurchase = () => {
    setItems((prev) => prev.map((item) => ({
      ...item,
      bought: false,
      quantity: item.baseQuantity,
      price: item.basePrice,
    })));
  };

  const boughtCount = items.filter((item) => item.bought).length;
  const totalItems = items.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-3 py-4 sm:px-4 pb-24">
        {/* Header */}
        <header className="sticky top-0 z-40 mb-4">
          <Card className="border-sky-100">
            <div className="flex items-center justify-between gap-3 p-4">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600 font-sans">SmartCart</p>
                <h1 className="text-lg font-bold text-slate-900 font-serif">Despensa Inteligente</h1>
                {mode === 'buy' && totalItems > 0 && (
                  <Badge variant="default" className="mt-2">
                    {boughtCount} de {totalItems} artículos
                  </Badge>
                )}
              </div>
              <Button
                onClick={() => setMode(mode === 'edit' ? 'buy' : 'edit')}
                className={mode === 'edit' ? 'bg-sky-600 text-white hover:bg-sky-700 px-4 py-2 text-sm flex items-center gap-2' : 'border-2 border-slate-300 text-slate-700 hover:bg-slate-100 px-4 py-2 text-sm flex items-center gap-2'}
              >
                {mode === 'edit' ? (
                  <>
                    <FiShoppingCart size={16} />
                    Compra
                  </>
                ) : (
                  <>
                    <FiEdit3 size={16} />
                    Editar
                  </>
                )}
              </Button>
            </div>
          </Card>
        </header>

        {/* Main Content */}
        <main className="flex-1 space-y-4">
          {mode === 'edit' ? (
            <div className="space-y-4">
              {/* Search Section */}
              <Card className="border-sky-100">
                <CardContent className="space-y-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-serif">Buscar productos</h2>
                  <div className="relative w-full">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 pointer-events-none z-10" size={20} />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Leche, pan, huevos..."
                      maxLength={30}
                      className="w-full pl-12 pr-4"
                    />
                  </div>

                  {loading && (
                    <div className="flex items-center gap-2 text-sky-600">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-300 border-t-sky-600"></div>
                      <span className="text-sm font-medium">Buscando en Walmart...</span>
                    </div>
                  )}

                  {results.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {results.map((product, idx) => (
                        <button
                          key={idx}
                          onClick={() => addItem(product, 1, product.unit || 'pieza')}
                          className="flex w-full items-center gap-3 rounded-lg border-2 border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-3 transition-all hover:border-sky-400 hover:shadow-md"
                        >
                          {product.image && (
                            <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                          )}
                          <div className="flex-1 text-left min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
                            <p className="text-xs text-slate-500">{product.unit || 'pieza'}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-sky-600">${product.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Items List */}
              {items.length > 0 && (
                <Card>
                  <CardHeader className="flex items-center justify-between border-b border-slate-200">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-serif">
                      Mi lista ({items.length})
                    </h2>
                    {items.length > 0 && (
                      <Button
                        onClick={() => setItems([])}
                        className="text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-transparent px-0 py-0 flex items-center gap-1"
                      >
                        <FiTrash2 size={14} /> Limpiar
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-64 overflow-y-auto p-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 group hover:border-sky-300 transition-all">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                          <p className="text-xs text-slate-600">{item.quantity} {item.unit} • ${item.price * item.quantity}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Custom Product */}
              <Card className="border-2 border-dashed border-sky-300 bg-blue-50">
                <CardContent className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-serif">
                    <FiPlus size={18} /> Producto personalizado
                  </h3>
                  <div className="grid gap-2">
                    <Input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Ej: Manzanas"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        type="number"
                        placeholder="$0"
                      />
                      <Input
                        value={customUnit}
                        onChange={(e) => setCustomUnit(e.target.value)}
                        placeholder="kg, pieza..."
                      />
                    </div>
                    <Button
                      onClick={handleCustomAdd}
                      disabled={!customName.trim()}
                      className="bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 px-4 py-2 text-sm flex items-center justify-center gap-2"
                    >
                      <FiPlus size={16} /> Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Buy Mode */
            <Card>
              <CardHeader className="flex items-center justify-between border-b border-slate-200">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 font-serif">
                  <FiShoppingCart size={18} /> Checklist
                </h2>
                <Button
                  onClick={resetPurchase}
                  className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 px-3 py-1.5 text-xs flex items-center gap-1"
                >
                  <FiRefreshCw size={14} /> Reiniciar
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto p-3">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 text-sm font-medium">No hay productos en tu lista</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleBought(item.id)}
                      className={`w-full rounded-lg border-2 p-3 transition-all text-left ${
                        item.bought
                          ? 'border-emerald-300 bg-emerald-50 opacity-75'
                          : 'border-slate-200 bg-white hover:border-sky-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox checked={item.bought} />
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm font-serif ${item.bought ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                        <p className="font-bold text-slate-900 flex-shrink-0">${item.price * item.quantity}</p>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <label className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-600">Cantidad</span>
                          <Input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, { quantity: Math.max(0, Number(e.target.value)) })}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-bold px-2 py-1 h-8"
                          />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-600">Precio</span>
                          <Input
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, { price: Math.max(0, Number(e.target.value)) })}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-bold px-2 py-1 h-8"
                          />
                        </label>
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </main>

        {/* Footer - Totals */}
        <footer className="fixed bottom-0 left-0 right-0 border-t-2 border-sky-200 bg-white/95 p-4 shadow-2xl backdrop-blur-sm">
          <div className="mx-auto max-w-2xl px-3">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-3">
                  <p className="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1 font-sans">
                    <FiDollarSign size={14} /> Estimado
                  </p>
                  <p className="text-2xl font-black text-slate-900 mt-1 font-serif">${estimatedTotal}</p>
                </CardContent>
              </Card>
              <Card className={`border-2 ${
                realTotal > 0 ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'
              }`}>
                <CardContent className="p-3">
                  <p className="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1 font-sans">
                    ✓ Comprado
                  </p>
                  <p className={`text-2xl font-black mt-1 font-serif ${realTotal > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    ${realTotal}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
