@extends('errors.layout')

@section('title', __('Not Found'))
@section('code', '404')
@section('message', __('Not Found'))
@section('action')
<form method="POST" action="{{ route('logout') }}">
    @csrf
    <button type="submit" class="btn">
        Logout
    </button>
</form>
@endsection
