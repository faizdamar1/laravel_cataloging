<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class UserImport
{
    public function import($path)
    {
        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getActiveSheet();
        $highestRow = $sheet->getHighestRow();

        for ($row=2; $row <= $highestRow ; $row++) {
            $name     = $sheet->getCell("B{$row}")->getValue();
            $email    = $sheet->getCell("C{$row}")->getValue();
            $password = $sheet->getCell("D{$row}")->getValue();

            if(!$email){
                continue;
            }

            // TODO : email verified at, role, 

            User::updateOrCreate([
                'email' => $email
            ], [
                'name' => $name,
                'password' => $password ? Hash::make($password) : Hash::make('admin123'),
                'email_verified_at' => now(),
                'role' => 0
            ]);
        }

    }

    public function template()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue("A1", "No.");
        $sheet->setCellValue("B1", "Nama");
        $sheet->setCellValue("C1", "Email");
        $sheet->setCellValue("D1", "Password");

        $fileName = 'user_import_template.xlsx';
        $filePath = storage_path("app/templates/{$fileName}");

        if (!is_dir(dirname($filePath))) {
            mkdir(dirname($filePath), 0775, true);
        }

        $writer = new Xlsx($spreadsheet);
        $writer->save($filePath);

        $spreadsheet->disconnectWorksheets();
        unset($writer, $spreadsheet);

        return $filePath;
    }
}
