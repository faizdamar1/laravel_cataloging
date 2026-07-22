@extends('errors.layout')

@section('title', __('Payment Required'))
@section('code', '402')
@section('message', __('Payment Required'))

@section('action')
<form method="POST" action="{{ route('logout') }}">
    @csrf
    <button type="submit" class="btn">
        Logout
    </button>
</form>
@endsection

