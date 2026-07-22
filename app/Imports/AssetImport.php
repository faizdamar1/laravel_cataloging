<?php

namespace App\Imports;

use App\Models\Asset;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class AssetImport
{
    public function import($path)
    {
        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getActiveSheet();
        $highestRow = $sheet->getHighestRow();

        for ($row = 2; $row <= $highestRow; $row++) {

            $data = [
                'kode_aset' => $sheet->getCell("A{$row}")->getValue(),
                'kode_aset_temuan' => $sheet->getCell("B{$row}")->getValue(),
                'entitas' => $sheet->getCell("C{$row}")->getValue(),
                'deskripsi' => $sheet->getCell("D{$row}")->getValue(),
                'pic_dept' => $sheet->getCell("E{$row}")->getValue(),
                'kota_lokasi' => $sheet->getCell("F{$row}")->getValue(),
                'qty' => $sheet->getCell("G{$row}")->getValue(),
            ];

            $validator = Validator::make($data, [
                'kode_aset' => 'nullable|required_without:kode_aset_temuan',
                'kode_aset_temuan' => 'nullable|required_without:kode_aset',
                // 'entitas' => 'required|required_without:kode_aset_temuan',
                // 'kota_lokasi' => 'required|required_without:kode_aset_temuan',
                // 'deskripsi' => 'nullable|required_without:kode_aset_temuan',
                // 'pic_dept' => 'nullable|required_without:kode_aset_temuan',
                // 'qty' => 'nullable|numeric|required_without:kode_aset_temuan',
            ]);

            if ($validator->fails()) {
                continue;
            }

            $matchCondition = [];
            if (! empty($data['kode_aset'])) {
                $matchCondition = ['kode_aset' => $data['kode_aset']];
            } else {
                $matchCondition = ['kode_aset_temuan' => $data['kode_aset_temuan']];
            }

            Asset::updateOrCreate($matchCondition, [
                'kode_aset' => $data['kode_aset'],
                'kode_aset_temuan' => $data['kode_aset_temuan'],
                'entity' => $data['entitas'],
                'deskripsi' => $data['deskripsi'],
                'pic_dept' => $data['pic_dept'],
                'lokasi' => $data['kota_lokasi'],
                'qty' => (int) $data['qty'],
            ]);
        }
    }

    public function template()
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        $headers = ['Kode Aset', 'Kode Aset Temuan', 'Entitas', 'Deskripsi', 'PIC-Dept', 'Kota-Lokasi', 'Qty'];
        foreach ($headers as $key => $title) {
            $column = chr(65 + $key);
            $sheet->setCellValue("{$column}1", $title);
        }

        $fileName = 'asset_import_template.xlsx';
        $filePath = storage_path("app/templates/{$fileName}");

        if (! is_dir(dirname($filePath))) {
            mkdir(dirname($filePath), 0775, true);
        }

        $writer = new Xlsx($spreadsheet);
        $writer->save($filePath);

        return $filePath;
    }
}
