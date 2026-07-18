const SERPAPI_BASE = 'https://serpapi.com/search';
const MAX_RESULTS = 10; // Número de resultados a mostrar (configurable)

// Mock products como fallback
const mockProducts = {
  leche: [
    { name: 'Leche Lala Entera 1L', price: 29, unit: 'pieza', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80' },
    { name: 'Leche Lala Deslactosada 1L', price: 32, unit: 'pieza', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80' },
    { name: 'Leche Alpura 1L', price: 28, unit: 'pieza', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80' },
  ],
  pan: [
    { name: 'Pan Bimbo Blanco 580g', price: 34, unit: 'pieza', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80' },
    { name: 'Pan Bimbo Integral 580g', price: 36, unit: 'pieza', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80' },
    { name: 'Pan Tía Rosa 510g', price: 32, unit: 'pieza', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80' },
  ],
  huevos: [
    { name: 'Huevos Jumbo 18 pzas', price: 44, unit: 'caja', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=300&q=80' },
    { name: 'Huevos Medianos 12 pzas', price: 32, unit: 'caja', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=300&q=80' },
    { name: 'Huevos Orgánicos 18 pzas', price: 65, unit: 'caja', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=300&q=80' },
  ],
  queso: [
    { name: 'Queso Oaxaca Kilo', price: 189, unit: 'kg', image: 'https://images.unsplash.com/photo-1452894692288-f6d7a9ffc166?auto=format&fit=crop&w=300&q=80' },
    { name: 'Queso Fresco 500g', price: 89, unit: 'paquete', image: 'https://images.unsplash.com/photo-1452894692288-f6d7a9ffc166?auto=format&fit=crop&w=300&q=80' },
  ],
  yogur: [
    { name: 'Yogur Lala 500g', price: 19, unit: 'pieza', image: 'https://images.unsplash.com/photo-1488865771115-f39fbc3ff590?auto=format&fit=crop&w=300&q=80' },
    { name: 'Yogur Griego Fage 150g', price: 24, unit: 'pieza', image: 'https://images.unsplash.com/photo-1488865771115-f39fbc3ff590?auto=format&fit=crop&w=300&q=80' },
  ],
  arroz: [
    { name: 'Arroz Tres Delicias 1kg', price: 18, unit: 'bolsa', image: 'https://images.unsplash.com/photo-1586985289688-cacf913bb591?auto=format&fit=crop&w=300&q=80' },
    { name: 'Arroz Integral 1kg', price: 22, unit: 'bolsa', image: 'https://images.unsplash.com/photo-1586985289688-cacf913bb591?auto=format&fit=crop&w=300&q=80' },
  ],
  frijoles: [
    { name: 'Frijoles Bayos 1kg', price: 25, unit: 'bolsa', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80' },
    { name: 'Frijoles Negros 1kg', price: 26, unit: 'bolsa', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80' },
  ],
};

function parsePrice(priceStr) {
  if (priceStr == null) return 0;
  // Handle formats: "$29", "$29.50", "MXN 29", "29", or number 29
  const cleaned = String(priceStr).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function extractUnit(name) {
  const lower = name.toLowerCase();
  if (lower.includes('kg') || lower.includes('kilo')) return 'kg';
  if (lower.includes('l') && (lower.includes('1l') || lower.includes(' l'))) return 'pieza';
  if (lower.includes('pza') || lower.includes('pieza')) return 'pieza';
  if (lower.includes('caja') || lower.includes('pzas')) return 'caja';
  if (lower.includes('bolsa') || lower.includes('500g') || lower.includes('580g')) return 'pieza';
  if (lower.includes('paquete')) return 'paquete';
  return 'pieza';
}

function searchMock(query) {
  const searchTerm = query.toLowerCase().trim();
  let results = [];

  for (const [key, products] of Object.entries(mockProducts)) {
    if (key.includes(searchTerm) || searchTerm.includes(key)) {
      results = products;
      break;
    }
  }

  if (results.length === 0) {
    // Si no hay match exacto, devolver todos los productos disponibles como fallback
    results = Object.values(mockProducts).flat().slice(0, MAX_RESULTS);
  } else {
    results = results.slice(0, MAX_RESULTS);
  }

  return results;
}

async function searchSerpApi(query) {
  const apiKey = process.env.SERPAPI_API_KEY;

  if (!apiKey) {
    console.log('SERPAPI_API_KEY no configurada, usando fallback mock');
    return searchMock(query);
  }

  const params = new URLSearchParams({
    engine: 'walmart',
    query: query,
    api_key: apiKey,
    walmart_domain: 'walmart.com.mx',
  });

  const url = `${SERPAPI_BASE}?${params}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('SerpApi error:', data.error);
      return searchMock(query);
    }

    const organicResults = data.organic_results || [];

    if (organicResults.length === 0) {
      return searchMock(query);
    }

    return organicResults.slice(0, MAX_RESULTS).map((item) => {
      // El precio viene en primary_offer.offer_price
      let price = 0;
      if (item.primary_offer?.offer_price != null) {
        price = parsePrice(item.primary_offer.offer_price);
      } else if (item.price != null) {
        price = parsePrice(item.price);
      }

      const unit = extractUnit(item.title || '');

      return {
        name: item.title || query,
        price,
        unit,
        image: item.thumbnail || '',
      };
    });
  } catch (error) {
    console.error('SerpApi fetch error:', error);
    return searchMock(query);
  }
}

export const handler = async (event) => {
  const query = event.queryStringParameters?.query || '';

  if (!query.trim()) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Consulta no válida' }),
    };
  }

  const products = await searchSerpApi(query);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ products }),
  };
};