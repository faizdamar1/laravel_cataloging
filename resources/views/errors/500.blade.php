@extends('errors.layout')

@section('title', __('Server Error'))
@section('code', '500')
@section('message', __('Server Error'))
@section('action')
<form method="POST" action="{{ route('logout') }}">
    @csrf
    <button type="submit" class="btn">
        Logout
    </button>
</form>
@endsection
