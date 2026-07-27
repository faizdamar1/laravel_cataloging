<?php

namespace App\Imports;

use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ItemImport
{
    public function import($path)
    {
        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getActiveSheet();
        $highestRow = $sheet->getHighestRow();

        for ($row = 2; $row <= $highestRow; $row++) {

            $data = [
                'item_code' => $sheet->getCell("A{$row}")->getValue(),
                'number_po' => $sheet->getCell("B{$row}")->getValue(),
                'description' => $sheet->getCell("C{$row}")->getValue(),
            ];

            $validator = Validator::make($data, [
                'item_code' => 'nullable',
                'number_po' => 'nullable',
                'description' => 'nullable',
            ]);

            if ($validator->fails()) {
                continue;
            }

            Item::updateOrCreate($matchCondition, [
                'item_code' => $data['item_code'],
                'number_po' => $data['number_po'],
                'description' => $data['description'],
            ]);
        }
    }

    public function template()
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        $headers = ['Item Code', 'PO Number', 'Description'];
        foreach ($headers as $key => $title) {
            $column = chr(65 + $key);
            $sheet->setCellValue("{$column}1", $title);
        }

        $fileName = 'item_import_template.xlsx';
        $filePath = storage_path("app/templates/{$fileName}");

        if (! is_dir(dirname($filePath))) {
            mkdir(dirname($filePath), 0775, true);
        }

        $writer = new Xlsx($spreadsheet);
        $writer->save($filePath);

        return $filePath;
    }
}
