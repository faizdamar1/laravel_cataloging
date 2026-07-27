<?php

namespace App\Exports;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class ItemExport
{
    public function export(array $filters = [])
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        $headers = [
            'A1' => 'Entitas',
            'B1' => 'Asset Code',
            'C1' => 'Discovered Asset Code',
            'D1' => 'Description',
            'E1' => 'Status',
            'F1' => 'Qty',
            'G1' => 'Qty Actual',
            'H1' => 'Kondisi',
            'I1' => 'Remarks',
            'J1' => 'Custodian',
            'K1' => 'Location',
            'L1' => 'Updated By',
            'M1' => 'Image 1',
            'N1' => 'Image 2',
            'O1' => 'Image 3',
            'P1' => 'Image 4',
            'Q1' => 'Image 5',
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
            $sheet->getStyle($cell)->getFont()->setBold(true);
        }

        $query = Item::with('details');

        if (! empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($q) use ($search) {
                $q->where('kode_aset', 'like', "%{$search}%")
                    ->orWhere('kode_aset_temuan', 'like', "%{$search}%")
                    ->orWhere('deskripsi', 'like', "%{$search}%")
                    ->orWhere('pic_dept', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['entity'])) {
            $query->where('entity', $filters['entity']);
        }

        $sortDirection = $filters['sort'] ?? 'DESC';

        $item = $query
            ->orderBy('created_at', $sortDirection)
            ->get();

        $imageColumns = ['M', 'N', 'O', 'P', 'Q'];

        $row = 2;

        foreach ($item as $item) {

            $sheet->setCellValue('A'.$row, $item->entity);
            $sheet->setCellValue('B'.$row, $item->kode_aset);
            $sheet->setCellValue('C'.$row, $item->kode_aset_temuan);
            $sheet->setCellValue('D'.$row, $item->deskripsi);
            $sheet->setCellValue('E'.$row, $item->status);
            $sheet->setCellValue('F'.$row, $item->qty);
            $sheet->setCellValue('G'.$row, $item->qty_actual);
            $sheet->setCellValue('H'.$row, $item->kondisi);
            $sheet->setCellValue('I'.$row, $item->remarks);
            $sheet->setCellValue('J'.$row, $item->pic_dept);
            $sheet->setCellValue('K'.$row, $item->lokasi);
            $sheet->setCellValue('L'.$row, $item->updatedby->email ?? '-');

            // Tinggi row untuk foto
            $sheet->getRowDimension($row)->setRowHeight(90);

            foreach ($item->details->take(5) as $index => $detail) {

                if (! isset($imageColumns[$index])) {
                    continue;
                }

                $imagePath = public_path($detail->photo);

                if (! file_exists($imagePath)) {
                    continue;
                }

                $drawing = new Drawing;
                $drawing->setPath($imagePath);
                $drawing->setCoordinates($imageColumns[$index].$row);

                // ukuran gambar
                $drawing->setHeight(80);

                // padding supaya terlihat di dalam cell
                $drawing->setOffsetX(5);
                $drawing->setOffsetY(5);

                $drawing->setWorksheet($sheet);
            }

            $row++;
        }

        // Auto size kolom data
        foreach (range('A', 'L') as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }

        // Lebar kolom foto
        foreach (['M', 'N', 'O', 'P', 'Q'] as $columnID) {
            $sheet->getColumnDimension($columnID)->setWidth(18);
        }

        return $spreadsheet;
    }
}
