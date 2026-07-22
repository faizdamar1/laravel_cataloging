<?php

namespace Tests\Feature\Admin;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SettingControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::factory()->create(['role' => 1]));
    }

    /** @test */
    public function it_can_render_the_settings_index_page()
    {
        $this->get(route('admin.settings.index'))
            ->assertSuccessful()
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/admin/index')
                ->has('setting', fn (Assert $page) => $page
                    ->where('limit_day', 30)
                    ->where('min_pass', 75)
                    ->where('time_per_question', 5)
                    ->etc()
                )
            );
    }

    /** @test */
    public function it_can_update_the_settings()
    {
        Setting::create(['limit_day' => 10, 'min_pass' => 50, 'time_per_question' => 10]);

        $response = $this->put(route('admin.settings.edit', 1), [
            'limit_day' => 60,
            'min_pass'  => 80,
            'time_per_question' => 15
        ]);

        $response->assertRedirect()
            ->assertSessionHas('success', 'Edit setting successfully');

        $this->assertDatabaseHas('settings', [
            'id' => 1,
            'limit_day' => 60,
            'min_pass'  => 80,
            'time_per_question' => 15
        ]);
    }
}
