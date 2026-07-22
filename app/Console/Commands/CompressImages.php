<?php

namespace App\Console\Commands;

use App\Models\AssetDetail;
use Illuminate\Console\Command;
use Intervention\Image\Laravel\Facades\Image;

class CompressImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:compress-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Compres Image';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        AssetDetail::query()
            ->select(['id', 'photo'])
            ->whereNotNull('photo')
            ->chunkById(200, function ($imgs) {

                foreach ($imgs as $img) {

                    $this->info("Processing ID {$img->id}");

                    $source = public_path(ltrim($img->photo, '/'));

                    if (! file_exists($source)) {
                        $this->warn("File not found: {$img->photo}");

                        continue;
                    }

                    $target = public_path(
                        'photos/'.basename($img->photo)
                    );

                    $image = Image::decode($source);

                    if ($image->width() <= 800) {
                        $this->line("Skip existing: {$img->photo}");

                        continue;
                    }

                    $image
                        ->scale(width: 800)
                        ->save($target);

                    $this->info("Compressed: {$img->photo}");
                }
            });
    }
}
