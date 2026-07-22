@extends('errors.layout')

@section('title', __('Page Expired'))
@section('code', '419')
@section('message', __('Page Expired'))
@section('action')
<form method="POST" action="{{ route('logout') }}">
    @csrf
    <button type="submit" class="btn">
        Logout
    </button>
</form>
@endsection
