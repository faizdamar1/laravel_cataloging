<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>@yield('title')</title>

    <style>
        html, body {
            background: linear-gradient(135deg, #e7f3f0, #f9fafb);
            color: #374151;
            font-family: ui-sans-serif, system-ui, -apple-system,
                         BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
                         Arial, "Noto Sans", sans-serif;
            height: 100vh;
            margin: 0;
        }

        .full-height { height: 100vh; }
        .flex-center {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .content {
            background: #fff;
            padding: 36px;
            border-radius: 20px;
            width: 100%;
            max-width: 420px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,.08);
        }

        .logo {
            width: 90px;
            height: 90px;
            margin: 0 auto 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .logo img { width: 90px; }

        .code {
            font-size: 56px;
            font-weight: 800;
            color: #0E6151;
            margin: 0;
        }

        .title {
            font-size: 20px;
            font-weight: 700;
            margin: 8px 0 12px;
        }

        .message {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 24px;
            line-height: 1.6;
        }

        .btn {
            width: 100%;
            padding: 12px;
            border-radius: 999px;
            background: #0E6151;
            color: #fff;
            border: none;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }
        .btn:hover { background: #0A4A3E; }
    </style>
</head>
<body>

<div class="flex-center full-height">
    <div class="content">

        <div class="logo">
            <img src="{{ asset('CKB.png') }}" alt="CKB Logo">
        </div>

        {{-- DINAMIS --}}
        <p class="code">@yield('code')</p>

        <div class="title">@yield('title')</div>

        <div class="message">@yield('message')</div>

        {{-- Optional button --}}
        @yield('action')

    </div>
</div>

</body>
</html>
