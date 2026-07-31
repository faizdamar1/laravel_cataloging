<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'number_po' => ['required', 'string', 'max:255'],

            'details' => ['required', 'array', 'min:1'],

            'details.*.item_code' => ['required', 'string', 'max:255'],
            'details.*.description' => ['nullable', 'string'],

            'details.*.images' => ['required', 'array', 'min:1'],
            'details.*.images.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp'],
        ];
    }

    public function messages(): array
    {
        return [
            'number_po.required' => 'Nomor PO/OD wajib diisi.',

            'details.required' => 'Minimal harus ada 1 item.',
            'details.array' => 'Format item tidak valid.',
            'details.min' => 'Minimal harus ada 1 item.',

            'details.*.item_code.required' => 'Item Code atau Part Number wajib diisi.',
            'details.*.item_code.max' => 'Item Code maksimal 255 karakter.',

            'details.*.description.string' => 'Description tidak valid.',

            'details.*.images.required' => 'Minimal harus ada 1 gambar.',
            'details.*.images.array' => 'Format gambar tidak valid.',
            'details.*.images.min' => 'Minimal harus ada 1 gambar.',

            'details.*.images.*.required' => 'Gambar wajib diisi.',
            'details.*.images.*.image' => 'File harus berupa gambar.',
            'details.*.images.*.mimes' => 'Format gambar harus JPG, JPEG, PNG, atau WEBP.',
        ];
    }
}
