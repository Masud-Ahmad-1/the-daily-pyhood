import asyncio
from playwright.async_api import async_playwright

async def take_screenshot():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
        await page.goto("http://localhost:3000", wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(2000)
        
        # Full page screenshot
        await page.screenshot(path="/home/z/my-project/download/mobile-full.png", full_page=True)
        
        # Also get page height
        height = await page.evaluate("document.body.scrollHeight")
        viewport_height = await page.evaluate("window.innerHeight")
        print(f"Page scroll height: {height}px")
        print(f"Viewport height: {viewport_height}px")
        print(f"Total scrollable: {height - viewport_height}px")
        
        await browser.close()

asyncio.run(take_screenshot())