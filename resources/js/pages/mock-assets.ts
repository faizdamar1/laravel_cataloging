import { Asset } from '@/types';

export const MOCK_ASSETS: Asset[] = [
    {
        id: 1,
        kode_aset: 'AST-2026-001',
        kode_aset_temuan: '',
        entity: 'PT Maju Bersama',
        deskripsi: 'Mesin Genset Honda 5000 Watt',
        pic_dept: 'Engineering',
        status: 'Found',
        kondisi: 'Baik',
        remarks: 'Sudah di-service bulan lalu',
        lokasi: 'Gudang Utama - Rak A1',
        qty: 1,
        qty_actual: 1,
        created_by: 1,
        user: null,
        tgl_scan: '2026-07-21',
        details: [
            { id: 101, asset_id: 1, photo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600', created_at: '', updated_at: '' },
            { id: 102, asset_id: 1, photo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600', created_at: '', updated_at: '' },
            { id: 103, asset_id: 1, photo: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600', created_at: '', updated_at: '' }
        ]
    },
    {
        id: 2,
        kode_aset: 'AST-2026-002',
        kode_aset_temuan: '',
        entity: 'PT Maju Bersama',
        deskripsi: 'Forklift Toyota 3 Ton',
        pic_dept: 'Logistics',
        status: 'Found',
        kondisi: 'Rusak Ringan',
        remarks: 'Ban depan aus',
        lokasi: 'Area Loading Bay',
        qty: 2,
        qty_actual: 2,
        created_by: 1,
        user: null,
        tgl_scan: '2026-07-20',
        details: [
            { id: 104, asset_id: 2, photo: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600', created_at: '', updated_at: '' },
            { id: 105, asset_id: 2, photo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600', created_at: '', updated_at: '' }
        ]
    },
    {
        id: 3,
        kode_aset: 'AST-2026-003',
        kode_aset_temuan: 'T-001',
        entity: 'PT Maju Bersama',
        deskripsi: 'Pallet Jack Manual 2T',
        pic_dept: 'Warehouse',
        status: 'Not Found',
        kondisi: 'Tidak Diketahui',
        remarks: 'Dicari sejak shift malam',
        lokasi: 'Zona Packing',
        qty: 5,
        qty_actual: 4,
        created_by: 1,
        user: null,
        tgl_scan: '2026-07-21',
        details: [
            { id: 106, asset_id: 3, photo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600', created_at: '', updated_at: '' }
        ]
    },
    {
        id: 4,
        kode_aset: 'AST-2026-004',
        kode_aset_temuan: '',
        entity: 'PT Maju Bersama',
        deskripsi: 'Rak Besi Heavy Duty 4 Tingkat',
        pic_dept: 'Warehouse',
        status: 'Found',
        kondisi: 'Baik',
        remarks: '',
        lokasi: 'Gudang B - Blok C',
        qty: 10,
        qty_actual: 10,
        created_by: 1,
        user: null,
        tgl_scan: '2026-07-15',
        details: [] // Tanpa foto detail
    }
];