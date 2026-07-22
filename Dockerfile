FROM php:8.3-fpm-alpine

# Gunakan apk, bukan apt-get
RUN apk add --no-cache \
    libpng-dev \
    libxml2-dev \
    oniguruma-dev \
    zip \
    unzip \
    curl \
    git \
    libzip-dev \
    pkgconfig

# Perintah install extension-nya tetap sama
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/portal
