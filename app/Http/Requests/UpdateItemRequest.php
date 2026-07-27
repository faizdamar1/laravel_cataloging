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
            'item_code' => ['required', 'string', 'max:255'],
            'number_po' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'images' => [
                'nullable',
                'array',
            ],
            'images.*' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
            ],
            'deleted_images' => [
                'nullable',
                'array',
            ],
            'deleted_images.*' => [
                'integer',
                'exists:item_details,id',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'images.*.image' => 'File harus berupa gambar.',
            'images.*.mimes' => 'Format gambar harus JPG, PNG atau WEBP.',
            'deleted_images.*.exists' => 'Gambar tidak ditemukan.',
        ];
    }
}
