<?php

namespace App\Exports;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class UserExport
{
    public function export($users)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Header 
        $sheet->setCellValue('A1', 'No.');
        $sheet->setCellValue('B1', 'Nama');
        $sheet->setCellValue('C1', 'Email');
        $sheet->setCellValue('D1', 'Verifikasi');
        $sheet->setCellValue('E1', 'Password');
        $sheet->setCellValue('F1', 'Photos');

        // Data
        $row = 2;
        $no = 1;
        foreach ($users as $user) {
            $sheet->setCellValue("A{$row}", $no);
            $sheet->setCellValue("B{$row}", $user->name);
            $sheet->setCellValue("C{$row}", $user->email);
            $sheet->setCellValue("D{$row}", $user->email_verified_at);
            $sheet->setCellValue("E{$row}", "");

            if ($user->photos && file_exists(public_path($user->photos))) {
                $drawing = new Drawing();
                $drawing->setPath(public_path($user->photos));
                $drawing->setHeight(60);
                $drawing->setCoordinates("F{$row}");
                $drawing->setWorksheet($sheet);

                $sheet->getRowDimension($row)->setRowHeight(50);
            }

            $row++;
            $no++;
        }

        // Setting
        $sheet->setAutoFilter('A1:E1');

        $highestColumn = $sheet->getHighestColumn();
        $highestRow = $sheet->getHighestRow();

        $sheet->getStyle("A2:{$highestColumn}{$highestRow}")
                ->getAlignment()
                ->setHorizontal(Alignment::HORIZONTAL_LEFT);

        foreach (range('A', $highestColumn) as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $fileName = 'users_' . now()->format('Ymd_His') . '.xlsx';
        $filePath = storage_path("app/exports/{$fileName}");

        if (!is_dir(dirname($filePath))) {
            mkdir(dirname($filePath), 0775, true);
        }

        $writer = new Xlsx($spreadsheet);
        $writer->save($filePath);

        //disconnect
        $spreadsheet->disconnectWorksheets();
        unset($writer, $spreadsheet);

        return $filePath;
    }
}
