<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserVerifyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => [
                'required',
                'integer',
                Rule::exists('users', 'id'),
            ],
        ];
    }

    public function messages()
    {
        return [
            'ids.required' => 'Pilih minimal satu user.',
            'ids.array' => 'Format data tidak valid.',
            'ids.min' => 'Minimal pilih 1 user.',
            'ids.*.integer' => 'ID user harus berupa angka.',
            'ids.*.exists' => 'User tidak ditemukan dalam database.',
        ];
    }
}
