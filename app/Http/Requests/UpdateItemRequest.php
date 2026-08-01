<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemRequest extends FormRequest
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
            'details.*.id' => ['nullable', 'integer', 'exists:item_details,id'],
            'details.*.item_code' => ['required', 'string', 'max:255'],
            'details.*.description' => ['nullable', 'string'],
            'details.*.images' => ['nullable', 'array'],
            'details.*.images.*' => ['image', 'mimes:jpg,jpeg,png,webp'],
            'details.*.deleted_images' => ['nullable', 'array'],
            'details.*.deleted_images.*' => ['integer', 'exists:item_detail_images,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'number_po.required' => 'Nomor PO wajib diisi.',
            'details.required' => 'Minimal harus ada 1 item.',
            'details.min' => 'Minimal harus ada 1 item.',
            'details.*.item_code.required' => 'Item Code wajib diisi.',
            'details.*.images.*.image' => 'File harus berupa gambar.',
            'details.*.images.*.mimes' => 'Format gambar harus JPG, JPEG, PNG atau WEBP.',
            'details.*.deleted_images.*.exists' => 'Gambar tidak ditemukan.',
        ];
    }
}
