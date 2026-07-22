<?php

namespace App\Http\Requests;

use App\Actions\Fortify\PasswordValidationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rule;

class UserAddRequest extends FormRequest
{

    use PasswordValidationRules;
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
            'name'  => ['required', 'string', 'max:255'],
            'email' => [
                'required','email','max:255',
                Rule::unique('users', 'email'),
            ],
            'password' => $this->passwordRules(),
            'photos'=> [
                'required',
                'image',
                'mimes:png,jpg,jpeg',
                'max:9000'
            ],
            'role' => ['required', 'in:0,1']
        ];
    }
}
