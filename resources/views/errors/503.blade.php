@extends('errors.layout')

@section('title', __('Service Unavailable'))
@section('code', '503')
@section('message', __('Service Unavailable'))
@section('action')
<form method="POST" action="{{ route('logout') }}">
    @csrf
    <button type="submit" class="btn">
        Logout
    </button>
</form>
@endsection
