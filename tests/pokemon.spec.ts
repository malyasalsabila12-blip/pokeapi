import { test, expect } from '@playwright/test';

const URL_WEB = 'http://127.0.0.1:5188';

test.describe('Pokémon App Automation Test', () => {

  test('Skenario Sukses - Home Page & Detail Page', async ({ page }) => {
    // 1. Buka web
    await page.goto(URL_WEB);

    // 2. Cek Judul
    await expect(page.locator('h1')).toContainText('Daftar Pokémon', { timeout: 30000 });

    // 3. Cek apakah ada kartu pokemon yang muncul
    const kartu = page.locator('.pokemon-card').first();
    await expect(kartu).toBeVisible({ timeout: 30000 });

    // 4. Coba Klik kartu untuk masuk Detail
    await kartu.click();
    
    // 5. Cek apakah tombol kembali dan gambar muncul di detail
    await expect(page.locator('button')).toContainText('Kembali', { timeout: 30000 });
    await expect(page.locator('img')).toBeVisible({ timeout: 30000 });
  });

  test('Skenario Sukses - Pagination', async ({ page }) => {
    await page.goto(URL_WEB);

    // 1. Cek halaman pertama
    await expect(page.locator('[data-testid="page-number"]')).toContainText('Halaman ke-1');

    // 2. Klik Next
    await page.click('text=Next');

    // 3. Cek apakah halaman berubah
    await expect(page.locator('[data-testid="page-number"]')).toContainText('Halaman ke-2');
    
    // 4. Klik Previous
    await page.click('text=Previous');
    await expect(page.locator('[data-testid="page-number"]')).toContainText('Halaman ke-1');
  });

  test('Skenario Gagal - Pencarian Kosong', async ({ page }) => {
    await page.goto(URL_WEB);

    // Ketik asal di kolom input
    const input = page.locator('input[type="text"]');
    await input.fill('pokemon_acak_palsu_123');

    // Cek apakah tulisan error muncul
    await expect(page.locator('text=Pokémon tidak ditemukan.')).toBeVisible({ timeout: 30000 });
  });

});