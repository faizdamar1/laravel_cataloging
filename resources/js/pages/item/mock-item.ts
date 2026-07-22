import { Item } from '@/types';

export const MOCK_ITEMS: Item[] = [
    {
        id: 1,
        item_code: 'ITM-001-A',
        number_po: 'PO-2026-X81',
        description: 'Baja Ringan Galvalum Taso 0.75mm',
        details: [
            { id: 101, item_id: 1, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400' },
            { id: 102, item_id: 1, image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400' },
            { id: 103, item_id: 1, image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=400' }
        ]
    },
    {
        id: 2,
        item_code: 'ITM-002-B',
        number_po: 'PO-2026-X82',
        description: 'Semen Portland Komposit (PCC) 50kg',
        details: [
            { id: 104, item_id: 2, image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400' },
            { id: 105, item_id: 2, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400' }
        ]
    },
    {
        id: 3,
        item_code: 'ITM-003-C',
        number_po: 'PO-2026-Y10',
        description: 'Besi Beton Ulir SNI 10mm',
        details: [
            { id: 106, item_id: 3, image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=400' }
        ]
    },
    {
        id: 4,
        item_code: 'ITM-004-D',
        number_po: 'PO-2026-Z99',
        description: 'Keramik Lantai Milan 60x60 Motif Marmer',
        details: [] // Item tanpa foto
    }
];