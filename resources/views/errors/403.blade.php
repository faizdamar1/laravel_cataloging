@extends('errors.layout')

@section('code', '403')
@section('title', 'Akses Ditolak')

@section('message')
    {{$exception->getMessage()}}
@endsection

@section('action')
<form method="POST" action="{{ route('logout') }}">
    @csrf
    <button type="submit" class="btn">
        Logout
    </button>
</form>
@endsection